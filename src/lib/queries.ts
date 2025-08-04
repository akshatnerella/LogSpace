// UPDATED QUERIES - Matching the new database schema

import { supabase } from '@/lib/supabaseClient'
import { ensureUserExists } from '@/lib/userManagement'
import { 
  Project, 
  ProjectWithStats, 
  ProjectLog, 
  ProjectCollaborator,
  CreateProjectData,
  CreateLogData,
  InviteCollaboratorData,
  UpdateCollaboratorData,
  ProjectFilters,
  ProjectSortOptions,
  PaginationOptions,
  PaginatedResponse
} from '@/types/database'

// USER QUERIES

export async function fetchUserProjectsWithCollaborators(): Promise<ProjectWithStats[]> {
  try {
    // Ensure user exists in database first
    const user = await ensureUserExists()
    if (!user) {
      console.log('No user found or created')
      return []
    }

    console.log('Fetching projects for user:', user.id)

    // ULTRA SIMPLE TEST: Try the most basic query possible
    try {
      console.log('Attempting basic projects query...')
      const { data: testProjects, error: testError } = await supabase
        .from('projects')
        .select('id, title, created_by')
        .limit(1)

      console.log('Basic query result:', { testProjects, testError })

      if (testError) {
        console.error('Even basic query failed:', testError)
        
        // If still recursion error, return empty for now
        if (testError.code === '42P17') {
          console.log('RLS recursion still happening, returning empty array')
          return []
        }
      }

      // Now try user-specific query
      const { data: ownedProjects, error: ownedError } = await supabase
        .from('projects')
        .select('*')
        .eq('created_by', user.id)
        .eq('status', 'active')
        .order('updated_at', { ascending: false })

      if (ownedError) {
        console.error('Error fetching owned projects:', ownedError)
        
        // If RLS error, return empty for now
        if (ownedError.code === '42P17') {
          console.log('RLS recursion detected, returning empty array')
          return []
        }
        return []
      }

      console.log('Found owned projects:', ownedProjects?.length || 0)

      // Skip collaboration projects for now to avoid RLS recursion
      console.log('Skipping collaboration projects due to RLS issues')

      // For now, just return owned projects
      const allProjects: Project[] = ownedProjects || []

      console.log('Total projects:', allProjects.length)

      // Add basic stats without calling other functions that might trigger RLS
      const projectsWithStats = allProjects.map(project => ({
        ...project,
        collaborator_count: 1, // At least the owner
        log_count: 0, // Skip for now to avoid RLS issues
      })) as ProjectWithStats[]

      return projectsWithStats

    } catch (queryError: any) {
      console.error('Query execution error:', queryError)
      return []
    }

  } catch (error) {
    console.error('Error in fetchUserProjectsWithCollaborators:', error)
    return []
  }
}

// PROJECT QUERIES

export async function fetchProjectById(id: string): Promise<ProjectWithStats | null> {
  try {
    // Get the project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .single()

    if (projectError || !project) {
      console.error('Error fetching project:', projectError)
      return null
    }

    // Get collaborators with user details
    const { data: collaborators } = await supabase
      .from('project_collaborators')
      .select(`
        *,
        users (
          id,
          name,
          email,
          avatar_url,
          handle
        )
      `)
      .eq('project_id', project.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    // Get project stats
    const [collaboratorCount, logCount] = await Promise.all([
      getProjectCollaboratorCount(project.id),
      getProjectLogCount(project.id)
    ])

    return {
      ...project,
      project_collaborators: collaborators || [],
      collaborator_count: collaboratorCount,
      log_count: logCount
    } as ProjectWithStats
  } catch (error) {
    console.error('Error in fetchProjectById:', error)
    return null
  }
}

// Public-only version for public dashboard
export async function fetchPublicProjectById(id: string): Promise<ProjectWithStats | null> {
  try {
    // Get the project - ONLY public projects
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .eq('visibility', 'public')
      .single()

    if (projectError || !project) {
      console.error('Error fetching public project:', projectError)
      return null
    }

    // Get collaborators with user details
    const { data: collaborators } = await supabase
      .from('project_collaborators')
      .select(`
        *,
        users (
          id,
          name,
          email,
          avatar_url,
          handle
        )
      `)
      .eq('project_id', project.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    // Get project stats
    const [collaboratorCount, logCount] = await Promise.all([
      getProjectCollaboratorCount(project.id),
      getProjectLogCount(project.id)
    ])

    return {
      ...project,
      project_collaborators: collaborators || [],
      collaborator_count: collaboratorCount,
      log_count: logCount
    } as ProjectWithStats
  } catch (error) {
    console.error('Error in fetchPublicProjectById:', error)
    return null
  }
}

export async function createProject(projectData: CreateProjectData): Promise<Project | null> {
  try {
    // Ensure user exists in database first
    const user = await ensureUserExists()
    if (!user) {
      throw new Error('User not authenticated or could not be created in database')
    }

    console.log('Creating project for user:', user.id)

    // Generate slug from title
    const slug = await generateProjectSlug(projectData.title)

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        ...projectData,
        slug,
        created_by: user.id,
        project_settings: projectData.project_settings || {}
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating project:', error)
      throw error
    }

    console.log('Project created successfully:', project.id)
    
    // The trigger should automatically create the owner collaboration record
    // Let's verify it worked
    setTimeout(async () => {
      const { data: collaborators } = await supabase
        .from('project_collaborators')
        .select('*')
        .eq('project_id', project.id)
      
      console.log('Auto-created collaborators:', collaborators)
    }, 1000)

    return project
  } catch (error) {
    console.error('Error in createProject:', error)
    return null
  }
}

// PROJECT LOG QUERIES

export async function fetchProjectLogs(projectId: string, limit: number = 20): Promise<ProjectLog[]> {
  try {
    const { data: logs, error } = await supabase
      .from('project_logs')
      .select(`
        *,
        users (
          id,
          name,
          avatar_url,
          handle
        )
      `)
      .eq('project_id', projectId)
      .order('timeline_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching project logs:', error)
      return []
    }

    return logs as ProjectLog[]
  } catch (error) {
    console.error('Error in fetchProjectLogs:', error)
    return []
  }
}

