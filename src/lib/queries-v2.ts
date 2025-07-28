// PRODUCTION-SCALE QUERY FUNCTIONS
// Optimized for high performance and scalability

import { supabase } from '@/lib/supabaseClient'
import { 
  Project, 
  ProjectWithStats, 
  ProjectCollaborator, 
  ProjectActivity,
  ProjectFilters,
  ProjectSortOptions,
  PaginationOptions,
  PaginatedResponse,
  CreateProjectData,
  UpdateProjectData,
  InviteCollaboratorData,
  UpdateCollaboratorData,
  DashboardStats
} from '@/types/database-v2'

// OPTIMIZED PROJECT QUERIES

export async function fetchProjectBySlug(
  slug: string, 
  includeStats = true
): Promise<ProjectWithStats | null> {
  try {
    let query = supabase
      .from('projects')
      .select(`
        *,
        ${includeStats ? `
        project_collaborators!inner(
          id,
          user_id,
          role,
          status,
          joined_at,
          users!inner(
            id,
            name,
            email,
            avatar_url
          )
        ),
        logs!inner(
          id,
          content,
          created_at,
          users!inner(
            id,
            name,
            avatar_url
          )
        )
        ` : ''}
      `)
      .eq('slug', slug)
      .eq('status', 'active')

    if (includeStats) {
      query = query
        .eq('project_collaborators.status', 'active')
        .order('joined_at', { ascending: false, referencedTable: 'project_collaborators' })
        .order('created_at', { ascending: false, referencedTable: 'logs' })
        .limit(5, { referencedTable: 'project_collaborators' })
        .limit(3, { referencedTable: 'logs' })
    }

    const { data: project, error } = await query.single()

    if (error) {
      console.error('Error fetching project:', error)
      return null
    }

    if (!project) return null

    // Type assertion for the complex query result
    const projectWithJoins = project as any

    // Format the response with proper typing
    const formattedProject: ProjectWithStats = {
      ...projectWithJoins,
      collaborator_count: projectWithJoins.project_collaborators?.length || 0,
      log_count: projectWithJoins.logs?.length || 0,
      last_activity: projectWithJoins.logs?.[0]?.created_at,
      collaborators: projectWithJoins.project_collaborators?.map((pc: any) => ({
        ...pc,
        user: pc.users
      })) || [],
      recent_logs: projectWithJoins.logs?.map((log: any) => ({
        ...log,
        user: log.users
      })) || []
    }

    return formattedProject
  } catch (error) {
    console.error('Unexpected error fetching project:', error)
    return null
  }
}

