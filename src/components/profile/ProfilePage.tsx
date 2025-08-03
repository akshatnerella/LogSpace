'use client'

import { useState } from 'react'
import { 
  ArrowLeft, 
  ExternalLink, 
  Github, 
  Globe, 
  Plus,
  FileText,
  Eye,
  Folder,
  Calendar
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import EmptyProjectsIllustration from './EmptyProjectsIllustration'

interface Project {
  id: string
  title: string
  description: string
  slug: string
  logCount: number
  isPublic: boolean
  tags?: string[]
  lastUpdated: Date
}

interface UserProfile {
  id: string
  name: string
  handle: string
  avatar: string
  bio: string
  website?: string
  github?: string
  joinedAt: Date
  stats: {
    totalProjects: number
    totalLogs: number
    views: number
  }
  projects: Project[]
}

interface ProfilePageProps {
  profile: UserProfile
  isOwnProfile?: boolean
  onBack?: () => void
}

export default function ProfilePage({ profile, isOwnProfile = false, onBack }: ProfilePageProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  const handleNewProject = () => {
    router.push('/create-project')
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric'
    }).format(date)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-surface-light rounded-lg transition-colors duration-200"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="text-sm font-medium text-foreground">
              {profile.name}
            </div>
            <div className="w-9" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={profile.avatar}
                alt={`${profile.name}'s avatar`}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-border object-cover"
              />
              {isOwnProfile && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full border-2 border-background flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <div className="mb-3">
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  {profile.name}
                </h1>
                <p className="text-muted-foreground">@{profile.handle}</p>
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="text-foreground mb-4 leading-relaxed">
                  {profile.bio}
                </p>
              )}

              {/* Links & Join Date */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary transition-colors duration-200"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {profile.github && (
                  <a
                    href={`https://github.com/${profile.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-primary transition-colors duration-200"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {formatDate(profile.joinedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-surface border border-border rounded-xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Folder className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {formatNumber(profile.stats.totalProjects)}
            </div>
            <div className="text-sm text-muted-foreground">Projects</div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <FileText className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {formatNumber(profile.stats.totalLogs)}
            </div>
            <div className="text-sm text-muted-foreground">Logs</div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Eye className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {formatNumber(profile.stats.views)}
            </div>
            <div className="text-sm text-muted-foreground">Views</div>
          </div>
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              Public Projects
            </h2>
            {isOwnProfile && (
              <button
                onClick={handleNewProject}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                New Project
              </button>
            )}
          </div>

          {profile.projects.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <EmptyProjectsIllustration />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {isOwnProfile ? "No public projects yet" : `${profile.name} hasn't shared any projects yet`}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {isOwnProfile 
                  ? "Get started by creating your first project and sharing your work with the community!"
                  : "Check back later to see what they're building."
                }
              </p>
              {isOwnProfile && (
                <button
                  onClick={handleNewProject}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                  Create First Project
                </button>
              )}
            </div>
          ) : (
            /* Projects Grid */
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {profile.projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-surface border border-border rounded-xl p-6 hover:border-primary/30 transition-all duration-200 group"
                >
                  <div className="mb-4">
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-surface-light text-muted-foreground rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs text-muted-foreground">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <FileText className="w-4 h-4" />
                      {project.logCount} logs
                    </div>
                    <button
                      onClick={() => router.push(`/project/${project.id}`)}
                      className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors duration-200"
                    >
                      View Project
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button (Mobile) */}
      {isOwnProfile && (
        <button
          onClick={handleNewProject}
          className="fixed bottom-6 right-6 sm:hidden w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all duration-200 hover:scale-105"
          aria-label="Create new project"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}
