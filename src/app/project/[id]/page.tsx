'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { ProjectDashboard } from '@/components/project/ProjectDashboard'
import { fetchProjectById } from '@/lib/queries'
import { ProjectWithStats } from '@/types/database'

interface ProjectPageProps {
  params: Promise<{
    id: string
  }>
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const [project, setProject] = useState<ProjectWithStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProject = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const { id } = await params
        
        // Fetch project by ID using the new optimized query
        const projectData = await fetchProjectById(id)
        
        if (!projectData) {
          notFound()
        }
        
        setProject(projectData)
      } catch (error: any) {
        console.error('Error loading project:', error)
        setError(error.message || 'Failed to load project')
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [params])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            {/* Header skeleton */}
            <div className="space-y-4">
              <div className="h-10 bg-gray-800 rounded w-96"></div>
              <div className="h-6 bg-gray-800 rounded w-64"></div>
              <div className="flex gap-4">
                <div className="h-6 bg-gray-800 rounded w-24"></div>
                <div className="h-6 bg-gray-800 rounded w-32"></div>
              </div>
            </div>
            
            {/* Content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-48 bg-gray-800 rounded-xl"></div>
                <div className="h-32 bg-gray-800 rounded-xl"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-gray-800 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error</h1>
          <p className="text-gray-400 mb-4">{error || 'Project not found'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return <ProjectDashboard project={project} />
}
