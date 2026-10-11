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
 * Returns both portfolios (family + personal) for the current user.
 * { family: Portfolio | null, personal: Portfolio | null, error }
 */
export async function getPortfolios() {
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .order('type');                     // 'family' < 'personal' alphabetically

  if (error) return { family: null, personal: null, error: error.message };

  const family   = data.find(p => p.type === 'family')   ?? null;
  const personal = data.find(p => p.type === 'personal') ?? null;

  return { family, personal, error: null };
}


/**
 * ensurePortfolios(user)
 * Creates family + personal portfolios for a user if they don't exist yet.
 * Call once after first login.
 * Returns { family, personal, error }
 */
export async function ensurePortfolios(user) {
  const { family, personal, error: fetchError } = await getPortfolios();
  if (fetchError) return { family: null, personal: null, error: fetchError };

  const toCreate = [];
  if (!family)   toCreate.push({ user_id: user.id, type: 'family',   label: 'Inversiones Familia' });
  if (!personal) toCreate.push({ user_id: user.id, type: 'personal', label: 'Inversiones Personales' });

  if (toCreate.length === 0) return { family, personal, error: null };

  const { data, error } = await supabase
    .from('portfolios')
    .insert(toCreate)
    .select();

  if (error) return { family: null, personal: null, error: error.message };

  const all = [family, personal, ...data].filter(Boolean);
  return {
    family:   all.find(p => p.type === 'family')   ?? null,
    personal: all.find(p => p.type === 'personal') ?? null,
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
 * Returns { family, personal, familyAssets, personalAssets,
 *           familyObjectives, personalObjectives, error }
 */
export async function loadPortfolioData(user) {
  // Ensure portfolios exist (safe to call every login)
  const { family, personal, error: pErr } = await ensurePortfolios(user);
  if (pErr) return { error: pErr };

  // Load assets and objectives in parallel
  const [
    { assets: familyAssets,       error: faErr },
    { assets: personalAssets,     error: paErr },
    { objectives: familyObjs,     error: foErr },
    { objectives: personalObjs,   error: poErr },
  ] = await Promise.all([
    getAssets(family.id),
    getAssets(personal.id),
    getObjectives(family.id),
    getObjectives(personal.id),
  ]);

  const error = faErr || paErr || foErr || poErr || null;

  return {
    family,
    personal,
    familyAssets,
    personalAssets,
    familyObjectives:  familyObjs,
    personalObjectives: personalObjs,
    error,
  };
}