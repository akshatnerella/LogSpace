'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
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
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button */}
            <Link href="/dashboard" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <h1 className="text-4xl font-bold text-white">{project.title}</h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full border border-gray-700">
                  {project.visibility === 'public' ? (
                    <>
                      <Eye className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium text-purple-400">Public</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-400">Private</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
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
              className="flex items-center gap-3 p-3 bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:bg-gray-800/50 rounded-2xl transition-colors group w-64 mt-8"
            >
              <div className="flex -space-x-1">
                {collaborators.slice(0, 3).map((collaborator, index) => (
                  <div
                    key={collaborator.id}
                    className={`w-6 h-6 rounded-full border-2 border-gray-700 overflow-hidden bg-gray-600 flex-shrink-0 ${
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
                  <div className="w-6 h-6 rounded-full border-2 border-gray-700 bg-gray-600 flex items-center justify-center z-0">
                    <span className="text-xs font-medium text-gray-300">+{collaborators.length - 3}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-white">Collaborators ({collaborators.length})</div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-400 transition-colors" />
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
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Project Summary</h2>
              {project.description ? (
                <p className="text-gray-300 leading-relaxed mb-6">{project.description}</p>
              ) : (
                <p className="text-gray-500 italic mb-6">No description provided yet.</p>
              )}

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
                {project.recent_logs && project.recent_logs.length > 0 ? (
                  <div className="space-y-3">
                    {project.recent_logs.map((log, index) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="flex items-start gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50"
                      >
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Activity className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-300 text-sm leading-relaxed">{log.content || 'No content'}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <p className="text-xs text-gray-500">
                              {formatRelativeTime(log.created_at)}
                            </p>
                            {log.users?.name && (
                              <>
                                <span className="text-xs text-gray-600">•</span>
                                <p className="text-xs text-gray-500">
                                  by {log.users.name}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="w-6 h-6 text-gray-500" />
                    </div>
                    <p className="text-gray-500 mb-2">No logs yet</p>
                    <p className="text-sm text-gray-600">Start documenting your project progress</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6"
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
                          : 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600'
                      }`}
                      onClick={() => !step.completed && toggleStep(step.id)}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                      <span className={`font-medium ${isCompleted ? 'text-green-400' : 'text-gray-300'}`}>
                        {step.label}
                      </span>
                      {!step.completed && (
                        <ChevronRight className="w-4 h-4 text-gray-500 ml-auto" />
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
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-4">
                <div className="mb-4">
                  <Link href={`/project/${project.id}/create`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center gap-3 p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors group"
                    >
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <PenTool className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="text-sm font-medium text-white">Add New Log</div>
                        <div className="text-xs text-purple-200">Document your progress</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/60 group-hover:text-white transition-colors flex-shrink-0" />
                    </motion.button>
                  </Link>
                </div>

                <div className="mb-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
                  >
                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Share2 className="w-5 h-5 text-gray-300" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-sm font-medium text-white">Share Project</div>
                      <div className="text-xs text-gray-400">Invite collaborators</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-400 transition-colors flex-shrink-0" />
                  </motion.button>
                </div>

                <div>
                  <Link href={`/project/${project.id}/settings`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
                    >
                      <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Settings className="w-5 h-5 text-gray-300" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="text-sm font-medium text-white">Manage Settings</div>
                        <div className="text-xs text-gray-400">Configure your project</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-400 transition-colors flex-shrink-0" />
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
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4"
            >
              <h2 className="text-lg font-semibold text-white mb-4">Statistics</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-xl font-bold text-purple-400 mb-1">{project.log_count}</div>
                  <div className="text-xs text-gray-500">Total Logs</div>
                </div>
                <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-xl font-bold text-blue-400 mb-1">{collaborators.length}</div>
                  <div className="text-xs text-gray-500">Collaborators</div>
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
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Collaborators</h2>
              <button
                onClick={() => setShowCollaboratorsModal(false)}
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
              >
                <span className="text-gray-400 text-lg">×</span>
              </button>
            </div>

            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {collaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-600 flex-shrink-0">
                    <img
                      src={collaborator.avatar_url}
                      alt={collaborator.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white">{collaborator.name}</div>
                    <div className="text-sm text-gray-400 truncate">{collaborator.email}</div>
                  </div>
                  <div className="text-xs font-medium text-gray-500 bg-gray-700 px-2 py-1 rounded-full">
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
    </div>
  )
}
