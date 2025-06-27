import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Content = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export async function getAllContent() {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Content[];
}

export async function getContentById(id: string) {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Content;
}

export async function createContent(title: string, content: string) {
  const { data, error } = await supabase
    .from('content')
    .insert([{ title, content }])
    .select()
    .single();

  if (error) throw error;
  return data as Content;
}

export async function updateContent(id: string, title: string, content: string) {
  const { data, error } = await supabase
    .from('content')
    .update({ title, content, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Content;
}
