'use client'

import { useState } from 'react'
import { X, ArrowLeft, Send } from 'lucide-react'
import { TextLogForm } from './TextLogForm'
import { createProjectLog } from '@/lib/queries'

interface TextLogModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  projectId: string
}

export function TextLogModal({ isOpen, onClose, onSuccess, projectId }: TextLogModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: { title: string; content: string; tags: string[] }) => {
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      const result = await createProjectLog({
        project_id: projectId,
        type: 'text',
        title: data.title,
        content: data.content,
        tags: data.tags
      })

      if (result) {
        console.log('Text log created successfully!')
        onSuccess()
      } else {
        console.error('Failed to create text log')
      }
    } catch (error) {
      console.error('Error creating text log:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-purple-500/5 to-blue-500/5">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1.5 hover:bg-surface-light rounded-lg transition-all duration-200 group"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent truncate">
              Create Text Log
            </h2>
            <p className="text-xs text-muted-foreground truncate">
              Share your thoughts and progress updates
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
        <TextLogForm
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
            form="text-log-form"
            disabled={isSubmitting}
            className="px-8 py-2 min-h-[36px] min-w-[140px] text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
