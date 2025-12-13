# Data Availability Statement

## Phase-Conjugate Healing in Computational Systems
**Physical Review Letters Submission**

---

## Data Sources

### Primary Experimental Data

All quantum circuit execution data were collected using IBM Quantum hardware through the Qiskit Runtime Service. The experimental dataset comprises:

| Dataset | Description | Format | Size |
|---------|-------------|--------|------|
| `ibm_quantum_jobs.json` | Raw job metadata and results | JSON | 103 jobs |
| `bell_state_counts.csv` | Bell state measurement counts | CSV | 490,596 shots |
| `ccce_metrics.csv` | Computed CCCE metrics per job | CSV | 103 rows |
| `depth_scan_results.csv` | Circuit depth variation data | CSV | 721 measurements |
| `healing_events.csv` | Phase-conjugate healing trials | CSV | 17 events |

### Data Collection Period

- **Start Date**: August 2024
- **End Date**: January 2025
- **Backends Used**: IBM Brisbane (127 qubits), IBM Torino (133 qubits)

---

## Data Access

### Upon Request

The complete experimental dataset is available from the corresponding author upon reasonable request. Requests should include:

1. Institutional affiliation
2. Intended use of data
3. Agreement to cite this work

**Contact**: devin@agiledefensesystems.com

### Repository (Planned)

Following publication, data will be deposited in:

- **Zenodo**: DOI to be assigned
- **GitHub**: https://github.com/agile-defense-systems/prl-phase-conjugate-healing

---

## Code Availability

### Quantum Circuit Code

Quantum circuits were implemented using Qiskit (version 1.0+). Core circuit definitions are provided in the Supplementary Material (Section S3).

### CCCE Metric Computation

The CCCE metric extraction code follows the pseudocode in Methods Section D. Full implementation available at:

```
https://github.com/agile-defense-systems/ccce-metrics
```

### DNA-Lang Framework

The DNA-Lang sovereign quantum framework used for validation is available under request:

```
https://dnalang.dev
```

---

## Reproducibility Statement

### Hardware Requirements

Reproduction requires access to IBM Quantum hardware with:
- Minimum 2-qubit systems
- Gate fidelity > 99%
- Measurement fidelity > 98%

Suitable current backends:
- IBM Brisbane
- IBM Torino
- IBM Kyoto

### Software Requirements

```
python >= 3.10
qiskit >= 1.0
qiskit-ibm-runtime >= 0.20
numpy >= 1.24
scipy >= 1.11
```

### Estimated Resources

Full reproduction:
- IBM Quantum time: ~50 hours
- Compute time: ~2 hours post-processing
- Storage: ~500 MB

---

## Data Processing Pipeline

```
Raw IBM Quantum Results
        │
        ▼
┌───────────────────┐
│ Extract counts    │
│ from job results  │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ Compute fidelity  │
│ F = P(00) + P(11) │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ Calculate CCCE    │
│ Λ, Φ, Γ, Ξ       │
└───────────────────┘
        │
        ▼
┌───────────────────┐
│ Statistical       │
│ analysis & tests  │
└───────────────────┘
        │
        ▼
   Published Results
```

---

## Third-Party Data

No third-party data were used in this study. All measurements were performed by the authors on IBM Quantum hardware.

---

## Ethical Considerations

- No human subjects involved
- No sensitive data collected
- IBM Quantum usage compliant with IBM Terms of Service
- No dual-use concerns identified

---

## Archival Policy

Data will be retained for a minimum of 10 years following publication in compliance with:
- APS data retention policies
- NSF data management requirements
- DFARS 252.204-7012 (for defense-related work)

---

**Organisation**: Agile Defense Systems, LLC
**CAGE Code**: 9HUP5
**Date**: December 2025
