'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabaseClient'
import { HomeLayout } from '@/components/home/HomeLayout'
import { SignInModal } from '@/components/auth/SignInModal'
import { usePendingProject } from '@/hooks/usePendingProject'
import { fetchUserProjectsWithCollaborators } from '@/lib/queries'
import { debugDatabaseConnection, ensureUserExists } from '@/lib/userManagement'
import { Project } from '@/types/database'

export function HomeClient() {
  const { user, loading: authLoading } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showSignInModal, setShowSignInModal] = useState(false)

  // Handle any pending project creation after authentication
  usePendingProject()

  // Fetch user's projects
  useEffect(() => {
    async function loadProjects() {
      if (!authLoading && user?.id) {
        try {
          console.log('=== STARTING PROJECT FETCH FOR USER ===', user.id)
          
          // Debug database connection first
          await debugDatabaseConnection()
          
          // Ensure user exists in database
          const dbUser = await ensureUserExists()
          console.log('Database user:', dbUser?.id)
          
          // Now fetch projects
          const userProjects = await fetchUserProjectsWithCollaborators()
          console.log('Final projects result:', userProjects)
          setProjects(userProjects)
        } catch (error) {
          console.error('Error in loadProjects:', error)
        } finally {
          setLoading(false)
        }
      } else if (!user) {
        setLoading(false)
      }
    }

    loadProjects()
  }, [user, authLoading])

  // Refresh projects when page becomes visible (e.g., when navigating back from project creation)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.id) {
        console.log('Page became visible, refreshing projects...')
        // Re-fetch projects
        const refreshProjects = async () => {
          try {
            console.log('=== REFRESHING PROJECTS FOR USER ===', user.id)
            await debugDatabaseConnection()
            const dbUser = await ensureUserExists()
            console.log('Database user during refresh:', dbUser?.id)
            
            const userProjects = await fetchUserProjectsWithCollaborators()
            console.log('Refreshed projects:', userProjects)
            setProjects(userProjects)
          } catch (error) {
            console.error('Error refreshing projects:', error)
          }
        }
        refreshProjects()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [user])

  // Show loading state while authenticating
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Redirect to home if not authenticated
  if (!user) {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">Please sign in to view your home.</p>
            <button 
              onClick={() => setShowSignInModal(true)}
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
        
        <SignInModal 
          isOpen={showSignInModal} 
          onClose={() => setShowSignInModal(false)} 
        />
      </>
    )
  }

  return <HomeLayout projects={projects} loading={loading} />
}
