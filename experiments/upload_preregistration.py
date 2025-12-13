#!/usr/bin/env python3
"""
Upload K8 Pre-Registration to Zenodo
====================================
Creates a DOI for the pre-registration BEFORE running experiments.

Usage:
    export ZENODO_TOKEN="your_token_here"
    python3 upload_preregistration.py

Author: Devin Phillip Davis
Organization: Agile Defense Systems, LLC
"""
import requests
import json
import os
import sys
import hashlib
from datetime import datetime

# =============================================================================
# CONFIGURATION
# =============================================================================

ZENODO_API = "https://zenodo.org/api"

# Get token from environment variable
ZENODO_TOKEN = os.environ.get("ZENODO_TOKEN")

if not ZENODO_TOKEN:
    print("ERROR: ZENODO_TOKEN environment variable not set")
    print("Usage: export ZENODO_TOKEN='your_token_here'")
    sys.exit(1)

headers = {"Authorization": f"Bearer {ZENODO_TOKEN}"}

# Pre-registration file
PREREG_FILE = os.path.join(os.path.dirname(__file__), "k8_preregistration.py")

# Compute file hash
with open(PREREG_FILE, 'rb') as f:
    FILE_HASH = hashlib.sha256(f.read()).hexdigest()

# =============================================================================
# METADATA
# =============================================================================

METADATA = {
    "metadata": {
        "title": "K8 Causality Discriminator: Pre-Registration for τ-Sweep Bell Fidelity Experiment",
        "upload_type": "other",
        "description": f"""<p><strong>PRE-REGISTRATION (Upload before experiment)</strong></p>

<p>This file contains the complete pre-registration for the K8 Causality Discriminator experiment,
which tests whether Bell-state fidelity exhibits non-monotonic revival at τ ≈ 47 μs (φ⁸),
as predicted by the ΛΦ (Lambda-Phi) theory.</p>

<h3>Theoretical Predictions (Zero Free Parameters)</h3>
<pre>
τ₀ = φ⁸ = 46.9787 μs     (revival time)
F_max = 1 - φ⁻⁸ = 0.9787  (peak fidelity)
ΛΦ = 2.176435×10⁻⁸ s⁻¹   (Universal Memory Constant)
</pre>

<h3>Decision Rules</h3>
<ul>
<li><strong>ACCEPT H₁</strong>: Revival at |τ - 47| &lt; 5 μs with σ ≥ 5.0 on ≥2 backends</li>
<li><strong>REJECT H₁</strong>: No revival, wrong location, or σ &lt; 3.0</li>
</ul>

<h3>Hardware Targets</h3>
<ul>
<li>IBM Brisbane</li>
<li>IBM Kyoto</li>
<li>IBM Osaka</li>
</ul>

<h3>File Integrity</h3>
<pre>
SHA256: {FILE_HASH}
</pre>

<p><strong>DO NOT MODIFY THIS FILE AFTER REGISTRATION</strong></p>

<p>Author: Devin Phillip Davis<br>
Organization: Agile Defense Systems, LLC<br>
CAGE: 9HUP5</p>""",
        "creators": [
            {
                "name": "Davis, Devin Phillip",
                "affiliation": "Agile Defense Systems, LLC",
            }
        ],
        "keywords": [
            "Pre-Registration",
            "Quantum Experiment",
            "Bell State",
            "Causality",
            "ΛΦ Theory",
            "Q-SLICE",
            "AI Safety",
            "Quantum Decoherence",
            "Phase Conjugate",
            "IBM Quantum"
        ],
        "license": "Apache-2.0",
        "access_right": "open",
        "related_identifiers": [
            {
                "identifier": "10.5281/zenodo.17918294",
                "relation": "isPartOf",
                "scheme": "doi"
            }
        ],
        "notes": f"SHA256: {FILE_HASH}\n\nThis pre-registration must be uploaded and DOI obtained BEFORE running hardware experiments. The file hash ensures no post-hoc modifications can be made to the analysis plan."
    }
}

