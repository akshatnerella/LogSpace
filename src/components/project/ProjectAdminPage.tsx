'use client'

import { useState } from 'react'
import { 
  Settings, 
  Users, 
  FileText, 
  Link2, 
  UserPlus, 
  MoreVertical, 
  Copy, 
  Check, 
  Trash2, 
  Edit3, 
  Save,
  X,
  ChevronDown,
  Eye,
  Lock,
  Globe
} from 'lucide-react'
import { Button } from '../Button'
import { ShareLinkModal } from './ShareLinkModal'

interface Project {
  id: string
  name: string
  description: string
  slug: string
  visibility: 'public' | 'private'
  createdAt: string
  logCount: number
  status: 'active' | 'completed'
}

interface Collaborator {
  id: string
  name: string
  email: string
  role: 'admin' | 'viewer'
  avatar?: string
  status: 'active' | 'pending'
  joinedAt: string
}

interface ProjectAdminPageProps {
  project: Project
  onBack: () => void
}

// Mock collaborators data
const mockCollaborators: Collaborator[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    role: 'admin',
    status: 'active',
    joinedAt: '2025-01-15'
  },
  {
    id: '2',
    name: 'Mike Rodriguez',
    email: 'mike@example.com',
    role: 'viewer',
    status: 'active',
    joinedAt: '2025-01-20'
  },
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    role: 'viewer',
    status: 'pending',
    joinedAt: '2025-01-22'
  }
]

