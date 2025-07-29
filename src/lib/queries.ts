// UPDATED QUERIES - Matching the new database schema

import { supabase } from '@/lib/supabaseClient'
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

// OPTIMIZED PROJECT QUERIES

export async function fetchProjectById(id: string): Promise<ProjectWithStats | null> {
  try {
    // First get the project
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
        users!inner(
          id,
          name,
          email,
          avatar_url
        )
      `)
      .eq('project_id', project.id)
      .eq('status', 'accepted')
      .order('created_at', { ascending: false })
      .limit(5)

    // Get recent logs with user details
    const { data: logs } = await supabase
      .from('project_logs')
      .select(`
        *,
        users(
          id,
          name,
          avatar_url
        )
      `)
      .eq('project_id', project.id)
      .order('created_at', { ascending: false })
      .limit(3)

    // Get total log count
    const { count: logCount } = await supabase
      .from('project_logs')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', project.id)

    const formattedProject: ProjectWithStats = {
      ...project,
      project_collaborators: collaborators || [],
      project_logs: logs || [],
      log_count: logCount || 0,
      collaborator_count: collaborators?.length || 0
    }

    return formattedProject
  } catch (error) {
    console.error('Error in fetchProjectById:', error)
    return null
  }
}

export async function fetchProjectBySlug(slug: string): Promise<ProjectWithStats | null> {
  try {
    // First get the project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
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
        users!inner(
          id,
          name,
          email,
          avatar_url
        )
      `)
      .eq('project_id', project.id)
      .eq('status', 'accepted')
      .order('created_at', { ascending: false })
      .limit(5)

    // Get recent logs with user details
    const { data: logs } = await supabase
      .from('project_logs')
      .select(`
        *,
        users(
          id,
          name,
          avatar_url
        )
      `)
      .eq('project_id', project.id)
      .order('created_at', { ascending: false })
      .limit(3)

    // Get total log count
    const { count: logCount } = await supabase
      .from('project_logs')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', project.id)

    const formattedProject: ProjectWithStats = {
      ...project,
      collaborator_count: collaborators?.length || 0,
      log_count: logCount || 0,
      last_activity: logs?.[0]?.created_at,
      collaborators: collaborators || [],
      recent_logs: logs || []
    }

    return formattedProject
  } catch (error) {
    console.error('Unexpected error fetching project:', error)
    return null
  }
}

export async function fetchUserProjectsWithCollaborators(): Promise<Project[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return []
    }

    // First get the user's projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('created_by', user.id)
      .eq('status', 'active')
      .order('updated_at', { ascending: false })

    if (projectsError) {
      console.error('Error fetching projects:', projectsError)
      console.error('Error details:', projectsError.details)
      console.error('Error hint:', projectsError.hint)
      console.error('Error message:', projectsError.message)
      return []
    }

    if (!projects || projects.length === 0) {
      return []
    }

    // Get collaborators for all projects (simplified query)
    const projectIds = projects.map(p => p.id)
    const { data: collaborators, error: collabError } = await supabase
      .from('project_collaborators')
      .select('*')
      .in('project_id', projectIds)
      .eq('status', 'accepted')

    if (collabError) {
      console.error('Error fetching collaborators:', collabError)
      console.error('Error details:', collabError.details)
      console.error('Error hint:', collabError.hint)
      console.error('Error message:', collabError.message)
      // Return projects without collaborator data rather than failing completely
      return projects.map(project => ({
        ...project,
        project_collaborators: []
      }))
    }

    // Get user details for collaborators
    let collaboratorsWithUsers = []
    if (collaborators && collaborators.length > 0) {
      const userIds = collaborators.map(c => c.user_id)
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, name, email, avatar_url')
        .in('id', userIds)

      if (usersError) {
        console.error('Error fetching user details:', usersError)
        // Still include collaborators without user details
        collaboratorsWithUsers = collaborators.map(collab => ({
          ...collab,
          users: null
        }))
      } else {
        // Combine collaborators with user data
        collaboratorsWithUsers = collaborators.map(collab => ({
          ...collab,
          users: users?.find(user => user.id === collab.user_id) || null
        }))
      }
    }

    // Combine projects with their collaborators
    const projectsWithCollaborators = projects.map(project => ({
      ...project,
      project_collaborators: collaboratorsWithUsers?.filter(collab => collab.project_id === project.id) || []
    }))

    return projectsWithCollaborators
  } catch (error) {
    console.error('Error in fetchUserProjectsWithCollaborators:', error)
    return []
  }
}

export async function fetchUserProjects(
  filters: ProjectFilters = {},
  sort: ProjectSortOptions = { field: 'updated_at', direction: 'desc' },
  pagination: PaginationOptions = { page: 1, limit: 20 }
): Promise<PaginatedResponse<Project>> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return {
        data: [],
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: 0,
          total_pages: 0,
          has_next: false,
          has_prev: false
        }
      }
    }

    let query = supabase
      .from('projects')
      .select('*', { count: 'exact' })

    // Filter by projects created by the user (simplified for now)
    query = query.eq('created_by', user.id)

    // Apply filters
    if (filters.visibility) {
      query = query.eq('visibility', filters.visibility)
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status)
    } else {
      query = query.eq('status', 'active')
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    // Apply sorting
    query = query.order(sort.field, { ascending: sort.direction === 'asc' })

    // Apply pagination
    const from = (pagination.page - 1) * pagination.limit
    const to = from + pagination.limit - 1
    query = query.range(from, to)

    const { data: projects, error, count } = await query

    if (error) {
      console.error('Error fetching user projects:', error)
      return {
        data: [],
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total: 0,
          total_pages: 0,
          has_next: false,
          has_prev: false
        }
      }
    }

    const total = count || 0
    const total_pages = Math.ceil(total / pagination.limit)

    return {
      data: projects || [],
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        total_pages,
        has_next: pagination.page < total_pages,
        has_prev: pagination.page > 1
      }
    }
  } catch (error) {
    console.error('Unexpected error fetching user projects:', error)
    return {
      data: [],
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: 0,
        total_pages: 0,
        has_next: false,
        has_prev: false
      }
    }
  }
}

