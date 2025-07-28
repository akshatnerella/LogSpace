'use client'

import { useState } from 'react'
import { Plus, FileText, Users, Zap, UserPlus } from 'lucide-react'
import { Project } from '../../lib/use-api-client'
import { Button } from '../Button'
import { ShareLinkModal } from './ShareLinkModal'

interface ProjectEmptyStateProps {
  project: Project
}

const tips = [
  {
    icon: FileText,
    title: 'Share your progress',
    description: 'Document what you\'re building, challenges you\'re facing, and victories you\'re celebrating.'
  },
  {
    icon: Users,
    title: 'Build your audience',
    description: 'Regular updates keep your followers engaged and attract new supporters to your project.'
  },
  {
    icon: Zap,
    title: 'Stay accountable',
    description: 'Public logging creates healthy pressure to keep making progress on your goals.'
  }
]

export function ProjectEmptyState({ project }: ProjectEmptyStateProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)

  return (
    <>
      <div className="text-center space-y-8 sm:space-y-12">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 rounded-xl sm:rounded-2xl mx-auto flex items-center justify-center animate-float">
            <Plus className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
          </div>
          
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
              Ready to start logging?
            </h2>
            <p className="text-sm sm:text-base text-text-secondary max-w-md mx-auto mb-8">
              Your project <strong>{project.name}</strong> is set up and ready. 
              Share your first update to begin building in public.
            </p>
          </div>

          {/* Primary CTA */}
          <a href={`/project/${project.id}/create-log`}>
            <Button
              variant="primary"
              size="lg"
              className="group px-8 py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 min-h-[56px]"
            >
              <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-300" />
              Create Your First Log
            </Button>
          </a>

          {/* Invite Collaborators - Secondary CTA */}
          <div className="pt-4">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsShareModalOpen(true)}
              className="group px-6 py-3 text-sm sm:text-base font-medium transition-all duration-200 min-h-[48px]"
            >
              <UserPlus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
              Invite Collaborators
            </Button>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-surface/50 border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-6">
            💡 Tips for Great Project Logs
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {tips.map((tip, index) => {
              const Icon = tip.icon
              return (
                <div key={index} className="text-center space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl mx-auto flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 text-sm sm:text-base">
                      {tip.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-text-secondary">
                      {tip.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Secondary Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button variant="ghost" className="min-h-[44px] px-6">
            <FileText className="w-4 h-4 mr-2" />
            View Examples
          </Button>
          <Button variant="ghost" className="min-h-[44px] px-6">
            <Users className="w-4 h-4 mr-2" />
            Explore Community
          </Button>
        </div>
      </div>

      {/* Share Link Modal */}
      <ShareLinkModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        project={project}
      />
    </>
  )
}
