import { NeuralBackground } from "@/components/neural-background"
import { SiteHeader } from "@/components/site-header"
import { IntroSequence } from "@/components/intro-sequence"
import { ProblemSolution } from "@/components/problem-solution"
import { SocialProof } from "@/components/social-proof"
import { CapacidadesSection } from "@/components/capacidades-section"
import { PricingSection } from "@/components/pricing-section"
import { SiteFooter } from "@/components/site-footer"

export default function AethermindPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <NeuralBackground />
      <div className="relative z-10">
        <SiteHeader />
        <IntroSequence />
        <ProblemSolution />
        <SocialProof />
        <CapacidadesSection />
        <PricingSection />
        
        <section className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Panel de Control
            </h2>
            <p className="text-gray-400 mb-8">
              Accede a tu panel de control completo para gestionar agentes, workflows y análisis
            </p>
            <a 
              href="https://aethermind-agent-os-dashboard.vercel.app/" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-500/50 transform hover:scale-105"
            >
              <span>🚀</span>
              Acceder al Dashboard
            </a>
          </div>

          <div className="mt-12 border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-500/20 overflow-hidden bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur">
            <iframe
              src="https://aethermind-agent-os-dashboard.vercel.app/"
              width="100%"
              height="800px"
              className="border-0 w-full"
              title="Aethermind Dashboard"
              loading="lazy"
            />
          </div>
        </section>

        <SiteFooter />
      </div>
    </main>
  )
}
