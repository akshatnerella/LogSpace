import { Button } from './Button'
import { ArrowRight, Play } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-muted/20 via-background to-accent-muted/20" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Text */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              <h1 className="text-display-lg font-bold leading-tight text-foreground">
                Build in Public.{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Stay Accountable.
                </span>{' '}
                Get Discovered.
              </h1>
              <p className="text-xl text-text-secondary leading-relaxed max-w-2xl">
                LogSpace helps creators and indie hackers share progress, ideas, and projects in public. 
                Turn your building journey into your competitive advantage.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="primary" size="lg" className="group">
                Start Building
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="ghost" size="lg" className="group">
                <Play className="mr-2 h-4 w-4" />
                Explore Logs
              </Button>
            </div>
            
            {/* Social proof */}
            <div className="pt-8">
              <p className="text-sm text-text-muted mb-4">Trusted by builders at</p>
              <div className="flex items-center space-x-6 opacity-60">
                <div className="h-8 w-20 bg-surface rounded border border-border animate-pulse" />
                <div className="h-8 w-24 bg-surface rounded border border-border animate-pulse" />
                <div className="h-8 w-16 bg-surface rounded border border-border animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Right Column - Hero Visual */}
          <div className="relative animate-slide-in-right">
            <div className="relative bg-surface border border-border rounded-2xl p-6 shadow-2xl">
              {/* Mock interface */}
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-primary rounded-full" />
                    <div>
                      <div className="h-3 w-20 bg-foreground/20 rounded mb-1" />
                      <div className="h-2 w-16 bg-text-muted/40 rounded" />
                    </div>
                  </div>
                  <div className="h-6 w-16 bg-primary/20 rounded-full" />
                </div>
                
                {/* Timeline entries */}
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex space-x-4 p-4 bg-surface-hover rounded-xl border border-border-light">
                    <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-full bg-foreground/30 rounded" />
                      <div className="h-3 w-3/4 bg-text-secondary/40 rounded" />
                      <div className="flex space-x-2 pt-2">
                        <div className="h-6 w-12 bg-accent/20 rounded text-xs" />
                        <div className="h-6 w-16 bg-primary/20 rounded text-xs" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 h-12 w-12 bg-accent rounded-xl shadow-lg animate-pulse" />
              <div className="absolute -bottom-4 -left-4 h-8 w-8 bg-primary rounded-lg shadow-lg animate-pulse delay-300" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
