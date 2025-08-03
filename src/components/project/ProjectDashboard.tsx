'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreateLogModal } from './CreateLogModal'
import { RecentLogs } from './RecentLogs'
import { 
  ArrowLeft, 
  Eye, 
  Lock, 
  Calendar, 
  BarChart3, 
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Share2,
  Settings,
  PenTool,
  Users,
  Palette,
  Activity,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { Project, ProjectLog } from '@/types/database'
import { formatRelativeTime } from '@/lib/utils'

interface ProjectDashboardProps {
  project: Project & { 
    log_count: number
    recent_logs?: Array<{
      id: string
      content?: string
      created_at: string
      type: string
      users?: {
        id: string
        name?: string
        avatar_url?: string
      }
    }>
  }
}

export function ProjectDashboard({ project }: ProjectDashboardProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [showCollaboratorsModal, setShowCollaboratorsModal] = useState(false)
  const [showCreateLogModal, setShowCreateLogModal] = useState(false)
  const [refreshLogsKey, setRefreshLogsKey] = useState(0)
  
  const createdDate = new Date(project.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const lastActivity = project.recent_logs?.[0] 
    ? formatRelativeTime(project.recent_logs[0].created_at)
    : 'No activity yet'

  // Mock collaborators data - in real app, this would come from props or API
  const collaborators = [
    {
      id: '1',
      name: 'You',
      email: 'user@example.com',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      role: 'Owner'
    },
    {
      id: '2', 
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b4b48c58?w=40&h=40&fit=crop&crop=face',
      role: 'Editor'
    },
    {
      id: '3',
      name: 'Mike Johnson', 
      email: 'mike@example.com',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      role: 'Viewer'
    }
  ]

  const nextSteps = [
    { id: 'first-log', label: 'Create first log', completed: project.log_count > 0 },
    { id: 'invite-collaborators', label: 'Invite collaborators', completed: false },
    { id: 'customize-project', label: 'Customize project page', completed: false }
  ]

  const toggleStep = (stepId: string) => {
    const newCompleted = new Set(completedSteps)
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId)
    } else {
      newCompleted.add(stepId)
    }
    setCompletedSteps(newCompleted)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button */}
            <Link href="/home" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>

            {/* Status Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-green-400">Active</span>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Project Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-4">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
                <h1 className="text-3xl sm:text-4xl font-bold text-white">{project.title}</h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-surface rounded-full border border-border w-fit">
                  {project.visibility === 'public' ? (
                    <>
                      <Eye className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium text-purple-400">Public</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Private</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Created {createdDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>{project.log_count} logs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Last activity {lastActivity}</span>
                </div>
              </div>
            </div>

            {/* Collaborators - Positioned with Project Title */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCollaboratorsModal(true)}
              className="flex items-center gap-3 p-3 bg-surface/50 backdrop-blur-sm border border-border hover:bg-surface-hover rounded-2xl transition-colors group w-full sm:w-64 mt-8"
            >
              <div className="flex -space-x-1">
                {collaborators.slice(0, 3).map((collaborator, index) => (
                  <div
                    key={collaborator.id}
                    className={`w-6 h-6 rounded-full border-2 border-border overflow-hidden bg-surface-light flex-shrink-0 ${
                      index === 0 ? 'z-30' : index === 1 ? 'z-20' : 'z-10'
                    }`}
                  >
                    <img
                      src={collaborator.avatar_url}
                      alt={collaborator.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {collaborators.length > 3 && (
                  <div className="w-6 h-6 rounded-full border-2 border-border bg-surface-light flex items-center justify-center z-0">
                    <span className="text-xs font-medium text-foreground">+{collaborators.length - 3}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-white">Collaborators ({collaborators.length})</div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-muted-foreground transition-colors" />
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Project Summary</h2>
              {project.description ? (
                <p className="text-foreground leading-relaxed mb-6">{project.description}</p>
              ) : (
                <p className="text-muted-foreground italic mb-6">No description provided yet.</p>
              )}

              {/* Recent Logs */}
              <RecentLogs 
                key={refreshLogsKey}
                projectId={project.id} 
                onAddLog={() => setShowCreateLogModal(true)}
              />
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Next Steps</h2>
              <div className="space-y-3">
                {nextSteps.map((step, index) => {
                  const isCompleted = step.completed || completedSteps.has(step.id)
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                        isCompleted 
                          ? 'bg-green-500/10 border-green-500/20' 
                          : 'bg-surface/50 border-border/50 hover:border-border-hover'
                      }`}
                      onClick={() => !step.completed && toggleStep(step.id)}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className={`font-medium ${isCompleted ? 'text-green-400' : 'text-foreground'}`}>
                        {step.label}
                      </span>
                      {!step.completed && (
                        <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface/50 backdrop-blur-sm border border-border rounded-xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-4">
                <div className="mb-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCreateLogModal(true)}
                    className="w-full flex items-center gap-3 p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors group"
                  >
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <PenTool className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-sm font-medium text-white">Add New Log</div>
                      <div className="text-xs text-purple-200">Document your progress</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/60 group-hover:text-foreground transition-colors flex-shrink-0" />
                  </motion.button>
                </div>

                <div className="mb-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 p-4 bg-surface hover:bg-surface-hover rounded-lg transition-colors group"
                  >
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Share2 className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-sm font-medium text-white">Share Project</div>
                      <div className="text-xs text-muted-foreground">Invite collaborators</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-muted-foreground transition-colors flex-shrink-0" />
                  </motion.button>
                </div>

                <div>
                  <Link href={`/project/${project.id}/settings`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center gap-3 p-4 bg-surface hover:bg-surface-hover rounded-lg transition-colors group"
                    >
                      <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Settings className="w-5 h-5 text-foreground" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="text-sm font-medium text-white">Manage Settings</div>
                        <div className="text-xs text-muted-foreground">Configure your project</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-muted-foreground transition-colors flex-shrink-0" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Project Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-surface/50 backdrop-blur-sm border border-border rounded-xl p-4"
            >
              <h2 className="text-lg font-semibold text-white mb-4">Statistics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="text-center p-3 bg-surface/50 rounded-lg">
                  <div className="text-xl font-bold text-purple-400 mb-1">{project.log_count}</div>
                  <div className="text-xs text-muted-foreground">Total Logs</div>
                </div>
                <div className="text-center p-3 bg-surface/50 rounded-lg">
                  <div className="text-xl font-bold text-blue-400 mb-1">{collaborators.length}</div>
                  <div className="text-xs text-muted-foreground">Collaborators</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Collaborators Modal */}
      {showCollaboratorsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-background border border-border rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Collaborators</h2>
              <button
                onClick={() => setShowCollaboratorsModal(false)}
                className="w-8 h-8 rounded-full bg-surface hover:bg-surface-hover flex items-center justify-center transition-colors"
              >
                <span className="text-muted-foreground text-lg">×</span>
              </button>
            </div>

            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {collaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="flex items-center gap-3 p-3 bg-surface/50 rounded-xl hover:bg-surface transition-colors"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-light flex-shrink-0">
                    <img
                      src={collaborator.avatar_url}
                      alt={collaborator.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white">{collaborator.name}</div>
                    <div className="text-sm text-muted-foreground truncate">{collaborator.email}</div>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground bg-surface px-2 py-1 rounded-full">
                    {collaborator.role}
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full flex items-center justify-center gap-2 p-3 bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors">
              <Plus className="w-4 h-4" />
              <span className="font-medium text-white">Invite Collaborator</span>
            </button>
          </motion.div>
        </div>
      )}

      {/* Create Log Modal */}
      <CreateLogModal
        isOpen={showCreateLogModal}
        onClose={() => setShowCreateLogModal(false)}
        onSuccess={() => setRefreshLogsKey(prev => prev + 1)}
        projectId={project.id}
      />
    </div>
  )
}
