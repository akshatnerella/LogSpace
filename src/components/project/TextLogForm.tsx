"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/Button'
import { X, Plus, Send } from 'lucide-react'

interface TextLogFormProps {
  onSubmit: (data: { title: string; content: string; tags: string[] }) => Promise<void>
  onBack: () => void
  isSubmitting?: boolean
}

export function TextLogForm({ onSubmit, onBack, isSubmitting = false }: TextLogFormProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  const addTag = () => {
    const tag = newTag.trim().toLowerCase()
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        tags: tags
      })
    } catch (error) {
      console.error('Error submitting text log:', error)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <form id="text-log-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Title Field */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-foreground">
            Title *
          </label>
            <input
              ref={titleRef}
              id="title"
              type="text"
              placeholder="What's this log about?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 bg-surface-light border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all text-foreground placeholder-muted-foreground text-sm"
              maxLength={100}
            />
            <div className="text-xs text-muted-foreground text-right">
              {title.length}/100 characters
            </div>
          </div>

          {/* Content Field */}
          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium text-foreground">
              Content *
            </label>
            <textarea
              id="content"
              placeholder="Share your thoughts, progress updates, learnings, or anything you'd like to document about your project..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full px-3 py-2.5 bg-surface-light border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all resize-none text-foreground placeholder-muted-foreground leading-relaxed text-sm"
              maxLength={2000}
            />
            <div className="text-xs text-muted-foreground text-right">
              {content.length}/2000 characters
            </div>
          </div>

          {/* Tags Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Tags <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            
            {/* Current Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-400/10 text-blue-400 border border-blue-400/20 rounded-full text-xs"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:bg-blue-400/20 rounded-full p-0.5 transition-colors"
                      aria-label={`Remove ${tag} tag`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add Tag Input */}
            {tags.length < 5 && (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="flex-1 px-3 py-2 bg-surface-light border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all text-foreground placeholder-muted-foreground text-xs"
                  maxLength={20}
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => addTag()}
                  disabled={!newTag.trim()}
                  className="px-3 py-2 min-h-[32px] text-xs"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            )}
            
            <div className="text-xs text-muted-foreground">
              {tags.length}/5 tags • Press Enter or click + to add
            </div>
          </div>
      </form>
    </div>
  )
}
