// API client for LogSpace backend (client-side)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

class ApiError extends Error {
  constructor(message: string, public status: number, public response?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface User {
  id: string;
  clerk_id: string;
  username: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_public: boolean;
  owner_id: string;
  created_at: string;
  updated_at: string;
  owner?: User;
  log_count?: number;
}

export interface Log {
  id: string;
  title: string;
  content: string;
  project_id: string;
  author_id: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  author?: User;
  project?: Project;
}

export interface Collaborator {
  id: string;
  project_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'collaborator' | 'viewer';
  invited_by_id: string;
  invited_at: string;
  joined_at?: string;
  user?: User;
  invited_by?: User;
}

export interface InviteLink {
  token: string;
  project_id: string;
  role: 'admin' | 'collaborator' | 'viewer';
  expires_at: string;
  created_by_id: string;
  max_uses?: number;
  current_uses: number;
}

class ApiClient {
  constructor(private getToken?: () => Promise<string | null>) {}

  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = this.getToken ? await this.getToken() : null;
    
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.detail || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    return response.json();
  }

  // Auth endpoints
  async syncUser(userData: {
    clerk_id: string;
    username: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
  }): Promise<User> {
    return this.request<User>('/auth/sync', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // Project endpoints
  async getProjects(): Promise<Project[]> {
    return this.request<Project[]>('/projects');
  }

  async getProject(slug: string): Promise<Project> {
    return this.request<Project>(`/projects/${slug}`);
  }

  async createProject(projectData: {
    name: string;
    description?: string;
    is_public: boolean;
  }): Promise<Project> {
    return this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProject(slug: string, projectData: {
    name?: string;
    description?: string;
    is_public?: boolean;
  }): Promise<Project> {
    return this.request<Project>(`/projects/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(slug: string): Promise<void> {
    await this.request<void>(`/projects/${slug}`, {
      method: 'DELETE',
    });
  }

  // Log endpoints
  async getProjectLogs(projectSlug: string): Promise<Log[]> {
    return this.request<Log[]>(`/projects/${projectSlug}/logs`);
  }

  async createLog(projectSlug: string, logData: {
    title: string;
    content: string;
    tags?: string[];
  }): Promise<Log> {
    return this.request<Log>(`/projects/${projectSlug}/logs`, {
      method: 'POST',
      body: JSON.stringify(logData),
    });
  }

  async getLog(projectSlug: string, logId: string): Promise<Log> {
    return this.request<Log>(`/projects/${projectSlug}/logs/${logId}`);
  }

  async updateLog(projectSlug: string, logId: string, logData: {
    title?: string;
    content?: string;
    tags?: string[];
  }): Promise<Log> {
    return this.request<Log>(`/projects/${projectSlug}/logs/${logId}`, {
      method: 'PUT',
      body: JSON.stringify(logData),
    });
  }

  async deleteLog(projectSlug: string, logId: string): Promise<void> {
    await this.request<void>(`/projects/${projectSlug}/logs/${logId}`, {
      method: 'DELETE',
    });
  }

  // Collaborator endpoints
  async getProjectCollaborators(projectSlug: string): Promise<Collaborator[]> {
    return this.request<Collaborator[]>(`/projects/${projectSlug}/collaborators`);
  }

  async inviteCollaborator(projectSlug: string, inviteData: {
    email: string;
    role: 'admin' | 'collaborator' | 'viewer';
  }): Promise<void> {
    await this.request<void>(`/projects/${projectSlug}/collaborators/invite`, {
      method: 'POST',
      body: JSON.stringify(inviteData),
    });
  }

  async updateCollaboratorRole(projectSlug: string, collaboratorId: string, role: 'admin' | 'collaborator' | 'viewer'): Promise<Collaborator> {
    return this.request<Collaborator>(`/projects/${projectSlug}/collaborators/${collaboratorId}`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async removeCollaborator(projectSlug: string, collaboratorId: string): Promise<void> {
    await this.request<void>(`/projects/${projectSlug}/collaborators/${collaboratorId}`, {
      method: 'DELETE',
    });
  }

  // Invite link endpoints
  async createInviteLink(projectSlug: string, linkData: {
    role: 'admin' | 'collaborator' | 'viewer';
    expires_in_hours?: number;
    max_uses?: number;
  }): Promise<InviteLink> {
    return this.request<InviteLink>(`/projects/${projectSlug}/invite-links`, {
      method: 'POST',
      body: JSON.stringify(linkData),
    });
  }

  async getInviteLinks(projectSlug: string): Promise<InviteLink[]> {
    return this.request<InviteLink[]>(`/projects/${projectSlug}/invite-links`);
  }

  async acceptInviteLink(token: string): Promise<void> {
    await this.request<void>(`/invite/${token}/accept`, {
      method: 'POST',
    });
  }

  async getInviteLinkInfo(token: string): Promise<{
    project: Project;
    role: string;
    expires_at: string;
    is_valid: boolean;
  }> {
    return this.request<any>(`/invite/${token}`);
  }
}

export const apiClient = new ApiClient();

// Helper function to create authenticated API client
export const createAuthenticatedApiClient = (getToken: () => Promise<string | null>) => {
  return new ApiClient(getToken);
};

export { ApiError };
