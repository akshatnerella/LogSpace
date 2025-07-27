'use client'

import { useParams } from 'next/navigation'
import ProfilePage from '@/components/profile/ProfilePage'

// Mock data - replace with actual API calls
const getMockProfile = (handle: string) => {
  return {
    id: '1',
    name: 'Akshat Gupta',
    handle: handle,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    bio: 'Building the future of project logging and collaboration. Passionate about clean code and beautiful UIs.',
    website: 'https://akshat.dev',
    github: 'akshatgupta',
    joinedAt: new Date('2023-03-15'),
    stats: {
      totalProjects: 12,
      totalLogs: 156,
      views: 1247
    },
    projects: [
      {
        id: '1',
        title: 'LogSpace',
        description: 'A beautiful platform for documenting and sharing your project journey with the world.',
        slug: 'logspace',
        logCount: 23,
        isPublic: true,
        tags: ['React', 'Next.js', 'TypeScript'],
        lastUpdated: new Date('2025-01-20')
      },
      {
        id: '2',
        title: 'AI Resume Builder',
        description: 'Create professional resumes with AI assistance. Smart formatting and content suggestions.',
        slug: 'ai-resume-builder',
        logCount: 18,
        isPublic: true,
        tags: ['AI', 'React', 'Node.js', 'OpenAI'],
        lastUpdated: new Date('2025-01-18')
      },
      {
        id: '3',
        title: 'Task Manager Pro',
        description: 'A clean, minimal task management app with team collaboration features and time tracking.',
        slug: 'task-manager-pro',
        logCount: 31,
        isPublic: true,
        tags: ['Vue.js', 'Firebase', 'PWA'],
        lastUpdated: new Date('2025-01-15')
      },
      {
        id: '4',
        title: 'Weather Dashboard',
        description: 'Beautiful weather dashboard with location-based forecasts and interactive maps.',
        slug: 'weather-dashboard',
        logCount: 12,
        isPublic: true,
        tags: ['React', 'Weather API', 'Maps'],
        lastUpdated: new Date('2025-01-10')
      },
      {
        id: '5',
        title: 'Expense Tracker',
        description: 'Personal finance management with budgeting, expense categorization, and insightful analytics.',
        slug: 'expense-tracker',
        logCount: 27,
        isPublic: true,
        tags: ['React Native', 'SQLite', 'Charts'],
        lastUpdated: new Date('2025-01-05')
      }
    ]
  }
}

export default function ProfilePageRoute() {
  const params = useParams()
  const handle = params.handle as string
  
  // In a real app, you'd fetch the profile data based on the handle
  const profile = getMockProfile(handle)
  
  // Determine if this is the current user's profile
  // In a real app, you'd compare with the authenticated user
  const isOwnProfile = handle === 'akshat' // Mock check
  
  return (
    <ProfilePage 
      profile={profile} 
      isOwnProfile={isOwnProfile}
    />
  )
}
