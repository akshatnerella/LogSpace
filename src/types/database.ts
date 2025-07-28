// UPDATED DATABASE TYPES - Matching the new schema exactly

export interface User {
  id: string;
  name?: string;
  email: string;
  avatar_url?: string;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  visibility: 'public' | 'private';
  status: string;
  slug?: string;
  project_settings: Record<string, any>;
  tags?: string[];
}

export interface ProjectCollaborator {
  id: string;
  project_id: string;
  user_id: string;
  role: 'admin' | 'contributor';
  permissions: Record<string, any>;
  invited_by?: string;
  invited_at: string;
  joined_at?: string;
  status: 'pending' | 'accepted' | 'removed';
  created_at: string;
  updated_at: string;
  // Joined user data
  users?: User;
}

export interface ProjectLog {
  id: string;
  project_id: string;
  user_id?: string;
  type: string; // 'text', 'image', 'code', etc.
  content?: string;
  images?: string[];
  metadata: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  // Joined user data
  users?: User;
}

export interface ProjectSlug {
  slug: string;
  project_id: string;
  created_at: string;
}

// ENHANCED INTERFACES FOR QUERIES

export interface ProjectWithStats extends Project {
  collaborator_count: number;
  log_count: number;
  last_activity?: string;
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
  project_settings?: Record<string, any>;
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
  visibility?: 'public' | 'private';
  status?: string;
  tags?: string[];
  project_settings?: Record<string, any>;
}

export interface CreateLogData {
  project_id: string;
  type: string;
  content?: string;
  images?: string[];
  metadata?: Record<string, any>;
}

export interface InviteCollaboratorData {
  project_id: string;
  user_id: string;
  role: 'admin' | 'contributor';
  permissions?: Record<string, any>;
}

export interface UpdateCollaboratorData {
  role?: 'admin' | 'contributor';
  permissions?: Record<string, any>;
  status?: 'pending' | 'accepted' | 'removed';
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
  status?: string;
  role?: 'admin' | 'contributor';
  tags?: string[];
  created_after?: string;
  created_before?: string;
  search?: string;
}

export interface ProjectSortOptions {
  field: 'title' | 'created_at' | 'updated_at' | 'last_activity';
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

// BACKWARD COMPATIBILITY
// Keep the old Log interface as an alias for easier migration
export interface Log extends ProjectLog {}