export function ProjectAdminPage({ project, onBack }: ProjectAdminPageProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(mockCollaborators)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [removeCollaboratorId, setRemoveCollaboratorId] = useState<string | null>(null)
  const [isEditingProject, setIsEditingProject] = useState(false)
  const [projectForm, setProjectForm] = useState({
    name: project.name,
    description: project.description,
    visibility: project.visibility
  })
  const [isSaving, setIsSaving] = useState(false)
  const [copiedLink, setCopiedLink] = useState<string | null>(null)

  const publicUrl = `https://logspace.dev/project/${project.id}`
  const inviteUrl = `https://logspace.dev/invite/${project.id}?token=abc123xyz`

  const handleRoleChange = async (collaboratorId: string, newRole: 'admin' | 'viewer') => {
    setCollaborators(prev => 
      prev.map(collab => 
        collab.id === collaboratorId 
          ? { ...collab, role: newRole }
          : collab
      )
    )
    // TODO: Update role in backend
    console.log('Updating role:', { collaboratorId, newRole })
  }

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    setCollaborators(prev => prev.filter(collab => collab.id !== collaboratorId))
    setRemoveCollaboratorId(null)
    // TODO: Remove from backend
    console.log('Removing collaborator:', collaboratorId)
  }

  const handleSaveProject = async () => {
    setIsSaving(true)
    try {
      // TODO: Save to backend
      console.log('Saving project:', projectForm)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsEditingProject(false)
    } catch (error) {
      console.error('Failed to save project:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopyLink = async (url: string, linkType: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url)
      } else {
        // Fallback for insecure contexts
        const textArea = document.createElement('textarea')
        textArea.value = url
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      setCopiedLink(linkType)
      setTimeout(() => setCopiedLink(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-surface/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-surface-light rounded-lg transition-colors duration-200"
                aria-label="Go back"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                    ⚙️ Project Settings
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage your team and project preferences
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          
          {/* Section 1: Collaborators */}
          <section className="bg-surface border border-border rounded-xl sm:rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-semibold text-foreground">
                    👥 Team Members
                  </h2>
                </div>
                <Button
                  onClick={() => setIsShareModalOpen(true)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Invite New Collaborator
                </Button>
              </div>
            </div>

            {/* Collaborators Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-light">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Email</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Role</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Joined</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {collaborators.map((collaborator) => (
                    <tr key={collaborator.id} className="hover:bg-surface-light/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {collaborator.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{collaborator.name}</p>
                            {collaborator.status === 'pending' && (
                              <span className="text-xs text-amber-500">Pending</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {collaborator.email}
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <label htmlFor={`role-${collaborator.id}`} className="sr-only">
                            Role for {collaborator.name}
                          </label>
                          <select
                            id={`role-${collaborator.id}`}
                            value={collaborator.role}
                            onChange={(e) => handleRoleChange(collaborator.id, e.target.value as 'admin' | 'viewer')}
                            className="appearance-none bg-surface border border-border rounded-lg px-3 py-1 pr-8 text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 cursor-pointer"
                          >
                            <option value="admin">Admin</option>
                            <option value="viewer">Viewer</option>
                          </select>
                          <ChevronDown className="absolute right-5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(collaborator.joinedAt)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setRemoveCollaboratorId(collaborator.id)}
                          className="p-1 hover:bg-red-500/10 rounded-lg transition-colors duration-200 text-muted-foreground hover:text-red-500"
                          aria-label="Remove collaborator"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 2: Project Settings */}
          <section className="bg-surface border border-border rounded-xl sm:rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-400" />
                  <h2 className="text-lg font-semibold text-foreground">
                    📝 Project Info
                  </h2>
                </div>
                {!isEditingProject && (
                  <button
                    onClick={() => setIsEditingProject(true)}
                    className="p-2 hover:bg-surface-light rounded-lg transition-colors duration-200 text-muted-foreground hover:text-foreground"
                    aria-label="Edit project"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Project Name */}
              <div>
                <label htmlFor="project-name" className="block text-sm font-medium text-foreground mb-2">
                  Project Name
                </label>
                {isEditingProject ? (
                  <input
                    id="project-name"
                    type="text"
                    value={projectForm.name}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200"
                  />
                ) : (
                  <p className="text-foreground py-2">{project.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="project-description" className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                {isEditingProject ? (
                  <textarea
                    id="project-description"
                    value={projectForm.description}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 resize-none"
                  />
                ) : (
                  <p className="text-muted-foreground py-2">{project.description}</p>
                )}
              </div>

              {/* Visibility */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Visibility
                </label>
                {isEditingProject ? (
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        value="public"
                        checked={projectForm.visibility === 'public'}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, visibility: e.target.value as 'public' | 'private' }))}
                        className="text-primary focus:ring-primary/20"
                      />
                      <Globe className="w-4 h-4 text-green-500" />
                      <span className="text-foreground">Public - Anyone can view this project</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="visibility"
                        value="private"
                        checked={projectForm.visibility === 'private'}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, visibility: e.target.value as 'public' | 'private' }))}
                        className="text-primary focus:ring-primary/20"
                      />
                      <Lock className="w-4 h-4 text-amber-500" />
                      <span className="text-foreground">Private - Only collaborators can access</span>
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 py-2">
                    {project.visibility === 'public' ? (
                      <>
                        <Globe className="w-4 h-4 text-green-500" />
                        <span className="text-foreground">Public</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-amber-500" />
                        <span className="text-foreground">Private</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Save/Cancel Buttons */}
              {isEditingProject && (
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button
                    onClick={handleSaveProject}
                    disabled={isSaving}
                    variant="primary"
                    className="gap-2"
                  >
                    {isSaving ? (
                      'Saving...'
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditingProject(false)
                      setProjectForm({
                        name: project.name,
                        description: project.description,
                        visibility: project.visibility
                      })
                    }}
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Section 3: Project Links */}
          <section className="bg-surface border border-border rounded-xl sm:rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
              <div className="flex items-center gap-2">
                <Link2 className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-semibold text-foreground">
                  🔗 Project Links
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Public Dashboard Link */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <h3 className="font-medium text-foreground">Public Dashboard</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Anyone can view this project&apos;s public dashboard
                </p>
                <div className="bg-surface-light border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center">
                    <div className="flex-1 px-4 py-3">
                      <p className="text-sm font-mono text-foreground truncate">
                        {publicUrl}
                      </p>
                    </div>
                    <div className="px-3">
                      <button
                        onClick={() => handleCopyLink(publicUrl, 'public')}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-surface rounded-md transition-colors duration-200"
                      >
                        {copiedLink === 'public' ? (
                          <>
                            <Check className="w-4 h-4 text-green-400" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invite Link */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-green-400" />
                  <h3 className="font-medium text-foreground">Collaboration Invite Link</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Share this link to invite people as collaborators
                </p>
                <div className="bg-surface-light border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center">
                    <div className="flex-1 px-4 py-3">
                      <p className="text-sm font-mono text-foreground truncate">
                        {inviteUrl}
                      </p>
                    </div>
                    <div className="px-3">
                      <button
                        onClick={() => handleCopyLink(inviteUrl, 'invite')}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-surface rounded-md transition-colors duration-200"
                      >
                        {copiedLink === 'invite' ? (
                          <>
                            <Check className="w-4 h-4 text-green-400" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Share Link Modal */}
      <ShareLinkModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        projectId={project.id}
        projectName={project.name}
      />

      {/* Remove Collaborator Confirmation Modal */}
      {removeCollaboratorId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setRemoveCollaboratorId(null)}
          />
          <div className="relative bg-surface border border-border rounded-2xl p-6 max-w-md w-full animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Remove Collaborator</h3>
                <p className="text-sm text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to remove this collaborator? They will lose access to the project immediately.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => handleRemoveCollaborator(removeCollaboratorId)}
                variant="primary"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Remove
              </Button>
              <Button
                onClick={() => setRemoveCollaboratorId(null)}
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
