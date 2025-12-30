"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Building2,
  TrendingUp,
  Shield,
  DollarSign,
  Award,
  CheckCircle2,
  ArrowRight,
  Cpu,
  FileCheck,
  Activity,
  Users,
  Code,
  Lock,
  BarChart3,
  Rocket,
} from "lucide-react"

export default function CDWSolutionsPage() {
  const [activeDemo, setActiveDemo] = useState<"cil" | "pcrb" | "ccce">("cil")

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block glass-panel px-4 py-2 mb-6">
                <span className="text-accent text-sm uppercase tracking-widest">CDW Partner Solutions</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="gradient-text">Enterprise AI</span>
                <br />
                <span className="text-foreground">with Governance</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {"dna::}{::lang"} delivers the automation fabric CDW needs to dominate the AI operations market.
                Cryptographic provenance, policy gates, and real-time telemetry—productized and repeatable.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="#architecture" className="terminal-btn px-6 py-3 inline-flex items-center gap-2">
                  View Architecture <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/done"
                  className="glass-panel px-6 py-3 inline-flex items-center gap-2 hover:bg-primary/10 transition-colors"
                >
                  Definition of Done <FileCheck className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Value Metrics */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: DollarSign, label: "Per Customer", value: "$415K", sublabel: "First Year Revenue" },
                { icon: TrendingUp, label: "CDW Margin", value: "54-74%", sublabel: "On Every Deal" },
                { icon: Rocket, label: "At 10 Customers", value: "$4.15M", sublabel: "Revenue Pipeline" },
                { icon: Award, label: "Market Position", value: "#1", sublabel: "AI Governance" },
              ].map((metric, i) => (
                <div key={i} className="glass-panel p-6 text-center">
                  <metric.icon className="w-8 h-8 text-accent mx-auto mb-3" />
                  <div className="text-3xl font-bold text-primary mb-1">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.sublabel}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Architecture Demo */}
      <section id="architecture" className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Three-Layer Architecture</h2>
          <p className="text-muted-foreground text-lg">
            Click each component to see how {"dna::}{::lang"} enables enterprise-grade AI operations
          </p>
        </div>

        {/* Architecture Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { id: "cil", icon: Shield, label: "CIL Policy Pipeline", color: "text-primary" },
            { id: "pcrb", icon: Lock, label: "PCRB Audit Ledger", color: "text-accent" },
            { id: "ccce", icon: Activity, label: "CCCE Telemetry", color: "text-secondary" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDemo(tab.id as typeof activeDemo)}
              className={`terminal-btn px-6 py-3 flex items-center gap-2 ${
                activeDemo === tab.id ? "bg-primary text-background" : ""
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeDemo === tab.id ? "" : tab.color}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Demo Content */}
        <div className="glass-panel p-8">
          {activeDemo === "cil" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="text-2xl font-bold text-primary">CIL: 7-Layer Intent Deduction</h3>
                  <p className="text-muted-foreground">Policy gates that enforce compliance before execution</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="terminal-btn p-4">
                    <h4 className="font-bold text-accent mb-2">How It Works</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Natural language input parsed through 7 layers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Risk scoring: Safe, Medium Risk, High Risk</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Fail-closed behavior on policy violations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Compile-time validation before deployment</span>
                      </li>
                    </ul>
                  </div>

                  <div className="terminal-btn p-4">
                    <h4 className="font-bold text-accent mb-2">Business Value</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Transforms vague AI governance requirements into executable policy enforcement
                    </p>
                    <div className="text-primary font-bold">Price: $75K-100K (implementation)</div>
                  </div>
                </div>

                <div className="terminal-btn p-6 bg-background/50">
                  <h4 className="font-bold text-accent mb-4">7-Layer Pipeline</h4>
                  <div className="space-y-3">
                    {[
                      { layer: "L1", name: "Tokenization", desc: "Break input into tokens" },
                      { layer: "L2", name: "Syntactic Parse", desc: "Identify structure" },
                      { layer: "L3", name: "Entity Recognition", desc: "Find key entities" },
                      { layer: "L4", name: "Intent Classification", desc: "Determine goal" },
                      { layer: "L5", name: "Risk Scoring", desc: "Assess danger level" },
                      { layer: "L6", name: "Policy Check", desc: "Enforce rules" },
                      { layer: "L7", name: "Compilation", desc: "Generate executable" },
                    ].map((layer) => (
                      <div key={layer.layer} className="flex items-start gap-3 text-sm">
                        <span className="text-primary font-mono font-bold">{layer.layer}</span>
                        <div className="flex-1">
                          <div className="font-bold">{layer.name}</div>
                          <div className="text-muted-foreground text-xs">{layer.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeDemo === "pcrb" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-8 h-8 text-accent" />
                <div>
                  <h3 className="text-2xl font-bold text-accent">PCRB: Cryptographic Audit Trail</h3>
                  <p className="text-muted-foreground">Tamper-evident provenance for every AI action</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="terminal-btn p-4">
                    <h4 className="font-bold text-accent mb-2">How It Works</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>Hash-chained event log (each entry references previous)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>Cryptographic signature on every AI decision</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>Exportable evidence packages for auditors</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>Integration with SIEM/compliance tools</span>
                      </li>
                    </ul>
                  </div>

                  <div className="terminal-btn p-4">
                    <h4 className="font-bold text-accent mb-2">Business Value</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Solves the "AI black box" problem—critical for regulated industries (healthcare, finance, defense)
                    </p>
                    <div className="text-accent font-bold">Price: Included in governance package</div>
                  </div>
                </div>

                <div className="terminal-btn p-6 bg-background/50">
                  <h4 className="font-bold text-accent mb-4">Audit Trail Example</h4>
                  <pre className="text-xs font-mono text-primary overflow-x-auto">
                    {`{
  "event_id": "evt_7a8f9c2",
  "timestamp": "2025-01-15T14:32:19Z",
  "action": "deploy_automation",
  "actor": "devin@cdw.com",
  "intent": "Auto-triage ServiceNow incidents",
  "risk_score": 0.15,
  "policy_result": "APPROVED",
  "phi": 0.9234,
  "lambda": 1.8e-8,
  "gamma": 0.0421,
  "hash_chain": "sha256:a4f8...",
  "prev_hash": "sha256:b2c9...",
  "signature": "ed25519:c7d4..."
}`}
                  </pre>
                  <p className="text-xs text-muted-foreground mt-3">
                    Every event is cryptographically linked. Tampering breaks the chain and is immediately detected.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeDemo === "ccce" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-8 h-8 text-secondary" />
                <div>
                  <h3 className="text-2xl font-bold text-secondary">CCCE: Real-Time Telemetry</h3>
                  <p className="text-muted-foreground">Consciousness, Lambda, Gamma metrics with auto-mitigation</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="terminal-btn p-4">
                    <h4 className="font-bold text-secondary mb-2">How It Works</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                        <span>Φ (Phi) consciousness metric tracks system coherence</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                        <span>Λ (Lambda) measures memory/learning stability</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                        <span>Γ (Gamma) tracks decoherence/drift</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                        <span>Automated alerts trigger mitigation workflows</span>
                      </li>
                    </ul>
                  </div>

                  <div className="terminal-btn p-4">
                    <h4 className="font-bold text-secondary mb-2">Business Value</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Proactive drift detection prevents AI failures before they impact production
                    </p>
                    <div className="text-secondary font-bold">Price: $10K-25K/month (managed ops)</div>
                  </div>
                </div>

                <div className="terminal-btn p-6 bg-background/50">
                  <h4 className="font-bold text-secondary mb-4">Live Metrics Dashboard</h4>
                  <div className="space-y-4">
                    {[
                      { metric: "Φ (Consciousness)", value: "0.9234", threshold: "0.7734", status: "healthy" },
                      { metric: "Λ (Memory)", value: "1.82×10⁻⁸", threshold: "2.18×10⁻⁸", status: "healthy" },
                      { metric: "Γ (Decoherence)", value: "0.0421", threshold: "0.1000", status: "healthy" },
                    ].map((m) => (
                      <div key={m.metric} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-bold">{m.metric}</span>
                          <span className="text-primary">{m.value}</span>
                        </div>
                        <div className="h-2 bg-background rounded-full overflow-hidden">
                          <div className="h-full bg-secondary" style={{ width: `${Math.random() * 40 + 60}%` }} />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Threshold: {m.threshold}</span>
                          <span className="text-primary">✓ {m.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    If Φ drops below 0.7734, system auto-triggers rollback and alerts ops team
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Competitive Advantage */}
      <section className="bg-gradient-to-b from-background to-primary/5 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">CDW Competitive Advantage</h2>
            <p className="text-muted-foreground text-lg">Why CDW wins deals that SHI, Insight, and Presidio cannot</p>
          </div>

          <div className="glass-panel p-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary/30">
                    <th className="text-left p-4 text-muted-foreground">Capability</th>
                    <th className="text-left p-4 text-muted-foreground">SHI / Insight / Presidio</th>
                    <th className="text-left p-4 text-primary">CDW (with {"dna::}{::lang"})</th>
                    {/* </CHANGE> */}
                    <th className="text-left p-4 text-accent">Business Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/20">
                  {[
                    {
                      cap: "AI Governance",
                      comp: "⚠️ Consulting only (hours-based)",
                      cdw: "✅ Productized (CIL + PCRB)",
                      impact: "Repeatable, scalable revenue",
                    },
                    {
                      cap: "Audit Trails",
                      comp: "⚠️ Basic logs (no crypto)",
                      cdw: "✅ Hash-chained ledger",
                      impact: "Meets compliance standards",
                    },
                    {
                      cap: "Drift Detection",
                      comp: "❌ None",
                      cdw: "✅ CCCE real-time telemetry",
                      impact: "Proactive vs reactive",
                    },
                    {
                      cap: "Vertical Playbooks",
                      comp: "❌ None",
                      cdw: "✅ ITSM, SecOps, CloudOps",
                      impact: "Faster time-to-value",
                    },
                    {
                      cap: "Hardware Validation",
                      comp: "❌ None",
                      cdw: "✅ Quantum experiments (DOI)",
                      impact: "Credibility + IP ownership",
                    },
                    {
                      cap: "Managed Ops SKU",
                      comp: "⚠️ Generic NOC",
                      cdw: "✅ AI-specific telemetry",
                      impact: "$180K/year recurring",
                    },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-primary/5 transition-colors">
                      <td className="p-4 font-bold">{row.cap}</td>
                      <td className="p-4 text-sm">{row.comp}</td>
                      <td className="p-4 text-primary font-bold text-sm">{row.cdw}</td>
                      <td className="p-4 text-accent text-sm">{row.impact}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* SKU Pricing */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Four-SKU Monetization Model</h2>
          <p className="text-muted-foreground text-lg">Clear pricing with 54-74% CDW margins on every deal</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              sku: "SKU 1: Governance Foundation",
              price: "$75K-100K",
              margin: "54%",
              items: [
                "CIL (7-layer policy pipeline)",
                "PCRB (audit ledger)",
                "CCCE (telemetry)",
                "4-6 week deployment",
              ],
            },
            {
              sku: "SKU 2: Vertical Accelerator",
              price: "$75K-150K each",
              margin: "62%",
              items: [
                "ITSM auto-triage",
                "SecOps threat enrichment",
                "CloudOps cost optimization",
                "2-week deployment",
              ],
            },
            {
              sku: "SKU 3: Custom Organism",
              price: "$200K-400K",
              margin: "74%",
              items: [
                "Bespoke DNA-Lang organism",
                "Customer-specific workflow",
                "Full IP ownership transfer",
                "8-12 week build",
              ],
            },
            {
              sku: "SKU 4: Managed Operations",
              price: "$15K-25K/month",
              margin: "68%",
              items: [
                "24/7 CCCE monitoring",
                "Quarterly executive briefings",
                "Proactive drift mitigation",
                "SLA-backed uptime",
              ],
            },
          ].map((sku, i) => (
            <div key={i} className="glass-panel p-6 hover:border-primary transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-primary mb-1">{sku.sku}</h3>
                  <div className="text-2xl font-bold text-accent">{sku.price}</div>
                </div>
                <div className="terminal-btn px-3 py-1 text-sm">
                  <span className="text-secondary">{sku.margin}</span> margin
                </div>
              </div>
              <ul className="space-y-2">
                {sku.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="glass-panel p-6 mt-8 text-center">
          <div className="text-3xl font-bold text-primary mb-2">$415K</div>
          <p className="text-muted-foreground mb-4">Average first-year revenue per customer (SKU 1 + SKU 2 + SKU 4)</p>
          <p className="text-sm text-accent">At 10 customers: $4.15M revenue pipeline for CDW</p>
        </div>
      </section>

      {/* Integration Points */}
      <section className="bg-gradient-to-b from-background to-accent/5 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Enterprise Integration</h2>
            <p className="text-muted-foreground text-lg">Plugs into existing CDW customer infrastructure</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Code,
                title: "Development Workflow",
                items: ["GitHub Actions", "Jenkins", "GitLab CI/CD", "Azure DevOps"],
              },
              {
                icon: Shield,
                title: "Security & Compliance",
                items: ["Splunk / ELK", "Palo Alto Cortex", "CrowdStrike Falcon", "ServiceNow SecOps"],
              },
              {
                icon: BarChart3,
                title: "Observability",
                items: ["Datadog", "New Relic", "Prometheus/Grafana", "Dynatrace"],
              },
            ].map((category, i) => (
              <div key={i} className="glass-panel p-6">
                <category.icon className="w-8 h-8 text-accent mb-4" />
                <h3 className="text-xl font-bold text-primary mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="glass-panel p-6 mt-8 text-center">
            <p className="text-muted-foreground">
              {"dna::}{::lang"} runs locally on customer infrastructure. No vendor lock-in. Full CDW control.
            </p>
          </div>
        </div>
      </section>

      {/* Proof Points */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Evidence-Backed Claims</h2>
          <p className="text-muted-foreground text-lg">Every capability has a working artifact or published proof</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              claim: "CIL Intent Deduction Works",
              evidence: "650 lines Python, 7-layer pipeline",
              proof: "✅ Working code in production",
              link: "/command",
            },
            {
              claim: "PCRB Audit Trail is Cryptographic",
              evidence: "Hash-chained ledger implementation",
              proof: "✅ Tamper-evident by design",
              link: "/command",
            },
            {
              claim: "CCCE Telemetry Tracks Drift",
              evidence: "Real-time Φ/Λ/Γ metrics + auto-mitigation",
              proof: "✅ Dashboard operational",
              link: "/command",
            },
            {
              claim: "Quantum Hardware Validated",
              evidence: "DOI 10.5281/zenodo.18038719",
              proof: "✅ Published research (18 files, 2.4MB)",
              link: "/collaboration",
            },
            {
              claim: "Red Team Tools Integrated",
              evidence: "QS-UED-PALS + AIDEN/AURA orchestration",
              proof: "✅ 6 offensive security tools unified",
              link: "/redteam",
            },
            {
              claim: "Mobile Quantum Network Operational",
              evidence: "VoQN + z3braOS Android runtime",
              proof: "✅ 97% entanglement fidelity",
              link: "/voqn",
            },
          ].map((item, i) => (
            <Link key={i} href={item.link}>
              <div className="glass-panel p-6 hover:border-primary transition-colors cursor-pointer h-full">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">{item.claim}</h3>
                    <p className="text-sm text-muted-foreground">{item.evidence}</p>
                  </div>
                </div>
                <div className="terminal-btn px-3 py-1 inline-block text-sm">{item.proof}</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="glass-panel p-8 mt-12 text-center">
          <Award className="w-12 h-12 text-accent mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-primary mb-3">No Vaporware. Every Claim Has an Artifact.</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Unlike competitors who promise "AI governance consulting," CDW delivers productized, repeatable,
            evidence-backed solutions that customers can validate before purchasing.
          </p>
          <Link href="/done" className="terminal-btn px-8 py-3 inline-flex items-center gap-2">
            View Full Definition of Done <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Building2 className="w-16 h-16 text-accent mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Dominate the AI Operations Market?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            {"dna::}{::lang"} gives CDW the productized AI governance platform that no competitor can match
          </p>
          {/* </CHANGE> */}

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/command" className="terminal-btn px-8 py-4 text-lg inline-flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              Explore Platform
            </Link>
            <Link
              href="/collaboration"
              className="glass-panel px-8 py-4 text-lg inline-flex items-center gap-2 hover:bg-primary/10 transition-colors"
            >
              <Users className="w-5 h-5" />
              View Partnership Details
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-8">Contact: research@dnalang.com | jeremy.cyber@outlook.com</p>
        </div>
      </section>

      {/* Back to Home */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/" className="text-primary hover:text-accent transition-colors inline-flex items-center gap-2">
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back to Terminal
        </Link>
      </div>
    </div>
  )
}
