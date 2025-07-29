import { TrendingUp, Users, Heart, Eye } from 'lucide-react'

const stats = [
  {
    title: 'Total Views',
    value: '0',
    change: '+0%',
    trend: 'up' as const,
    icon: Eye
  },
  {
    title: 'Followers',
    value: '0',
    change: '+0%',
    trend: 'up' as const,
    icon: Users
  },
  {
    title: 'Likes',
    value: '0',
    change: '+0%',
    trend: 'up' as const,
    icon: Heart
  },
  {
    title: 'Projects',
    value: '0',
    change: '+0%',
    trend: 'up' as const,
    icon: TrendingUp
  }
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        const animationDelay = `animate-fade-in [animation-delay:${index * 100}ms]`
        return (
          <div
            key={stat.title}
            className={`bg-surface border border-border rounded-lg sm:rounded-xl p-3 sm:p-4 hover:border-border-hover transition-colors ${animationDelay}`}
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/5 rounded-lg flex items-center justify-center">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary/70" />
              </div>
              <div className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                stat.trend === 'up' 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-red-600 bg-red-50'
              }`}>
                {stat.change}
              </div>
            </div>
            
            <div>
              <div className="text-lg sm:text-xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-text-secondary">
                {stat.title}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
