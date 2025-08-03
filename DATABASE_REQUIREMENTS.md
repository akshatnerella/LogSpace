# LogSpace Database Requirements Analysis

## Overview

LogSpace is a public-first builder portfolio platform where users can showcase their development projects through build logs, collaborate with others, and discover interesting projects. This document outlines the complete data requirements for each page and feature based on comprehensive codebase investigation.

## Core Data Models

### 1. User
```typescript
interface User {
  id: string;                           // UUID primary key
  name: string;                         // Full name
  email: string;                        // Email address (unique)
  handle?: string;                      // Unique username/handle for URLs
  bio?: string;                         // User biography/about section
  website?: string;                     // Personal website URL
  github?: string;                      // GitHub profile URL
  avatar_url?: string;                  // Profile picture URL
  is_public: boolean;                   // Profile visibility (default: true)
  settings: Record<string, any>;        // User preferences JSON
  created_at: string;                   // Registration timestamp
  updated_at: string;                   // Last profile update
}
```

### 2. Project
```typescript
interface Project {
  id: string;                           // UUID primary key
  title: string;                        // Project name
  description?: string;                 // Project description
  slug: string;                         // URL-friendly identifier (unique)
  visibility: 'public' | 'private';    // Access level
  status: 'active' | 'completed' | 'archived'; // Project state
  created_by: string;                   // User ID (FK)
  tags?: string[];                      // Project tags for search/discovery
  repository_url?: string;              // Git repository URL
  live_url?: string;                    // Live demo URL
  featured_image?: string;              // Project cover image
  project_settings: Record<string, any>; // Custom settings JSON
  created_at: string;                   // Creation timestamp
  updated_at: string;                   // Last modified timestamp
}
```

### 3. ProjectCollaborator
```typescript
interface ProjectCollaborator {
  id: string;                           // UUID primary key
  project_id: string;                   // Project ID (FK)
  user_id: string;                      // User ID (FK)
  role: 'owner' | 'admin' | 'editor' | 'viewer'; // Access level
  permissions: Record<string, any>;     // Detailed permissions JSON
  status: 'active' | 'pending' | 'declined' | 'removed'; // Collaboration status
  invited_by?: string;                  // User ID who sent invite (FK)
  invited_at: string;                   // Invitation timestamp
  joined_at?: string;                   // Acceptance timestamp
  created_at: string;                   // Record creation
  updated_at: string;                   // Last modification
}
```

### 4. ProjectLog
```typescript
interface ProjectLog {
  id: string;                           // UUID primary key
  project_id: string;                   // Project ID (FK)
  author_id: string;                    // User ID (FK)
  title: string;                        // Log entry title
  content: string;                      // Log content (markdown)
  type: 'text' | 'image' | 'video' | 'link' | 'milestone'; // Log type
  featured_image?: string;              // Log cover image
  metadata: Record<string, any>;        // Additional data JSON
  tags?: string[];                      // Log-specific tags
  is_pinned: boolean;                   // Pin to top of project
  timeline_date?: string;               // When the logged event occurred
  created_at: string;                   // Creation timestamp
  updated_at: string;                   // Last edit timestamp
}
```

### 5. Project Watching/Starring (MVP Core)

#### Project Watchers (for notifications)
```typescript
interface ProjectWatcher {
  id: string;                           // UUID primary key
  project_id: string;                   // Project ID (FK)
  user_id: string;                      // User ID (FK)
  type: 'watch' | 'star';              // Watch for notifications, Star for bookmarking
  created_at: string;                   // When user started watching/starred
}
```

#### Basic Notifications (MVP)
```typescript
interface Notification {
  id: string;                           // UUID primary key
  user_id: string;                      // Recipient user ID (FK)
  type: 'new_log' | 'collaboration_invite' | 'project_update'; // Notification type
  title: string;                        // Notification title
  message: string;                      // Notification message
  project_id?: string;                  // Related project ID (FK)
  is_read: boolean;                     // Read status
  created_at: string;                   // Notification timestamp
}
```
```

---

## Page-by-Page Data Requirements

### 1. Landing Page (`/`)
**Purpose**: Marketing landing page with authentication

**Data Storage**: None (static content)
**Data Retrieval**: None (static content)

**Components**:
- Hero section (static)
- Features showcase (static)
- Social proof (static)
- Authentication UI (Supabase Auth)

---

### 2. Home Dashboard (`/home`)
**Purpose**: User's personal project dashboard with filtering and management

**Data Storage**:
- User profile upserts on login
- Project creation (redirects to project page)

**Data Retrieval**:
```sql
-- Get user's projects with basic stats
SELECT 
  p.*,
  COUNT(DISTINCT pc.user_id) FILTER (WHERE pc.status = 'active') as collaborator_count,
  COUNT(DISTINCT pl.id) as log_count,
  MAX(pl.created_at) as last_activity
