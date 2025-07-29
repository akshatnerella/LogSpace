'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabaseClient'
import { HomeLayout } from '@/components/home/HomeLayout'
import { usePendingProject } from '@/hooks/usePendingProject'
import { fetchUserProjects, fetchUserProjectsWithCollaborators } from '@/lib/queries'
import { Project } from '@/types/database'

export function HomeClient() {
  const { user, loading: authLoading } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  // Handle any pending project creation after authentication
  usePendingProject()

  // Fetch user's projects
  useEffect(() => {
    async function loadProjects() {
      if (!authLoading && user?.id) {
        try {
          console.log('Fetching projects for user:', user.id)
          
          // Simple direct query to debug
          const { data: debugProjects, error: debugError } = await supabase
            .from('projects')
            .select('*')
            .eq('created_by', user.id)
          
          console.log('Debug direct query result:', { debugProjects, debugError })
          
          const userProjects = await fetchUserProjectsWithCollaborators()
          console.log('Fetched projects with collaborators:', userProjects)
          setProjects(userProjects)
        } catch (error) {
          console.error('Error fetching projects:', error)
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
          <p className="text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Redirect to home if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Access Denied</h2>
          <p className="text-text-secondary mb-4">Please sign in to view your home.</p>
          <Link 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return <HomeLayout projects={projects} loading={loading} />
}
