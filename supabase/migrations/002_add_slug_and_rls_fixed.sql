-- Create function to generate unique slug from title
CREATE OR REPLACE FUNCTION generate_unique_slug(input_title TEXT, project_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  -- Generate base slug from title
  base_slug := LOWER(REGEXP_REPLACE(REGEXP_REPLACE(input_title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
  final_slug := base_slug;
  
  -- Handle potential duplicates by appending a number
  WHILE EXISTS (
    SELECT 1 FROM projects 
    WHERE slug = final_slug 
    AND (project_id IS NULL OR id != project_id)
  ) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Add slug column to projects table (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='slug') THEN
    ALTER TABLE projects ADD COLUMN slug TEXT;
  END IF;
END $$;

-- Create index for faster slug lookups (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_projects_slug') THEN
    CREATE INDEX idx_projects_slug ON projects(slug);
  END IF;
END $$;

-- Populate existing projects with unique slugs
DO $$
DECLARE
  project_record RECORD;
BEGIN
  FOR project_record IN SELECT id, title FROM projects WHERE slug IS NULL LOOP
    UPDATE projects 
    SET slug = generate_unique_slug(project_record.title, project_record.id)
    WHERE id = project_record.id;
  END LOOP;
END $$;

-- Add unique constraint on slug (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='projects_slug_key') THEN
    ALTER TABLE projects ADD CONSTRAINT projects_slug_key UNIQUE (slug);
  END IF;
END $$;

-- Make slug NOT NULL after populating existing data
ALTER TABLE projects ALTER COLUMN slug SET NOT NULL;

-- Enable Row Level Security on all tables (if not already enabled)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename='users' AND rowsecurity=true) THEN
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename='projects' AND rowsecurity=true) THEN
    ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename='logs' AND rowsecurity=true) THEN
    ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can view accessible projects" ON projects;
DROP POLICY IF EXISTS "Users can create own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;
DROP POLICY IF EXISTS "Users can view accessible logs" ON logs;
DROP POLICY IF EXISTS "Users can create logs in accessible projects" ON logs;
DROP POLICY IF EXISTS "Users can update own logs" ON logs;
DROP POLICY IF EXISTS "Users can delete own logs" ON logs;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for projects table
CREATE POLICY "Users can view accessible projects" ON projects
  FOR SELECT USING (
    is_public = true OR 
    created_by = auth.uid() OR
    auth.uid() = ANY(collaborators)
  );

CREATE POLICY "Users can create own projects" ON projects
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (created_by = auth.uid());

-- RLS Policies for logs table
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

-- Create trigger function to auto-generate slugs for new projects
CREATE OR REPLACE FUNCTION trigger_generate_project_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate slug from title if slug is not provided or empty
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_unique_slug(NEW.title, NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_generate_project_slug ON projects;

-- Create trigger to auto-generate slugs
CREATE TRIGGER trigger_generate_project_slug
  BEFORE INSERT OR UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION trigger_generate_project_slug();