export async function fetchUserProjects(
  userId: string,
  filters: ProjectFilters = {},
  sort: ProjectSortOptions = { field: 'updated_at', direction: 'desc' },
  pagination: PaginationOptions = { page: 1, limit: 20 }
): Promise<PaginatedResponse<ProjectWithStats>> {
  try {
    let query = supabase
      .from('project_stats') // Use the optimized view
      .select('*', { count: 'exact' })

    // Apply filters
    if (filters.visibility) {
      query = query.eq('visibility', filters.visibility)
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status)
    } else {
      query = query.eq('status', 'active') // Default to active projects
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,slug.ilike.%${filters.search}%`)
    }

    if (filters.created_after) {
      query = query.gte('created_at', filters.created_after)
    }

    if (filters.created_before) {
      query = query.lte('created_at', filters.created_before)
    }

    // Filter by user access (projects they own or collaborate on)
    query = query.or(`created_by.eq.${userId},project_collaborators.user_id.eq.${userId}`)

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

export async function fetchPublicProjects(
  filters: Omit<ProjectFilters, 'role'> = {},
  sort: ProjectSortOptions = { field: 'updated_at', direction: 'desc' },
  pagination: PaginationOptions = { page: 1, limit: 20 }
): Promise<PaginatedResponse<ProjectWithStats>> {
  return fetchUserProjects('', { ...filters, visibility: 'public' }, sort, pagination)
}

// PROJECT COLLABORATION QUERIES

export async function fetchProjectCollaborators(
  projectId: string,
  includeInactive = false
): Promise<ProjectCollaborator[]> {
  try {
    let query = supabase
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

    if (!includeInactive) {
      query = query.eq('status', 'active')
    }

    query = query.order('role').order('joined_at', { ascending: false })

    const { data: collaborators, error } = await query

    if (error) {
      console.error('Error fetching collaborators:', error)
      return []
    }

    return (collaborators || []).map((collab: any) => ({
      ...collab,
      user: collab.users
    }))
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
        permissions: data.permissions || {
          read: true,
          write: data.role !== 'viewer',
          admin: data.role === 'admin'
        }
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

    return {
      ...collaborator,
      user: collaborator.users
    }
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
        updated_at: new Date().toISOString()
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

    return {
      ...collaborator,
      user: collaborator.users
    }
  } catch (error) {
    console.error('Unexpected error updating collaborator:', error)
    return null
  }
}

// PROJECT MANAGEMENT QUERIES

export async function createProject(data: CreateProjectData): Promise<Project | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        ...data,
        created_by: user.id,
        // slug will be auto-generated by trigger
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating project:', error)
      return null
    }

    return project
  } catch (error) {
    console.error('Unexpected error creating project:', error)
    return null
  }
}

export async function updateProject(
  projectId: string,
  data: UpdateProjectData
): Promise<Project | null> {
  try {
    const { data: project, error } = await supabase
      .from('projects')
      .update(data)
      .eq('id', projectId)
      .select()
      .single()

    if (error) {
      console.error('Error updating project:', error)
      return null
    }

    return project
  } catch (error) {
    console.error('Unexpected error updating project:', error)
    return null
  }
}

export async function deleteProject(projectId: string): Promise<boolean> {
  try {
    // Soft delete by setting status to 'deleted'
    const { error } = await supabase
      .from('projects')
      .update({ status: 'deleted' })
      .eq('id', projectId)

    if (error) {
      console.error('Error deleting project:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected error deleting project:', error)
    return false
  }
}

// DASHBOARD STATS

export async function fetchDashboardStats(userId: string): Promise<DashboardStats> {
  try {
    const [
      { count: totalProjects },
      { count: activeProjects },
      { count: archivedProjects },
      { count: totalCollaborations },
      { count: totalLogs },
      { count: recentActivityCount }
    ] = await Promise.all([
      supabase
        .from('user_project_access')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .neq('effective_role', 'none'),
      
      supabase
        .from('user_project_access')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'active')
        .neq('effective_role', 'none'),
      
      supabase
        .from('user_project_access')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'archived')
        .neq('effective_role', 'none'),
      
      supabase
        .from('project_collaborators')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'active'),
      
      supabase
        .from('logs')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', userId),
      
      supabase
        .from('project_activities')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
    ])

    return {
      total_projects: totalProjects || 0,
      active_projects: activeProjects || 0,
      archived_projects: archivedProjects || 0,
      total_collaborations: totalCollaborations || 0,
      total_logs: totalLogs || 0,
      recent_activity_count: recentActivityCount || 0
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      total_projects: 0,
      active_projects: 0,
      archived_projects: 0,
      total_collaborations: 0,
      total_logs: 0,
      recent_activity_count: 0
    }
  }
}

// REAL-TIME SUBSCRIPTIONS

export function subscribeToProject(projectId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`project:${projectId}`)
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'projects', filter: `id=eq.${projectId}` },
      callback
    )
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'logs', filter: `project_id=eq.${projectId}` },
      callback
    )
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'project_collaborators', filter: `project_id=eq.${projectId}` },
      callback
    )
    .subscribe()
}

export function subscribeToUserProjects(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`user_projects:${userId}`)
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'projects', filter: `created_by=eq.${userId}` },
      callback
    )
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'project_collaborators', filter: `user_id=eq.${userId}` },
      callback
    )
    .subscribe()
}
