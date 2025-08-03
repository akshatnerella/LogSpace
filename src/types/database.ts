// UPDATED DATABASE TYPES - Matching the exact schema provided

export interface User {
  id: string;
  name: string;
  email: string;
  handle?: string;
  bio?: string;
  website?: string;
  github?: string;
  avatar_url?: string;
  is_public: boolean;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  slug: string;
  visibility: 'public' | 'private';
  status: 'active' | 'completed' | 'archived';
  created_by: string;
  tags?: string[];
  repository_url?: string;
  live_url?: string;
  featured_image?: string;
  project_settings: Record<string, any>;
  created_at: string;
  updated_at: string;
  // Optional collaborators data for dashboard display
  project_collaborators?: ProjectCollaborator[];
}

export interface ProjectCollaborator {
  id: string;
  project_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  permissions: Record<string, any>;
  status: 'active' | 'pending' | 'declined' | 'removed';
  invited_by?: string;
  invited_at: string;
  joined_at?: string;
  created_at: string;
  updated_at: string;
  // Joined user data
  users?: User;
}

export interface ProjectLog {
  id: string;
  project_id: string;
  author_id: string;
  type: 'text' | 'image' | 'url' | 'milestone';
  title?: string;
  content?: string;
  summary?: string;
  source_link?: string;
  featured_image?: string;
  images?: string[];
  tags?: string[];
  timeline_date: string;
  is_pinned?: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  // Joined user data
  users?: User;
}

export interface ProjectWatcher {
  id: string;
  project_id: string;
  user_id: string;
  type: 'watch' | 'star';
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'new_log' | 'collaboration_invite' | 'project_update';
  title: string;
  message: string;
  project_id?: string;
  is_read: boolean;
  created_at: string;
}

// ENHANCED INTERFACES FOR QUERIES

export interface ProjectWithStats extends Project {
  collaborator_count: number;
  log_count: number;
  watcher_count?: number;
  star_count?: number;
  last_activity?: string;
  owner_name?: string;
  owner_avatar?: string;
  owner_handle?: string;
  // Recent collaborators with details
  collaborators?: ProjectCollaborator[];
  // Recent logs
  recent_logs?: ProjectLog[];
}

// FORM DATA INTERFACES

export interface CreateProjectData {
  title: string;
  description?: string;
  visibility: 'public' | 'private';
  tags?: string[];
  repository_url?: string;
  live_url?: string;
  project_settings?: Record<string, any>;
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
  visibility?: 'public' | 'private';
  status?: 'active' | 'completed' | 'archived';
  tags?: string[];
  repository_url?: string;
  live_url?: string;
  featured_image?: string;
  project_settings?: Record<string, any>;
}

export interface CreateLogData {
  project_id: string;
  type: 'text' | 'image' | 'url' | 'milestone';
  title?: string;
  content?: string;
  summary?: string;
  source_link?: string;
  featured_image?: string;
  images?: string[];
  tags?: string[];
  timeline_date?: string;
  is_pinned?: boolean;
  metadata?: Record<string, any>;
}

export interface InviteCollaboratorData {
  project_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  permissions?: Record<string, any>;
}

export interface UpdateCollaboratorData {
  role?: 'owner' | 'admin' | 'editor' | 'viewer';
  permissions?: Record<string, any>;
  status?: 'active' | 'pending' | 'declined' | 'removed';
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

// FILTER AND SEARCH INTERFACES

export interface ProjectFilters {
  visibility?: 'public' | 'private';
  status?: 'active' | 'completed' | 'archived';
  role?: 'owner' | 'admin' | 'editor' | 'viewer';
  tags?: string[];
  search?: string;
}

export interface ProjectSortOptions {
  field: 'created_at' | 'updated_at' | 'title' | 'last_activity';
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
}
