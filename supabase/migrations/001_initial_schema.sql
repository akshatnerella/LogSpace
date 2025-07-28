-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    collaborators UUID[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create logs table
CREATE TABLE logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own records
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (id = auth.uid()::text::uuid);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (id = auth.uid()::text::uuid);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (id = auth.uid()::text::uuid);

-- Projects: owner or collaborator can read/write
CREATE POLICY "Users can view own projects or projects they collaborate on" ON projects 
FOR SELECT USING (
    created_by = auth.uid()::text::uuid OR 
    auth.uid()::text::uuid = ANY(collaborators)
);

CREATE POLICY "Users can create projects" ON projects 
FOR INSERT WITH CHECK (created_by = auth.uid()::text::uuid);

CREATE POLICY "Project owners can update projects" ON projects 
FOR UPDATE USING (created_by = auth.uid()::text::uuid);

CREATE POLICY "Project owners can delete projects" ON projects 
FOR DELETE USING (created_by = auth.uid()::text::uuid);

-- Logs: creator can write, project collaborators can read
CREATE POLICY "Users can view logs for projects they have access to" ON logs 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM projects 
        WHERE projects.id = logs.project_id 
        AND (
            projects.created_by = auth.uid()::text::uuid OR 
            auth.uid()::text::uuid = ANY(projects.collaborators)
        )
    )
);

CREATE POLICY "Users can create logs for accessible projects" ON logs 
FOR INSERT WITH CHECK (
    created_by = auth.uid()::text::uuid AND
    EXISTS (
        SELECT 1 FROM projects 
        WHERE projects.id = logs.project_id 
        AND (
            projects.created_by = auth.uid()::text::uuid OR 
            auth.uid()::text::uuid = ANY(projects.collaborators)
        )
    )
);

CREATE POLICY "Log creators can update their logs" ON logs 
FOR UPDATE USING (created_by = auth.uid()::text::uuid);

CREATE POLICY "Log creators can delete their logs" ON logs 
FOR DELETE USING (created_by = auth.uid()::text::uuid);

-- Create indexes for better performance
CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_projects_collaborators ON projects USING GIN(collaborators);
CREATE INDEX idx_logs_project_id ON logs(project_id);
CREATE INDEX idx_logs_created_by ON logs(created_by);