FROM projects p
LEFT JOIN project_collaborators pc ON p.id = pc.project_id
LEFT JOIN project_logs pl ON p.id = pl.project_id
WHERE (
  p.created_by = $user_id 
  OR EXISTS (
    SELECT 1 FROM project_collaborators pc2 
    WHERE pc2.project_id = p.id 
    AND pc2.user_id = $user_id 
    AND pc2.status = 'active'
  )
) AND p.status = 'active'
GROUP BY p.id
ORDER BY p.updated_at DESC;

-- Get watched projects for notifications
SELECT p.*, pw.type as watch_type
FROM projects p
JOIN project_watchers pw ON p.id = pw.project_id
WHERE pw.user_id = $user_id
  AND p.status = 'active'
ORDER BY pw.created_at DESC;
```

**Features**:
- Project grid with basic search/filter/sort
- Recent projects list
- Quick project creation button
- Watched/starred projects section

---

### 3. Create Project (`/create-project`)
**Purpose**: Simple project creation form

**Data Storage**:
```sql
-- Create new project with auto-generated slug
INSERT INTO projects (title, description, visibility, created_by, tags, project_settings, status)
VALUES ($title, $description, $visibility, $user_id, $tags, '{}', 'active');

-- Create owner collaboration record automatically
INSERT INTO project_collaborators (project_id, user_id, role, status, permissions, joined_at)
VALUES ($project_id, $user_id, 'owner', 'active', '{"read": true, "write": true, "admin": true}', NOW());
```

**Data Retrieval**: User authentication status

**Form Fields**:
- Project name (required, validation)
- Description (optional)
- Visibility (public/private radio)
- Tags (optional, comma-separated)
- Repository URL (optional, validation)

---

### 4. Project Dashboard (`/project/[id]`)
**Purpose**: Main project hub with timeline logs and collaboration

**Data Storage**:
- New project logs via forms
- Watch/star project actions
- Collaborator invitations

**Data Retrieval**:
```sql
-- Get project details with user permissions
SELECT 
  p.*,
  u.name as owner_name,
  u.avatar_url as owner_avatar,
  CASE 
    WHEN p.created_by = $current_user_id THEN 'owner'
    ELSE COALESCE(pc.role, 'viewer')
  END as user_role,
  COUNT(DISTINCT pc2.user_id) FILTER (WHERE pc2.status = 'active') as collaborator_count,
  COUNT(DISTINCT pl.id) as log_count
FROM projects p
JOIN users u ON p.created_by = u.id
LEFT JOIN project_collaborators pc ON p.id = pc.project_id AND pc.user_id = $current_user_id
LEFT JOIN project_collaborators pc2 ON p.id = pc2.project_id
LEFT JOIN project_logs pl ON p.id = pl.project_id
WHERE p.id = $project_id
GROUP BY p.id, u.name, u.avatar_url, pc.role;

-- Get project timeline logs
SELECT 
  pl.*,
  u.name as author_name,
  u.avatar_url as author_avatar,
  u.handle as author_handle
FROM project_logs pl
LEFT JOIN users u ON pl.author_id = u.id
WHERE pl.project_id = $project_id
ORDER BY pl.timeline_date DESC, pl.created_at DESC
LIMIT 20;

-- Check if user is watching/starring this project
SELECT type FROM project_watchers 
WHERE project_id = $project_id AND user_id = $current_user_id;
```

**Features**:
- Project header with basic stats
- Timeline of logs
- Watch/Star project buttons
- Collaborator list
- Quick log creation
- Share project functionality

---

### 5. Create/Edit Log (`/project/[id]/log/new`, `/project/[id]/log/[log_id]/edit`)
**Purpose**: Simple log creation and editing

**Data Storage**:
```sql
-- Create new project log
INSERT INTO project_logs (
  project_id, author_id, title, content, type, 
  featured_image, tags, timeline_date, is_pinned, metadata
)
VALUES (
  $project_id, $user_id, $title, $content, $type,
  $featured_image, $tags, $timeline_date, $is_pinned, '{}'
);