# =============================================================================
# FUNCTIONS
# =============================================================================

def create_deposit():
    """Create empty Zenodo deposit"""
    print("Creating Zenodo deposit...")
    r = requests.post(
        f"{ZENODO_API}/deposit/depositions",
        headers=headers,
        json={}
    )

    if r.status_code != 201:
        print(f"Error creating deposit: {r.status_code}")
        print(r.text)
        return None

    deposit = r.json()
    print(f"Deposit created: ID={deposit['id']}")
    return deposit


def upload_file(deposit):
    """Upload pre-registration file"""
    bucket_url = deposit['links']['bucket']

    print(f"Uploading k8_preregistration.py...")
    print(f"  SHA256: {FILE_HASH}")

    with open(PREREG_FILE, 'rb') as f:
        r = requests.put(
            f"{bucket_url}/k8_preregistration.py",
            headers=headers,
            data=f
        )

    if r.status_code in (200, 201):
        print(f"  Upload successful")
        return True
    else:
        print(f"  Error: {r.status_code} - {r.text}")
        return False


def add_metadata(deposit_id):
    """Add metadata to deposit"""
    print("Adding metadata...")
    r = requests.put(
        f"{ZENODO_API}/deposit/depositions/{deposit_id}",
        headers={**headers, "Content-Type": "application/json"},
        json=METADATA
    )

    if r.status_code == 200:
        print("Metadata added successfully")
        return True
    else:
        print(f"Error adding metadata: {r.status_code}")
        print(r.text)
        return False


def publish_deposit(deposit_id):
    """Publish the deposit"""
    print("Publishing deposit...")
    r = requests.post(
        f"{ZENODO_API}/deposit/depositions/{deposit_id}/actions/publish",
        headers=headers
    )

    if r.status_code == 202:
        return r.json()
    else:
        print(f"Error publishing: {r.status_code}")
        print(r.text)
        return None


def main():
    """Main entry point"""
    print(f"""
╔══════════════════════════════════════════════════════════════════════════════╗
║  K8 PRE-REGISTRATION - Zenodo Upload                                         ║
║  {datetime.now().isoformat()[:23]}                                            ║
╚══════════════════════════════════════════════════════════════════════════════╝

File: {PREREG_FILE}
SHA256: {FILE_HASH}
""")

    # Create deposit
    deposit = create_deposit()
    if not deposit:
        return 1

    deposit_id = deposit['id']

    # Upload file
    if not upload_file(deposit):
        print(f"\nDeposit created but upload failed. ID: {deposit_id}")
        return 1

    # Add metadata
    if not add_metadata(deposit_id):
        print(f"\nDeposit created but metadata failed. ID: {deposit_id}")
        print(f"View at: https://zenodo.org/deposit/{deposit_id}")
        return 1

    # Publish
    result = publish_deposit(deposit_id)

    if result:
        doi = result.get('doi', 'pending')
        doi_url = result.get('doi_url', f"https://zenodo.org/record/{deposit_id}")

        print(f"""
╔══════════════════════════════════════════════════════════════════════════════╗
║  PRE-REGISTRATION PUBLISHED                                                  ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  DOI: {doi:<66} ║
║  URL: {doi_url:<66} ║
╚══════════════════════════════════════════════════════════════════════════════╝

NEXT STEPS:
  1. Record this DOI in your lab notebook
  2. Set environment variable: export ZENODO_PREREG_DOI="{doi}"
  3. Run experiment: python3 k8_tau_sweep.py --backend ibm_brisbane --phase coarse
  4. DO NOT modify k8_preregistration.py after this point!
""")
        return 0
    else:
        print(f"\nDeposit created but not published. ID: {deposit_id}")
        print(f"View at: https://zenodo.org/deposit/{deposit_id}")
        return 1


if __name__ == '__main__':
    sys.exit(main())
