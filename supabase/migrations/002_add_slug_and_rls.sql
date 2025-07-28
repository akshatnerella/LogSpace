-- Add slug column to projects table
ALTER TABLE projects ADD COLUMN slug TEXT UNIQUE;

-- Create index for faster slug lookups
CREATE INDEX idx_projects_slug ON projects(slug);

-- Populate existing projects with slugs (convert title to slug)
UPDATE projects SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL;

-- Make slug NOT NULL after populating existing data
ALTER TABLE projects ALTER COLUMN slug SET NOT NULL;

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
-- Users can only see and update their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for projects table
-- Users can view public projects or projects they created/collaborate on
CREATE POLICY "Users can view accessible projects" ON projects
  FOR SELECT USING (
    is_public = true OR 
    created_by = auth.uid() OR
    auth.uid() = ANY(collaborators)
  );

-- Users can only create projects for themselves
CREATE POLICY "Users can create own projects" ON projects
  FOR INSERT WITH CHECK (created_by = auth.uid());

-- Users can update projects they created
CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (created_by = auth.uid());

-- Users can delete projects they created
CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (created_by = auth.uid());

-- RLS Policies for logs table
-- Users can view logs from projects they have access to
CREATE POLICY "Users can view accessible logs" ON logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = logs.project_id 
      AND (
        projects.is_public = true OR 
        projects.created_by = auth.uid() OR
        auth.uid() = ANY(projects.collaborators)
      )
    )
  );

-- Users can create logs in projects they have access to
CREATE POLICY "Users can create logs in accessible projects" ON logs
  FOR INSERT WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = logs.project_id 
      AND (
        projects.created_by = auth.uid() OR
        auth.uid() = ANY(projects.collaborators)
      )
    )
  );

-- Users can update their own logs in accessible projects
CREATE POLICY "Users can update own logs" ON logs
  FOR UPDATE USING (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = logs.project_id 
      AND (
        projects.created_by = auth.uid() OR
        auth.uid() = ANY(projects.collaborators)
      )
    )
  );

-- Users can delete their own logs in accessible projects
CREATE POLICY "Users can delete own logs" ON logs
  FOR DELETE USING (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = logs.project_id 
      AND (
        projects.created_by = auth.uid() OR
        auth.uid() = ANY(projects.collaborators)
      )
    )
  );

-- Create function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug_from_title()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate slug from title if slug is not provided
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := LOWER(REGEXP_REPLACE(REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
    
    -- Handle potential duplicates by appending a number
    DECLARE
      counter INTEGER := 1;
      base_slug TEXT := NEW.slug;
    BEGIN
      WHILE EXISTS (SELECT 1 FROM projects WHERE slug = NEW.slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)) LOOP
        NEW.slug := base_slug || '-' || counter;
        counter := counter + 1;
      END LOOP;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate slugs
CREATE TRIGGER trigger_generate_project_slug
  BEFORE INSERT OR UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION generate_slug_from_title();
