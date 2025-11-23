import { SiteHeader } from "@/components/site-header"
import { ApkManager } from "@/components/apk-manager"

export default function ApkManagerPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      <div className="fixed inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(20,0,40,0.4)_100%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[url('/hex-pattern.svg')] opacity-10 pointer-events-none" />

      <SiteHeader />

      <main className="container relative mx-auto px-4 py-24">
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              Aura APK Manager
            </span>
            <span className="block text-2xl font-normal text-muted-foreground mt-2">
              Secure App Distribution & Configuration
            </span>
          </h1>
          <p className="max-w-[700px] text-zinc-400 md:text-xl">
            Manage device permissions, configure security policies, and deploy the VoQN client to authorized Android
            devices.
          </p>
        </div>

        <ApkManager />
      </main>
    </div>
  )
}
