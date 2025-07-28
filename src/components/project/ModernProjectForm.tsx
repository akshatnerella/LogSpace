'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createProject } from '@/lib/queries'
import { Button } from '../Button'
import { Plus, Eye, Lock, Sparkles, CheckCircle } from 'lucide-react'
import { VisibilityToggle } from './VisibilityToggle'

interface FormData {
  name: string
  description: string
  visibility: 'public' | 'private'
}

interface FormErrors {
  name?: string
  general?: string
}

interface ModernProjectFormProps {
  onAuthRequired: (projectData: FormData) => void
  isAuthenticated: boolean
}

export function ModernProjectForm({ onAuthRequired, isAuthenticated }: ModernProjectFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    visibility: 'public'
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  
  const nameInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Auto-focus and progressive reveal
  useEffect(() => {
    const timer = setTimeout(() => {
      nameInputRef.current?.focus()
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Progress through steps
  useEffect(() => {
    if (formData.name.trim().length >= 3 && currentStep === 0) {
      setCurrentStep(1)
    }
  }, [formData.name, currentStep])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Give your project a name!'
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Make it at least 3 characters'
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Keep it under 50 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    if (!isAuthenticated) {
      onAuthRequired(formData)
      return
    }
    
    setIsSubmitting(true)
    setErrors({})
    
    try {
      const project = await createProject({
        title: formData.name.trim(),
        description: formData.description.trim() || undefined,
        visibility: formData.visibility
      })
      
      if (!project) {
        throw new Error('Failed to create project')
      }
      
      router.push(`/project/${project.id}`)
      
    } catch (error: any) {
      console.error('Error creating project:', error)
      setErrors({ 
        general: error.message || 'Something went wrong. Let\'s try again!' 
      })
      setIsSubmitting(false)
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.5, 
        ease: [0.23, 1, 0.32, 1] as any
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.95,
      transition: { duration: 0.3 }
    }
  }

  const isFormValid = formData.name.trim().length >= 3

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* General Error */}
      <AnimatePresence>
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-sm"
          >
            <p className="text-red-400 text-sm font-medium">{errors.general}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Project Name */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="group"
        >
          <motion.div 
            className={`relative bg-surface/50 backdrop-blur-xl border-2 rounded-xl p-4 sm:p-5 transition-all duration-300 ${
              focusedField === 'name' 
                ? 'border-primary shadow-xl shadow-primary/20 bg-surface/80' 
                : 'border-border hover:border-border-hover hover:bg-surface/70'
            }`}
            whileHover={{ scale: focusedField === 'name' ? 1 : 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xs">1</span>
              </div>
              <div>
                <label htmlFor="name" className="block text-base font-semibold text-foreground">
                  Project Name
                </label>
                <p className="text-xs text-text-secondary">Make it memorable!</p>
              </div>
            </div>
            
            <input
              ref={nameInputRef}
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, name: e.target.value }))
                if (errors.name) setErrors(prev => ({ ...prev, name: undefined }))
              }}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              placeholder="e.g., AI Resume Bot"
              className="w-full px-0 py-2 bg-transparent border-0 text-lg sm:text-xl font-bold text-foreground placeholder-text-secondary/60 focus:outline-none focus:ring-0"
              maxLength={50}
            />
            
            <div className="flex items-center justify-between mt-2">
              <AnimatePresence>
                {errors.name && (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-red-400 text-xs font-medium"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
              
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-medium ${
                  formData.name.length > 40 ? 'text-amber-400' : 'text-text-secondary'
                }`}>
                  {formData.name.length}/50
                </span>
                {formData.name.trim().length >= 3 && (
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-green-400"
                  >
                    <CheckCircle className="w-3 h-3" />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Step 2: Description (appears after name is valid) */}
        <AnimatePresence>
          {currentStep >= 1 && (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="group"
            >
              <motion.div 
                className={`relative bg-surface/50 backdrop-blur-xl border-2 rounded-xl p-4 sm:p-5 transition-all duration-300 ${
                  focusedField === 'description' 
                    ? 'border-accent shadow-xl shadow-accent/20 bg-surface/80' 
                    : 'border-border hover:border-border-hover hover:bg-surface/70'
                }`}
                whileHover={{ scale: focusedField === 'description' ? 1 : 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="flex items-center mb-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-accent to-primary rounded-lg flex items-center justify-center mr-2">
                    <span className="text-white font-bold text-xs">2</span>
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-base font-semibold text-foreground">
                      Short Description
                    </label>
                    <p className="text-xs text-text-secondary">What&apos;s this project about?</p>
                  </div>
                </div>
                
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  onFocus={() => setFocusedField('description')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Building something awesome..."
                  rows={2}
                  maxLength={200}
                  className="w-full px-0 py-2 bg-transparent border-0 text-sm sm:text-base text-foreground placeholder-text-secondary/60 focus:outline-none focus:ring-0 resize-none"
                />
                
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-text-secondary">
                    Don&apos;t worry — you can update this later.
                  </p>
                  <span className={`text-xs font-medium ${
                    formData.description.length > 160 ? 'text-amber-400' : 'text-text-secondary'
                  }`}>
                    {formData.description.length}/200
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3: Visibility (appears after name is valid) */}
        <AnimatePresence>
          {currentStep >= 1 && (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ delay: 0.2 }}
            >
              <VisibilityToggle
                value={formData.visibility}
                onChange={(visibility: 'public' | 'private') => setFormData(prev => ({ ...prev, visibility }))}
                onFocus={() => setFocusedField('visibility')}
                onBlur={() => setFocusedField(null)}
                focused={focusedField === 'visibility'}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions - Sticky on mobile */}
        <AnimatePresence>
          {currentStep >= 1 && (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ delay: 0.4 }}
              className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border sm:relative sm:bottom-auto sm:left-auto sm:right-auto sm:p-0 sm:bg-transparent sm:backdrop-blur-none sm:border-t-0 sm:pt-4"
            >
              <div className="max-w-2xl mx-auto">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full group min-h-[48px] text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  disabled={isSubmitting || !isFormValid}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Creating your project...
                    </>
                  ) : isAuthenticated ? (
                    <>
                      <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                      Create Project
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                      Sign in to Create Project
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-text-secondary text-center mt-2 sm:hidden">
                  {isAuthenticated ? 'Ready to create!' : 'We\'ll sign you in first'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  )
}
