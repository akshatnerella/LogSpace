'use client'

import { useState, useEffect } from 'react'
import { Calendar, ArrowRight, Plus } from 'lucide-react'
import { useApiClient, Project } from '../../lib/use-api-client'
import { Button } from '../Button'

export function RecentProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const apiClient = useApiClient()

  useEffect(() => {
    const loadProjects = async () => {
      try {
        console.log('🔄 Starting to load projects...')
        setIsLoading(true)
        setError(null)
        
        // Add minimum loading time to ensure skeleton is visible
        const [data] = await Promise.all([
          apiClient.getProjects(),
          new Promise(resolve => setTimeout(resolve, 800)) // Minimum 800ms loading
        ])
        
        console.log('✅ Projects loaded:', data)
        setProjects(data)
      } catch (error: any) {
        console.error('❌ Error loading projects:', error)
        setError(error.message || 'Failed to load projects')
      } finally {
        console.log('🏁 Loading complete')
        setIsLoading(false)
      }
    }

    loadProjects()
  }, [apiClient])

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">
          Your Recent Projects
        </h2>
        <div className="bg-surface border border-border rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center">
          <div className="animate-pulse space-y-4">
            <div className="w-16 h-16 bg-white/30 rounded-xl mx-auto"></div>
            <div className="space-y-2">
              <div className="h-4 bg-white/25 rounded mx-auto w-32"></div>
              <div className="h-3 bg-white/20 rounded mx-auto w-48"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="animate-fade-in">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">
          Your Recent Projects
        </h2>
        <div className="bg-surface border border-border rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const hasProjects = projects.length > 0

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
          
          <a href="/create-project">
            <Button variant="primary" className="min-h-[48px] px-6">
              <Plus className="mr-2 w-4 h-4" />
              Create Your First Project
            </Button>
          </a>
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
        {projects.map((project) => (
          <div
            key={project.id}
            className="group bg-surface border border-border hover:border-border-hover rounded-xl p-4 sm:p-6 transition-all duration-200 hover:shadow-md cursor-pointer"
            onClick={() => window.location.href = `/project/${project.slug}`}
          >
            <div className="flex items-start gap-4">
              {/* Status Indicator */}
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-green-500" />
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 text-sm sm:text-base">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-text-secondary flex-shrink-0">
                    <span className="bg-accent/10 text-accent px-2 py-1 rounded-full">
                      {project.log_count || 0} logs
                    </span>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {new Date(project.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <p className="text-xs sm:text-sm text-text-secondary line-clamp-2">
                  {project.description || 'No description provided'}
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