-- Update project's last activity
UPDATE projects SET updated_at = NOW() WHERE id = $project_id;

-- Notify watchers of new log
INSERT INTO notifications (user_id, type, title, message, project_id, is_read)
SELECT pw.user_id, 'new_log', $notification_title, $notification_message, $project_id, false
FROM project_watchers pw
WHERE pw.project_id = $project_id 
  AND pw.type = 'watch' 
  AND pw.user_id != $author_id;
```

**Data Retrieval**:
```sql
-- Verify write permissions
SELECT 
  CASE 
    WHEN p.created_by = $user_id THEN true
    WHEN pc.role IN ('owner', 'admin', 'editor') AND pc.status = 'active' THEN true
    ELSE false
  END as can_edit
FROM projects p
LEFT JOIN project_collaborators pc ON p.id = pc.project_id AND pc.user_id = $user_id
WHERE p.id = $project_id;
```

**Form Features**:
- Rich text editor with markdown
- Image upload
- Timeline date picker
- Tags
- Pin to top option

---

### 6. Project Admin/Settings (`/project/[id]/admin`)
**Purpose**: Basic project management interface

**Data Storage**:
- Project metadata updates
- Collaborator role changes and invitations
- Project archival

**Data Retrieval**:
```sql
-- Get project details for admin (owners and admins only)
SELECT p.* FROM projects p 
WHERE p.id = $project_id
  AND (
    p.created_by = $user_id 
    OR EXISTS (
      SELECT 1 FROM project_collaborators pc
      WHERE pc.project_id = p.id 
        AND pc.user_id = $user_id 
        AND pc.role IN ('owner', 'admin')
        AND pc.status = 'active'
    )
  );

-- Get collaborators for management
SELECT 
  pc.*,
  u.name, u.email, u.avatar_url, u.handle
FROM project_collaborators pc
JOIN users u ON pc.user_id = u.id
WHERE pc.project_id = $project_id
  AND pc.status IN ('active', 'pending')
ORDER BY 
  CASE pc.role 
    WHEN 'owner' THEN 1 WHEN 'admin' THEN 2 
    WHEN 'editor' THEN 3 ELSE 4 
  END,
  pc.created_at ASC;
```

**Admin Features**:
- Project info editing (name, description, visibility)
- Team member management (invite, remove, change roles)
- Basic project sharing links
- Archive project option

---

### 7. User Profile (`/profile/[handle]`)
**Purpose**: Simple user profile with project showcase

**Data Storage**: Profile views tracking (optional)

**Data Retrieval**:
```sql
-- Get user profile
SELECT u.* FROM users u 
WHERE u.handle = $handle OR u.id = $handle;

-- Get user's public projects
SELECT 
  p.*,
  COUNT(DISTINCT pc.user_id) FILTER (WHERE pc.status = 'active') as collaborator_count,
  COUNT(DISTINCT pl.id) as log_count,
  MAX(pl.created_at) as last_activity
FROM projects p
LEFT JOIN project_collaborators pc ON p.id = pc.project_id
LEFT JOIN project_logs pl ON p.id = pl.project_id
WHERE p.created_by = $profile_user_id
  AND p.status = 'active'
  AND (
    p.visibility = 'public' 
    OR $current_user_id = $profile_user_id
  )
GROUP BY p.id
ORDER BY p.updated_at DESC
LIMIT 12;
```

**Profile Features**:
- User info (name, bio, links)
- Project portfolio grid
- Basic stats (project count, total logs)

---

### 8. Explore/Discovery (`/explore`)
**Purpose**: Discover public projects

**Data Storage**: Search queries tracking (optional)

**Data Retrieval**:
```sql
-- Get public projects for discovery
SELECT 
  p.*,
  u.name as owner_name, u.avatar_url as owner_avatar, u.handle as owner_handle,
  COUNT(DISTINCT pc.user_id) FILTER (WHERE pc.status = 'active') as collaborator_count,
  COUNT(DISTINCT pl.id) as log_count,
  MAX(pl.created_at) as last_activity
FROM projects p
JOIN users u ON p.created_by = u.id
LEFT JOIN project_collaborators pc ON p.id = pc.project_id
LEFT JOIN project_logs pl ON p.id = pl.project_id
WHERE p.visibility = 'public' 
  AND p.status = 'active'
