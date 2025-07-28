'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabaseClient'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { usePendingProject } from '@/hooks/usePendingProject'
import { fetchUserProjects } from '@/lib/queries'
import { Project } from '@/types/database'

export function DashboardClient() {
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
          
          const { data: userProjects } = await fetchUserProjects()
          console.log('Fetched projects via fetchUserProjects:', userProjects)
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
          <p className="text-text-secondary mb-4">Please sign in to view your dashboard.</p>
          <Link 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  return <DashboardLayout projects={projects} loading={loading} />
}
