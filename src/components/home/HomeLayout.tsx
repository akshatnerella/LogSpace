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
  Lock,
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react'
import { Button } from '../Button'
import { useAuth } from '@/lib/auth'
import { Project } from '@/types/database'
import { generateSlug, formatRelativeTime } from '@/lib/utils'

interface HomeLayoutProps {
  projects: Project[]
  loading: boolean
}

type SidebarSection = 'projects' | 'activity' | 'settings'

export function HomeLayout({ projects, loading }: HomeLayoutProps) {
  const [activeSection, setActiveSection] = useState<SidebarSection>('projects')
  const [searchQuery, setSearchQuery] = useState('')
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [sortBy, setSortBy] = useState<'updated_at' | 'created_at' | 'title'>('updated_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [filterVisibility, setFilterVisibility] = useState<'all' | 'public' | 'private'>('all')
  const { user, signOut } = useAuth()

  const sidebarItems = [
    { id: 'projects' as const, icon: FolderOpen, label: 'Projects' },
    { id: 'activity' as const, icon: Activity, label: 'Activity' },
    { id: 'settings' as const, icon: Settings, label: 'Settings' }
  ]

  const filteredProjects = projects
    .filter(project => {
      // Search filter
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Visibility filter
      const matchesVisibility = filterVisibility === 'all' || project.visibility === filterVisibility
      
      return matchesSearch && matchesVisibility
    })
    .sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
        case 'updated_at':
        default:
          comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
          break
      }
      
      return sortOrder === 'desc' ? -comparison : comparison
    })

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
            <Link href="/home" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <img src="/logo.png" alt="LogSpace" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-semibold text-foreground">LogSpace</span>
            </Link>
          </div>

          {/* Center - Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Right side - Notifications and Profile */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button 
              className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-surface rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 text-muted-foreground hover:text-foreground hover:bg-surface rounded-lg transition-colors"
              >
                {user?.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user?.user_metadata?.full_name || 'User'}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      // Fallback to initials avatar if image fails to load
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                ) : null}
                <div className={`w-8 h-8 rounded-full bg-primary flex items-center justify-center text-background font-semibold text-sm ${user?.user_metadata?.avatar_url ? 'hidden' : ''}`}>
                  {user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || 
                   user?.email?.charAt(0)?.toUpperCase() || 
                   'U'}
                </div>
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
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                  
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-surface-light transition-colors"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  
                  <Link
                    href="/settings"
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-surface-light transition-colors"
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
                        : 'text-muted-foreground hover:text-foreground hover:bg-surface'
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
                  <p className="text-muted-foreground mt-1">
                    {searchQuery 
                      ? `${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''} found`
                      : `${projects.length} project${projects.length !== 1 ? 's' : ''} total`
                    }
                  </p>
                </div>
                
                {/* Filters and Sort */}
                <div className="flex items-center gap-2">
                  {/* Visibility Filter */}
                  <select
                    value={filterVisibility}
                    onChange={(e) => setFilterVisibility(e.target.value as 'all' | 'public' | 'private')}
                    className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    aria-label="Filter projects by visibility"
                  >
                    <option value="all">All Projects</option>
                    <option value="public">Public Only</option>
                    <option value="private">Private Only</option>
                  </select>
                  
                  {/* Sort Options */}
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-')
                      setSortBy(field as 'updated_at' | 'created_at' | 'title')
                      setSortOrder(order as 'asc' | 'desc')
                    }}
                    className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    aria-label="Sort projects"
                  >
                    <option value="updated_at-desc">Recently Updated</option>
                    <option value="created_at-desc">Recently Created</option>
                    <option value="title-asc">Name A-Z</option>
                    <option value="title-desc">Name Z-A</option>
                    <option value="created_at-asc">Oldest First</option>
                  </select>
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
                      className="w-full h-40 p-0 border-2 border-dashed border-border hover:border-primary/70 bg-transparent hover:bg-primary/5 transition-all duration-200 group relative overflow-hidden"
                    >
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-surface group-hover:bg-primary/10 flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                          <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="text-center">
                          <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                            Create New Project
                          </span>
                          <p className="text-xs text-muted-foreground/70 mt-1">
                            Start building something amazing
                          </p>
                        </div>
                      </div>
                      
                      {/* Subtle background pattern */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-200">
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent" />
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
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search terms or create a new project.
                    </p>
                  </div>
                ) : filteredProjects.length === 0 && !searchQuery ? (
                  // Empty state
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="col-span-full flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mb-4">
                        <FolderOpen className="w-10 h-10 text-primary" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-surface border-2 border-background rounded-full flex items-center justify-center">
                        <Plus className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Ready to start building?</h3>
                    <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
                      Create your first project to start building in public, track your progress, and share your journey with the world.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button href="/create-project" className="bg-primary hover:bg-primary/90 px-6 py-3">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Project
                      </Button>
                      <Button variant="ghost" className="px-6 py-3 text-muted-foreground hover:text-foreground">
                        Learn More
                      </Button>
                    </div>
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
                        className="block h-40 p-5 bg-surface border border-border rounded-lg hover:border-primary/50 hover:shadow-sm transition-all duration-200 group relative overflow-hidden"
                      >
                        <div className="flex flex-col justify-between h-full">
                          <div>
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1 flex-1">
                                {project.title}
                              </h3>
                              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3 overflow-hidden">
                              <span className="line-clamp-1 break-words leading-relaxed">
                                {project.description && project.description.length > 80 
                                  ? `${project.description.substring(0, 80)}...`
                                  : project.description || 'No description'
                                }
                              </span>
                            </p>
                          </div>

                          <div className="space-y-3">
                            {/* Collaborators Preview */}
                            {project.project_collaborators && project.project_collaborators.length > 0 && (
                              <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                  {project.project_collaborators.slice(0, 3).map((collaborator: any, idx: number) => (
                                    <div
                                      key={collaborator.id}
                                      className="relative"
                                      title={`${collaborator.users?.name || collaborator.users?.email} (${collaborator.role})`}
                                    >
                                      {collaborator.users?.avatar_url ? (
                                        <img
                                          src={collaborator.users.avatar_url}
                                          alt={collaborator.users.name || collaborator.users.email}
                                          className="w-6 h-6 rounded-full border-2 border-background object-cover"
                                        />
                                      ) : (
                                        <div className="w-6 h-6 rounded-full border-2 border-background bg-primary flex items-center justify-center text-background text-xs font-semibold">
                                          {collaborator.users?.name?.charAt(0)?.toUpperCase() || 
                                           collaborator.users?.email?.charAt(0)?.toUpperCase() || 
                                           'U'}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                  {project.project_collaborators.length > 3 && (
                                    <div 
                                      className="w-6 h-6 rounded-full border-2 border-background bg-text-secondary text-background flex items-center justify-center text-xs font-semibold"
                                      title={`+${project.project_collaborators.length - 3} more`}
                                    >
                                      +{project.project_collaborators.length - 3}
                                    </div>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {project.project_collaborators.length} {project.project_collaborators.length === 1 ? 'collaborator' : 'collaborators'}
                                </span>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {project.visibility === 'public' ? (
                                  <span className="flex items-center gap-1 px-2 py-1 border border-border text-muted-foreground rounded text-xs">
                                    <Globe className="w-3 h-3" />
                                    Public
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 px-2 py-1 border border-border text-muted-foreground rounded text-xs">
                                    <Lock className="w-3 h-3" />
                                    Private
                                  </span>
                                )}
                                <span className="px-2 py-1 border border-border text-muted-foreground rounded text-xs">
                                  Owner
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-4">
                                <Clock className="w-3 h-3" />
                                <span>Updated {formatRelativeTime(project.updated_at)}</span>
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
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Activity Feed</h3>
                <p className="text-muted-foreground">
                  Your recent activity will appear here.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="max-w-4xl">
              <h1 className="text-2xl font-semibold text-foreground mb-6">Settings</h1>
              <div className="bg-surface border border-border rounded-lg p-8 text-center">
                <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Settings</h3>
                <p className="text-muted-foreground">
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