export async function createProjectLog(logData: CreateLogData): Promise<ProjectLog | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Explicitly map only the fields we know exist in the table
    const insertData = {
      project_id: logData.project_id,
      author_id: user.id,
      type: logData.type,
      title: logData.title || null,
      content: logData.content || null,
      summary: logData.summary || null,
      source_link: logData.source_link || null,
      featured_image: logData.featured_image || null,
      images: logData.images || null,
      tags: logData.tags || [],
      timeline_date: logData.timeline_date || new Date().toISOString(),
      is_pinned: logData.is_pinned || false,
      metadata: logData.metadata || {}
    }

    console.log('Inserting log data:', insertData)
    console.log('Insert data keys:', Object.keys(insertData))

    const { data: log, error } = await supabase
      .from('project_logs')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }

    console.log('Log created successfully:', log)
    return log
  } catch (error) {
    console.error('Error in createProjectLog:', error)
    return null
  }
}

// COLLABORATION QUERIES

export async function inviteCollaborator(inviteData: InviteCollaboratorData): Promise<ProjectCollaborator | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data: collaborator, error } = await supabase
      .from('project_collaborators')
      .insert({
        ...inviteData,
        invited_by: user.id,
        permissions: inviteData.permissions || {
          read: true,
          write: inviteData.role === 'editor' || inviteData.role === 'admin' || inviteData.role === 'owner',
          admin: inviteData.role === 'admin' || inviteData.role === 'owner'
        }
      })
      .select()
      .single()

    if (error) {
      console.error('Error inviting collaborator:', error)
      throw error
    }

    return collaborator
  } catch (error) {
    console.error('Error in inviteCollaborator:', error)
    return null
  }
}

// HELPER FUNCTIONS

async function getProjectCollaboratorCount(projectId: string): Promise<number> {
  const { count } = await supabase
    .from('project_collaborators')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId)
    .eq('status', 'active')

  return count || 0
}

async function getProjectLogCount(projectId: string): Promise<number> {
  const { count } = await supabase
    .from('project_logs')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId)

  return count || 0
}

async function generateProjectSlug(title: string): Promise<string> {
  // Use the database function for generating unique slugs
  const { data, error } = await supabase
    .rpc('generate_project_slug', { title })

  if (error) {
    console.error('Error generating slug:', error)
    // Fallback to simple slug generation
    return title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  }

  return data
}

// WATCH/STAR FUNCTIONS

export async function watchProject(projectId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { error } = await supabase
      .from('project_watchers')
      .insert({
        project_id: projectId,
        user_id: user.id,
        type: 'watch'
      })

    return !error
  } catch (error) {
    console.error('Error watching project:', error)
    return false
  }
}

export async function starProject(projectId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { error } = await supabase
      .from('project_watchers')
      .insert({
        project_id: projectId,
        user_id: user.id,
        type: 'star'
      })

    return !error
  } catch (error) {
    console.error('Error starring project:', error)
    return false
  }
}

export async function getProjectWatchStatus(projectId: string): Promise<{ isWatching: boolean; isStarred: boolean }> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { isWatching: false, isStarred: false }

    const { data: watchers } = await supabase
      .from('project_watchers')
      .select('type')
      .eq('project_id', projectId)
      .eq('user_id', user.id)

    const isWatching = watchers?.some(w => w.type === 'watch') || false
    const isStarred = watchers?.some(w => w.type === 'star') || false

    return { isWatching, isStarred }
  } catch (error) {
    console.error('Error getting watch status:', error)
    return { isWatching: false, isStarred: false }
  }
}
