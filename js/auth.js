// ============================================================
// auth.js — Supabase Auth handler
// Terminal Financiera Personal v0.2.0
// ============================================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const configResponse = await fetch('/api/config', { cache: 'no-store' });
if (!configResponse.ok) {
  throw new Error(`No se pudo cargar la configuración de Supabase (HTTP ${configResponse.status}).`);
}

const config = await configResponse.json();
if (!config.supabaseUrl || !config.supabaseAnonKey) {
  throw new Error('Falta la URL o la clave pública de Supabase en la configuración de Vercel.');
}

let supabaseUrl;
try {
  supabaseUrl = new URL(config.supabaseUrl);
} catch {
  throw new Error('La URL de Supabase configurada en Vercel no es válida.');
}
if (supabaseUrl.protocol !== 'https:' && supabaseUrl.protocol !== 'http:') {
  throw new Error('La URL de Supabase debe comenzar con https://.');
}

export const supabase = createClient(supabaseUrl.toString().replace(/\/$/, ''), config.supabaseAnonKey);


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
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  window.location.href = '/';
}


// ------------------------------------------------------------
// getSession()
// Returns current session or null
// ------------------------------------------------------------
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
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
    window.location.replace('/');
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
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
}