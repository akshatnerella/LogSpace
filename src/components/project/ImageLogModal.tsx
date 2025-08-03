'use client'

import { useState } from 'react'
import { X, ArrowLeft } from 'lucide-react'
import { VisualLogForm } from './VisualLogForm'
import { createProjectLog } from '@/lib/queries'

interface ImageLogModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  projectId: string
}

export function ImageLogModal({ isOpen, onClose, onSuccess, projectId }: ImageLogModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: { files: File[]; caption: string }) => {
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      // For now, create a simple image log
      // In a full implementation, you'd upload the files to storage first
      const result = await createProjectLog({
        project_id: projectId,
        type: 'image',
        title: 'Visual Log',
        content: data.caption,
        // images: [] // Would contain uploaded image URLs
      })

      if (result) {
        console.log('Image log created successfully!')
        onSuccess()
      } else {
        console.error('Failed to create image log')
      }
    } catch (error) {
      console.error('Error creating image log:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold">Create Visual Log</h2>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-hidden">
        <VisualLogForm
          projectId={projectId}
          onBack={onClose}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
