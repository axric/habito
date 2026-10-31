// ============================================================
// data.js — User portfolio data layer
// Terminal Financiera Personal v0.2.0
// ============================================================

import { supabase } from './auth.js';


// ------------------------------------------------------------
// PORTFOLIOS
// ------------------------------------------------------------

/**
 * getPortfolios()
 * Returns both portfolios (main + retirement) for the current user.
 * { main: Portfolio | null, retirement: Portfolio | null, error }
 */
export async function getPortfolios() {
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .order('type');                     // 'main' < 'retirement' alphabetically

  if (error) return { main: null, retirement: null, error: error.message };

  const main      = data.find(p => p.type === 'main')      ?? null;
  const retirement = data.find(p => p.type === 'retirement') ?? null;

  return { main, retirement, error: null };
}


/**
 * ensurePortfolios(user)
 * Creates main + retirement portfolios for a user if they don't exist yet.
 * Call once after first login.
 * Returns { main, retirement, error }
 */
export async function ensurePortfolios(user) {
  const { main, retirement, error: fetchError } = await getPortfolios();
  if (fetchError) return { main: null, retirement: null, error: fetchError };

  const toCreate = [];
  if (!main)      toCreate.push({ user_id: user.id, type: 'main',      label: 'Main Portfolio' });
  if (!retirement) toCreate.push({ user_id: user.id, type: 'retirement', label: '2050' });

  if (toCreate.length === 0) return { main, retirement, error: null };

  const { data, error } = await supabase
    .from('portfolios')
    .insert(toCreate)
    .select();

  if (error) return { main: null, retirement: null, error: error.message };

  const all = [main, retirement, ...data].filter(Boolean);
  return {
    main:      all.find(p => p.type === 'main')      ?? null,
    retirement: all.find(p => p.type === 'retirement') ?? null,
    error: null,
  };
}


// ------------------------------------------------------------
// ASSETS
// ------------------------------------------------------------

/**
 * getAssets(portfolioId)
 * Returns all assets for a given portfolio, ordered by sort_order.
 * { assets: Asset[], error }
 */
export async function getAssets(portfolioId) {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .eq('portfolio_id', portfolioId)
    .order('sort_order');

  if (error) return { assets: [], error: error.message };
  return { assets: data, error: null };
}


/**
 * upsertAsset(asset)
 * Insert or update a single asset.
 * Pass id to update, omit to insert.
 * { asset, error }
 */
export async function upsertAsset(asset) {
  const { data, error } = await supabase
    .from('assets')
    .upsert(asset, { onConflict: 'id' })
    .select()
    .single();

  if (error) return { asset: null, error: error.message };
  return { asset: data, error: null };
}


/**
 * deleteAsset(id)
 * { error }
 */
export async function deleteAsset(id) {
  const { error } = await supabase
    .from('assets')
    .delete()
    .eq('id', id);

  return { error: error?.message ?? null };
}


// ------------------------------------------------------------
// OBJECTIVES
// ------------------------------------------------------------

/**
 * getObjectives(portfolioId)
 * Returns all objectives for a given portfolio, ordered by sort_order.
 * { objectives: Objective[], error }
 */
export async function getObjectives(portfolioId) {
  const { data, error } = await supabase
    .from('objectives')
    .select('*')
    .eq('portfolio_id', portfolioId)
    .order('sort_order');

  if (error) return { objectives: [], error: error.message };
  return { objectives: data, error: null };
}


/**
 * upsertObjective(objective)
 * Insert or update a single objective.
 * { objective, error }
 */
export async function upsertObjective(objective) {
  const { data, error } = await supabase
    .from('objectives')
    .upsert(objective, { onConflict: 'id' })
    .select()
    .single();

  if (error) return { objective: null, error: error.message };
  return { objective: data, error: null };
}


/**
 * deleteObjective(id)
 * { error }
 */
export async function deleteObjective(id) {
  const { error } = await supabase
    .from('objectives')
    .delete()
    .eq('id', id);

  return { error: error?.message ?? null };
}

export async function load(userId) {
  const { data, error } = await supabase
    .from('user_data')
    .select('data')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data?.data ?? null;
}

let pendingSave = Promise.resolve();

export function save(userId, state) {
  const snapshot = JSON.parse(JSON.stringify(state));
  const nextSave = pendingSave.catch(() => {}).then(async () => {
    const { error } = await supabase
      .from('user_data')
      .upsert({ user_id: userId, data: snapshot }, { onConflict: 'user_id' });
    if (error) throw error;
  });

  pendingSave = nextSave;
  return nextSave;
}

window.HabitoData = { load, save };


// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------

/**
 * loadPortfolioData(user)
 * Convenience function — loads everything needed to render the dashboard.
 * Returns { main, retirement, mainAssets, retirementAssets,
 *           mainObjectives, retirementObjectives, error }
 */
export async function loadPortfolioData(user) {
  // Ensure portfolios exist (safe to call every login)
  const { main, retirement, error: pErr } = await ensurePortfolios(user);
  if (pErr) return { error: pErr };

  // Load assets and objectives in parallel
  const [
    { assets: mainAssets,          error: maErr },
    { assets: retirementAssets,    error: raErr },
    { objectives: mainObjectives,  error: moErr },
    { objectives: retirementObjs,  error: roErr },
  ] = await Promise.all([
    getAssets(main.id),
    getAssets(retirement.id),
    getObjectives(main.id),
    getObjectives(retirement.id),
  ]);

  const error = maErr || raErr || moErr || roErr || null;

  return {
    main,
    retirement,
    mainAssets,
    retirementAssets,
    mainObjectives,
    retirementObjectives: retirementObjs,
    error,
  };
}