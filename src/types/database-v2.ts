// PRODUCTION-SCALE DATABASE TYPES
// Updated for the new optimized schema

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string;
  visibility: 'public' | 'private' | 'internal';
  status: 'active' | 'archived' | 'deleted';
  created_by: string;
  project_settings: Record<string, any>;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ProjectCollaborator {
  id: string;
  project_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  permissions: {
    read: boolean;
    write: boolean;
    admin: boolean;
  };
  invited_by?: string;
  invited_at: string;
  joined_at?: string;
  status: 'active' | 'pending' | 'declined' | 'removed';
  created_at: string;
  updated_at: string;
  // Joined user data
  user?: User;
}

export interface ProjectActivity {
  id: string;
  project_id: string;
  user_id?: string;
  activity_type: 
    | 'project_created' 
    | 'project_updated' 
    | 'project_deleted'
    | 'collaborator_added' 
    | 'collaborator_removed' 
    | 'role_changed'
    | 'log_created' 
    | 'log_updated' 
    | 'log_deleted'
    | 'settings_changed' 
    | 'visibility_changed';
  metadata: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  // Joined user data
  user?: User;
}

export interface ProjectSlug {
  slug: string;
  project_id: string;
  created_at: string;
}

export interface Log {
  id: string;
  project_id: string;
  created_by: string;
  content: string;
  images: string[];
  created_at: string;
  // Joined user data
  user?: User;
}

// ENHANCED INTERFACES FOR QUERIES

export interface ProjectWithStats extends Project {
  collaborator_count: number;
  log_count: number;
  last_activity?: string;
  // Recent collaborators with details
  collaborators?: ProjectCollaborator[];
  // Recent logs
  recent_logs?: Log[];
  // Recent activities
  recent_activities?: ProjectActivity[];
}

export interface UserProjectAccess {
  user_id: string;
  user_name: string;
  project_id: string;
  project_title: string;
  project_slug: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  status: 'active' | 'pending' | 'declined' | 'removed';
  effective_role: 'owner' | 'admin' | 'editor' | 'viewer' | 'none';
}

// FORM DATA INTERFACES

export interface CreateProjectData {
  title: string;
  description?: string;
  visibility: 'public' | 'private' | 'internal';
  tags?: string[];
  project_settings?: Record<string, any>;
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
  visibility?: 'public' | 'private' | 'internal';
  status?: 'active' | 'archived';
  tags?: string[];
  project_settings?: Record<string, any>;
}

export interface CreateLogData {
  project_id: string;
  content: string;
  images?: string[];
}

export interface InviteCollaboratorData {
  project_id: string;
  user_id: string;
  role: 'admin' | 'editor' | 'viewer';
  permissions?: {
    read: boolean;
    write: boolean;
    admin: boolean;
  };
}

export interface UpdateCollaboratorData {
  role?: 'admin' | 'editor' | 'viewer';
  permissions?: {
    read: boolean;
    write: boolean;
    admin: boolean;
  };
  status?: 'active' | 'removed';
}

// QUERY RESULT INTERFACES

export interface ProjectStats {
  id: string;
  title: string;
  slug: string;
  visibility: 'public' | 'private' | 'internal';
  status: 'active' | 'archived' | 'deleted';
  created_at: string;
  updated_at: string;
  collaborator_count: number;
  log_count: number;
  last_activity?: string;
}

export interface DashboardStats {
  total_projects: number;
  active_projects: number;
  archived_projects: number;
  total_collaborations: number;
  total_logs: number;
  recent_activity_count: number;
}

// API RESPONSE INTERFACES

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

// PERMISSION HELPERS

export type ProjectPermission = 'read' | 'write' | 'admin' | 'delete';

export interface ProjectPermissions {
  can_read: boolean;
  can_write: boolean;
  can_admin: boolean;
  can_delete: boolean;
  can_invite: boolean;
  can_remove_collaborators: boolean;
  can_change_visibility: boolean;
  can_archive: boolean;
}

// FILTER AND SEARCH INTERFACES

export interface ProjectFilters {
  visibility?: 'public' | 'private' | 'internal';
  status?: 'active' | 'archived';
  role?: 'owner' | 'admin' | 'editor' | 'viewer';
  tags?: string[];
  created_after?: string;
  created_before?: string;
  search?: string;
}

export interface ProjectSortOptions {
  field: 'title' | 'created_at' | 'updated_at' | 'last_activity' | 'collaborator_count' | 'log_count';
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

// REAL-TIME SUBSCRIPTION INTERFACES

export interface ProjectSubscriptionPayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: Project | null;
  old: Project | null;
}

export interface CollaboratorSubscriptionPayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: ProjectCollaborator | null;
  old: ProjectCollaborator | null;
}

export interface LogSubscriptionPayload {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: Log | null;
  old: Log | null;
}
