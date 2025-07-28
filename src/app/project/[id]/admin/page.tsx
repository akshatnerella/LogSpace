'use client'

import { notFound, useRouter } from 'next/navigation'
import { ProjectAdminPage } from '@/components/project/ProjectAdminPage'
import { useEffect, useState } from 'react'
import { fetchProjectById } from '@/lib/queries'

interface AdminPageProps {
  params: Promise<{
    id: string
  }>
}

export default function AdminPage({ params }: AdminPageProps) {
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      const { id } = await params
      const projectData = await fetchProjectById(id)
      
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
    router.push(`/project/${project.id}`)
  }

  return (
    <ProjectAdminPage 
      project={project} 
      onBack={handleBack}
    />
  )
}
