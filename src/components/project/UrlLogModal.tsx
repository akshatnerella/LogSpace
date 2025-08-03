'use client'

import { useState } from 'react'
import { X, ArrowLeft } from 'lucide-react'
import { UrlLogForm } from './UrlLogForm'
import { createProjectLog } from '@/lib/queries'

interface UrlLogModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  projectId: string
}

export function UrlLogModal({ isOpen, onClose, onSuccess, projectId }: UrlLogModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: { title: string; url: string; description: string }) => {
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      const result = await createProjectLog({
        project_id: projectId,
        type: 'url',
        title: data.title,
        content: data.description,
        source_link: data.url
      })

      if (result) {
        console.log('URL log created successfully!')
        onSuccess()
      } else {
        console.error('Failed to create URL log')
      }
    } catch (error) {
      console.error('Error creating URL log:', error)
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
          <h2 className="text-xl font-semibold">Create Link Log</h2>
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
        <UrlLogForm
          projectId={projectId}
          onBack={onClose}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
