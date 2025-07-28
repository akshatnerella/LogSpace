-- PRODUCTION-SCALE PROJECT SCHEMA REDESIGN
-- Designed for millions of projects and hundreds of thousands of users

-- 1. ENHANCED PROJECTS TABLE
-- Remove collaborators array, add proper indexing and constraints
ALTER TABLE projects 
  DROP COLUMN IF EXISTS collaborators,
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
  ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'private' CHECK (visibility IN ('public', 'private', 'internal')),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS project_settings JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Replace is_public with visibility enum for better scalability
UPDATE projects SET visibility = CASE 
  WHEN is_public = true THEN 'public'::TEXT 
  ELSE 'private'::TEXT 
END WHERE visibility IS NULL;

ALTER TABLE projects DROP COLUMN IF EXISTS is_public;

-- Add proper constraints and indexes
ALTER TABLE projects 
  ADD CONSTRAINT projects_slug_unique UNIQUE (slug),
  ADD CONSTRAINT projects_title_not_empty CHECK (length(trim(title)) > 0);

-- 2. PROJECT COLLABORATORS TABLE (Junction Table)
-- Replaces the inefficient UUID[] collaborators array
CREATE TABLE IF NOT EXISTS project_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  permissions JSONB DEFAULT '{"read": true, "write": false, "admin": false}',
  invited_by UUID REFERENCES users(id),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  joined_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'declined', 'removed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- 3. PROJECT ACTIVITY LOG (Audit Trail)
-- Track all project activities for analytics and debugging
CREATE TABLE IF NOT EXISTS project_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'project_created', 'project_updated', 'project_deleted',
    'collaborator_added', 'collaborator_removed', 'role_changed',
    'log_created', 'log_updated', 'log_deleted',
    'settings_changed', 'visibility_changed'
  )),
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PROJECT SLUGS TABLE (For High-Performance Slug Management)
-- Separate table for slug management to handle race conditions
CREATE TABLE IF NOT EXISTS project_slugs (
  slug TEXT PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id)
);

-- 5. PERFORMANCE INDEXES
-- Optimized for common query patterns at scale

-- Projects table indexes
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_projects_visibility ON projects(visibility);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_tags ON projects USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_projects_settings ON projects USING GIN(project_settings);

