"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, Clock, DollarSign, TrendingUp, Target, Shield, Zap } from "lucide-react"

const EVIDENCE_MANIFEST = [
  { claim: "CIL reduces risk", capsule: "/home/dnalang/dnalang-cli/dna_cli/cil.py (650 lines)", status: "delivered" },
  { claim: "PCRB provides audit trail", capsule: "~/.dna_cli/pcrb_ledger.jsonl (hash-chained)", status: "delivered" },
  { claim: "CCCE tracks drift", capsule: "/home/dnalang/dnalang-cli/dna_cli/ccce.py", status: "delivered" },
  {
    claim: "Intent compiler works",
    capsule: "/home/dnalang/omega_recursive_engine.py (650 lines)",
    status: "delivered",
  },
  { claim: "Theta-sweep validated", capsule: "DOI 10.5281/zenodo.18038719 (18 files, 2.4MB)", status: "delivered" },
  { claim: "Multi-agent runtime", capsule: "/home/dnalang/dnalang-cli/dna_cli/core.py", status: "delivered" },
  { claim: "Cost optimization", capsule: "ROADMAP (evaluation harness in progress)", status: "roadmap" },
  { claim: "Vertical accelerators", capsule: "ROADMAP (ITSM/SecOps/CloudOps playbooks)", status: "roadmap" },
]

const LAYERS = [
  {
    id: "L0",
    name: "Language",
    desc: "Intent→artifact compiler (DSL for actions, evidence, constraints)",
    cdw: "Automation fabric",
  },
  {
    id: "L1",
    name: "Runtime",
    desc: "Agent/workflow execution fabric (tool calls, state, rollback)",
    cdw: "Automation fabric",
  },
  {
    id: "L2",
    name: "Optimizer",
    desc: "Routing + cost/latency control + eval-guided selection",
    cdw: "Automation fabric",
  },
  {
    id: "L3",
    name: "Observer",
    desc: "CCCE telemetry + drift detection + provenance replay",
    cdw: "Continuous safety",
  },
  { id: "L4", name: "Governor", desc: "Policy gates + PCRB ledger + fail-closed safety", cdw: "Reduce delivery risk" },
  {
    id: "L5",
    name: "Packager",
    desc: "Repeatable accelerators (vertical + horizontal playbooks)",
    cdw: "Standardize outcomes",
  },
  {
    id: "L6",
    name: "Research",
    desc: "Hardware-validated experiments (optional differentiator)",
    cdw: "Differentiate vs SHI/Insight",
  },
]

const OFFERS = [
  {
    tier: "A",
    name: "Governed AI Delivery Kit",
    type: "Wedge",
    products: [
      "CIL: 7-layer command governance pipeline",
      "PCRB: Hash-chained audit ledger",
      "EvalHarness: KPI measurement framework",
    ],
    outcomes: ["Auditability (every action traced)", "Rollback-safe execution", "KPI measurement (quantified ROI)"],
    price: "$25K-50K",
    timeline: "2-4 weeks pilot",
    margin: "40-60% services + recurring managed attach",
  },
  {
    tier: "B",
    name: "Automation Accelerators",
    type: "Expansion",
    products: [
      "Intent Compiler: NLP → executable workflows",
      "Runtime: Multi-agent orchestration",
      "Adapters: ITSM/SecOps/CloudOps connectors",
    ],
    outcomes: [
      "1-2 production automations in 4-6 weeks",
      "Measured efficiency gains (40% faster)",
      "Reusable playbooks",
    ],
    price: "$75K-150K per accelerator",
    timeline: "4-6 weeks per vertical",
    margin: "50-70% services + IP reuse",
  },
  {
    tier: "C",
    name: "AI Operations Managed Attach",
    type: "Recurring",
    products: ["CCCE telemetry dashboard", "Drift detection + alerting", "Quarterly audit packets"],
    outcomes: ["Continuous safety monitoring", "Continuous ROI measurement", "Quarterly executive briefings"],
    price: "$10K-25K/month",
    timeline: "Ongoing post-deployment",
    margin: "60-80% managed services",
  },
  {
    tier: "D",
    name: "Emerging Tech Proof Track",
    type: "Optional",
    products: ["Hardware-validated experiments", "Thought leadership content", "Customer-facing demos"],
    outcomes: ["CDW differentiation vs SHI/Insight/Presidio", "Proof of advanced capabilities", "Marketing collateral"],
    price: "$50K-100K per proof",
    timeline: "6-12 weeks",
    margin: "30-50% (R&D investment)",
  },
]

