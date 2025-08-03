"use client"

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, Link2, ExternalLink } from 'lucide-react'
import { Button } from '../Button'

interface UrlLogFormProps {
  projectId: string
  onBack: () => void
  onSubmit: (data: { title: string; url: string; description: string }) => void
}

export function UrlLogForm({ projectId, onBack, onSubmit }: UrlLogFormProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValidUrl, setIsValidUrl] = useState(true)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-focus title input
    if (titleRef.current) {
      titleRef.current.focus()
    }
  }, [])

  const validateUrl = (urlString: string) => {
    try {
      new URL(urlString)
      return true
    } catch {
      return false
    }
  }

  const handleUrlChange = (value: string) => {
    setUrl(value)
    if (value.trim()) {
      setIsValidUrl(validateUrl(value))
    } else {
      setIsValidUrl(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !url.trim() || !isValidUrl || isSubmitting) return

    setIsSubmitting(true)
    
    try {
      await onSubmit({ 
        title: title.trim(), 
        url: url.trim(), 
        description: description.trim() 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const canSubmit = title.trim() && url.trim() && isValidUrl && !isSubmitting

  return (
    <div className="h-full flex flex-col">
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 p-6 space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              Title
            </label>
            <input
              ref={titleRef}
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give this link a descriptive title..."
              className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-lg"
              maxLength={200}
            />
            <div className="text-xs text-muted-foreground text-right">
              {title.length}/200
            </div>
          </div>

          {/* URL Input */}
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium text-foreground">
              URL
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Link2 className="w-5 h-5" />
              </div>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://example.com"
                className={`w-full pl-12 pr-4 py-3 bg-input border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg ${
                  !isValidUrl ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-border'
                }`}
              />
              {url && isValidUrl && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <ExternalLink className="w-4 h-4" />
                </div>
              )}
            </div>
            {!isValidUrl && (
              <div className="text-xs text-red-500">
                Please enter a valid URL
              </div>
            )}
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-foreground">
              Description <span className="text-muted-foreground">(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add context about why this link is relevant to your project..."
              className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-base min-h-[120px]"
              maxLength={1000}
            />
            <div className="text-xs text-muted-foreground text-right">
              {description.length}/1000
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-border p-6">
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              type="submit"
              disabled={!canSubmit}
              className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                'Creating...'
              ) : (
                <>
                  Create Link Log
                  <Send className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
