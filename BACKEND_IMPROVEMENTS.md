# Backend Improvements for Project Dashboard

## Current Issues

1. **Inefficient Project Query**: Fetching all projects then filtering by slug locally
2. **Missing Slug Column**: No dedicated slug column in database
3. **Collaborator Data Not Populated**: String array instead of user objects
4. **No Authentication**: No user/permission checks
5. **Multiple Queries**: 3 separate database calls instead of joins

## Suggested Improvements

### 1. Database Schema Updates

```sql
-- Add proper slug column to projects table
ALTER TABLE projects ADD COLUMN slug TEXT UNIQUE;

-- Create index for faster lookups
CREATE INDEX idx_projects_slug ON projects(slug);

-- Create collaborators junction table for better data structure
CREATE TABLE project_collaborators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'viewer')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);
```

### 2. Optimized Single Query

```typescript
// Replace 3 queries with 1 optimized query using joins
const { data: projectData, error } = await supabase
  .from('projects')
  .select(`
    *,
    logs(count),
    logs!inner(
      id,
      content,
      created_at
    ),
    project_collaborators!inner(
      role,
      users(
        id,
        name,
        email,
        avatar_url
      )
    )
  `)
  .eq('slug', slug)
  .order('logs.created_at', { ascending: false })
  .limit(3, { referencedTable: 'logs' })
  .single()
```

### 3. Add Authentication & Authorization

```typescript
// Check if user can access project
const { data: { user } } = await supabase.auth.getUser()

if (!user) {
  redirect('/login')
}

// Check project permissions
const { data: permission } = await supabase
  .from('project_collaborators')
  .select('role')
  .eq('project_id', project.id)
  .eq('user_id', user.id)
  .single()

if (!project.is_public && !permission) {
  notFound() // User can't access private project
}
```

### 4. Add Row Level Security (RLS)

```sql
-- Enable RLS on projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view public projects or projects they collaborate on
CREATE POLICY "Users can view accessible projects" ON projects
  FOR SELECT USING (
    is_public = true OR 
    EXISTS (
      SELECT 1 FROM project_collaborators 
      WHERE project_id = projects.id 
      AND user_id = auth.uid()
    )
  );
```

### 5. Caching Strategy

```typescript
// Add React Query for caching
const { data: project, isLoading, error } = useQuery({
  queryKey: ['project', slug],
  queryFn: () => fetchProject(slug),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
})
```

## Implementation Priority

1. **High Priority**: Add slug column and optimize queries
2. **Medium Priority**: Implement authentication and RLS  
3. **Low Priority**: Add caching and real-time updates

## Expected Performance Gains

- **Query Time**: ~70% reduction (3 queries → 1 query)
- **Data Transfer**: ~50% reduction (no fetching all projects)
- **User Experience**: Faster page loads, proper loading states
- **Security**: Proper access control and data protection
