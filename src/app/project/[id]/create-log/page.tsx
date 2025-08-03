"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogTypeSelector } from '@/components/project/LogTypeSelector'
import { TextLogForm } from '@/components/project/TextLogForm'
import { VisualLogForm } from '@/components/project/VisualLogForm'
import { createProjectLog } from '@/lib/queries'

interface CreateLogPageProps {
  params: Promise<{
    id: string
  }>
}

export default function CreateLogPage({ params }: CreateLogPageProps) {
  const [selectedType, setSelectedType] = useState<'text' | 'image' | 'url' | null>(null)
  const [showSelector, setShowSelector] = useState(true)
  const [projectId, setProjectId] = useState<string>('')
  const router = useRouter()

  // Extract id from params
  useEffect(() => {
    const getParams = async () => {
      const { id } = await params
      setProjectId(id)
    }
    getParams()
  }, [params])

  const handleSelectType = (type: 'text' | 'image' | 'url') => {
    setSelectedType(type)
    setShowSelector(false)
  }

  const handleBack = () => {
    if (selectedType) {
      setSelectedType(null)
      setShowSelector(true)
    } else {
      router.push(`/project/${projectId}`)
    }
  }

  const handleTextLogSubmit = async (data: { title: string; content: string }) => {
    try {
      console.log('Creating text log:', data)
      
      const logData = {
        project_id: projectId,
        type: 'text' as const,
        title: data.title,
        content: data.content,
        timeline_date: new Date().toISOString()
      }

      const result = await createProjectLog(logData)
      if (!result) {
        throw new Error('Failed to create log')
      }

      console.log('Text log created successfully:', result.id)
      
      // Redirect back to project
      router.push(`/project/${projectId}`)
    } catch (error) {
      console.error('Failed to create text log:', error)
      alert('Failed to publish log. Please try again.')
    }
  }

  const handleVisualLogSubmit = async (data: { files: File[]; caption: string }) => {
    try {
      // TODO: Upload files to backend API
      console.log('Visual log data:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Show success toast
      alert('Visual log published successfully!')
      
      // Redirect back to project
      router.push(`/project/${projectId}`)
    } catch (error) {
      console.error('Failed to create visual log:', error)
      alert('Failed to publish log. Please try again.')
    }
  }

  const handleCloseSelector = () => {
    router.push(`/project/${projectId}`)
  }

  // Don't render until we have the id
  if (!projectId) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
    </div>
  }

  // Show type selector
  if (showSelector) {
    return (
      <LogTypeSelector
        isOpen={true}
        onClose={handleCloseSelector}
        onSelectType={handleSelectType}
        projectId={projectId}
      />
    )
  }

  // Show specific log form based on selected type
  if (selectedType === 'text') {
    return (
      <TextLogForm
        projectId={projectId}
        onBack={handleBack}
        onSubmit={handleTextLogSubmit}
      />
    )
  }

  if (selectedType === 'image') {
    return (
      <VisualLogForm
        projectId={projectId}
        onBack={handleBack}
        onSubmit={handleVisualLogSubmit}
      />
    )
  }

  if (selectedType === 'url') {
    // TODO: Create URL form component
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">URL Log Coming Soon</h2>
          <button 
            onClick={handleBack}
            className="text-primary hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  // Default to selector
  return (
    <LogTypeSelector
      isOpen={true}
      onClose={handleCloseSelector}
      onSelectType={handleSelectType}
      projectId={projectId}
    />
  )
}
