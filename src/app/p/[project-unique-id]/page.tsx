'use client'

import { useEffect, useState } from 'react'
import { ProjectWithStats } from '@/types/database'
import { fetchPublicProjectById } from '@/lib/queries'
import { LoadingSpinner } from '@/components/LoadingSpinner'

interface PublicProjectPageProps {
  params: Promise<{
    'project-unique-id': string
  }>
}

export default function PublicProjectPage({ params }: PublicProjectPageProps) {
  const [project, setProject] = useState<ProjectWithStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const resolvedParams = await params
        const projectId = resolvedParams['project-unique-id']
        const projectData = await fetchPublicProjectById(projectId)
        
        if (!projectData) {
          setError('This project has been made private, or taken down. Please contact the project owner.')
          return
        }

        setProject(projectData)
      } catch (err) {
        console.error('Error loading public project:', err)
        setError('Failed to load project')
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [params])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Project Not Found</h1>
          <p className="text-muted-foreground">
            {error || 'This project might be private or does not exist.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-bold mb-3">{project.title}</h1>
              {project.description && (
                <p className="text-lg text-muted-foreground mb-4 max-w-2xl">{project.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Public Project</span>
                <span>•</span>
                <span>{project.log_count || 0} logs</span>
                <span>•</span>
                <span>{project.collaborator_count || 0} contributors</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors">
                ⭐ Star
              </button>
              <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors">
                👁️ Follow
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-muted-foreground">
                {project.description || 'No description provided yet.'}
              </p>
            </div>

            {/* Recent Activity */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {project.recent_logs && project.recent_logs.length > 0 ? (
                  project.recent_logs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm">{log.content || 'Log entry'}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(log.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No recent activity to show.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Stats */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-semibold mb-4">Project Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Logs</span>
                  <span className="font-medium">{project.log_count || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contributors</span>
                  <span className="font-medium">{project.collaborator_count || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Contributors */}
            {project.project_collaborators && project.project_collaborators.length > 0 && (
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold mb-4">Contributors</h3>
                <div className="space-y-3">
                  {project.project_collaborators.slice(0, 5).map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        {collaborator.users?.name?.[0] || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {collaborator.users?.name || 'Unknown'}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {collaborator.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