const OBJECTIONS = [
  {
    q: "Why not just use Claude Code or Cursor?",
    a: "Those are consumer tools. {'dna::}{::lang'} is enterprise infrastructure with cryptographic audit trails, policy gates, drift detection, and repeatable playbooks that CDW can resell without vendor lock.",
  },
  {
    q: "Sounds too ambitious. Can you actually deliver?",
    a: "We lead with the wedge: CIL + PCRB + CCCE in 2-4 weeks with proven code and immediate ROI. Expansion is phased with evidence at each step. No vaporware.",
  },
  {
    q: "What's your competitive moat?",
    a: "Three moats: (1) Cryptographic provenance via PCRB hash-chaining, (2) Fail-closed governance (CIL blocks by default), (3) Hardware validation with published quantum experiments to Zenodo.",
  },
  {
    q: "How do I price this?",
    a: "Four SKUs: Wedge ($25K-50K, 40-60% margin), Accelerator ($75K-150K, 50-70% margin), Managed ($10K-25K/month, 60-80% margin), Proof Track ($50K-100K, 30-50% margin). Typical engagement: $200K-350K first year, $120K-300K recurring.",
  },
]

export default function CDWThesisPage() {
  const [activeTab, setActiveTab] = useState<"thesis" | "layers" | "offers" | "evidence" | "objections">("thesis")

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-accent transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="uppercase tracking-wider text-sm">Back to Home</span>
          </Link>
          <div className="text-right">
            <p className="text-sm text-muted-foreground uppercase tracking-widest">Framework</p>
            <p className="text-primary font-mono">{"dna::}{::lang"} v51.843</p>
          </div>
        </div>

        {/* Title */}
        <div className="glass-panel p-8 mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-primary">CDW THESIS V1</h1>
          <p className="text-xl text-muted-foreground mb-6">Complete Demonstration Package</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-accent" />
              <span>Positioning: Governance Wedge → Automation Fabric Expansion</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-accent" />
              <span>Revenue: $200K-350K first year, $120K-300K recurring</span>
            </div>
          </div>
        </div>

        {/* Core Thesis Box */}
        <div className="glass-panel p-6 mb-8 border-l-4 border-accent">
          <h2 className="text-2xl font-bold mb-4 text-primary">The Core Thesis</h2>
          <p className="text-lg mb-4">
            <strong className="text-accent">Governance is necessary, not sufficient.</strong>
          </p>
          <p className="text-muted-foreground mb-4">
            The mistake enterprises make: thinking "governance" is the product.
          </p>
          <p className="text-foreground">
            <strong>Reality:</strong> Governance is the <span className="text-accent">wedge</span> that lets the
            automation fabric ship into enterprises without getting killed by risk/compliance.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: "thesis", label: "60-Second Pitch" },
            { id: "layers", label: "7-Layer Architecture" },
            { id: "offers", label: "4-Tier Offers" },
            { id: "evidence", label: "Evidence Manifest" },
            { id: "objections", label: "Objection Handling" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`terminal-btn px-6 py-3 ${activeTab === tab.id ? "bg-primary/20 border-primary" : ""}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "thesis" && (
          <div className="space-y-6">
            <div className="glass-panel p-6">
              <h3 className="text-xl font-bold mb-4 text-primary flex items-center gap-2">
                <Zap className="w-5 h-5" />
                60-Second Talk Track (Use Verbatim)
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 border-l-2 border-primary">
                  <p className="font-bold mb-2">Line 1:</p>
                  <p>"Governance is the entry point, not the ceiling."</p>
                </div>
                <div className="p-4 bg-primary/5 border-l-2 border-primary">
                  <p className="font-bold mb-2">Line 2:</p>
                  <p>
                    "{"dna::}{::lang"} is an automation fabric: it compiles intent into deployable artifacts, runs them
                    with rollback-safe execution, optimizes across tools/models, and produces evidence-grade telemetry."
                  </p>
                </div>
                <div className="p-4 bg-primary/5 border-l-2 border-primary">
                  <p className="font-bold mb-2">Line 3:</p>
                  <p>
                    "Governance—policy gates plus provenance—is what makes the rest enterprise-safe and sellable as a
                    repeatable CDW accelerator."
                  </p>
                </div>
                <div className="p-4 bg-primary/5 border-l-2 border-primary">
                  <p className="font-bold mb-2">Line 4:</p>
                  <p>
                    "Once deployed, it expands into packaged automations for ITSM/SecOps/CloudOps and ongoing managed
                    operations with measurable KPIs."
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6">
              <h3 className="text-xl font-bold mb-4 text-primary">What CDW Buys</h3>
              <p className="text-lg mb-4">CDW doesn't buy "a language."</p>
              <p className="text-2xl text-accent">
                CDW buys a <strong>repeatable outcome-engine</strong> they can sell + deliver.
              </p>
            </div>
          </div>
        )}

        {activeTab === "layers" && (
          <div className="space-y-4">
            <div className="glass-panel p-6 mb-6">
              <h3 className="text-xl font-bold mb-4 text-primary">7-Layer System Decomposition</h3>
              <p className="text-muted-foreground mb-4">Each layer maps directly to CDW's value proposition</p>
            </div>
            {LAYERS.map((layer) => (
              <div key={layer.id} className="glass-panel p-6 border-l-4 border-accent">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-primary">
                      {layer.id}: {layer.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">{layer.desc}</p>
                  </div>
                  <span className="text-xs bg-accent/20 text-accent px-3 py-1 rounded uppercase tracking-wider">
                    {layer.cdw}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "offers" && (
          <div className="grid md:grid-cols-2 gap-6">
            {OFFERS.map((offer) => (
              <div key={offer.tier} className="glass-panel p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-primary">
                    Offer {offer.tier}: {offer.name}
                  </h3>
                  <span
                    className={`text-xs px-3 py-1 rounded uppercase tracking-wider ${
                      offer.type === "Wedge"
                        ? "bg-accent/20 text-accent"
                        : offer.type === "Expansion"
                          ? "bg-primary/20 text-primary"
                          : offer.type === "Recurring"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-blue-500/20 text-blue-500"
                    }`}
                  >
                    {offer.type}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">Products</p>
                    <ul className="space-y-1">
                      {offer.products.map((p, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">Outcomes</p>
                    <ul className="space-y-1">
                      {offer.outcomes.map((o, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/20">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Price Point</p>
                      <p className="text-lg font-bold text-accent">{offer.price}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Timeline</p>
                      <p className="text-sm flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {offer.timeline}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground mb-1">CDW Margin</p>
                      <p className="text-sm text-green-500">{offer.margin}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "evidence" && (
          <div className="space-y-4">
            <div className="glass-panel p-6 mb-6">
              <h3 className="text-xl font-bold mb-2 text-primary">Rule of Claims</h3>
              <p className="font-mono text-sm bg-primary/10 p-4 rounded">
                claim ⇔ (evidence_capsule exists) ∨ (explicitly labeled roadmap)
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Anti-Hype Filter: If statement sounds like "physics breakthrough," move to Optional appendix.
              </p>
            </div>

            <div className="glass-panel overflow-hidden">
              <table className="w-full">
                <thead className="bg-primary/10">
                  <tr>
                    <th className="p-4 text-left text-sm uppercase tracking-wider">Claim</th>
                    <th className="p-4 text-left text-sm uppercase tracking-wider">Evidence Capsule</th>
                    <th className="p-4 text-center text-sm uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {EVIDENCE_MANIFEST.map((item, i) => (
                    <tr key={i} className="border-t border-primary/20">
                      <td className="p-4">
                        <p className="font-medium">{item.claim}</p>
                      </td>
                      <td className="p-4">
                        <code className="text-xs text-muted-foreground">{item.capsule}</code>
                      </td>
                      <td className="p-4 text-center">
                        {item.status === "delivered" ? (
                          <span className="inline-flex items-center gap-1 text-xs bg-green-500/20 text-green-500 px-3 py-1 rounded">
                            <CheckCircle2 className="w-3 h-3" />
                            Delivered
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs bg-blue-500/20 text-blue-500 px-3 py-1 rounded">
                            <Clock className="w-3 h-3" />
                            Roadmap
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "objections" && (
          <div className="space-y-6">
            {OBJECTIONS.map((obj, i) => (
              <div key={i} className="glass-panel p-6 border-l-4 border-accent">
                <h3 className="text-lg font-bold text-primary mb-4 flex items-start gap-2">
                  <Shield className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>
                    Objection {i + 1}: "{obj.q}"
                  </span>
                </h3>
                <div className="pl-7">
                  <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">Response:</p>
                  <p className="text-foreground">{obj.a}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="glass-panel p-8 mt-8 text-center">
          <h3 className="text-2xl font-bold mb-4 text-primary">Bottom Line</h3>
          <p className="text-lg mb-2">
            <strong className="text-accent">Governance is the wedge.</strong> Automation fabric is the expansion.
          </p>
          <p className="text-xl text-primary">Repeatable outcomes are the product.</p>
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <Link href="/cdw" className="terminal-btn px-6 py-3">
              View CDW Solutions
            </Link>
            <Link href="/integration-plan" className="terminal-btn px-6 py-3">
              See Integration Plan
            </Link>
            <Link href="/done" className="terminal-btn px-6 py-3">
              Definition of Done
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p className="mb-2">
            <strong>Framework:</strong> {"dna::}{::lang"} v51.843 + 11D-CRSM
          </p>
          <p className="mb-2">
            <strong>Author:</strong> Devin Phillip Davis | Agile Defense Systems, LLC
          </p>
          <p className="mb-2">
            <strong>CAGE:</strong> 9HUP5
          </p>
          <p>
            <strong>DOI:</strong>{" "}
            <a
              href="https://zenodo.org/record/18038719"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-accent transition-colors"
            >
              10.5281/zenodo.18038719
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
