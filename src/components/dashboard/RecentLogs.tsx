import { Calendar, ArrowRight, Plus } from 'lucide-react'
import { Button } from '../Button'

// Mock data - replace with real data from your backend
const recentProjects = [
  {
    id: 1,
    title: 'SaaS Dashboard Redesign',
    summary: 'Building a modern analytics dashboard with Next.js and Tailwind. Just shipped the mobile-first responsive design.',
    timestamp: '2 days ago',
    status: 'active',
    logCount: 12
  },
  {
    id: 2,
    title: 'AI Writing Assistant',
    summary: 'Working on an AI-powered writing tool. Currently integrating OpenAI GPT-4 and building the text editor.',
    timestamp: '5 days ago',
    status: 'active',
    logCount: 8
  },
  {
    id: 3,
    title: 'E-commerce Mobile App',
    summary: 'React Native app for local businesses. Just completed the shopping cart functionality and payment integration.',
    timestamp: '1 week ago',
    status: 'completed',
    logCount: 15
  }
]

export function RecentLogs() {
  const hasProjects = recentProjects.length > 0

  if (!hasProjects) {
    return (
      <div className="animate-fade-in">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">
          Your Recent Projects
        </h2>
        
        {/* Empty State */}
        <div className="bg-surface border border-border rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-accent/10 rounded-xl sm:rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center">
            <Plus className="w-8 h-8 sm:w-10 sm:h-10 text-accent" />
          </div>
          
          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
            No projects yet!
          </h3>
          <p className="text-sm sm:text-base text-text-secondary mb-6">
            Start your first build-in-public project and share your journey with the community.
          </p>
          
          <Button variant="primary" className="min-h-[48px] px-6">
            <Plus className="mr-2 w-4 h-4" />
            Create Your First Project
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">
          Your Recent Projects
        </h2>
        <Button 
          variant="ghost" 
          className="text-sm text-primary hover:text-primary-dark min-h-[44px]"
        >
          View All Projects
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        {recentProjects.map((project) => (
          <div
            key={project.id}
            className="group bg-surface border border-border hover:border-border-hover rounded-xl p-4 sm:p-6 transition-all duration-200 hover:shadow-md cursor-pointer"
          >
            <div className="flex items-start gap-4">
              {/* Status Indicator */}
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                project.status === 'active' ? 'bg-green-500' : 'bg-blue-500'
              }`} />
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 text-sm sm:text-base">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-text-secondary flex-shrink-0">
                    <span className="bg-accent/10 text-accent px-2 py-1 rounded-full">
                      {project.logCount} logs
                    </span>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {project.timestamp}
                    </div>
                  </div>
                </div>
                
                <p className="text-xs sm:text-sm text-text-secondary line-clamp-2">
                  {project.summary}
                </p>
              </div>
              
              {/* Arrow */}
              <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 mt-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
