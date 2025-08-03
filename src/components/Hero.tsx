import { Button } from './Button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16 lg:py-20 xl:py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-muted/20 via-background to-accent-muted/20" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-20 items-center">
          {/* Left Column - Text */}
          <div className="space-y-6 sm:space-y-8 animate-fade-in text-center lg:text-left">
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-foreground">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Log the Grind.
                </span>{' '}
                Show the Climb.
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto lg:mx-0">
                Log your work in public, share ideas, track your journey, and let others follow your build. Turn your progress into your competitive advantage.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center lg:items-start">
              <Link href="/create-project">
                <Button variant="primary" size="lg" className="group w-full sm:w-auto min-h-[52px] px-8 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                  Start Building
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/home">
                <Button variant="ghost" size="lg" className="group w-full sm:w-auto min-h-[52px] px-8 text-lg font-medium border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-200">
                  Discover Projects
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform opacity-70 group-hover:opacity-100" />
                </Button>
              </Link>
            </div>
            
            {/* Social proof */}
            <div className="pt-6 sm:pt-8">
              <p className="text-xs sm:text-sm text-text-muted mb-3 sm:mb-4">Trusted by builders at</p>
              <div className="flex items-center justify-center lg:justify-start space-x-4 sm:space-x-6">
                <div className="flex items-center justify-center h-6 w-16 sm:h-8 sm:w-20 bg-surface border border-border rounded text-[10px] sm:text-xs font-medium text-text-muted opacity-60">
                  ACME
                </div>
                <div className="flex items-center justify-center h-6 w-20 sm:h-8 sm:w-24 bg-surface border border-border rounded text-[10px] sm:text-xs font-medium text-text-muted opacity-60">
                  BUILDCO
                </div>
                <div className="flex items-center justify-center h-6 w-12 sm:h-8 sm:w-16 bg-surface border border-border rounded text-[10px] sm:text-xs font-medium text-text-muted opacity-60">
                  DEV
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Hero Visual */}
          <div className="relative animate-slide-in-right mt-8 lg:mt-0 hidden md:block">
            <div className="relative bg-surface border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl">
              {/* Mock interface */}
              <div className="space-y-3 sm:space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-border">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="h-6 w-6 sm:h-8 sm:w-8 bg-primary rounded-full" />
                    <div>
                      <div className="h-2.5 w-16 sm:h-3 sm:w-20 bg-foreground/20 rounded mb-1" />
                      <div className="h-1.5 w-12 sm:h-2 sm:w-16 bg-text-muted/40 rounded" />
                    </div>
                  </div>
                  <div className="h-5 w-12 sm:h-6 sm:w-16 bg-primary/20 rounded-full" />
                </div>
                
                {/* Timeline entries */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex space-x-3 sm:space-x-4 p-3 sm:p-4 bg-surface-hover rounded-lg sm:rounded-xl border border-border-hover">
                    <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-primary rounded-full mt-1.5 sm:mt-2 flex-shrink-0" />
                    <div className="flex-1 space-y-1.5 sm:space-y-2">
                      <div className="h-2.5 sm:h-3 w-full bg-foreground/30 rounded" />
                      <div className="h-2.5 sm:h-3 w-3/4 bg-text-secondary/40 rounded" />
                      <div className="flex space-x-1.5 sm:space-x-2 pt-1.5 sm:pt-2">
                        <div className="h-4 w-8 sm:h-6 sm:w-12 bg-accent/20 rounded" />
                        <div className="h-4 w-10 sm:h-6 sm:w-16 bg-primary/20 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Floating elements - only visible on tablets and larger */}
              <div className="hidden md:block absolute -top-4 -right-4 h-12 w-12 bg-accent rounded-xl shadow-lg animate-pulse" />
              <div className="hidden md:block absolute -bottom-4 -left-4 h-8 w-8 bg-primary rounded-lg shadow-lg animate-pulse delay-300" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