-- Project collaborators indexes (Critical for performance)
CREATE INDEX IF NOT EXISTS idx_project_collaborators_project_id ON project_collaborators(project_id);
CREATE INDEX IF NOT EXISTS idx_project_collaborators_user_id ON project_collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_project_collaborators_role ON project_collaborators(role);
CREATE INDEX IF NOT EXISTS idx_project_collaborators_status ON project_collaborators(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_project_collaborators_user_projects ON project_collaborators(user_id, project_id) WHERE status = 'active';

-- Activity log indexes
CREATE INDEX IF NOT EXISTS idx_project_activities_project_id ON project_activities(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_activities_user_id ON project_activities(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_activities_type ON project_activities(activity_type, created_at DESC);

-- Logs table additional indexes
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_project_created ON logs(project_id, created_at DESC);

-- 6. MIGRATE EXISTING DATA
-- Safely migrate collaborators from UUID[] to junction table

-- First, create project owners in collaborators table
INSERT INTO project_collaborators (project_id, user_id, role, status, joined_at)
SELECT id, created_by, 'owner', 'active', created_at
FROM projects
WHERE created_by IS NOT NULL
ON CONFLICT (project_id, user_id) DO NOTHING;

-- Migrate existing collaborators (if any exist in old schema)
-- This handles the case where collaborators UUID[] might still have data
DO $$
DECLARE
  project_record RECORD;
  collaborator_id UUID;
BEGIN
  -- Only run if old collaborators column exists
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='collaborators') THEN
    FOR project_record IN 
      SELECT id, created_by, collaborators 
      FROM projects 
      WHERE collaborators IS NOT NULL AND array_length(collaborators, 1) > 0
    LOOP
      FOREACH collaborator_id IN ARRAY project_record.collaborators
      LOOP
        -- Skip if it's the owner (already added above)
        IF collaborator_id != project_record.created_by THEN
          INSERT INTO project_collaborators (project_id, user_id, role, status, joined_at)
          VALUES (project_record.id, collaborator_id, 'editor', 'active', NOW())
          ON CONFLICT (project_id, user_id) DO NOTHING;
        END IF;
      END LOOP;
    END LOOP;
  END IF;
END $$;

-- 7. POPULATE SLUGS TABLE
-- Move slugs to dedicated table for better performance
INSERT INTO project_slugs (slug, project_id)
SELECT slug, id FROM projects 
WHERE slug IS NOT NULL
ON CONFLICT (slug) DO NOTHING;

-- 8. PRODUCTION-READY FUNCTIONS

-- High-performance slug generation with proper locking
CREATE OR REPLACE FUNCTION generate_unique_slug_v2(input_title TEXT, project_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
  max_attempts INTEGER := 100;
BEGIN
  -- Generate base slug
  base_slug := LOWER(
    TRIM(
      REGEXP_REPLACE(
        REGEXP_REPLACE(input_title, '[^a-zA-Z0-9\s-]', '', 'g'), 
        '\s+', '-', 'g'
      ), 
      '-'
    )
  );
  
  -- Ensure minimum length
  IF length(base_slug) < 3 THEN
    base_slug := base_slug || '-project';
  END IF;
  
  final_slug := base_slug;
  
  -- Use advisory lock to prevent race conditions
  PERFORM pg_advisory_lock(hashtext(base_slug));
  
  BEGIN
    -- Find unique slug
    WHILE counter <= max_attempts LOOP
      IF NOT EXISTS (
        SELECT 1 FROM project_slugs 
        WHERE slug = final_slug 
        AND (project_id IS NULL OR project_id != project_id)
      ) THEN
        EXIT;
      END IF;
      
      final_slug := base_slug || '-' || counter;
      counter := counter + 1;
    END LOOP;
    
    -- Release lock
    PERFORM pg_advisory_unlock(hashtext(base_slug));
    
    IF counter > max_attempts THEN
      RAISE EXCEPTION 'Could not generate unique slug after % attempts', max_attempts;
    END IF;
    
    RETURN final_slug;
  EXCEPTION WHEN OTHERS THEN
    -- Ensure lock is released on error
    PERFORM pg_advisory_unlock(hashtext(base_slug));
    RAISE;
  END;
END;
$$ LANGUAGE plpgsql;

-- 9. UPDATED TRIGGERS

-- Project slug trigger (improved)
CREATE OR REPLACE FUNCTION trigger_manage_project_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle slug on INSERT
  IF TG_OP = 'INSERT' THEN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
      NEW.slug := generate_unique_slug_v2(NEW.title, NEW.id);
    END IF;
    
    -- Insert into slugs table
    INSERT INTO project_slugs (slug, project_id) 
    VALUES (NEW.slug, NEW.id)
    ON CONFLICT (slug) DO NOTHING;
    
  -- Handle slug on UPDATE
  ELSIF TG_OP = 'UPDATE' THEN
    -- Update timestamp
    NEW.updated_at := NOW();
    
    -- If title changed, optionally update slug
    IF OLD.title != NEW.title AND (NEW.slug IS NULL OR NEW.slug = OLD.slug) THEN
      NEW.slug := generate_unique_slug_v2(NEW.title, NEW.id);
      
      -- Update slugs table
      UPDATE project_slugs SET slug = NEW.slug WHERE project_id = NEW.id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Activity logging trigger
CREATE OR REPLACE FUNCTION trigger_log_project_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO project_activities (project_id, user_id, activity_type, metadata)
    VALUES (NEW.id, NEW.created_by, 'project_created', jsonb_build_object('title', NEW.title));
    RETURN NEW;
    
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO project_activities (project_id, user_id, activity_type, metadata)
    VALUES (NEW.id, NEW.created_by, 'project_updated', 
      jsonb_build_object(
        'old_title', OLD.title,
        'new_title', NEW.title,
        'changes', jsonb_build_object(
          'title_changed', OLD.title != NEW.title,
          'description_changed', OLD.description != NEW.description,
          'visibility_changed', OLD.visibility != NEW.visibility
        )
      )
    );
    RETURN NEW;
    
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO project_activities (project_id, user_id, activity_type, metadata)
    VALUES (OLD.id, OLD.created_by, 'project_deleted', jsonb_build_object('title', OLD.title));
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop old triggers
DROP TRIGGER IF EXISTS trigger_generate_project_slug ON projects;

-- Create new triggers
CREATE TRIGGER trigger_manage_project_slug
  BEFORE INSERT OR UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION trigger_manage_project_slug();

CREATE TRIGGER trigger_log_project_activity
  AFTER INSERT OR UPDATE OR DELETE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION trigger_log_project_activity();

-- 10. PRODUCTION RLS POLICIES (Updated for new schema)

-- Drop old policies
DROP POLICY IF EXISTS "Users can view accessible projects" ON projects;
DROP POLICY IF EXISTS "Users can create own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;

-- Enhanced RLS policies
CREATE POLICY "Users can view accessible projects" ON projects
  FOR SELECT USING (
    visibility = 'public' OR 
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM project_collaborators 
      WHERE project_id = projects.id 
      AND user_id = auth.uid() 
      AND status = 'active'
    )
  );

CREATE POLICY "Users can create projects" ON projects
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update projects they own or admin" ON projects
  FOR UPDATE USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM project_collaborators 
      WHERE project_id = projects.id 
      AND user_id = auth.uid() 
      AND role IN ('owner', 'admin')
      AND status = 'active'
    )
  );

