import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Features } from '@/components/Features'
import { HowItWorks } from '@/components/HowItWorks'
import { SocialProof } from '@/components/SocialProof'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <SocialProof />
      <Footer />
    </main>
  )
}
