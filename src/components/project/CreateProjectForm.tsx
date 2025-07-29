"use client"

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { createProject } from '@/lib/queries'
import { Button } from '../Button'
import { ArrowLeft, Plus, Eye, Lock } from 'lucide-react'
import { SignInModal } from '../auth/SignInModal'

interface FormData {
  name: string
  description: string
  visibility: 'public' | 'private'
}

interface FormErrors {
  name?: string
  general?: string
}

export function CreateProjectForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    visibility: 'public'
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { user, loading } = useAuth()
  
  const isAuthenticated = !!user

  // Auto-focus on name field
  useEffect(() => {
    nameInputRef.current?.focus()
  }, [])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required'
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Project name must be at least 3 characters'
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Project name must be less than 50 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Show sign-in modal if not authenticated
      setShowSignInModal(true)
      return
    }
    
    setIsSubmitting(true)
    setErrors({})
    
    try {
      console.log('Creating project with data:', {
        title: formData.name.trim(),
        description: formData.description.trim() || undefined,
        visibility: formData.visibility
      })
      
      const project = await createProject({
        title: formData.name.trim(),
        description: formData.description.trim() || undefined,
        visibility: formData.visibility
      })
      
      console.log('Project creation result:', project)
      
      if (!project) {
        throw new Error('Failed to create project')
      }
      
      console.log('Redirecting to project:', `/project/${project.id}`)
      
      // Redirect to project page
      router.push(`/project/${project.id}`)
      
    } catch (error: any) {
      console.error('Error creating project:', error)
      setErrors({ 
        general: error.message || 'Failed to create project. Please try again.' 
      })
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="bg-surface border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg animate-scale-in">
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* General Error */}
        {errors.general && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Project Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-semibold text-foreground">
            Project Name *
          </label>
          <input
            ref={nameInputRef}
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, name: e.target.value }))
              if (errors.name) setErrors(prev => ({ ...prev, name: undefined }))
            }}
            placeholder="e.g. AI Resume Bot"
            className={`w-full px-4 py-3 sm:px-5 sm:py-4 bg-background border rounded-xl text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-base sm:text-lg font-medium ${
              errors.name ? 'border-red-500 focus:ring-red-500' : 'border-border hover:border-border-hover'
            }`}
            maxLength={50}
          />
          {errors.name && (
            <p className="text-red-500 text-sm animate-fade-in">{errors.name}</p>
          )}
          <p className="text-xs text-text-secondary">
            {formData.name.length}/50 characters
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-semibold text-foreground">
            Short Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="What's this project about?"
            rows={3}
            maxLength={200}
            className="w-full px-4 py-3 sm:px-5 sm:py-4 bg-background border border-border hover:border-border-hover rounded-xl text-foreground placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm sm:text-base resize-none"
          />
          <p className="text-xs text-text-secondary">
            {formData.description.length}/200 characters
          </p>
        </div>

        {/* Visibility */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground">
            Visibility
          </label>
          <div className="space-y-2">
            <label className="flex items-center p-3 sm:p-4 bg-background border border-border hover:border-border-hover rounded-xl cursor-pointer transition-all duration-200 group">
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={formData.visibility === 'public'}
                onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value as 'public' | 'private' }))}
                className="sr-only"
              />
              <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 mr-3 sm:mr-4 flex items-center justify-center transition-all duration-200 ${
                formData.visibility === 'public' ? 'border-primary bg-primary' : 'border-border group-hover:border-primary'
              }`}>
                {formData.visibility === 'public' && (
                  <div className="w-2 h-2 bg-background rounded-full" />
                )}
              </div>
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-primary mr-3" />
              <div className="flex-1">
                <div className="font-medium text-foreground text-sm sm:text-base">Public</div>
                <div className="text-xs sm:text-sm text-text-secondary">Anyone can see this project</div>
              </div>
            </label>

            <label className="flex items-center p-3 sm:p-4 bg-background border border-border hover:border-border-hover rounded-xl cursor-pointer transition-all duration-200 group">
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={formData.visibility === 'private'}
                onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value as 'public' | 'private' }))}
                className="sr-only"
              />
              <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 mr-3 sm:mr-4 flex items-center justify-center transition-all duration-200 ${
                formData.visibility === 'private' ? 'border-primary bg-primary' : 'border-border group-hover:border-primary'
              }`}>
                {formData.visibility === 'private' && (
                  <div className="w-2 h-2 bg-background rounded-full" />
                )}
              </div>
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-text-secondary mr-3" />
              <div className="flex-1">
                <div className="font-medium text-foreground text-sm sm:text-base">Private</div>
                <div className="text-xs sm:text-sm text-text-secondary">Only you can see this project</div>
              </div>
            </label>
          </div>
          <p className="text-xs text-text-secondary">
            You can change this later
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            className="flex-1 sm:flex-initial min-h-[48px] sm:min-h-[52px]"
            disabled={isSubmitting}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          
          {/* Conditional button - SignIn if not authenticated, Create Project if authenticated */}
          <Button
            type="submit"
            variant="primary"
            className="flex-1 sm:flex-initial group min-h-[48px] sm:min-h-[52px] px-6 sm:px-8 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={isSubmitting || !formData.name.trim()}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-background/30 border-t-background rounded-full animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Create Project
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        redirectTo="/create-project"
        pendingProjectData={{
          name: formData.name.trim(),
          description: formData.description.trim(),
          visibility: formData.visibility
        }}
      />
    </div>
  )
}
