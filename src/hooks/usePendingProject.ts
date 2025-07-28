'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { createProject, upsertUser } from '../lib/database'
import { useRouter } from 'next/navigation'

interface PendingProjectData {
  name: string
  description: string
  visibility: 'public' | 'private'
}

export function usePendingProject() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const createPendingProject = async () => {
      // Only proceed if user is authenticated and not loading
      if (loading || !user) return

      try {
        console.log('User authenticated, creating/updating user record:', user)
        
        // Ensure user exists in database
        await upsertUser({
          id: user.id,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
          email: user.email || '',
          avatar_url: user.user_metadata?.avatar_url || undefined,
        })

        console.log('User record created/updated successfully')

        // Check for pending project data
        const pendingDataString = localStorage.getItem('pendingProjectData')
        if (!pendingDataString) return

        const pendingData: PendingProjectData = JSON.parse(pendingDataString)
        
        console.log('Creating pending project:', pendingData)
        
        // Create the project
        const project = await createProject({
          title: pendingData.name.trim(),
          description: pendingData.description.trim() || undefined,
          is_public: pendingData.visibility === 'public'
        }, user.id)
        
        // Clear the pending data
        localStorage.removeItem('pendingProjectData')
        
        console.log('Pending project created successfully:', project)
        
        // Refresh the page to show the new project
        window.location.reload()
        
      } catch (error) {
        console.error('Error creating pending project or user:', error)
        // Keep the data in localStorage for retry
      }
    }

    createPendingProject()
  }, [loading, user])
}
