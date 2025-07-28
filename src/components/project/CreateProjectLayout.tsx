'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '../Button'
import { ModernProjectForm } from './ModernProjectForm'
import { SignInModal } from '../auth/SignInModal'

interface PendingProjectData {
  name: string
  description: string
  visibility: 'public' | 'private'
}

export function CreateProjectLayout() {
  const [showForm, setShowForm] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const [pendingProjectData, setPendingProjectData] = useState<PendingProjectData | null>(null)
  const router = useRouter()
  const { user, loading } = useAuth()
  
  const isAuthenticated = !!user

  // Show form with a slight delay for better UX
  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const handleBack = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 pt-6 sm:pt-8 pb-4"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-8 text-text-secondary hover:text-foreground group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Dashboard
          </Button>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="relative z-10 text-center mb-8 sm:mb-10"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center mb-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg mr-3"
            >
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </motion.div>
            <div className="text-left">
              <motion.h1 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight"
              >
                Put your work on the map.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                className="text-sm sm:text-base text-text-secondary mt-1 sm:mt-2"
              >
                Keep it simple. You can always tweak the details later.
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Form Section */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="relative z-10 pb-12"
          >
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
              <ModernProjectForm 
                onAuthRequired={(projectData) => {
                  setPendingProjectData(projectData)
                  setShowSignInModal(true)
                }}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Bottom Padding */}
      <div className="h-16 sm:hidden" />

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        redirectTo="/dashboard"
        pendingProjectData={pendingProjectData}
      />
    </div>
  )
}