CREATE POLICY "Users can delete projects they own" ON projects
  FOR DELETE USING (created_by = auth.uid());

-- Project collaborators policies
ALTER TABLE project_collaborators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view project collaborators" ON project_collaborators
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_collaborators.project_id 
      AND (
        visibility = 'public' OR 
        created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM project_collaborators pc2
          WHERE pc2.project_id = projects.id 
          AND pc2.user_id = auth.uid() 
          AND pc2.status = 'active'
        )
      )
    )
  );

CREATE POLICY "Users can manage collaborators they admin" ON project_collaborators
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_collaborators.project_id 
      AND (
        created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM project_collaborators pc2
          WHERE pc2.project_id = projects.id 
          AND pc2.user_id = auth.uid() 
          AND pc2.role IN ('owner', 'admin')
          AND pc2.status = 'active'
        )
      )
    )
  );

-- Activity log policies
ALTER TABLE project_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view project activities they have access to" ON project_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE id = project_activities.project_id 
      AND (
        visibility = 'public' OR 
        created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM project_collaborators 
          WHERE project_id = projects.id 
          AND user_id = auth.uid() 
          AND status = 'active'
        )
      )
    )
  );

-- Project slugs policies
ALTER TABLE project_slugs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view project slugs" ON project_slugs
  FOR SELECT USING (true);

-- 11. PERFORMANCE MONITORING VIEWS

-- View for project statistics
CREATE OR REPLACE VIEW project_stats AS
SELECT 
  p.id,
  p.title,
  p.slug,
  p.visibility,
  p.status,
  p.created_at,
  p.updated_at,
  COUNT(DISTINCT pc.user_id) FILTER (WHERE pc.status = 'active') as collaborator_count,
  COUNT(DISTINCT l.id) as log_count,
  MAX(l.created_at) as last_activity
FROM projects p
LEFT JOIN project_collaborators pc ON p.id = pc.project_id
LEFT JOIN logs l ON p.id = l.project_id
GROUP BY p.id, p.title, p.slug, p.visibility, p.status, p.created_at, p.updated_at;

-- View for user project access
CREATE OR REPLACE VIEW user_project_access AS
SELECT 
  u.id as user_id,
  u.name as user_name,
  p.id as project_id,
  p.title as project_title,
  p.slug as project_slug,
  COALESCE(pc.role, 'owner') as role,
  COALESCE(pc.status, 'active') as status,
  CASE 
    WHEN p.created_by = u.id THEN 'owner'
    ELSE COALESCE(pc.role, 'none')
  END as effective_role
FROM users u
CROSS JOIN projects p
LEFT JOIN project_collaborators pc ON p.id = pc.project_id AND u.id = pc.user_id
WHERE 
  p.visibility = 'public' OR 
  p.created_by = u.id OR 
  (pc.user_id IS NOT NULL AND pc.status = 'active');

COMMIT;
