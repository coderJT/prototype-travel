import { createClient } from '@supabase/supabase-js';

// Default to env variables if configured, with sensible demo fallbacks
const SUPABASE_URL_KEY = 'escapeplan_supabase_url';
const SUPABASE_ANON_KEY = 'escapeplan_supabase_anon_key';

const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export function getSavedSupabaseConfig() {
  const customUrl = localStorage.getItem(SUPABASE_URL_KEY) || envUrl;
  const customKey = localStorage.getItem(SUPABASE_ANON_KEY) || envAnonKey;
  return {
    url: customUrl.trim(),
    anonKey: customKey.trim(),
    isConfigured: Boolean(customUrl && customKey)
  };
}

export function saveSupabaseConfig(url, anonKey) {
  if (url) localStorage.setItem(SUPABASE_URL_KEY, url.trim());
  if (anonKey) localStorage.setItem(SUPABASE_ANON_KEY, anonKey.trim());
  initClient();
}

let supabaseInstance = null;

function initClient() {
  const { url, anonKey, isConfigured } = getSavedSupabaseConfig();
  if (isConfigured) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      supabaseInstance = null;
    }
  } else {
    supabaseInstance = null;
  }
  return supabaseInstance;
}

// Initial client boot
initClient();

export function getSupabase() {
  if (!supabaseInstance) {
    initClient();
  }
  return supabaseInstance;
}

// Auth Helper Functions
export async function signUpWithEmail(email, password) {
  const client = getSupabase();
  if (!client) {
    // Local demo simulation if Supabase is not yet configured with remote keys
    const demoUser = {
      id: `usr-${Date.now()}`,
      email,
      created_at: new Date().toISOString()
    };
    localStorage.setItem('escapeplan_demo_user', JSON.stringify(demoUser));
    return { data: { user: demoUser }, error: null };
  }
  return await client.auth.signUp({ email, password });
}

export async function signInWithEmail(email, password) {
  const client = getSupabase();
  if (!client) {
    // Local demo simulation
    const demoUser = {
      id: `usr-${Date.now()}`,
      email,
      last_sign_in_at: new Date().toISOString()
    };
    localStorage.setItem('escapeplan_demo_user', JSON.stringify(demoUser));
    return { data: { user: demoUser }, error: null };
  }
  return await client.auth.signInWithPassword({ email, password });
}

export async function signOutUser() {
  const client = getSupabase();
  localStorage.removeItem('escapeplan_demo_user');
  if (!client) {
    return { error: null };
  }
  return await client.auth.signOut();
}

export async function getInitialUser() {
  const client = getSupabase();
  if (!client) {
    const raw = localStorage.getItem('escapeplan_demo_user');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
  const { data } = await client.auth.getSession();
  return data?.session?.user || null;
}
