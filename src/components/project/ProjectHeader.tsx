"use client"

import { useState } from 'react'
import { ArrowLeft, Eye, Lock, Calendar, BarChart3, Share2, Settings } from 'lucide-react'
import { ProjectWithStats } from '../../types/database'
import { Button } from '../Button'
import { ShareLinkModal } from './ShareLinkModal'

interface ProjectHeaderProps {
  project: ProjectWithStats
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  
  const createdDate = new Date(project.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="border-b border-border bg-surface">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Navigation */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <a href="/home">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground min-h-[44px]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </a>
            
            <div className="flex items-center gap-2">
              <a href={`/project/${project.id}/admin`}>
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground min-h-[44px]"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </a>
              
              <Button
                variant="ghost"
                onClick={() => setIsShareModalOpen(true)}
                className="text-muted-foreground hover:text-foreground min-h-[44px]"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div className="space-y-4">
          {/* Success Message (shown briefly after creation) */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 animate-fade-in">
            <div className="flex items-center text-green-800">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium">Project Created — Start logging!</span>
            </div>
          </div>

          {/* Title and Description */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {project.title}
              </h1>
              <div className="flex items-center gap-2 px-3 py-1 bg-background rounded-full">
                {project.visibility === 'public' ? (
                  <>
                    <Eye className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Public</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Private</span>
                  </>
                )}
              </div>
            </div>
            
            {project.description && (
              <p className="text-muted-foreground text-base sm:text-lg mb-4">
                {project.description}
              </p>
            )}
            
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Created {createdDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span>{project.log_count || 0} logs</span>
              </div>
              <div className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Link Modal */}
      <ShareLinkModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        project={{
          id: project.id,
          name: project.title,
          slug: project.slug
        }}
      />
    </div>
  )
}
