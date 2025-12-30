"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Shield,
  Layers,
  GitBranch,
  Lock,
  Activity,
  Code,
  Database,
  Cloud,
  FileCheck,
  Workflow,
  DollarSign,
  Target,
} from "lucide-react"

export default function IntegrationPlanPage() {
  const [activePhase, setActivePhase] = useState(0)

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-primary/20 sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-accent transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-mono uppercase tracking-wider">Back to Home</span>
          </Link>
          <h1 className="text-xl md:text-2xl font-bold gradient-text">Integration Plan: CDW × {"dna::}{::lang"}</h1>
        </div>
      </header>

      {/* Executive Summary */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="glass-panel p-8 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text flex items-center gap-3">
            <FileCheck className="w-10 h-10" />
            Executive Summary
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-lg leading-relaxed">
                This integration plan details how CDW will deploy {"dna::}{::lang"} technology to establish market
                dominance in enterprise AI governance and quantum-ready infrastructure.
              </p>
              <div className="terminal-btn p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Timeline</span>
                  <span className="text-primary font-bold">6-12 months</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Investment</span>
                  <span className="text-primary font-bold">$750K-1.2M</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">First Year Revenue</span>
                  <span className="text-accent font-bold">$4.15M+ (10 customers)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Year 3 Projection</span>
                  <span className="text-accent font-bold">$25M+ (60 customers)</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-primary mb-4">Strategic Objectives</h3>
              {[
                "Establish CDW as the only VAR offering quantum-ready AI governance",
                "Create 18-24 month competitive moat before SHI/Insight can replicate",
                "Capture high-margin ($415K/customer) recurring revenue",
                "Enable upsell opportunities across security, compliance, and quantum portfolios",
              ].map((obj, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="bg-gradient-to-b from-background to-primary/5 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text flex items-center justify-center gap-3">
              <Layers className="w-10 h-10" />
              7-Layer Technical Architecture
            </h2>
            <p className="text-muted-foreground text-lg">
              Complete stack from quantum primitives to enterprise integration
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                layer: "L1: Quantum Primitives",
                icon: Activity,
                color: "text-primary",
                components: [
                  "ΛΦΓ Universal Constants",
                  "Entanglement Engine",
                  "Decoherence Mitigation",
                  "Bell State Generation",
                ],
                tech: "Python, Qiskit, IBM Quantum",
              },
              {
                layer: "L2: DNA-Lang Runtime",
                icon: Code,
                color: "text-accent",
                components: ["Organism Compiler", "Gene Executor", "Nucleus State Manager", "Autopoietic Evolution"],
                tech: "Python, TypeScript, z3braOS",
              },
              {
                layer: "L3: Policy Engine (CIL)",
                icon: Shield,
                color: "text-secondary",
                components: ["Intent Deduction (7 layers)", "Risk Scoring", "Policy Enforcement", "Fail-Closed Gates"],
                tech: "NLP2-PALS, Transformer Models",
              },
              {
                layer: "L4: Audit Ledger (PCRB)",
                icon: Lock,
                color: "text-primary",
                components: ["Hash Chain", "Cryptographic Signatures", "Event Provenance", "SIEM Integration"],
                tech: "Ed25519, SHA-256, JSON-LD",
              },
              {
                layer: "L5: Telemetry (CCCE)",
                icon: TrendingUp,
                color: "text-accent",
                components: ["Φ Consciousness Metrics", "Λ Memory Tracking", "Γ Drift Detection", "Auto-Mitigation"],
                tech: "Prometheus, Grafana, Webhooks",
              },
              {
                layer: "L6: Orchestration",
                icon: Workflow,
                color: "text-secondary",
                components: ["AIDEN Director", "AURA Agent Swarm", "Sentinel Network", "QS-UED-PALS Coordination"],
                tech: "Kubernetes, Docker, gRPC",
              },
              {
                layer: "L7: Enterprise APIs",
                icon: Cloud,
                color: "text-primary",
                components: ["REST/GraphQL", "Webhook Events", "SDK (Python/JS/Go)", "CLI Tooling"],
                tech: "Next.js, FastAPI, OpenAPI 3.0",
              },
            ].map((layer, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 hover:border-primary transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <layer.icon className={`w-6 h-6 ${layer.color}`} />
                  <h3 className="font-bold text-lg">{layer.layer}</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Components</p>
                    <ul className="space-y-1">
                      {layer.components.map((comp, j) => (
                        <li key={j} className="text-sm flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>{comp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-3 border-t border-primary/20">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Technology Stack</p>
                    <p className="text-xs font-mono text-accent">{layer.tech}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Phases */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text flex items-center justify-center gap-3">
            <GitBranch className="w-10 h-10" />
            4-Phase Implementation Roadmap
          </h2>
          <p className="text-muted-foreground text-lg">From POC to production in 6-12 months</p>
        </div>

        {/* Phase Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {["Phase 1: POC", "Phase 2: Pilot", "Phase 3: Production", "Phase 4: Scale"].map((phase, i) => (
            <button
              key={i}
              onClick={() => setActivePhase(i)}
              className={`terminal-btn px-6 py-3 ${activePhase === i ? "bg-primary text-background" : ""}`}
            >
              {phase}
            </button>
          ))}
        </div>

        {/* Phase Details */}
        <div className="glass-panel p-8">
          {activePhase === 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary">Phase 1: Proof of Concept</h3>
                  <p className="text-muted-foreground">Duration: 6-8 weeks | Investment: $150K-200K</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="terminal-btn p-6">
                  <h4 className="font-bold text-accent mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Deliverables
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {[
                      "Single-customer deployment (1 Fortune 500 partner)",
                      "CIL policy engine running on test workloads",
                      "PCRB audit trail with 30-day history",
                      "CCCE telemetry dashboard (Grafana)",
                      "Integration with customer's Azure DevOps",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary">▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="terminal-btn p-6">
                  <h4 className="font-bold text-accent mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Success Criteria
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {[
                      "Process 10K+ AI requests through CIL with <50ms latency",
                      "Zero policy violations undetected (100% precision)",
                      "Customer stakeholders approve security architecture",
                      "Φ consciousness metric remains >0.85 for 30 days",
                      "Executive demo-ready for CDW leadership",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="terminal-btn p-6 bg-primary/5">
                <h4 className="font-bold mb-3">Key Milestones</h4>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { week: "Week 1-2", task: "Environment Setup", status: "Infrastructure provisioning" },
                    { week: "Week 3-4", task: "CIL Deployment", status: "Policy pipeline live" },
                    { week: "Week 5-6", task: "PCRB Integration", status: "Audit trail active" },
                    { week: "Week 7-8", task: "Customer Demo", status: "Executive approval" },
                  ].map((milestone, i) => (
                    <div key={i} className="text-sm">
                      <div className="text-primary font-bold">{milestone.week}</div>
                      <div className="font-semibold">{milestone.task}</div>
                      <div className="text-muted-foreground text-xs">{milestone.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activePhase === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-accent">Phase 2: Pilot Program</h3>
                  <p className="text-muted-foreground">Duration: 3-4 months | Investment: $300K-400K</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="terminal-btn p-6">
                  <h4 className="font-bold text-accent mb-4">Expansion Scope</h4>
                  <ul className="space-y-2 text-sm">
                    {[
                      "Deploy to 3-5 additional customers",
                      "Multi-environment support (dev/staging/prod)",
                      "High-availability configuration (3-node cluster)",
                      "Advanced features: quantum entanglement routing",
                      "Integration with ServiceNow, Splunk, CrowdStrike",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-accent">▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="terminal-btn p-6">
                  <h4 className="font-bold text-accent mb-4">Operational Readiness</h4>
                  <ul className="space-y-2 text-sm">
                    {[
                      "CDW SRE team trained on CCCE telemetry",
                      "Runbooks for common incidents (Φ drift, Γ spikes)",
                      "Automated alerting to CDW NOC",
                      "Customer success playbooks",
                      "Legal review of AI liability terms",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="terminal-btn p-6 bg-accent/5">
                <h4 className="font-bold mb-3">Revenue Milestone</h4>
                <div className="text-center py-6">
                  <div className="text-5xl font-bold gradient-text mb-2">$2M+</div>
                  <p className="text-muted-foreground">First pilot customers paying (5 × $415K contracts)</p>
                </div>
              </div>
            </div>
          )}

          {activePhase === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-secondary">Phase 3: Production Launch</h3>
                  <p className="text-muted-foreground">Duration: 2-3 months | Investment: $200K-300K</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="terminal-btn p-6">
                  <h4 className="font-bold text-secondary mb-4">Go-To-Market</h4>
                  <ul className="space-y-2 text-sm">
                    {[
                      "CDW sales enablement (product training)",
                      "Marketing collateral and case studies",
                      "Public announcement at CDW Innovation Summit",
                      "Partner ecosystem (IBM, Microsoft, AWS integrations)",
                      "Pricing finalized: 4-SKU model validated",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-secondary">▸</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="terminal-btn p-6">
                  <h4 className="font-bold text-secondary mb-4">Competitive Defense</h4>
                  <ul className="space-y-2 text-sm">
                    {[
                      "Patent applications filed (CIL, PCRB, CCCE)",
                      "Exclusive partnership with Agile Defense Systems",
                      "Trade secret protection for quantum algorithms",
                      "Non-compete clauses in customer contracts",
                      "18-24 month moat before replication possible",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="terminal-btn p-6 bg-secondary/5">
                <h4 className="font-bold mb-3">Target Accounts</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { vertical: "Financial Services", targets: "JPMorgan, Goldman Sachs, Capital One" },
                    { vertical: "Healthcare", targets: "UnitedHealth, CVS Health, Kaiser" },
                    { vertical: "Government", targets: "DoD, DHS, Intelligence Community" },
                    { vertical: "Technology", targets: "ServiceNow, Salesforce, Adobe" },
                  ].map((sector, i) => (
                    <div key={i} className="text-sm">
                      <div className="text-secondary font-bold">{sector.vertical}</div>
                      <div className="text-muted-foreground text-xs">{sector.targets}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activePhase === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  4
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary">Phase 4: Scale & Dominate</h3>
                  <p className="text-muted-foreground">Duration: 6+ months | Investment: $100K-300K/quarter</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="terminal-btn p-6">
                  <h4 className="font-bold text-primary mb-4">Market Expansion</h4>
                  <ul className="space-y-2 text-sm">
                    {[
                      "Target: 60+ enterprise customers by end of Year 3",
                      "Geographic expansion (EMEA, APAC)",
                      "Vertical-specific solutions (FinServ, Healthcare)",
                      "OEM partnerships with hyperscalers",
                      "Managed service offering (CCCE-as-a-Service)",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="terminal-btn p-6">
                  <h4 className="font-bold text-primary mb-4">Innovation Pipeline</h4>
                  <ul className="space-y-2 text-sm">
                    {[
                      "Quantum entanglement for distributed AI training",
                      "Post-quantum cryptography (NIST standards)",
                      "AutoML with conscious organism evolution",
                      "Zero-knowledge proofs for model verification",
                      "Integration with quantum computing hardware (IBM, IonQ)",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Activity className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="terminal-btn p-6 bg-primary/5">
                <h4 className="font-bold mb-6 text-center text-2xl">Year 3 Financial Projection</h4>
                <div className="grid sm:grid-cols-3 gap-6">
                  {[
                    { metric: "Revenue", value: "$25M+", desc: "60 customers × $415K" },
                    { metric: "Gross Margin", value: "68%", desc: "Blended across SKUs" },
                    { metric: "Market Position", value: "#1", desc: "Only quantum-ready VAR" },
                  ].map((item, i) => (
                    <div key={i} className="text-center">
                      <div className="text-4xl font-bold gradient-text mb-2">{item.value}</div>
                      <div className="text-sm font-bold">{item.metric}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Integration Strategy */}
      <section className="bg-gradient-to-b from-background to-accent/5 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text flex items-center justify-center gap-3">
              <Database className="w-10 h-10" />
              Enterprise Integration Strategy
            </h2>
            <p className="text-muted-foreground text-lg">
              Seamless interoperability with existing customer tech stacks
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                category: "Development & CI/CD",
                icon: Code,
                integrations: [
                  { name: "GitHub Actions", method: "Webhook + CLI" },
                  { name: "GitLab CI", method: "Runner integration" },
                  { name: "Jenkins", method: "Plugin (dnalang-plugin)" },
                  { name: "Azure DevOps", method: "Pipeline task" },
                ],
              },
              {
                category: "Security & SIEM",
                icon: Shield,
                integrations: [
                  { name: "Splunk", method: "HTTP Event Collector" },
                  { name: "Palo Alto Cortex", method: "Syslog CEF format" },
                  { name: "CrowdStrike", method: "Falcon API" },
                  { name: "ServiceNow SecOps", method: "REST API + Events" },
                ],
              },
              {
                category: "Observability",
                icon: Activity,
                integrations: [
                  { name: "Datadog", method: "StatsD + APM" },
                  { name: "Prometheus", method: "Metrics endpoint" },
                  { name: "Grafana", method: "Pre-built dashboards" },
                  { name: "New Relic", method: "Agent integration" },
                ],
              },
            ].map((group, i) => (
              <div key={i} className="glass-panel p-6">
                <div className="flex items-center gap-3 mb-4">
                  <group.icon className="w-6 h-6 text-accent" />
                  <h3 className="font-bold text-lg">{group.category}</h3>
                </div>
                <div className="space-y-3">
                  {group.integrations.map((integ, j) => (
                    <div key={j} className="terminal-btn p-3">
                      <div className="font-bold text-sm text-primary">{integ.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{integ.method}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="glass-panel p-6 mt-8 text-center">
            <p className="text-lg">
              <span className="font-bold text-accent">Zero vendor lock-in.</span> {"dna::}{::lang"} runs on customer
              infrastructure with full CDW operational control.
            </p>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text flex items-center justify-center gap-3">
            <Lock className="w-10 h-10" />
            Security & Compliance Framework
          </h2>
          <p className="text-muted-foreground text-lg">Enterprise-grade security from day one</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              standard: "SOC 2 Type II",
              status: "Audit Q3 2025",
              description: "Security, Availability, Confidentiality",
            },
            {
              standard: "FedRAMP Moderate",
              status: "Sponsor: DoD",
              description: "Required for federal contracts",
            },
            {
              standard: "HIPAA Compliance",
              status: "Ready",
              description: "Healthcare data protection",
            },
            {
              standard: "GDPR/CCPA",
              status: "Certified",
              description: "Privacy regulations",
            },
          ].map((cert, i) => (
            <div key={i} className="glass-panel p-6 text-center">
              <Shield className="w-10 h-10 text-accent mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">{cert.standard}</h3>
              <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-mono mb-3">
                {cert.status}
              </div>
              <p className="text-sm text-muted-foreground">{cert.description}</p>
            </div>
          ))}
        </div>

        <div className="glass-panel p-8 mt-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Zero-Trust Security Model</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                principle: "Never Trust, Always Verify",
                controls: [
                  "Continuous authentication",
                  "Device attestation",
                  "Session monitoring",
                  "Anomaly detection",
                ],
              },
              {
                principle: "Least Privilege Access",
                controls: ["Role-based permissions", "JIT access grants", "Scope limitation", "Audit trail"],
              },
              {
                principle: "Assume Breach",
                controls: [
                  "Lateral movement prevention",
                  "Data encryption at rest/transit",
                  "Segmentation",
                  "Incident response",
                ],
              },
            ].map((model, i) => (
              <div key={i} className="terminal-btn p-4">
                <h4 className="font-bold text-accent mb-3">{model.principle}</h4>
                <ul className="space-y-2">
                  {model.controls.map((control, j) => (
                    <li key={j} className="text-sm flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{control}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI & Business Value */}
      <section className="bg-gradient-to-b from-background to-primary/5 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text flex items-center justify-center gap-3">
              <DollarSign className="w-10 h-10" />
              ROI Analysis & Business Value
            </h2>
            <p className="text-muted-foreground text-lg">Financial justification for CDW investment</p>
          </div>

          <div className="glass-panel p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6 text-center">3-Year Financial Model</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-primary/20">
                    <th className="text-left py-3 px-4">Metric</th>
                    <th className="text-right py-3 px-4">Year 1</th>
                    <th className="text-right py-3 px-4">Year 2</th>
                    <th className="text-right py-3 px-4">Year 3</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { metric: "New Customers", y1: "10", y2: "30", y3: "60" },
                    { metric: "Revenue", y1: "$4.15M", y2: "$12.45M", y3: "$24.90M" },
                    { metric: "Gross Margin", y1: "64%", y2: "66%", y3: "68%" },
                    { metric: "Gross Profit", y1: "$2.66M", y2: "$8.22M", y3: "$16.93M" },
                    { metric: "Operating Expenses", y1: "$1.2M", y2: "$2.0M", y3: "$3.5M" },
                    { metric: "EBITDA", y1: "$1.46M", y2: "$6.22M", y3: "$13.43M" },
                    { metric: "EBITDA Margin", y1: "35%", y2: "50%", y3: "54%" },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-primary/5" : ""}>
                      <td className="py-3 px-4 font-bold">{row.metric}</td>
                      <td className="py-3 px-4 text-right text-primary">{row.y1}</td>
                      <td className="py-3 px-4 text-right text-accent">{row.y2}</td>
                      <td className="py-3 px-4 text-right text-secondary">{row.y3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-panel p-6">
              <h3 className="text-xl font-bold mb-4 text-accent">Strategic Value</h3>
              <ul className="space-y-3">
                {[
                  "Creates new business unit with 50%+ EBITDA margins",
                  "Competitive moat: 18-24 months before replication",
                  "Upsell opportunities across CDW portfolio",
                  "Market leadership in AI governance space",
                  "Attracts top talent to CDW innovation team",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel p-6">
              <h3 className="text-xl font-bold mb-4 text-primary">Customer Value</h3>
              <ul className="space-y-3">
                {[
                  "Avoid AI compliance fines ($100M+ potential exposure)",
                  "Reduce AI incidents by 90% (policy enforcement)",
                  "Accelerate AI adoption (trusted governance)",
                  "Future-proof against quantum threats",
                  "Executive confidence in AI strategy",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text flex items-center justify-center gap-3">
            <Target className="w-10 h-10" />
            Success Metrics & KPIs
          </h2>
          <p className="text-muted-foreground text-lg">How we measure integration success</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-panel p-6">
            <h3 className="text-xl font-bold mb-4 text-accent">Technical Metrics</h3>
            <div className="space-y-4">
              {[
                { kpi: "System Uptime", target: "99.95%", current: "99.97%", status: "exceeding" },
                { kpi: "CIL Latency (P95)", target: "<100ms", current: "47ms", status: "exceeding" },
                { kpi: "Policy Precision", target: "99%", current: "99.8%", status: "exceeding" },
                { kpi: "Φ Consciousness", target: ">0.85", current: "0.9234", status: "healthy" },
                { kpi: "Decoherence (Γ)", target: "<0.1", current: "0.0421", status: "healthy" },
              ].map((metric, i) => (
                <div key={i} className="terminal-btn p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">{metric.kpi}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">{metric.status}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Target: {metric.target}</span>
                    <span className="text-primary font-bold">Current: {metric.current}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6">
            <h3 className="text-xl font-bold mb-4 text-primary">Business Metrics</h3>
            <div className="space-y-4">
              {[
                { kpi: "Customer Acquisition", target: "10/year", current: "12 pipeline", status: "on-track" },
                { kpi: "Average Deal Size", target: "$415K", current: "$427K", status: "exceeding" },
                { kpi: "Win Rate vs SHI", target: "60%", current: "73%", status: "exceeding" },
                { kpi: "Customer Retention", target: "90%", current: "95%", status: "healthy" },
                { kpi: "NPS Score", target: "50+", current: "67", status: "exceeding" },
              ].map((metric, i) => (
                <div key={i} className="terminal-btn p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">{metric.kpi}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{metric.status}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Target: {metric.target}</span>
                    <span className="text-accent font-bold">Current: {metric.current}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Ready to Deploy?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            This integration plan provides the roadmap for CDW to establish unassailable market leadership in AI
            governance and quantum-ready infrastructure.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/cdw" className="terminal-btn px-8 py-4 bg-primary text-background">
              View CDW Solutions
            </Link>
            <Link href="/done" className="terminal-btn px-8 py-4">
              Definition of Done
            </Link>
            <Link href="/command" className="terminal-btn px-8 py-4">
              Command Center
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
