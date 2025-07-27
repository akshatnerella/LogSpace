import { Plus, Rocket, FileText, Users } from 'lucide-react'
import { Button } from '../Button'

const steps = [
  {
    icon: FileText,
    title: 'Share your first log',
    description: 'Document what you\'re building and your progress so far'
  },
  {
    icon: Users,
    title: 'Connect with builders',
    description: 'Follow other creators and engage with their projects'
  },
  {
    icon: Rocket,
    title: 'Build momentum',
    description: 'Regular updates help you stay accountable and attract followers'
  }
]

export function CreateFirstProject() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-8 text-center animate-fade-in">
      {/* Empty State Illustration */}
      <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Plus className="w-12 h-12 text-primary" />
      </div>

      {/* Content */}
      <div className="space-y-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Ready to start building in public?
          </h2>
          <p className="text-text-secondary max-w-md mx-auto">
            You haven't created any logs yet. Start documenting your journey and connect with the builder community.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="text-center space-y-3">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="space-y-4">
        <Button variant="primary" size="lg" className="group">
          <Plus className="mr-2 w-5 h-5 group-hover:rotate-90 transition-transform" />
          Create Your First Log
        </Button>
        <div className="text-sm text-text-muted">
          or{' '}
          <button className="text-primary hover:text-primary-hover font-medium transition-colors">
            explore the community
          </button>{' '}
          first
        </div>
      </div>
    </div>
  )
}
