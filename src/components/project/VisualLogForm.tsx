"use client"

import { useState, useRef, useCallback } from 'react'
import { ArrowLeft, Upload, X, Image as ImageIcon, Video, Send, Camera } from 'lucide-react'
import { Button } from '../Button'

interface VisualLogFormProps {
  projectId: string
  onBack: () => void
  onSubmit: (data: { files: File[]; caption: string }) => void
}

interface UploadedFile {
  file: File
  preview: string
  type: 'image' | 'video'
}

export function VisualLogForm({ projectId, onBack, onSubmit }: VisualLogFormProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [caption, setCaption] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const acceptedTypes = {
    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    'video/*': ['.mp4', '.mov', '.avi', '.webm']
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (uploadedFiles.length === 0 || isSubmitting) return

    setIsSubmitting(true)
    
    try {
      await onSubmit({ 
        files: uploadedFiles.map(f => f.file), 
        caption: caption.trim() 
      })
    } finally {
      setIsSubmitting(false)
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
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">
                  New Visual Log
                </h1>
                <p className="text-sm text-muted-foreground">
                  Share images, videos, or screenshots
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="space-y-6">
          {/* File Upload Area */}
          <div className="space-y-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
                ${isDragOver 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-border-hover hover:bg-surface/50'
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

              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-xl mx-auto flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Drop your files here, or click to browse
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Support for JPG, PNG, GIF, WebP, MP4, MOV, AVI, WebM
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Max 5 files • Up to 10MB each
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2.5 min-h-[44px]"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                </div>
              </div>
            </div>

            {/* Uploaded Files Preview */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground">
                  Uploaded Files ({uploadedFiles.length}/5)
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uploadedFiles.map((uploadedFile, index) => (
                    <div
                      key={index}
                      className="relative bg-surface border border-border rounded-lg overflow-hidden group"
                    >
                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-2 right-2 z-10 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors duration-200"
                        aria-label="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* File preview */}
                      <div className="aspect-video bg-surface-light">
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
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-1">
                          {uploadedFile.type === 'image' ? (
                            <ImageIcon className="w-4 h-4 text-purple-400" />
                          ) : (
                            <Video className="w-4 h-4 text-purple-400" />
                          )}
                          <span className="text-sm font-medium text-foreground truncate">
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

          {/* Caption Input */}
          <div className="space-y-2">
            <label htmlFor="caption" className="block text-sm font-medium text-foreground">
              Caption (Optional)
            </label>
            <textarea
              id="caption"
              placeholder="Add context, describe what's happening, or share your thoughts..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors duration-200 resize-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Help viewers understand what they&apos;re seeing
              </p>
              <span className="text-xs text-muted-foreground">
                {caption.length}/500
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-border">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">
                Your visual log will be visible to anyone following your project. 
                <span className="font-medium text-foreground"> Make sure you have the right to share these files!</span>
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
                disabled={uploadedFiles.length === 0 || isSubmitting}
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
