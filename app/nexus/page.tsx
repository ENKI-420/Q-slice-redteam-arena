import { NexusHeader } from "@/components/nexus-header";
import { VoQNDashboard } from "@/components/voqn-dashboard";
import { TelemetryDashboard } from "@/components/telemetry-dashboard";
import { SwarmDelegation } from "@/components/swarm-delegation";
import { QuantumSwarm } from "@/components/quantum-swarm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuantumNexusPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <NexusHeader />
      <main className="flex-1 p-4 md:p-8 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Quantum Swarm Visualizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <QuantumSwarm />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>System Telemetry</CardTitle>
              </CardHeader>
              <CardContent>
                <TelemetryDashboard />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>VOQN Control</CardTitle>
              </CardHeader>
              <CardContent>
                <VoQNDashboard />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Swarm Delegation</CardTitle>
              </CardHeader>
              <CardContent>
                <SwarmDelegation />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
