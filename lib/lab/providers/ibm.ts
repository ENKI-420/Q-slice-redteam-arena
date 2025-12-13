/**
 * IBM Quantum Provider Adapter
 * SPEC_LOCK v2.2.0 | CAGE: 9HUP5
 *
 * Interfaces with IBM Quantum via qiskit-ibm-runtime.
 * Uses Python subprocess for actual QPU submission.
 */

import { spawn } from "child_process"
import { IRCircuit, toOpenQASM3 } from "../ir"
import { assertProviderAvailable, validateRealCounts, FailClosedError } from "../invariants"

// === TYPES ===
export interface IBMJobResult {
  job_id: string
  status: "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED"
  counts?: Record<string, number>
  error?: string
  backend: string
  shots: number
  created_utc: string
  completed_utc?: string
}

export interface IBMBackendInfo {
  name: string
  num_qubits: number
  operational: boolean
  pending_jobs: number
  dt_us: number
}

// === PYTHON SCRIPT TEMPLATES ===
const SUBMIT_SCRIPT = `
import sys
import json
from qiskit import QuantumCircuit
from qiskit.transpiler.preset_passmanagers import generate_preset_pass_manager
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler

def main():
    data = json.loads(sys.argv[1])

    service = QiskitRuntimeService(channel='ibm_quantum_platform')
    backend = service.backend(data['backend'])

    # Build circuit from gates
    n = data['nqubits']
    qc = QuantumCircuit(n, n)

    for gate in data['gates']:
        op = gate['op']
        if op == 'H':
            qc.h(gate['q'])
        elif op == 'X':
            qc.x(gate['q'])
        elif op == 'Y':
            qc.y(gate['q'])
        elif op == 'Z':
            qc.z(gate['q'])
        elif op == 'CX':
            qc.cx(gate['c'], gate['t'])
        elif op == 'CZ':
            qc.cz(gate['c'], gate['t'])
        elif op == 'RX':
            qc.rx(gate['theta'], gate['q'])
        elif op == 'RY':
            qc.ry(gate['theta'], gate['q'])
        elif op == 'RZ':
            qc.rz(gate['theta'], gate['q'])
        elif op == 'DELAY':
            qc.delay(gate['dt'], gate['q'])
        elif op == 'MEASURE':
            qc.measure(gate['q'], gate['cbit'])

    # Transpile
    pm = generate_preset_pass_manager(backend=backend, optimization_level=1)
    isa_circuit = pm.run(qc)

    # Submit
    sampler = Sampler(mode=backend)
    job = sampler.run([isa_circuit], shots=data['shots'])

    print(json.dumps({
        'job_id': job.job_id(),
        'status': 'QUEUED',
        'backend': data['backend'],
        'shots': data['shots']
    }))

if __name__ == '__main__':
    main()
`

const POLL_SCRIPT = `
import sys
import json
from qiskit_ibm_runtime import QiskitRuntimeService

def main():
    job_id = sys.argv[1]

    service = QiskitRuntimeService(channel='ibm_quantum_platform')
    job = service.job(job_id)

    status = job.status().name
    result_data = {'job_id': job_id, 'status': status}

    if status == 'DONE':
        result = job.result()
        pub_result = result[0]
        counts = pub_result.data.c.get_counts()
        result_data['status'] = 'COMPLETED'
        result_data['counts'] = counts
    elif status in ['ERROR', 'CANCELLED']:
        result_data['status'] = 'FAILED'
        result_data['error'] = str(job.error_message()) if hasattr(job, 'error_message') else 'Unknown error'
    elif status == 'RUNNING':
        result_data['status'] = 'RUNNING'

    print(json.dumps(result_data))

if __name__ == '__main__':
    main()
`

const LIST_BACKENDS_SCRIPT = `
import json
from qiskit_ibm_runtime import QiskitRuntimeService

service = QiskitRuntimeService(channel='ibm_quantum_platform')
backends = service.backends()

result = []
for b in backends:
    status = b.status()
    config = b.configuration()
    dt = b.dt if b.dt else 4e-9
    result.append({
        'name': b.name,
        'num_qubits': config.n_qubits,
        'operational': status.operational,
        'pending_jobs': status.pending_jobs,
        'dt_us': dt * 1e6
    })

print(json.dumps(result))
`

// === HELPER: Run Python Script ===
async function runPython(script: string, args: string[] = []): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn("python3", ["-c", script, ...args], {
      env: {
        ...process.env,
        IBM_QUANTUM_TOKEN: process.env.IBM_QUANTUM_TOKEN,
      },
    })

    let stdout = ""
    let stderr = ""

    proc.stdout.on("data", (data) => {
      stdout += data.toString()
    })

    proc.stderr.on("data", (data) => {
      stderr += data.toString()
    })

    proc.on("close", (code) => {
      if (code === 0) {
        resolve(stdout.trim())
      } else {
        reject(new Error(`Python error (code ${code}): ${stderr || stdout}`))
      }
    })

    proc.on("error", (err) => {
      reject(err)
    })

    // Timeout after 5 minutes
    setTimeout(() => {
      proc.kill()
      reject(new Error("Python script timeout"))
    }, 300000)
  })
}

