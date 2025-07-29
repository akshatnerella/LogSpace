import { Plus, Rocket, FileText, Users } from 'lucide-react'
import { Button } from '../Button'

const steps = [
  {
    icon: FileText,
    title: 'Create your project',
    description: 'Set up your build-in-public project and describe what you\'re building'
  },
  {
    icon: Users,
    title: 'Connect with builders',
    description: 'Follow other creators and engage with their projects'
  },
  {
    icon: Rocket,
    title: 'Share regular updates',
    description: 'Post logs about your progress to build momentum and attract followers'
  }
]

export function CreateFirstProject() {
  return (
    <div className="bg-surface border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center animate-fade-in">
      {/* Empty State Illustration */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
        <Plus className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
      </div>

      {/* Content */}
      <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            Ready to start building in public?
          </h2>
          <p className="text-sm sm:text-base text-text-secondary max-w-md mx-auto">
            You haven&apos;t created any projects yet. Start your first build-in-public project and connect with the builder community.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="text-center space-y-2 sm:space-y-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="space-y-3 sm:space-y-4">
        <a href="/create-project">
          <Button variant="primary" size="lg" className="group min-h-[48px] px-6 sm:px-8 text-sm sm:text-base">
            <Plus className="mr-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform" />
            Create Your First Project
          </Button>
        </a>
        <div className="text-xs sm:text-sm text-text-muted">
          or{' '}
          <button className="text-primary hover:text-primary-hover font-medium transition-colors min-h-[44px] px-2">
            explore the community
          </button>{' '}
          first
        </div>
      </div>
    </div>
  )
}
