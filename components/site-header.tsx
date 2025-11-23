// Ambient module and JSX declarations to satisfy TypeScript in this environment
declare module "next/link" {
  import * as React from "react";
  const Link: React.ComponentType<any>;
  export default Link;
}

declare module "lucide-react" {
  import * as React from "react";
  export const Menu: React.FC<any>;
  export default {} as any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function SiteHeader() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
          <span className="text-xl font-bold tracking-tight text-white">
            Threatlab <span className="text-cyan-400">Aura</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-zinc-300">
          <Link href="/framework" className="hover:text-cyan-400 transition-colors">
            Framework
          </Link>
          <Link href="/physics" className="hover:text-cyan-400 transition-colors">
            Physics Canon
          </Link>
          <Link href="/lab" className="hover:text-cyan-400 transition-colors">
            DNA Lab
          </Link>
          <Link href="/voqn" className="hover:text-cyan-400 transition-colors">
            VoQN
          </Link>
          <Link href="/services/apk-manager" className="hover:text-cyan-400 transition-colors">
            APK Manager
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link href="/auth">
            <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white border-0">
              Access Portal
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-zinc-950 border-zinc-800 text-white">
              <div className="flex flex-col space-y-4 mt-8">
                <Link href="/framework" className="text-lg hover:text-cyan-400">
                  Framework
                </Link>
                <Link href="/physics" className="text-lg hover:text-cyan-400">
                  Physics Canon
                </Link>
                <Link href="/lab" className="text-lg hover:text-cyan-400">
                  DNA Lab
                </Link>
                <Link href="/voqn" className="text-lg hover:text-cyan-400">
                  VoQN Dashboard
                </Link>
                <Link href="/services/apk-manager" className="text-lg hover:text-cyan-400">
                  APK Manager
                </Link>
                <Link href="/auth" className="text-lg hover:text-cyan-400">
                  Sign In
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