GROUP BY p.id, u.name, u.avatar_url, u.handle
ORDER BY 
  CASE WHEN $sort = 'recent' THEN p.created_at END DESC,
  CASE WHEN $sort = 'active' THEN last_activity END DESC,
  p.updated_at DESC
LIMIT 24;

-- Basic search
SELECT p.*, u.name as owner_name, u.handle as owner_handle
FROM projects p
JOIN users u ON p.created_by = u.id
WHERE p.visibility = 'public' 
  AND p.status = 'active'
  AND (
    p.title ILIKE '%' || $search_query || '%'
    OR p.description ILIKE '%' || $search_query || '%'
    OR $search_query = ANY(p.tags)
  )
ORDER BY p.updated_at DESC;
```

**Features**:
- Featured projects grid
- Basic search functionality
- Simple filtering (by tags)
- Recent and active project sorting

---

## Additional Data Requirements

### Authentication & Session Management
```sql
-- Supabase Auth integration
-- User records auto-created via database trigger on auth.users insert
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, avatar_url, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.created_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### File Upload & Storage Management
```sql
-- Storage bucket: 'project-images'
-- Structure: /{user_id}/{project_id?}/{filename}
-- Policies: Users can upload to their own folders, anyone can view public images
```

### Basic Notification System
```sql
-- Trigger to notify watchers when new log is created
CREATE OR REPLACE FUNCTION notify_project_watchers()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, message, project_id, is_read)
  SELECT 
    pw.user_id,
    'new_log',
    'New log in ' || p.title,
    'A new log "' || NEW.title || '" was added',
    NEW.project_id,
    false
  FROM project_watchers pw
  JOIN projects p ON p.id = pw.project_id
  WHERE pw.project_id = NEW.project_id 
    AND pw.type = 'watch' 
    AND pw.user_id != NEW.author_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER notify_watchers_on_new_log
  AFTER INSERT ON project_logs
  FOR EACH ROW EXECUTE FUNCTION notify_project_watchers();
```

---

## Security & Permissions

### Row Level Security (RLS) Implementation

**Users Table**:
```sql
-- Users can view public profiles or their own profile
CREATE POLICY "Public profiles are viewable by everyone" ON users
  FOR SELECT USING (is_public = true OR id = auth.uid());

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (id = auth.uid());
```

**Projects Table**:
```sql
-- Public projects visible to everyone, private only to collaborators
CREATE POLICY "Projects visibility based on access" ON projects
  FOR SELECT USING (
    visibility = 'public' 
    OR created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM project_collaborators pc
      WHERE pc.project_id = projects.id 
        AND pc.user_id = auth.uid() 
        AND pc.status = 'active'
    )
  );

-- Only owners can update projects (or admins via collaborator table)
CREATE POLICY "Project owners can update" ON projects
  FOR UPDATE USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM project_collaborators pc
      WHERE pc.project_id = projects.id 
        AND pc.user_id = auth.uid() 
        AND pc.role IN ('owner', 'admin')
        AND pc.status = 'active'
    )
  );
```

**Project Collaborators Table**:
```sql
-- Collaborators visible to project members
CREATE POLICY "Collaborators visible to project members" ON project_collaborators
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_collaborators.project_id
        AND (
          p.visibility = 'public'
          OR p.created_by = auth.uid()
          OR EXISTS (
            SELECT 1 FROM project_collaborators pc2
            WHERE pc2.project_id = p.id 
              AND pc2.user_id = auth.uid() 
              AND pc2.status = 'active'
          )
        )
    )
  );

-- Only project owners can manage collaborators
CREATE POLICY "Owners can manage collaborators" ON project_collaborators
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_collaborators.project_id
        AND projects.created_by = auth.uid()
    )
  );
```

**Project Logs Table**:
```sql
-- Logs visible based on project visibility
CREATE POLICY "Logs visible based on project access" ON project_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_logs.project_id
        AND (
          p.visibility = 'public'
          OR p.created_by = auth.uid()
          OR EXISTS (
            SELECT 1 FROM project_collaborators pc
            WHERE pc.project_id = p.id 
              AND pc.user_id = auth.uid() 
              AND pc.status = 'active'
          )
        )
    )
  );

-- Only authors and project admins can edit logs
CREATE POLICY "Authors and project admins can edit logs" ON project_logs
  FOR UPDATE USING (
    author_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_logs.project_id
        AND p.created_by = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM project_collaborators pc
      WHERE pc.project_id = project_logs.project_id 
        AND pc.user_id = auth.uid() 
        AND pc.role IN ('owner', 'admin')
        AND pc.status = 'active'
    )
  );
```

