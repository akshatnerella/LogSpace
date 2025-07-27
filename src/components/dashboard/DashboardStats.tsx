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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        const animationDelay = `animate-fade-in [animation-delay:${index * 100}ms]`
        return (
          <div
            key={stat.title}
            className={`bg-surface border border-border rounded-2xl p-6 hover:border-border-hover transition-colors ${animationDelay}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                stat.trend === 'up' 
                  ? 'text-green-400 bg-green-400/10' 
                  : 'text-red-400 bg-red-400/10'
              }`}>
                {stat.change}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm text-text-secondary">
                {stat.title}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
