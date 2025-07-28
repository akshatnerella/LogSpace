'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FolderOpen, 
  Activity, 
  Settings, 
  Plus,
  Clock,
  Archive,
  ChevronRight,
  Search,
  Bell,
  LogOut,
  User,
  ChevronDown,
  Globe,
  Lock
} from 'lucide-react'
import { Button } from '../Button'
import { useAuth } from '@/lib/auth'
import { Project } from '@/types/database'
import { generateSlug, formatRelativeTime } from '@/lib/utils'

interface DashboardLayoutProps {
  projects: Project[]
  loading: boolean
}

type SidebarSection = 'projects' | 'activity' | 'settings'

export function DashboardLayout({ projects, loading }: DashboardLayoutProps) {
  const [activeSection, setActiveSection] = useState<SidebarSection>('projects')
  const [searchQuery, setSearchQuery] = useState('')
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const { user, signOut } = useAuth()

  const sidebarItems = [
    { id: 'projects' as const, icon: FolderOpen, label: 'Projects' },
    { id: 'activity' as const, icon: Activity, label: 'Activity' },
    { id: 'settings' as const, icon: Settings, label: 'Settings' }
  ]

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getProjectStatus = (project: Project) => {
    // You can customize this logic based on your needs
    return 'Active'
  }

  const handleSignOut = async () => {
    await signOut()
    setShowProfileMenu(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between h-full px-6">
          {/* Left side - Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-background font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-semibold text-foreground">LogSpace</span>
            </div>
          </div>

          {/* Center - Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-sm placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Right side - Notifications and Profile */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button 
              className="relative p-2 text-text-secondary hover:text-foreground hover:bg-surface rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 text-text-secondary hover:text-foreground hover:bg-surface rounded-lg transition-colors"
              >
                <img
                  src={user?.user_metadata?.avatar_url || "/default-avatar.png"}
                  alt={user?.user_metadata?.full_name || 'User'}
                  className="w-8 h-8 rounded-full"
                />
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-xl py-1 z-50"
                >
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-text-secondary truncate">
                      {user?.email}
                    </p>
                  </div>
                  
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-foreground hover:bg-surface-light transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  
                  <Link
                    href="/settings"
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-foreground hover:bg-surface-light transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                  
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-16 lg:w-64 border-r border-border bg-background/50 backdrop-blur-sm">
          <div className="p-4 lg:p-6">
            {/* Navigation */}
            <nav className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'text-text-secondary hover:text-foreground hover:bg-surface'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="hidden lg:block">{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 lg:p-8">
          {activeSection === 'projects' && (
            <div className="max-w-6xl">
              {/* Projects Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground">
                    {searchQuery ? `Search results for "${searchQuery}"` : 'Projects'}
                  </h1>
                  <p className="text-text-secondary mt-1">
                    {searchQuery 
                      ? `${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''} found`
                      : `${projects.length} project${projects.length !== 1 ? 's' : ''} total`
                    }
                  </p>
                </div>
                <Button href="/create-project" className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>New Project</span>
                </Button>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* New Project Tile - only show when not searching */}
                {!searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      href="/create-project"
                      variant="ghost"
                      className="w-full h-32 p-0 border-2 border-dashed border-border hover:border-primary/50 bg-transparent hover:bg-primary/5 transition-all duration-200 group"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <div className="w-10 h-10 rounded-full bg-surface group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                          <Plus className="w-5 h-5 text-text-secondary group-hover:text-primary" />
                        </div>
                        <span className="text-sm font-medium text-text-secondary group-hover:text-foreground">
                          New Project
                        </span>
                      </div>
                    </Button>
                  </motion.div>
                )}

                {/* Project Tiles */}
                {loading ? (
                  // Loading skeleton
                  Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: (i + 1) * 0.1 }}
                      className="h-32 bg-surface rounded-lg border border-border animate-pulse"
                    />
                  ))
                ) : filteredProjects.length === 0 && searchQuery ? (
                  // No search results
                  <div className="col-span-full text-center py-12">
                    <Search className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
                    <p className="text-text-secondary">
                      Try adjusting your search terms or create a new project.
                    </p>
                  </div>
                ) : filteredProjects.length === 0 && !searchQuery ? (
                  // Empty state
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="col-span-full flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4">
                      <FolderOpen className="w-8 h-8 text-text-secondary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No projects yet</h3>
                    <p className="text-text-secondary mb-6 max-w-sm">
                      Create your first project to start building in public and tracking your progress.
                    </p>
                    <Button href="/create-project" className="bg-primary hover:bg-primary/90">
                      Create Your First Project
                    </Button>
                  </motion.div>
                ) : (
                  filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: (searchQuery ? index : index + 1) * 0.1 }}
                    >
                      <Link
                        href={`/project/${project.id}`}
                        className="block h-32 p-4 bg-surface border border-border rounded-lg hover:border-primary/50 hover:shadow-sm transition-all duration-200 group"
                      >
                        <div className="flex flex-col justify-between h-full">
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1 flex-1">
                                {project.title}
                              </h3>
                              <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                            </div>
                            
                            <p className="text-sm text-text-secondary line-clamp-1 mb-3">
                              {project.description || 'No description'}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {project.visibility === 'public' ? (
                                  <div className="flex items-center gap-1 px-2 py-1 border border-border text-text-secondary rounded text-xs">
                                    <Globe className="w-3 h-3" />
                                    Public
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 px-2 py-1 border border-border text-text-secondary rounded text-xs">
                                    <Lock className="w-3 h-3" />
                                    Private
                                  </div>
                                )}
                                <div className="px-2 py-1 border border-border text-text-secondary rounded text-xs">
                                  Owner
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2 text-xs text-text-secondary">
                                <Clock className="w-3 h-3" />
                                <span>{formatRelativeTime(project.created_at)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeSection === 'activity' && (
            <div className="max-w-4xl">
              <h1 className="text-2xl font-semibold text-foreground mb-6">Activity</h1>
              <div className="bg-surface border border-border rounded-lg p-8 text-center">
                <Activity className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Activity Feed</h3>
                <p className="text-text-secondary">
                  Your recent activity will appear here.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="max-w-4xl">
              <h1 className="text-2xl font-semibold text-foreground mb-6">Settings</h1>
              <div className="bg-surface border border-border rounded-lg p-8 text-center">
                <Settings className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Settings</h3>
                <p className="text-text-secondary">
                  Manage your account and preferences.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close profile menu */}
      {showProfileMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </div>
  )
}
