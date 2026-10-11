// ============================================================
// auth.js — Supabase Auth handler
// Terminal Financiera Personal v0.2.0
// ============================================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ------------------------------------------------------------
// Init — replace with your Supabase project values
// These are safe to expose in the frontend (anon key only)
// ------------------------------------------------------------
const SUPABASE_URL  = '__SUPABASE_URL__';
const SUPABASE_ANON = '__SUPABASE_ANON_KEY__';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);


// ------------------------------------------------------------
// signIn(email, password)
// Returns { user, error }
// ------------------------------------------------------------
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { user: null, error: error.message };
  return { user: data.user, error: null };
}


// ------------------------------------------------------------
// signOut()
// Clears session and redirects to login
// ------------------------------------------------------------
export async function signOut() {
  await supabase.auth.signOut();
  window.location.href = '/index.html';
}


// ------------------------------------------------------------
// getSession()
// Returns current session or null
// ------------------------------------------------------------
export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}


// ------------------------------------------------------------
// requireAuth()
// Call at the top of dashboard.html
// Redirects to login if no active session
// ------------------------------------------------------------
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    window.location.href = '/index.html';
    return null;
  }
  return session.user;
}


// ------------------------------------------------------------
// onAuthChange(callback)
// Listener for session changes (login, logout, token refresh)
// Usage: onAuthChange((user) => { ... })
// ------------------------------------------------------------
export function onAuthChange(callback) {
  supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
}