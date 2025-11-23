"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Terminal, Download, Settings, ShieldCheck, Smartphone, CheckCircle } from "lucide-react"

export function ApkManager() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* CLI Installation */}
      <Card className="border-purple-500/30 bg-black/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Terminal className="mr-2 h-5 w-5 text-purple-400" />
            CLI Installation
          </CardTitle>
          <CardDescription>Install the Aura Command Line Interface for advanced configuration.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-zinc-950 p-4 font-mono text-sm text-zinc-300 border border-zinc-800 relative group">
            <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" variant="ghost" className="h-6 text-xs">
                Copy
              </Button>
            </div>
            <span className="text-purple-500">$</span> npm -install -g @dnalang.dev/aura-cli
          </div>
          <div className="mt-4 space-y-2 text-sm text-zinc-400">
            <p>Requirements:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Node.js v18.0.0 or higher</li>
              <li>Python 3.10+ (for Quantum core)</li>
              <li>Android Debug Bridge (ADB) for device sync</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* APK Download */}
      <Card className="border-pink-500/30 bg-black/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Smartphone className="mr-2 h-5 w-5 text-pink-400" />
            VoQN Client for Android
          </CardTitle>
          <CardDescription>Latest build v2.5.0-quantum (Stable)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded bg-pink-500/20 flex items-center justify-center">
                <span className="font-bold text-pink-400">APK</span>
              </div>
              <div>
                <p className="font-medium text-white">VoQN_Client_Signed.apk</p>
                <p className="text-xs text-zinc-500">45.2 MB • Updated 2h ago</p>
              </div>
            </div>
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white">Permission Manifest</h4>
            <div className="flex flex-wrap gap-2">
              {["CAMERA", "RECORD_AUDIO", "ACCESS_FINE_LOCATION", "NEARBY_WIFI_DEVICES", "USE_BIOMETRIC"].map(
                (perm) => (
                  <Badge key={perm} variant="outline" className="border-zinc-700 text-zinc-400">
                    {perm}
                  </Badge>
                ),
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Configuration */}
      <Card className="col-span-full border-zinc-800 bg-black/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <ShieldCheck className="mr-2 h-5 w-5 text-green-400" />
            Zero-Trust Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2 p-4 rounded-lg border border-zinc-800 bg-zinc-900/20">
              <div className="flex items-center space-x-2 text-white font-medium">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Device Attestation</span>
              </div>
              <p className="text-sm text-zinc-500">
                Hardware-backed key storage validation required for all connected endpoints.
              </p>
              <Button variant="outline" size="sm" className="w-full mt-2 border-zinc-700 bg-transparent">
                Configure
              </Button>
            </div>

            <div className="space-y-2 p-4 rounded-lg border border-zinc-800 bg-zinc-900/20">
              <div className="flex items-center space-x-2 text-white font-medium">
                <Settings className="h-4 w-4 text-blue-500" />
                <span>App Encoding</span>
              </div>
              <p className="text-sm text-zinc-500">
                Re-sign APKs with custom DNA-Lang certificates for enhanced tamper protection.
              </p>
              <Button variant="outline" size="sm" className="w-full mt-2 border-zinc-700 bg-transparent">
                Manage Keys
              </Button>
            </div>

            <div className="space-y-2 p-4 rounded-lg border border-zinc-800 bg-zinc-900/20">
              <div className="flex items-center space-x-2 text-white font-medium">
                <Activity className="h-4 w-4 text-orange-500" />
                <span>Continuous Auth</span>
              </div>
              <p className="text-sm text-zinc-500">Behavioral biometrics and signal analysis for session validity.</p>
              <Button variant="outline" size="sm" className="w-full mt-2 border-zinc-700 bg-transparent">
                View Policies
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Activity(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}
