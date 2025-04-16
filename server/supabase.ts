import { createClient } from '@supabase/supabase-js';

// Create a Supabase client instance
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common Supabase operations
export const fetchData = async <T>(table: string, columns: string = '*'): Promise<T[]> => {
  const { data, error } = await supabase
    .from(table)
    .select(columns);
  
  if (error) {
    console.error(`Error fetching data from ${table}:`, error);
    throw error;
  }
  
  return data as T[];
};

export const fetchById = async <T>(table: string, id: number, columns: string = '*'): Promise<T | null> => {
  const { data, error } = await supabase
    .from(table)
    .select(columns)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching ${table} with id ${id}:`, error);
    throw error;
  }
  
  return data as T;
};

export const insertData = async <T>(table: string, data: any): Promise<T> => {
  const { data: insertedData, error } = await supabase
    .from(table)
    .insert(data)
    .select()
    .single();
  
  if (error) {
    console.error(`Error inserting data into ${table}:`, error);
    throw error;
  }
  
  return insertedData as T;
};

export const updateData = async <T>(table: string, id: number, data: any): Promise<T> => {
  const { data: updatedData, error } = await supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating ${table} with id ${id}:`, error);
    throw error;
  }
  
  return updatedData as T;
};

export const deleteData = async (table: string, id: number): Promise<void> => {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting from ${table} with id ${id}:`, error);
    throw error;
  }
};