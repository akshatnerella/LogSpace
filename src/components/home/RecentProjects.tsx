'use client'

import { Calendar, ArrowRight, Plus, Globe, Lock } from 'lucide-react'
import { Project, ProjectWithStats } from '@/types/database'
import { Button } from '../Button'

interface RecentProjectsProps {
  projects: (Project & { log_count?: number })[]
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            My Projects ({projects.length})
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary-dark"
            onClick={() => window.location.href = '/create-project'}
          >
            <Plus className="w-4 h-4 mr-1" />
            New Project
          </Button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group"
            onClick={() => window.location.href = `/project/${project.id}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-base font-medium text-gray-900 truncate group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1">
                    {project.visibility === 'public' ? (
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <Globe className="w-3 h-3" />
                        Public
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        <Lock className="w-3 h-3" />
                        Private
                      </div>
                    )}
                    <div className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      Owner
                    </div>
                  </div>
                </div>
                
                {project.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {project.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Created {formatDate(project.created_at)}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Active
                    </span>
                    {project.log_count !== undefined && (
                      <span>
                        {project.log_count} {project.log_count === 1 ? 'log' : 'logs'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="ml-4 flex-shrink-0">
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="px-6 py-12 text-center">
          <div className="text-gray-400 mb-4">
            <Plus className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No projects yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first project to start building in public
          </p>
          <Button
            onClick={() => window.location.href = '/create-project'}
            className="inline-flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Project
          </Button>
        </div>
      )}
    </div>
  )
}