**Additional Tables**:
```sql
-- Project watchers visible to everyone (for public projects)
CREATE POLICY "Watchers visible for accessible projects" ON project_watchers
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_watchers.project_id
        AND p.visibility = 'public'
    )
  );

-- Users can only manage their own watching status
CREATE POLICY "Users manage own watching" ON project_watchers
  FOR ALL USING (user_id = auth.uid());

-- Users can view their own notifications
CREATE POLICY "Users view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());
```

### Access Control Matrix

| Role | View Project | Create Logs | Edit Logs | Edit Project | Manage Collaborators | Archive Project |
|------|-------------|-------------|-----------|--------------|---------------------|-----------------|
| Owner | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Admin | ✅ | ✅ | ✅ (own + others) | ✅ | ✅ | ❌ |
| Editor | ✅ | ✅ | ✅ (own only) | ❌ | ❌ | ❌ |
| Viewer | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Watcher | ✅ (if public) | ❌ | ❌ | ❌ | ❌ | ❌ |
| Public | ✅ (if public) | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## Implementation Priorities

### Phase 1: MVP Core (Weeks 1-3)
**Essential for launch - No optional features**

**Core Tables**:
1. `users` - Basic profile (name, email, handle, bio, avatar_url, github, website)
2. `projects` - Core project data (title, description, slug, visibility, status, created_by, tags, repository_url)
3. `project_collaborators` - Team management (role-based access)
4. `project_logs` - Build logs and updates (title, content, type, timeline_date)
5. `project_watchers` - Watch/star functionality
6. `notifications` - Basic notifications for watchers

**Core Features**:
- User authentication with Supabase Auth
- Project CRUD with public/private visibility
- Basic collaboration (invite, roles, permissions)
- Log creation with markdown support
- Watch/star projects for notifications
- Simple project discovery (public projects)
- File upload for images (Supabase Storage)

**Core Queries**:
- User's projects with basic stats
- Project timeline with logs
- Public project discovery
- Collaboration management
- Notification system

### Phase 2: Enhancement & Polish (Weeks 4-6)
**Improve user experience**

**Enhanced Features**:
- Rich text editor for logs
- Better search and filtering
- User profiles with project showcase
- Email notifications for watchers
- Project sharing and invite links
- Mobile responsive design

### Phase 3: Growth Features (Weeks 7-8)
**Scale and engagement**

**Advanced Features**:
- Advanced search with full-text indexing
- Project analytics (view counts, watcher counts)
- User activity feeds
- Enhanced collaboration tools
- API for external integrations

---

## MVP Database Schema Summary

**Essential Tables Only**:
```sql
-- 1. Users (from Supabase Auth + extended profile)
users: id, name, email, handle, bio, avatar_url, github, website, is_public, settings, created_at, updated_at

-- 2. Projects (core project data)
projects: id, title, description, slug, visibility, status, created_by, tags, repository_url, live_url, featured_image, project_settings, created_at, updated_at

-- 3. Project Collaborators (team management)
project_collaborators: id, project_id, user_id, role, permissions, status, invited_by, invited_at, joined_at, created_at, updated_at

-- 4. Project Logs (build logs and updates)  
project_logs: id, project_id, author_id, title, content, type, featured_image, metadata, tags, is_pinned, timeline_date, created_at, updated_at

-- 5. Project Watchers (watch/star for notifications)
project_watchers: id, project_id, user_id, type, created_at

-- 6. Notifications (basic notification system)
notifications: id, user_id, type, title, message, project_id, is_read, created_at
```

**Key Indexes**:
```sql
-- Performance indexes for common queries
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_projects_visibility_status ON projects(visibility, status);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_project_logs_project_id ON project_logs(project_id);
CREATE INDEX idx_project_collaborators_project_user ON project_collaborators(project_id, user_id);
CREATE INDEX idx_project_watchers_user_id ON project_watchers(user_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);
```

This simplified, MVP-focused approach ensures we can launch quickly with core functionality while maintaining the ability to scale and add features later. The database design is clean, efficient, and production-ready for Supabase.
