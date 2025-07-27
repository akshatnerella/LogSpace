'use client'

import { notFound, useRouter } from 'next/navigation'
import { ProjectAdminPage } from '@/components/project/ProjectAdminPage'
import { useEffect, useState } from 'react'

// Mock data - replace with real data fetching
const getProject = (slug: string) => {
  const projects = [
    {
      id: '1',
      name: 'My Awesome Project',
      description: 'Building the next generation of productivity tools with a focus on simplicity and power.',
      slug: 'my-awesome-project',
      visibility: 'public' as const,
      createdAt: '2025-01-10',
      logCount: 0,
      status: 'active' as const
    }
  ]
  
  return projects.find(p => p.slug === slug)
}

interface AdminPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function AdminPage({ params }: AdminPageProps) {
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      const { slug } = await params
      const projectData = getProject(slug)
      
      if (!projectData) {
        notFound()
      }
      
      setProject(projectData)
      setLoading(false)
    }
    
    fetchProject()
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!project) {
    notFound()
  }

  const handleBack = () => {
    router.push(`/project/${project.slug}`)
  }

  return (
    <ProjectAdminPage 
      project={project} 
      onBack={handleBack}
    />
  )
}
