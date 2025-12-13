/**
 * AWS Braket Provider Adapter (Architecture-2: IonQ)
 * SPEC_LOCK v2.2.0 | CAGE: 9HUP5
 *
 * Interfaces with AWS Braket for IonQ and Rigetti QPUs.
 * Uses Python subprocess with boto3 + amazon-braket-sdk.
 *
 * Target devices for G3 closure:
 * - IonQ Aria (arn:aws:braket:us-east-1::device/qpu/ionq/Aria-1)
 * - IonQ Forte (arn:aws:braket:us-east-1::device/qpu/ionq/Forte-1)
 * - Rigetti Ankaa-2 (arn:aws:braket:us-west-1::device/qpu/rigetti/Ankaa-2)
 */

import { spawn } from "child_process"
import { IRCircuit } from "../ir"
import { assertProviderAvailable, validateRealCounts, FailClosedError } from "../invariants"

// === TYPES ===
export interface BraketJobResult {
  job_id: string
  task_arn: string
  status: "CREATED" | "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED"
  counts?: Record<string, number>
  error?: string
  device: string
  device_type: "ionq" | "rigetti" | "iqm"
  shots: number
  created_utc: string
  completed_utc?: string
}

export interface BraketDeviceInfo {
  arn: string
  name: string
  provider: string
  type: "ionq" | "rigetti" | "iqm"
  status: "ONLINE" | "OFFLINE" | "RETIRED"
  queue_depth: number
  supported_gates: string[]
  max_qubits: number
}

// === DEVICE CATALOG ===
export const BRAKET_DEVICES = {
  // IonQ (Trapped-Ion) - Architecture 2
  IONQ_ARIA: "arn:aws:braket:us-east-1::device/qpu/ionq/Aria-1",
  IONQ_FORTE: "arn:aws:braket:us-east-1::device/qpu/ionq/Forte-1",

  // Rigetti (Superconducting) - Alternative Architecture 2
  RIGETTI_ANKAA: "arn:aws:braket:us-west-1::device/qpu/rigetti/Ankaa-2",

  // IQM (Superconducting) - Additional option
  IQM_GARNET: "arn:aws:braket:eu-north-1::device/qpu/iqm/Garnet",

  // Simulators (FAIL_CLOSED: FORBIDDEN in production)
  SIM_SV1: "arn:aws:braket:::device/quantum-simulator/amazon/sv1",
  SIM_TN1: "arn:aws:braket:::device/quantum-simulator/amazon/tn1",
} as const

// === PYTHON SCRIPT TEMPLATES ===

const SUBMIT_SCRIPT = `
import sys
import json
import boto3
from braket.aws import AwsDevice, AwsQuantumTask
from braket.circuits import Circuit
from braket.ir.openqasm import Program

def main():
    data = json.loads(sys.argv[1])

    device = AwsDevice(data['device_arn'])

    # Build circuit from gates
    circuit = Circuit()

    for gate in data['gates']:
        op = gate['op']
        q = gate.get('q', gate.get('target'))

        if op == 'H':
            circuit.h(q)
        elif op == 'X':
            circuit.x(q)
        elif op == 'Y':
            circuit.y(q)
        elif op == 'Z':
            circuit.z(q)
        elif op == 'CX' or op == 'CNOT':
            circuit.cnot(gate['c'], gate['t'])
        elif op == 'CZ':
            circuit.cz(gate['c'], gate['t'])
        elif op == 'RX':
            circuit.rx(q, gate['theta'])
        elif op == 'RY':
            circuit.ry(q, gate['theta'])
        elif op == 'RZ':
            circuit.rz(q, gate['theta'])
        elif op == 'SWAP':
            circuit.swap(gate['q1'], gate['q2'])

    # IonQ native gates (if available)
    # circuit.gpi(q, phi)  # GPi gate
    # circuit.gpi2(q, phi) # GPi2 gate
    # circuit.ms(q1, q2, phi0, phi1) # Molmer-Sorensen gate

    # Submit task
    task = device.run(
        circuit,
        shots=data['shots'],
        poll_timeout_seconds=300
    )

    print(json.dumps({
        'task_arn': task.id,
        'status': 'QUEUED',
        'device': data['device_arn'],
        'shots': data['shots']
    }))

if __name__ == '__main__':
    main()
`

const POLL_SCRIPT = `
import sys
import json
from braket.aws import AwsQuantumTask

def main():
    task_arn = sys.argv[1]

    task = AwsQuantumTask(task_arn)
    state = task.state()

    result_data = {
        'task_arn': task_arn,
        'status': state.upper()
    }

    if state == 'COMPLETED':
        result = task.result()
        counts = result.measurement_counts
        result_data['counts'] = dict(counts)
    elif state == 'FAILED':
        result_data['error'] = 'Task failed'
    elif state == 'CANCELLED':
        result_data['status'] = 'CANCELLED'

    print(json.dumps(result_data))

if __name__ == '__main__':
    main()
`

const LIST_DEVICES_SCRIPT = `
import json
import boto3

client = boto3.client('braket')

# Get available devices
paginator = client.get_paginator('search_devices')

devices = []
for page in paginator.paginate(
    filters=[
        {'name': 'deviceType', 'values': ['QPU']}
    ]
):
    for device in page['devices']:
        devices.append({
            'arn': device['deviceArn'],
            'name': device['deviceName'],
            'provider': device['providerName'],
            'type': device['deviceType'],
            'status': device['deviceStatus'],
        })

print(json.dumps(devices))
`

