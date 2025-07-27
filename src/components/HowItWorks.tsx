import { User, FileText, Share2 } from 'lucide-react'

const steps = [
  {
    icon: User,
    number: '01',
    title: 'Create Your Builder Profile',
    description: 'Set up your public profile in minutes. Share your background, current projects, and what you\'re building next.'
  },
  {
    icon: FileText,
    number: '02',
    title: 'Log Projects and Updates',
    description: 'Document your progress with rich text, images, and code snippets. Share both wins and challenges transparently.'
  },
  {
    icon: Share2,
    number: '03',
    title: 'Share Your Journey, Get Feedback',
    description: 'Connect with other builders, get valuable feedback, and inspire others with your building journey.'
  }
]

export function HowItWorks() {
  return (
    <section className="py-12 sm:py-16 lg:py-24 xl:py-32 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            How it works
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-text-secondary max-w-2xl mx-auto">
            Start building in public in three simple steps
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative text-center">
                {/* Connection line - only show on lg+ screens */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-border to-transparent z-0" />
                )}
                
                <div className="relative z-10 space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg sm:rounded-xl">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-background" />
                    </div>
                    <span className="text-xl sm:text-2xl font-bold text-text-muted">
                      {step.number}
                    </span>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-sm mx-auto">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
