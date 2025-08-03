'use client'

import { useState } from 'react'
import { X, ArrowLeft, Send } from 'lucide-react'
import { VisualLogForm } from './VisualLogForm'
import { createProjectLog } from '@/lib/queries'

interface VisualLogModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  projectId: string
}

export function VisualLogModal({ isOpen, onClose, onSuccess, projectId }: VisualLogModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: { files: File[]; title: string; description: string; tags: string[] }) => {
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      const result = await createProjectLog({
        project_id: projectId,
        type: 'image',
        title: data.title,
        content: data.description,
        tags: data.tags
      })

      if (result) {
        console.log('Visual log created successfully!')
        onSuccess()
      } else {
        console.error('Failed to create visual log')
      }
    } catch (error) {
      console.error('Error creating visual log:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-purple-500/5 to-pink-500/5">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1.5 hover:bg-surface-light rounded-lg transition-all duration-200 group"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent truncate">
              Create Visual Log
            </h2>
            <p className="text-xs text-muted-foreground truncate">
              Upload images, videos, or screenshots with captions
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1.5 hover:bg-surface-light rounded-lg transition-all duration-200 group ml-2"
          aria-label="Close modal"
        >
          <X className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </div>

      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
        <VisualLogForm
          projectId={projectId}
          onBack={onClose}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="flex-shrink-0 p-4 border-t border-border bg-surface-light/50">
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 min-h-[36px] text-sm bg-transparent hover:bg-surface-light border border-border-light rounded-lg transition-colors text-foreground"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            form="visual-log-form"
            disabled={isSubmitting}
            className="px-8 py-2 min-h-[36px] min-w-[140px] text-sm font-medium bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              'Publishing...'
            ) : (
              <>
                Publish Log
                <Send className="w-3 h-3 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
