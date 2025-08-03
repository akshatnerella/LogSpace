"use client"

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, Video, Camera, Plus } from 'lucide-react'

interface VisualLogFormProps {
  projectId: string
  onBack: () => void
  onSubmit: (data: { files: File[]; title: string; description: string; tags: string[] }) => void
  isSubmitting?: boolean
}

interface UploadedFile {
  file: File
  preview: string
  type: 'image' | 'video'
}

export function VisualLogForm({ projectId, onBack, onSubmit, isSubmitting = false }: VisualLogFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const createFilePreview = useCallback((file: File): UploadedFile => {
    const preview = URL.createObjectURL(file)
    const type = file.type.startsWith('image/') ? 'image' : 'video'
    return { file, preview, type }
  }, [])

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newFiles: UploadedFile[] = []
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        newFiles.push(createFilePreview(file))
      }
    })

    setUploadedFiles(prev => [...prev, ...newFiles].slice(0, 5)) // Limit to 5 files
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview) // Clean up preview URL
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
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
    if (uploadedFiles.length === 0 || !title.trim() || isSubmitting) return
    
    try {
      await onSubmit({ 
        files: uploadedFiles.map(f => f.file), 
        title: title.trim(),
        description: description.trim(),
        tags: tags
      })
    } catch (error) {
      console.error('Error submitting visual log:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="p-4 space-y-4">
      <form id="visual-log-form" onSubmit={handleSubmit} className="space-y-4">
        {/* File Upload Area */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Upload Images/Videos *
          </label>
          
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-lg p-4 text-center transition-all duration-300
              ${isDragOver 
                ? 'border-purple-400 bg-purple-400/5' 
                : 'border-border-light hover:border-border-hover hover:bg-surface-light/50'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              aria-label="Upload files"
            />

            <div className="space-y-3">
              <div className="w-8 h-8 bg-purple-400/10 rounded-lg mx-auto flex items-center justify-center">
                <Upload className="w-4 h-4 text-purple-400" />
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Drop files or click to browse
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  JPG, PNG, GIF, WebP, MP4, MOV, AVI, WebM
                </p>
                <p className="text-xs text-muted-foreground">
                  Max 5 files • Up to 10MB each
                </p>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 min-h-[32px] text-sm bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
              >
                <Camera className="w-3 h-3 mr-2 inline" />
                Choose Files
              </button>
            </div>
          </div>

          {/* Uploaded Files Preview */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">
                Uploaded Files ({uploadedFiles.length}/5)
              </h4>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {uploadedFiles.map((uploadedFile, index) => (
                  <div
                    key={index}
                    className="relative bg-surface-light border border-border-light rounded-lg overflow-hidden group"
                  >
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1.5 right-1.5 z-10 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors duration-200"
                      aria-label="Remove file"
                    >
                      <X className="w-3 h-3" />
                    </button>

                    {/* File preview */}
                    <div className="aspect-square bg-surface">
                      {uploadedFile.type === 'image' ? (
                        <img
                          src={uploadedFile.preview}
                          alt="Upload preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={uploadedFile.preview}
                          className="w-full h-full object-cover"
                          controls
                        />
                      )}
                    </div>

                    {/* File info */}
                    <div className="p-2">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {uploadedFile.type === 'image' ? (
                          <ImageIcon className="w-3 h-3 text-purple-400" />
                        ) : (
                          <Video className="w-3 h-3 text-purple-400" />
                        )}
                        <span className="text-xs font-medium text-foreground truncate">
                          {uploadedFile.file.name}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(uploadedFile.file.size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Title Input */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-foreground">
            Title *
          </label>
          <input
            id="title"
            type="text"
            placeholder="Give your visual log a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2.5 bg-surface-light border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/20 focus:border-purple-400 transition-all text-foreground placeholder-muted-foreground text-sm"
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
            placeholder="Add context, describe what's happening, or share your thoughts..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 bg-surface-light border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/20 focus:border-purple-400 transition-all resize-none text-foreground placeholder-muted-foreground leading-relaxed text-sm"
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
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-400/10 text-purple-400 border border-purple-400/20 rounded-full text-xs"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:bg-purple-400/20 rounded-full p-0.5 transition-colors"
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
                className="flex-1 px-3 py-2 bg-surface-light border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/20 focus:border-purple-400 transition-all text-foreground placeholder-muted-foreground text-xs"
                maxLength={20}
              />
              <button
                type="button"
                onClick={() => addTag()}
                disabled={!newTag.trim()}
                className="px-3 py-2 min-h-[32px] text-xs bg-transparent hover:bg-surface-light border border-border-light rounded-lg transition-colors text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Add tag"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground">
            {tags.length}/5 tags • Press Enter or click + to add
          </div>
        </div>

        {/* Helpful tip */}
        <div className="p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-purple-400">💡 Pro tip:</span> Visual logs are perfect for showing progress, 
            before/after comparisons, or design iterations. Make sure you have rights to share these files!
          </p>
        </div>
      </form>
    </div>
  )
}
