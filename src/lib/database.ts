import { supabase } from './supabaseClient';
import { User, Project, Log, CreateProjectData, CreateLogData } from '@/types/database';

// User operations
export async function upsertUser(userData: Omit<User, 'created_at'>): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .upsert(userData, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('Error upserting user:', error);
    return null;
  }

  return data;
}

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
}

// Project operations
export async function createProject(projectData: CreateProjectData, userId: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      ...projectData,
      created_by: userId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    return null;
  }

  return data;
}

export async function getProjectsByUser(userId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .or(`created_by.eq.${userId},collaborators.cs.{${userId}}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data || [];
}

export async function getProjectById(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }

  return data;
}

export async function updateProject(id: string, updates: Partial<CreateProjectData>): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    return null;
  }

  return data;
}

export async function deleteProject(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    return false;
  }

  return true;
}

// Log operations
export async function createLog(logData: CreateLogData, userId: string): Promise<Log | null> {
  const { data, error } = await supabase
    .from('logs')
    .insert({
      ...logData,
      created_by: userId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating log:', error);
    return null;
  }

  return data;
}

export async function getLogsForProject(projectId: string): Promise<Log[]> {
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching logs:', error);
    return [];
  }

  return data || [];
}

export async function deleteLog(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('logs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting log:', error);
    return false;
  }

  return true;
}
