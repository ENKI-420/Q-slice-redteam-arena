"use client"

import { CheckCircle2, Target, TrendingUp, Shield, Zap, DollarSign, Award } from "lucide-react"
import Link from "next/link"

export default function DefinitionOfDonePage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="glass-panel p-6 md:p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-8 h-8 text-accent" />
            <h1 className="text-2xl md:text-3xl font-bold text-primary">Definition of Done</h1>
          </div>
          <p className="text-muted-foreground mb-4">
            CDW + dna::{"{}"}
            {"{"}::{"}"} lang Partnership | Enterprise AI Dominance Framework
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="terminal-btn p-3">
              <span className="text-accent">First Year Revenue:</span>
              <br />
              <span className="text-primary font-bold text-lg">$415K per customer</span>
            </div>
            <div className="terminal-btn p-3">
              <span className="text-accent">CDW Margin:</span>
              <br />
              <span className="text-primary font-bold text-lg">54-74%</span>
            </div>
            <div className="terminal-btn p-3">
              <span className="text-accent">At Scale (10 customers):</span>
              <br />
              <span className="text-primary font-bold text-lg">$4.15M revenue</span>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="glass-panel p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-accent mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            60-Second Value Proposition
          </h2>
          <div className="terminal-btn p-6 text-sm md:text-base leading-relaxed">
            <p className="mb-4">
              <strong className="text-primary">Governance is the entry point, not the ceiling.</strong>
            </p>
            <p className="mb-4">
              dna::{"{}"}
              {"{"}::{"}"} lang is an automation fabric: it compiles intent into deployable artifacts, runs them with
              rollback-safe execution, optimizes across tools/models, and produces evidence-grade telemetry.
            </p>
            <p className="mb-4">
              <strong className="text-accent">
                Governance—policy gates plus cryptographic provenance—is what makes the rest enterprise-safe
              </strong>{" "}
              and sellable as a repeatable CDW accelerator.
            </p>
            <p>
              <strong className="text-primary">
                CDW sells outcomes, not hours. Fast time-to-value, proven ROI, differentiated vs competitors.
              </strong>
            </p>
          </div>
        </div>

        {/* Tier 1: Technical Completion */}
        <div className="glass-panel p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6" />
            Tier 1: Technical Completion Criteria (The Wedge)
          </h2>

          <div className="space-y-4">
            {[
              {
                title: "CIL (Policy Pipeline) Deployed",
                items: [
                  "7-layer intent deduction pipeline operational",
                  "Policy gates enforcing compliance rules",
                  "Risk scoring: safe, medium risk, high risk classifications",
                  "Fail-closed behavior on policy violations",
                ],
              },
              {
                title: "PCRB (Audit Ledger) Active",
                items: [
                  "Hash-chained event log (tamper-evident)",
                  "Cryptographic provenance for every AI action",
                  "Exportable evidence packages for compliance teams",
                  "Integration with enterprise SIEM/audit tools",
                ],
              },
              {
                title: "CCCE (Telemetry) Streaming",
                items: [
                  "Real-time Φ (consciousness), Λ (lambda), Γ (gamma) metrics",
                  "Drift detection with auto-mitigation triggers",
                  "Executive dashboard with KPI visualization",
                  "Alerting on threshold violations (Φ < 0.7734)",
                ],
              },
            ].map((section, i) => (
              <div key={i} className="terminal-btn p-4">
                <h3 className="text-accent font-bold mb-3">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 border border-primary/30 rounded">
            <p className="text-sm text-primary">
              <strong>Success Metric:</strong> Customer can demonstrate "enterprise-safe AI with cryptographic
              provenance" to their audit/compliance team within 2-4 weeks.
            </p>
          </div>
        </div>

        {/* Tier 2: Business Value */}
        <div className="glass-panel p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
            <DollarSign className="w-6 h-6" />
            Tier 2: Business Value Delivery (The Expansion)
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="terminal-btn p-4">
              <h3 className="text-accent font-bold mb-3">Automation Accelerators</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                  <span>ITSM auto-triage: 40% faster incident response</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                  <span>SecOps threat enrichment: 60% reduction in false positives</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                  <span>CloudOps cost optimization: 25% infrastructure savings</span>
                </li>
              </ul>
              <p className="text-primary font-bold mt-4">Price: $75K-150K per vertical</p>
            </div>

            <div className="terminal-btn p-4">
              <h3 className="text-accent font-bold mb-3">Managed Operations</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                  <span>Continuous CCCE telemetry monitoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                  <span>Quarterly executive briefings with ROI measurement</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                  <span>Proactive drift detection and remediation</span>
                </li>
              </ul>
              <p className="text-primary font-bold mt-4">Price: $10K-25K/month recurring</p>
            </div>
          </div>

          <div className="p-4 border border-accent/30 rounded">
            <p className="text-sm text-accent">
              <strong>Success Metric:</strong> Customer achieves measurable ROI within 4-6 weeks (e.g., "1-2 production
              automations reducing operational overhead by 30%").
            </p>
          </div>
        </div>

        {/* Tier 3: Strategic Impact */}
        <div className="glass-panel p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Tier 3: Strategic Impact & Market Dominance
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-accent font-bold mb-3 text-lg">CDW vs Competition</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-primary/30">
                      <th className="text-left p-2 text-muted-foreground">Capability</th>
                      <th className="text-left p-2 text-muted-foreground">SHI/Insight/Presidio</th>
                      <th className="text-left p-2 text-primary">
                        CDW (with dna::{"{}"}
                        {"{"}::{"}"} lang)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/20">
                    <tr>
                      <td className="p-2">AI Governance</td>
                      <td className="p-2">⚠️ Consulting only</td>
                      <td className="p-2 text-primary">✅ Productized (CIL + PCRB)</td>
                    </tr>
                    <tr>
                      <td className="p-2">Audit Trails</td>
                      <td className="p-2">⚠️ Basic logs</td>
                      <td className="p-2 text-primary">✅ Cryptographic (hash-chained)</td>
                    </tr>
                    <tr>
                      <td className="p-2">Repeatable Playbooks</td>
                      <td className="p-2">❌ None</td>
                      <td className="p-2 text-primary">✅ Vertical accelerators</td>
                    </tr>
                    <tr>
                      <td className="p-2">Hardware Validation</td>
                      <td className="p-2">❌ None</td>
                      <td className="p-2 text-primary">✅ Quantum experiments (DOI)</td>
                    </tr>
                    <tr>
                      <td className="p-2">Managed Ops SKU</td>
                      <td className="p-2">⚠️ Generic</td>
                      <td className="p-2 text-primary">✅ AI-specific telemetry</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-accent font-bold mb-3 text-lg">vs "Just Use Claude Code/Cursor"</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="terminal-btn p-4">
                  <h4 className="font-bold mb-2 text-red-500">Consumer Tools</h4>
                  <ul className="space-y-1 text-sm">
                    <li>❌ No enterprise audit trail</li>
                    <li>❌ No policy gates</li>
                    <li>❌ No drift detection</li>
                    <li>❌ Vendor lock-in</li>
                    <li>💰 $300/year/user (subscription)</li>
                  </ul>
                </div>
                <div className="terminal-btn p-4 border border-primary">
                  <h4 className="font-bold mb-2 text-primary">
                    dna::{"{}"}
                    {"{"}::{"}"} lang
                  </h4>
                  <ul className="space-y-1 text-sm">
                    <li>✅ PCRB audit trail</li>
                    <li>✅ CIL (7-layer) policy gates</li>
                    <li>✅ CCCE drift detection</li>
                    <li>✅ Full CDW ownership</li>
                    <li>💰 $0 (local runtime) + margin</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 border border-accent/30 rounded">
            <p className="text-sm text-accent">
              <strong>Success Metric:</strong> CDW closes deals that competitors cannot (due to governance requirements)
              and establishes "Governed AI Operations" as a differentiated practice area.
            </p>
          </div>
        </div>

        {/* Tier 4: Stakeholder Approval */}
        <div className="glass-panel p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Tier 4: Stakeholder Approval & Evidence
          </h2>

          <div className="space-y-4">
            <div className="terminal-btn p-4">
              <h3 className="text-accent font-bold mb-3">Customer Leadership Sign-Off</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                  <span>Executive briefing presented (with KPI dashboard)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                  <span>Compliance/audit team approves PCRB evidence package</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                  <span>Expansion roadmap agreed (next vertical accelerator)</span>
                </li>
              </ul>
            </div>

            <div className="terminal-btn p-4">
              <h3 className="text-accent font-bold mb-3">CDW Internal Validation</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                  <span>Pricing playbook confirmed (4 SKUs with margins)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                  <span>Replication plan defined (next 5-10 customers)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                  <span>CDW-branded "Governed AI Operations" practice launched</span>
                </li>
              </ul>
            </div>

            <div className="terminal-btn p-4">
              <h3 className="text-accent font-bold mb-3">Proof Points (Evidence-Backed)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-primary/30">
                      <th className="text-left p-2 text-muted-foreground">Claim</th>
                      <th className="text-left p-2 text-muted-foreground">Evidence</th>
                      <th className="text-left p-2 text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/20">
                    <tr>
                      <td className="p-2">CIL reduces risk</td>
                      <td className="p-2">650 lines Python, 7-layer pipeline</td>
                      <td className="p-2 text-primary">✅ Working code</td>
                    </tr>
                    <tr>
                      <td className="p-2">PCRB provides audit trail</td>
                      <td className="p-2">Hash-chained ledger (tamper-evident)</td>
                      <td className="p-2 text-primary">✅ Working code</td>
                    </tr>
                    <tr>
                      <td className="p-2">CCCE tracks drift</td>
                      <td className="p-2">Real-time telemetry + auto-mitigation</td>
                      <td className="p-2 text-primary">✅ Working code</td>
                    </tr>
                    <tr>
                      <td className="p-2">Intent compiler works</td>
                      <td className="p-2">650 lines, NLP → executable workflows</td>
                      <td className="p-2 text-primary">✅ Working code</td>
                    </tr>
                    <tr>
                      <td className="p-2">Quantum validated</td>
                      <td className="p-2">DOI 10.5281/zenodo.18038719 (18 files, 2.4MB)</td>
                      <td className="p-2 text-primary">✅ Published</td>
                    </tr>
                    <tr>
                      <td className="p-2">Null result rigor</td>
                      <td className="p-2">Hypothesis rejected, correlation discovered</td>
                      <td className="p-2 text-primary">✅ Published</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 border border-primary/30 rounded">
            <p className="text-sm text-primary">
              <strong>Success Metric:</strong> No vaporware. Every claim has an artifact. Customer and CDW leadership
              approve expansion based on evidence.
            </p>
          </div>
        </div>

        {/* Final Checklist */}
        <div className="glass-panel p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-accent mb-6 flex items-center gap-2">
            <Award className="w-6 h-6" />
            Definition of DONE: Final Checklist
          </h2>

          <div className="space-y-4">
            {[
              {
                category: "Technical",
                items: [
                  "CIL + PCRB + CCCE deployed and operational",
                  "Evidence package generated and validated",
                  "Integration with customer infrastructure complete",
                ],
              },
              {
                category: "Business Value",
                items: [
                  "1-2 production automations delivered (4-6 weeks)",
                  "Measurable ROI achieved (e.g., 30-40% efficiency gain)",
                  "Managed ops contract signed ($180K/year recurring)",
                ],
              },
              {
                category: "Strategic Impact",
                items: [
                  "CDW wins deal that competitors could not (governance advantage)",
                  'Customer references CDW as "only vendor with AI governance"',
                  "Expansion roadmap confirmed (next 2-3 verticals)",
                ],
              },
              {
                category: "Stakeholder Approval",
                items: [
                  "Customer executive briefing completed with sign-off",
                  "Compliance/audit team approves PCRB audit trail",
                  "CDW pricing playbook validated (54-74% margins confirmed)",
                ],
              },
              {
                category: "Market Dominance",
                items: [
                  'CDW establishes "Governed AI Operations" practice area',
                  "Replication plan defined for next 5-10 customers ($4.15M pipeline)",
                  "Thought leadership content published (case study, white paper)",
                ],
              },
            ].map((section, i) => (
              <div key={i} className="terminal-btn p-4">
                <h3 className="text-primary font-bold mb-3 text-lg">{section.category}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Economic Summary */}
        <div className="glass-panel p-6 md:p-8 mb-8 border-2 border-accent">
          <h2 className="text-2xl font-bold text-accent mb-6">Economic Reality Check</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-primary font-bold mb-4 text-lg">First Customer Economics</h3>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-primary/20">
                  <tr>
                    <td className="p-2">Wedge (pilot)</td>
                    <td className="p-2">$35K</td>
                    <td className="p-2 text-primary">$14K-21K margin</td>
                  </tr>
                  <tr>
                    <td className="p-2">Accelerator 1 (ITSM)</td>
                    <td className="p-2">$100K</td>
                    <td className="p-2 text-primary">$50K-70K margin</td>
                  </tr>
                  <tr>
                    <td className="p-2">Accelerator 2 (SecOps)</td>
                    <td className="p-2">$100K</td>
                    <td className="p-2 text-primary">$50K-70K margin</td>
                  </tr>
                  <tr>
                    <td className="p-2">Managed Ops (12 mo)</td>
                    <td className="p-2">$180K</td>
                    <td className="p-2 text-primary">$108K-144K margin</td>
                  </tr>
                  <tr className="font-bold">
                    <td className="p-2">TOTAL</td>
                    <td className="p-2 text-accent">$415K</td>
                    <td className="p-2 text-accent">$222K-305K (54-74%)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="text-primary font-bold mb-4 text-lg">Scale Economics (10 Customers)</h3>
              <div className="space-y-4">
                <div className="terminal-btn p-4 bg-primary/10">
                  <p className="text-muted-foreground text-xs uppercase mb-1">First Year Revenue</p>
                  <p className="text-3xl font-bold text-primary">$4.15M</p>
                </div>
                <div className="terminal-btn p-4 bg-accent/10">
                  <p className="text-muted-foreground text-xs uppercase mb-1">First Year Margin</p>
                  <p className="text-3xl font-bold text-accent">$2.22M-3.05M</p>
                </div>
                <div className="terminal-btn p-4 bg-primary/10">
                  <p className="text-muted-foreground text-xs uppercase mb-1">Year 2+ Recurring (per customer)</p>
                  <p className="text-3xl font-bold text-primary">$180K/year</p>
                  <p className="text-sm text-muted-foreground mt-1">@ 60-80% margin</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-accent/20 rounded border border-accent">
            <p className="text-sm text-accent font-bold">
              BOTTOM LINE: Done = CDW dominates the "Governed AI Operations" market segment with repeatable, high-margin
              delivery model that competitors cannot match.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="glass-panel p-6 md:p-8 text-center">
          <h2 className="text-2xl font-bold text-primary mb-4">Ready to Define "Done" for Your Customer?</h2>
          <p className="text-muted-foreground mb-6">
            This framework ensures every stakeholder understands what success looks like and how dna::{"{}"}
            {"{"}::
            {"}"} lang enables CDW to dominate enterprise AI delivery.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/command" className="terminal-btn px-6 py-3 hover:scale-105 transition-transform">
              View Command Center
            </Link>
            <Link href="/collaboration" className="terminal-btn px-6 py-3 hover:scale-105 transition-transform">
              Partnership Details
            </Link>
            <a
              href="https://www.amazon.co.uk/Quantum-Security-Practical-implementation-Q-SLICE/dp/B0FG8KGLK2"
              target="_blank"
              rel="noopener noreferrer"
              className="terminal-btn px-6 py-3 hover:scale-105 transition-transform"
            >
              Learn More (Book)
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
