import { Eye, Brain, Target, Users } from 'lucide-react'

const features = [
  {
    icon: Eye,
    title: 'Discoverable Logs',
    description: 'Share your building journey publicly and get discovered by fellow creators, potential collaborators, and supporters.'
  },
  {
    icon: Brain,
    title: 'Transparent Ideas',
    description: 'Document your thought process, decisions, and learnings. Build trust through radical transparency.'
  },
  {
    icon: Target,
    title: 'Project Milestones',
    description: 'Track progress with clear milestones and celebrate wins along the way. Stay accountable to your goals.'
  },
  {
    icon: Users,
    title: 'Community Feedback',
    description: 'Get valuable insights from other builders. Learn from their experiences and share your own.'
  }
]

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-display-md font-bold text-foreground mb-4">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              build in public
            </span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Turn your side projects into your competitive advantage with tools designed for transparency and growth.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div 
                key={index} 
                className={`group p-8 bg-surface border border-border rounded-2xl hover:border-border-light transition-all duration-300 hover:shadow-2xl animate-slide-up`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {feature.description}
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
