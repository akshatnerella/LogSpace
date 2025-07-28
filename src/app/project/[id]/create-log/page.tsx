"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogTypeSelector } from '@/components/project/LogTypeSelector'
import { TextLogForm } from '@/components/project/TextLogForm'
import { VisualLogForm } from '@/components/project/VisualLogForm'

interface CreateLogPageProps {
  params: Promise<{
    id: string
  }>
}

export default function CreateLogPage({ params }: CreateLogPageProps) {
  const [selectedType, setSelectedType] = useState<'text' | 'visual' | 'code' | null>(null)
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

  const handleSelectType = (type: 'text' | 'visual' | 'code') => {
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
      // TODO: Send to backend API
      console.log('Text log data:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success toast (you can implement a toast system)
      alert('Text log published successfully!')
      
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

  if (selectedType === 'visual') {
    return (
      <VisualLogForm
        projectId={projectId}
        onBack={handleBack}
        onSubmit={handleVisualLogSubmit}
      />
    )
  }

  // For now, code type redirects back to selector since it's "coming soon"
  return (
    <LogTypeSelector
      isOpen={true}
      onClose={handleCloseSelector}
      onSelectType={handleSelectType}
      projectId={projectId}
    />
  )
}