// PROJECT COLLABORATION QUERIES

export async function fetchProjectCollaborators(projectId: string): Promise<ProjectCollaborator[]> {
  try {
    const { data: collaborators, error } = await supabase
      .from('project_collaborators')
      .select(`
        *,
        users!inner(
          id,
          name,
          email,
          avatar_url
        )
      `)
      .eq('project_id', projectId)
      .in('status', ['pending', 'accepted'])
      .order('role').order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching collaborators:', error)
      return []
    }

    return collaborators || []
  } catch (error) {
    console.error('Unexpected error fetching collaborators:', error)
    return []
  }
}

export async function inviteCollaborator(data: InviteCollaboratorData): Promise<ProjectCollaborator | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data: collaborator, error } = await supabase
      .from('project_collaborators')
      .insert({
        ...data,
        invited_by: user.id,
        status: 'pending'
      })
      .select(`
        *,
        users!inner(
          id,
          name,
          email,
          avatar_url
        )
      `)
      .single()

    if (error) {
      console.error('Error inviting collaborator:', error)
      return null
    }

    return collaborator
  } catch (error) {
    console.error('Unexpected error inviting collaborator:', error)
    return null
  }
}

export async function updateCollaborator(
  collaboratorId: string,
  data: UpdateCollaboratorData
): Promise<ProjectCollaborator | null> {
  try {
    const { data: collaborator, error } = await supabase
      .from('project_collaborators')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
        ...(data.status === 'accepted' ? { joined_at: new Date().toISOString() } : {})
      })
      .eq('id', collaboratorId)
      .select(`
        *,
        users!inner(
          id,
          name,
          email,
          avatar_url
        )
      `)
      .single()

    if (error) {
      console.error('Error updating collaborator:', error)
      return null
    }

    return collaborator
  } catch (error) {
    console.error('Unexpected error updating collaborator:', error)
    return null
  }
}

// PROJECT MANAGEMENT QUERIES

export async function createProject(data: CreateProjectData): Promise<Project | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    console.log('createProject - Current user:', user?.id)
    console.log('createProject - Project data:', data)
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Ensure user exists in users table first
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()
    
    if (userError && userError.code === 'PGRST116') {
      // User doesn't exist, create them
      console.log('createProject - Creating user record')
      const { error: insertUserError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
          email: user.email || '',
          avatar_url: user.user_metadata?.avatar_url
        })
      
      if (insertUserError) {
        console.error('Error creating user:', insertUserError)
        throw insertUserError
      }
    } else if (userError) {
      console.error('Error checking user:', userError)
      throw userError
    }

    // Generate unique slug from title
    let slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    // Check if slug already exists and make it unique
    let uniqueSlug = slug
    let counter = 1
    while (true) {
      const { data: existingProject } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', uniqueSlug)
        .single()
      
      if (!existingProject) break
      
      uniqueSlug = `${slug}-${counter}`
      counter++
    }

    const projectData = {
      title: data.title,
      description: data.description,
      visibility: data.visibility,
      tags: data.tags || [],
      project_settings: data.project_settings || {},
      created_by: user.id,
      slug: uniqueSlug,
      status: 'active'
    }
    
    console.log('createProject - Inserting project:', projectData)

    const { data: project, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single()

    if (error) {
      console.error('Error creating project:', error)
      console.error('Error details:', error.details)
      console.error('Error hint:', error.hint)
      console.error('Error message:', error.message)
      return null
    }

    console.log('createProject - Project created:', project)

    // Add creator as admin collaborator
    const collaboratorData = {
      project_id: project.id,
      user_id: user.id,
      role: 'admin',
      status: 'accepted',
      joined_at: new Date().toISOString()
    }
    
    console.log('createProject - Adding collaborator:', collaboratorData)
    
    const { error: collaboratorError } = await supabase
      .from('project_collaborators')
      .insert(collaboratorData)
      
    if (collaboratorError) {
      console.error('Error adding collaborator:', collaboratorError)
      // Don't fail the project creation if collaborator addition fails
    }

    console.log('createProject - Complete, returning project:', project)
    return project
  } catch (error) {
    console.error('Unexpected error creating project:', error)
    return null
  }
}

export async function createLog(data: CreateLogData): Promise<ProjectLog | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data: log, error } = await supabase
      .from('project_logs')
      .insert({
        ...data,
        user_id: user.id
      })
      .select(`
        *,
        users(
          id,
          name,
          avatar_url
        )
      `)
      .single()

    if (error) {
      console.error('Error creating log:', error)
      return null
    }

    return log
  } catch (error) {
    console.error('Unexpected error creating log:', error)
    return null
  }
}

// UTILITY FUNCTIONS

export async function checkProjectAccess(projectId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return false
    }

    // Check if user is the project creator or an accepted collaborator
    const { data: project } = await supabase
      .from('projects')
      .select('id, created_by, visibility')
      .eq('id', projectId)
      .single()

    if (!project) {
      return false
    }

    // Public projects are accessible to everyone
    if (project.visibility === 'public') {
      return true
    }

    // Check if user created the project
    if (project.created_by === user.id) {
      return true
    }

    // Check if user is an accepted collaborator
    const { data: collaboration } = await supabase
      .from('project_collaborators')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .eq('status', 'accepted')
      .single()

    return !!collaboration
  } catch (error) {
    console.error('Error checking project access:', error)
    return false
  }
}
