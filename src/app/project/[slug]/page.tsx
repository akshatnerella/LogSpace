'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { useApiClient, Project } from '@/lib/use-api-client'
import { ProjectHeader } from '@/components/project/ProjectHeader'
import { ProjectEmptyState } from '@/components/project/ProjectEmptyState'
import { FloatingCreateButton } from '@/components/project/FloatingCreateButton'

interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const apiClient = useApiClient()

  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const { slug } = await params
        
        // Add minimum loading time to ensure skeleton is visible
        const [data] = await Promise.all([
          apiClient.getProject(slug),
          new Promise(resolve => setTimeout(resolve, 600)) // Minimum 600ms loading
        ])
        
        setProject(data)
      } catch (error: any) {
        console.error('Error loading project:', error)
        if (error.status === 404) {
          notFound()
        }
        setError(error.message || 'Failed to load project')
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [params, apiClient])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="animate-pulse space-y-6">
            <div className="space-y-4">
              <div className="h-8 bg-white/25 rounded w-64"></div>
              <div className="h-4 bg-white/20 rounded w-96"></div>
            </div>
            <div className="h-32 bg-white/15 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Error</h1>
          <p className="text-text-secondary mb-4">{error || 'Project not found'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-background rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const hasLogs = (project.log_count || 0) > 0

  return (
    <div className="min-h-screen bg-background">
      <ProjectHeader project={project} />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {hasLogs ? (
          <div>
            {/* TODO: Show project logs */}
            <p className="text-text-secondary">Project logs will appear here...</p>
          </div>
        ) : (
          <ProjectEmptyState project={project} />
        )}
      </main>

      {/* Floating Action Button - Only show when there are logs */}
      {hasLogs && <FloatingCreateButton projectSlug={project.slug} />}
    </div>
  )
}