// === IBM PROVIDER CLASS ===
export class IBMQuantumProvider {
  private token: string

  constructor() {
    assertProviderAvailable("ibm-quantum")
    this.token = process.env.IBM_QUANTUM_TOKEN!
  }

  /**
   * List available backends
   */
  async listBackends(): Promise<IBMBackendInfo[]> {
    const result = await runPython(LIST_BACKENDS_SCRIPT)
    return JSON.parse(result)
  }

  /**
   * Submit circuit to IBM Quantum
   */
  async submit(
    circuit: IRCircuit,
    backend: string,
    shots: number
  ): Promise<IBMJobResult> {
    const payload = {
      backend,
      shots,
      nqubits: circuit.nqubits,
      gates: circuit.gates,
    }

    const result = await runPython(SUBMIT_SCRIPT, [JSON.stringify(payload)])
    const parsed = JSON.parse(result)

    return {
      job_id: parsed.job_id,
      status: parsed.status,
      backend: parsed.backend,
      shots: parsed.shots,
      created_utc: new Date().toISOString(),
    }
  }

  /**
   * Poll job status
   */
  async poll(jobId: string): Promise<IBMJobResult> {
    const result = await runPython(POLL_SCRIPT, [jobId])
    const parsed = JSON.parse(result)

    // Validate counts if completed
    if (parsed.status === "COMPLETED" && parsed.counts) {
      validateRealCounts(parsed.counts)
    }

    return {
      job_id: parsed.job_id,
      status: parsed.status,
      counts: parsed.counts,
      error: parsed.error,
      backend: parsed.backend || "unknown",
      shots: parsed.shots || 0,
      created_utc: parsed.created_utc || new Date().toISOString(),
      completed_utc: parsed.status === "COMPLETED" ? new Date().toISOString() : undefined,
    }
  }

  /**
   * Submit multiple circuits as a batch (for tau-sweep)
   */
  async submitBatch(
    circuits: IRCircuit[],
    backend: string,
    shots: number
  ): Promise<{ job_ids: string[]; batch_id: string }> {
    const batchScript = `
import sys
import json
from qiskit import QuantumCircuit
from qiskit.transpiler.preset_passmanagers import generate_preset_pass_manager
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler

def build_circuit(data):
    n = data['nqubits']
    qc = QuantumCircuit(n, n)
    for gate in data['gates']:
        op = gate['op']
        if op == 'H': qc.h(gate['q'])
        elif op == 'X': qc.x(gate['q'])
        elif op == 'CX': qc.cx(gate['c'], gate['t'])
        elif op == 'RZ': qc.rz(gate['theta'], gate['q'])
        elif op == 'RY': qc.ry(gate['theta'], gate['q'])
        elif op == 'RX': qc.rx(gate['theta'], gate['q'])
        elif op == 'DELAY': qc.delay(gate['dt'], gate['q'])
        elif op == 'MEASURE': qc.measure(gate['q'], gate['cbit'])
    return qc

def main():
    data = json.loads(sys.argv[1])

    service = QiskitRuntimeService(channel='ibm_quantum_platform')
    backend = service.backend(data['backend'])

    circuits = [build_circuit(c) for c in data['circuits']]

    pm = generate_preset_pass_manager(backend=backend, optimization_level=1)
    isa_circuits = pm.run(circuits)

    sampler = Sampler(mode=backend)
    job = sampler.run(isa_circuits, shots=data['shots'])

    print(json.dumps({
        'job_id': job.job_id(),
        'batch_size': len(circuits)
    }))

if __name__ == '__main__':
    main()
`

    const payload = {
      backend,
      shots,
      circuits: circuits.map((c) => ({
        nqubits: c.nqubits,
        gates: c.gates,
      })),
    }

    const result = await runPython(batchScript, [JSON.stringify(payload)])
    const parsed = JSON.parse(result)

    return {
      job_ids: [parsed.job_id], // Single job for batch
      batch_id: parsed.job_id,
    }
  }

  /**
   * Poll batch job and get all results
   */
  async pollBatch(batchId: string): Promise<{
    status: string
    results: Array<{ index: number; counts: Record<string, number> }>
  }> {
    const pollBatchScript = `
import sys
import json
from qiskit_ibm_runtime import QiskitRuntimeService

def main():
    job_id = sys.argv[1]

    service = QiskitRuntimeService(channel='ibm_quantum_platform')
    job = service.job(job_id)

    status = job.status().name
    result_data = {'status': status, 'results': []}

    if status == 'DONE':
        result = job.result()
        result_data['status'] = 'COMPLETED'
        for i, pub_result in enumerate(result):
            counts = pub_result.data.c.get_counts()
            result_data['results'].append({'index': i, 'counts': counts})
    elif status in ['ERROR', 'CANCELLED']:
        result_data['status'] = 'FAILED'

    print(json.dumps(result_data))

if __name__ == '__main__':
    main()
`

    const result = await runPython(pollBatchScript, [batchId])
    return JSON.parse(result)
  }
}

// === SINGLETON INSTANCE ===
let ibmProvider: IBMQuantumProvider | null = null

export function getIBMProvider(): IBMQuantumProvider {
  if (!ibmProvider) {
    ibmProvider = new IBMQuantumProvider()
  }
  return ibmProvider
}
