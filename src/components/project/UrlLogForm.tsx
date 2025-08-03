"use client"

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, Link2, ExternalLink, X, Plus } from 'lucide-react'
import { Button } from '../Button'

interface UrlLogFormProps {
  projectId: string
  onBack: () => void
  onSubmit: (data: { title: string; url: string; description: string; tags: string[] }) => void
}

export function UrlLogForm({ projectId, onBack, onSubmit }: UrlLogFormProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValidUrl, setIsValidUrl] = useState(true)
  const urlRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-focus URL input
    if (urlRef.current) {
      urlRef.current.focus()
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

  const addTag = (e?: React.FormEvent) => {
    e?.preventDefault()
    const trimmedTag = newTag.trim().toLowerCase()
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag])
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
    if (!title.trim() || !url.trim() || !isValidUrl || isSubmitting) return

    setIsSubmitting(true)
    
    try {
      await onSubmit({ 
        title: title.trim(), 
        url: url.trim(), 
        description: description.trim(),
        tags: tags
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const canSubmit = title.trim() && url.trim() && isValidUrl && !isSubmitting

  return (
    <div className="p-4 space-y-4">
      <form id="url-log-form" onSubmit={handleSubmit} className="space-y-4">
        {/* URL Input */}
        <div className="space-y-2">
          <label htmlFor="url" className="block text-sm font-medium text-foreground">
            URL *
          </label>
          <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Link2 className="w-4 h-4" />
              </div>
              <input
                ref={urlRef}
                id="url"
                type="url"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://example.com"
                className={`w-full pl-10 pr-10 py-2.5 bg-surface-light border rounded-lg focus:outline-none focus:ring-2 transition-all text-foreground placeholder-muted-foreground text-sm ${
                  !isValidUrl 
                    ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' 
                    : 'border-border-light focus:ring-green-400/20 focus:border-green-400'
                }`}
              />
              {url && isValidUrl && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400">
                  <ExternalLink className="w-3 h-3" />
                </div>
              )}
            </div>
            {!isValidUrl && (
              <div className="text-xs text-red-400 flex items-center gap-1">
                ⚠️ Please enter a valid URL starting with http:// or https://
              </div>
            )}
            {url && isValidUrl && (
              <div className="text-xs text-green-400 flex items-center gap-1">
                ✓ Valid URL
              </div>
            )}
          </div>

          {/* URL Preview */}
          {url && isValidUrl && (
            <div className="p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
              <h4 className="text-xs font-medium text-green-400 mb-2">Link Preview</h4>
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 bg-green-400/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Link2 className="w-4 h-4 text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-foreground text-sm break-words">
                    {title || 'Link Preview'}
                  </h5>
                  <p className="text-xs text-green-400 break-all">
                    {url}
                  </p>
                  {description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 break-words">
                      {description}
                    </p>
                  )}
                </div>
                <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              </div>
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-foreground">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give this link a descriptive title..."
              className="w-full px-3 py-2.5 bg-surface-light border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-400 transition-all text-foreground placeholder-muted-foreground text-sm"
              maxLength={100}
            />
            <div className="text-xs text-muted-foreground text-right">
              {title.length}/100 characters
            </div>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-foreground">
              Description <span className="text-muted-foreground">(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add context about why this link is relevant to your project..."
              className="w-full px-3 py-2.5 bg-surface-light border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-400 transition-all resize-none text-foreground placeholder-muted-foreground leading-relaxed text-sm"
              rows={3}
              maxLength={300}
            />
            <div className="text-xs text-muted-foreground text-right">
              {description.length}/300 characters
            </div>
          </div>

          {/* Tags Input */}
          <div className="space-y-2">
            <label htmlFor="tags" className="block text-sm font-medium text-foreground">
              Tags <span className="text-muted-foreground">(optional)</span>
            </label>
            
            {/* Current Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-400/10 text-green-400 border border-green-400/20 rounded-full text-xs"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:bg-green-400/20 rounded-full p-0.5 transition-colors"
                      aria-label={`Remove ${tag} tag`}
                    >
                      <X className="w-2.5 h-2.5" />
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
                  className="flex-1 px-3 py-2 bg-surface-light border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-400 transition-all text-foreground placeholder-muted-foreground text-xs"
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

          {/* Helpful tip */}
          <div className="p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-green-400">💡 Pro tip:</span> Great link logs include articles, 
              tools, inspiration, or resources that influenced your project. Add context to help others understand the connection!
            </p>
          </div>
      </form>
    </div>
  )
}
