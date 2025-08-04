'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check, Mail, User, UserPlus } from 'lucide-react'
import { Button } from '../Button'

interface ShareLinkModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  projectName: string
}

export function ShareLinkModal({ isOpen, onClose, projectId, projectName }: ShareLinkModalProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'viewer' | 'editor' | 'admin'>('viewer')
  const [copied, setCopied] = useState(false)
  const [isInviting, setIsInviting] = useState(false)

  const shareUrl = `${window.location.origin}/project/${projectId}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const handleInvite = async () => {
    if (!email.trim()) return
    
    setIsInviting(true)
    // TODO: Implement actual invite functionality
    setTimeout(() => {
      setIsInviting(false)
      setEmail('')
      // Show success message
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-background border border-border rounded-2xl p-6 w-full max-w-md"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Share Project</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface hover:bg-surface-hover flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Copy Link Section */}
            <div>
              <h3 className="text-sm font-medium text-white mb-2">Share Link</h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  aria-label="Project share URL"
                  className="flex-1 px-3 py-2 text-sm bg-surface border border-border rounded-lg text-muted-foreground"
                />
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Invite by Email Section */}
            <div>
              <h3 className="text-sm font-medium text-white mb-2">Invite Collaborator</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm bg-surface border border-border rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'viewer' | 'editor' | 'admin')}
                    aria-label="Select collaborator role"
                    className="flex-1 px-3 py-2 text-sm bg-surface border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="viewer">Viewer - Can view project</option>
                    <option value="editor">Editor - Can add logs</option>
                    <option value="admin">Admin - Full access</option>
                  </select>
                </div>

                <Button
                  onClick={handleInvite}
                  disabled={!email.trim() || isInviting}
                  className="w-full flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isInviting ? 'Sending...' : 'Send Invitation'}</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              People you share this project with will be able to view it according to their assigned role.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