// === HELPER: Run Python Script ===
async function runPython(script: string, args: string[] = []): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn("python3", ["-c", script, ...args], {
      env: {
        ...process.env,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION || "us-east-1",
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
        reject(new Error(`Braket Python error (code ${code}): ${stderr || stdout}`))
      }
    })

    proc.on("error", (err) => {
      reject(err)
    })

    // Timeout after 10 minutes (IonQ can be slow)
    setTimeout(() => {
      proc.kill()
      reject(new Error("Braket Python script timeout"))
    }, 600000)
  })
}

// === AWS BRAKET PROVIDER CLASS ===
export class AWSBraketProvider {
  private region: string

  constructor() {
    assertProviderAvailable("aws-braket")
    this.region = process.env.AWS_DEFAULT_REGION || "us-east-1"
  }

  /**
   * List available QPU devices
   */
  async listDevices(): Promise<BraketDeviceInfo[]> {
    const result = await runPython(LIST_DEVICES_SCRIPT)
    return JSON.parse(result)
  }

  /**
   * Submit circuit to AWS Braket
   */
  async submit(
    circuit: IRCircuit,
    deviceArn: string,
    shots: number
  ): Promise<BraketJobResult> {
    // Validate device is a real QPU (FAIL_CLOSED)
    if (deviceArn.includes("simulator")) {
      throw new FailClosedError(
        "FAIL_CLOSED: Simulator devices forbidden. Real QPU required.",
        "SIMULATOR_FORBIDDEN"
      )
    }

    const deviceType = this.getDeviceType(deviceArn)

    const payload = {
      device_arn: deviceArn,
      shots,
      nqubits: circuit.nqubits,
      gates: circuit.gates,
    }

    const result = await runPython(SUBMIT_SCRIPT, [JSON.stringify(payload)])
    const parsed = JSON.parse(result)

    return {
      job_id: parsed.task_arn,
      task_arn: parsed.task_arn,
      status: "QUEUED",
      device: deviceArn,
      device_type: deviceType,
      shots,
      created_utc: new Date().toISOString(),
    }
  }

  /**
   * Poll task status
   */
  async poll(taskArn: string): Promise<BraketJobResult> {
    const result = await runPython(POLL_SCRIPT, [taskArn])
    const parsed = JSON.parse(result)

    // Validate counts if completed
    if (parsed.status === "COMPLETED" && parsed.counts) {
      validateRealCounts(parsed.counts)
    }

    const deviceType = this.getDeviceType(taskArn)

    return {
      job_id: parsed.task_arn,
      task_arn: parsed.task_arn,
      status: parsed.status,
      counts: parsed.counts,
      error: parsed.error,
      device: taskArn.split("/").slice(-2).join("/"),
      device_type: deviceType,
      shots: 0, // Not returned by poll
      created_utc: new Date().toISOString(),
      completed_utc: parsed.status === "COMPLETED" ? new Date().toISOString() : undefined,
    }
  }

  /**
   * Submit batch for tau-sweep
   */
  async submitBatch(
    circuits: IRCircuit[],
    deviceArn: string,
    shots: number
  ): Promise<{ task_arns: string[]; batch_id: string }> {
    // AWS Braket batch support via Hybrid Jobs or sequential submission
    const task_arns: string[] = []

    for (const circuit of circuits) {
      const result = await this.submit(circuit, deviceArn, shots)
      task_arns.push(result.task_arn)
    }

    const batch_id = `batch_${Date.now()}_${task_arns.length}`

    return {
      task_arns,
      batch_id,
    }
  }

  /**
   * Poll all tasks in a batch
   */
  async pollBatch(taskArns: string[]): Promise<{
    status: string
    results: Array<{ index: number; counts: Record<string, number> }>
  }> {
    const results: Array<{ index: number; counts: Record<string, number> }> = []
    let allCompleted = true
    let anyFailed = false

    for (let i = 0; i < taskArns.length; i++) {
      const result = await this.poll(taskArns[i])

      if (result.status === "COMPLETED" && result.counts) {
        results.push({ index: i, counts: result.counts })
      } else if (result.status === "FAILED") {
        anyFailed = true
      } else if (result.status !== "COMPLETED") {
        allCompleted = false
      }
    }

    return {
      status: anyFailed ? "FAILED" : (allCompleted ? "COMPLETED" : "RUNNING"),
      results,
    }
  }

  /**
   * Get device type from ARN
   */
  private getDeviceType(arn: string): "ionq" | "rigetti" | "iqm" {
    if (arn.includes("ionq")) return "ionq"
    if (arn.includes("rigetti")) return "rigetti"
    if (arn.includes("iqm")) return "iqm"
    return "ionq" // default
  }
}

// === SINGLETON INSTANCE ===
let braketProvider: AWSBraketProvider | null = null

export function getBraketProvider(): AWSBraketProvider {
  if (!braketProvider) {
    braketProvider = new AWSBraketProvider()
  }
  return braketProvider
}

// === ARCHITECTURE-2 CLOSURE HELPER ===
export interface Architecture2Status {
  available: boolean
  providers: string[]
  recommended_device: string | null
  reason: string
}

export function checkArchitecture2Status(): Architecture2Status {
  const hasAWS = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
  const hasIonQ = !!process.env.IONQ_API_KEY

  if (hasAWS) {
    return {
      available: true,
      providers: ["aws-braket"],
      recommended_device: BRAKET_DEVICES.IONQ_ARIA,
      reason: "AWS credentials present - IonQ Aria recommended for G3 closure",
    }
  }

  if (hasIonQ) {
    return {
      available: true,
      providers: ["ionq-direct"],
      recommended_device: "ionq-aria", // Direct API device name
      reason: "IonQ API key present - direct submission available",
    }
  }

  return {
    available: false,
    providers: [],
    recommended_device: null,
    reason: "No Architecture-2 credentials configured. Set AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY or IONQ_API_KEY.",
  }
}
