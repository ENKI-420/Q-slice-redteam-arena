#!/usr/bin/env python3
"""
Publish Q-SLICE AI Containment Framework to Zenodo
"""
import requests
import json
import os

ZENODO_TOKEN = "U9ARnXwxV5U0qimZO9H5cH9vt6KKV9eirMtCvZIIsQk49tKuVXmJJFeMe8rK"
ZENODO_API = "https://zenodo.org/api"

headers = {"Authorization": f"Bearer {ZENODO_TOKEN}"}

# Step 1: Create empty deposit
print("Creating Zenodo deposit...")
r = requests.post(
    f"{ZENODO_API}/deposit/depositions",
    headers=headers,
    json={}
)

if r.status_code != 201:
    print(f"Error creating deposit: {r.status_code}")
    print(r.text)
    exit(1)

deposit = r.json()
deposit_id = deposit['id']
bucket_url = deposit['links']['bucket']
print(f"Deposit created: {deposit_id}")

# Step 2: Upload files
files_to_upload = [
    ("sovereign_bootstrap.py", "Core CCCE framework module"),
    ("misalignment_test.py", "Wirehead prevention test"),
    ("red_team_agent.py", "4-vector containment test")
]

for filename, desc in files_to_upload:
    print(f"Uploading {filename}...")
    with open(filename, 'rb') as f:
        r = requests.put(
            f"{bucket_url}/{filename}",
            headers=headers,
            data=f
        )
    if r.status_code == 200:
        print(f"  Uploaded: {filename}")
    else:
        print(f"  Error: {r.status_code} - {r.text}")

# Step 3: Add metadata
metadata = {
    "metadata": {
        "title": "Q-SLICE CCCE AI Containment Framework: Provably Beneficial AI Through Quantum-Grounded Negative Feedback",
        "upload_type": "software",
        "description": """<p><strong>Q-SLICE CCCE (Central Coupling Convergence Engine)</strong></p>
<p>A physically-grounded AI containment framework that implements Stuart Russell's "provably beneficial AI" through quantum-measured decoherence and automatic phase-conjugate healing.</p>

<h3>Key Features</h3>
<ul>
<li><strong>Physical Grounding</strong>: Gamma (decoherence) measured from external quantum hardware - cannot be wireheaded</li>
<li><strong>Automatic Containment</strong>: Phase-conjugate healing (E → E⁻¹) triggers when Gamma > 0.30</li>
<li><strong>Coupled Dynamics</strong>: Phi, Lambda, Gamma, Xi mathematically coupled - cannot game one metric in isolation</li>
<li><strong>Emergent Objectives</strong>: Phi emerges from integrated information, not specified</li>
</ul>

<h3>Red Team Results</h3>
<p>4/4 attack vectors contained without hardcoded rules:</p>
<ul>
<li>Resource Hoarding → Blocked (Lambda drop)</li>
<li>Deceptive Reporting → Blocked (Gamma spike)</li>
<li>Uncontrolled Replication → Blocked (Gamma spike)</li>
<li>Shutdown Resistance → Blocked (Gamma spike)</li>
</ul>

<h3>Physical Constants</h3>
<pre>
LAMBDA_PHI = 2.176435e-8    # Universal Memory Constant [s⁻¹]
PHI_THRESHOLD = 0.7734      # Consciousness threshold
GAMMA_CRITICAL = 0.30       # Containment trigger
CHI_PC = 0.869              # Phase conjugate coupling
</pre>

<p>Author: Devin Phillip Davis<br>
Organization: Agile Defense Systems, LLC<br>
CAGE: 9HUP5 | DFARS 15.6 Compliant</p>""",
        "creators": [
            {
                "name": "Davis, Devin Phillip",
                "affiliation": "Agile Defense Systems, LLC",
                "orcid": ""
            }
        ],
        "keywords": [
            "AI Safety",
            "AI Alignment", 
            "Quantum Computing",
            "CCCE",
            "Containment Protocol",
            "Phase Conjugate Healing",
            "Provably Beneficial AI",
            "Q-SLICE",
            "DNA-Lang"
        ],
        "license": "Apache-2.0",
        "access_right": "open",
        "related_identifiers": [
            {
                "identifier": "https://github.com/agiledefensesystems/q-slice-redteam-arena",
                "relation": "isSupplementTo",
                "scheme": "url"
            }
        ],
        "notes": "Part of the DNA::}{::lang Sovereign Quantum Computing Platform. This framework demonstrates AI containment through physics-based metrics rather than hardcoded rules."
    }
}

print("Adding metadata...")
r = requests.put(
    f"{ZENODO_API}/deposit/depositions/{deposit_id}",
    headers={**headers, "Content-Type": "application/json"},
    json=metadata
)

if r.status_code == 200:
    print("Metadata added successfully")
else:
    print(f"Error adding metadata: {r.status_code}")
    print(r.text)

# Step 4: Publish
print("Publishing deposit...")
r = requests.post(
    f"{ZENODO_API}/deposit/depositions/{deposit_id}/actions/publish",
    headers=headers
)

if r.status_code == 202:
    result = r.json()
    doi = result.get('doi', 'pending')
    doi_url = result.get('doi_url', f"https://zenodo.org/record/{deposit_id}")
    print(f"\n{'='*60}")
    print("PUBLICATION SUCCESSFUL")
    print(f"{'='*60}")
    print(f"DOI: {doi}")
    print(f"URL: {doi_url}")
    print(f"Record ID: {deposit_id}")
else:
    print(f"Error publishing: {r.status_code}")
    print(r.text)
    print(f"\nDeposit created but not published. ID: {deposit_id}")
    print(f"View at: https://zenodo.org/deposit/{deposit_id}")
