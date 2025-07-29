import { FileText, Globe, User, ArrowRight } from 'lucide-react'

const actions = [
  {
    icon: FileText,
    title: 'Create Project',
    description: 'Start a new build-in-public journey',
    gradient: 'from-blue-500/10 to-blue-600/10',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200 hover:border-blue-300'
  },
  {
    icon: Globe,
    title: 'Explore Community',
    description: 'Find other builders',
    gradient: 'from-green-500/10 to-emerald-600/10',
    iconColor: 'text-green-600',
    borderColor: 'border-green-200 hover:border-green-300'
  },
  {
    icon: User,
    title: 'Setup Profile',
    description: 'Complete your public builder page',
    gradient: 'from-purple-500/10 to-violet-600/10',
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-200 hover:border-purple-300'
  }
]

export function QuickActions() {
  return (
    <div className="animate-fade-in">
      <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">
        Quick Actions
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <a key={action.title} href={action.title === 'Create Project' ? '/create-project' : '#'}>
              <button
                className={`group relative p-6 bg-gradient-to-br ${action.gradient} border ${action.borderColor} rounded-xl sm:rounded-2xl text-left transition-all duration-300 hover:scale-105 hover:shadow-lg min-h-[120px] sm:min-h-[140px] w-full`}
              >
                {/* Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-surface/80 rounded-xl flex items-center justify-center">
                    <Icon className={`w-6 h-6 ${action.iconColor}`} />
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                </div>
                
                {/* Content */}
                <div>
                  <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base">
                    {action.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary">
                    {action.description}
                  </p>
                </div>
              </button>
            </a>
          )
        })}
      </div>
    </div>
  )
}
