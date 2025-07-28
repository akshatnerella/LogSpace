"use client"

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, Bold, Italic, Link2, Eye, EyeOff } from 'lucide-react'
import { Button } from '../Button'

interface TextLogFormProps {
  projectId: string
  onBack: () => void
  onSubmit: (data: { title: string; content: string }) => void
}

export function TextLogForm({ projectId, onBack, onSubmit }: TextLogFormProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-focus title input
    if (titleRef.current) {
      titleRef.current.focus()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || isSubmitting) return

    setIsSubmitting(true)
    
    try {
      await onSubmit({ title: title.trim(), content: content.trim() })
    } finally {
      setIsSubmitting(false)
    }
  }

  const insertMarkdown = (syntax: string, placeholder = 'text') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const textToInsert = selectedText || placeholder

    let newText = ''
    if (syntax === 'bold') {
      newText = `**${textToInsert}**`
    } else if (syntax === 'italic') {
      newText = `*${textToInsert}*`
    } else if (syntax === 'link') {
      newText = `[${textToInsert}](url)`
    }

    const newContent = content.substring(0, start) + newText + content.substring(end)
    setContent(newContent)

    // Set cursor position
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + newText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  // Simple markdown preview (basic implementation)
  const renderPreview = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
      .replace(/\n/g, '<br />')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-surface/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-surface-light rounded-lg transition-colors duration-200"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-text-secondary" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">
                  New Text Log
                </h1>
                <p className="text-sm text-text-secondary">
                  Share your thoughts and progress
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="p-2 hover:bg-surface-light rounded-lg transition-colors duration-200"
                aria-label={isPreview ? 'Edit mode' : 'Preview mode'}
              >
                {isPreview ? (
                  <EyeOff className="w-5 h-5 text-text-secondary" />
                ) : (
                  <Eye className="w-5 h-5 text-text-secondary" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="space-y-6">
          {/* Title Input */}
          <div>
            <input
              ref={titleRef}
              type="text"
              placeholder="What's this log about? (e.g., 'Fixed the login bug' or 'New feature idea')"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl sm:text-2xl font-semibold bg-transparent border-none outline-none text-foreground placeholder-text-secondary resize-none"
              maxLength={120}
            />
            <div className="flex justify-between items-center mt-2">
              <div className="text-xs text-text-secondary">
                Title • {title.length}/120 characters
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            {/* Toolbar */}
            {!isPreview && (
              <div className="flex items-center gap-1 p-3 border-b border-border bg-surface-light">
                <button
                  type="button"
                  onClick={() => insertMarkdown('bold')}
                  className="p-2 hover:bg-surface rounded-lg transition-colors duration-200"
                  aria-label="Bold text"
                >
                  <Bold className="w-4 h-4 text-text-secondary" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('italic')}
                  className="p-2 hover:bg-surface rounded-lg transition-colors duration-200"
                  aria-label="Italic text"
                >
                  <Italic className="w-4 h-4 text-text-secondary" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('link')}
                  className="p-2 hover:bg-surface rounded-lg transition-colors duration-200"
                  aria-label="Insert link"
                >
                  <Link2 className="w-4 h-4 text-text-secondary" />
                </button>
                <div className="ml-auto text-xs text-text-secondary">
                  Markdown supported
                </div>
              </div>
            )}

            {/* Editor/Preview */}
            <div className="p-4">
              {isPreview ? (
                <div className="min-h-[300px] prose prose-invert max-w-none">
                  {content.trim() ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: renderPreview(content)
                      }}
                    />
                  ) : (
                    <p className="text-text-secondary italic">
                      Start typing to see your preview...
                    </p>
                  )}
                </div>
              ) : (
                <textarea
                  placeholder="Share what you're working on, what you've learned, or what's coming next..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  className="w-full bg-transparent border-none outline-none text-foreground placeholder-text-secondary resize-none leading-relaxed"
                />
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-border">
            <div className="flex-1">
              <p className="text-xs text-text-secondary">
                Your log will be visible to anyone following your project. 
                <span className="font-medium text-foreground"> Keep it authentic!</span>
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onBack}
                className="px-6 py-2.5 min-h-[44px]"
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="primary"
                disabled={!title.trim() || !content.trim() || isSubmitting}
                className="px-8 py-2.5 min-h-[44px] font-semibold group"
              >
                {isSubmitting ? (
                  'Publishing...'
                ) : (
                  <>
                    Publish Log
                    <Send className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
