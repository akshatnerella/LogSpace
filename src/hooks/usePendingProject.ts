'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { createProject } from '@/lib/queries'
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
        console.log('User authenticated, checking for pending project data')

        // Check for pending project data
        const pendingDataString = localStorage.getItem('pendingProjectData')
        if (!pendingDataString) return

        const pendingData: PendingProjectData = JSON.parse(pendingDataString)
        
        console.log('Creating pending project:', pendingData)
        console.log('Current user:', user)
        
        // Create the project using the updated API
        const project = await createProject({
          title: pendingData.name.trim(),
          description: pendingData.description.trim() || undefined,
          visibility: pendingData.visibility
        })
        
        console.log('Project creation result:', project)
        
        // Clear the pending data
        localStorage.removeItem('pendingProjectData')
        
        console.log('Pending project created successfully, project ID:', project?.id)
        
        if (project) {
          // Navigate to the created project
          console.log('Navigating to project:', `/project/${project.id}`)
          router.push(`/project/${project.id}`)
        } else {
          // If creation failed, go to dashboard
          console.log('Project creation failed, going to dashboard')
          router.push('/dashboard')
        }
        
      } catch (error) {
        console.error('Error creating pending project:', error)
        // Keep the data in localStorage for retry
        // Navigate to dashboard anyway
        router.push('/dashboard')
      }
    }

    createPendingProject()
  }, [loading, user, router])
}
