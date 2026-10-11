// ============================================================
// macro.js — Shared macro data layer
// Terminal Financiera Personal v0.2.0
// ============================================================

import { supabase } from './auth.js';


// ------------------------------------------------------------
// Known macro keys (matches schema.sql seeds)
// ------------------------------------------------------------
export const MACRO_KEYS = {
  DOLAR_OFICIAL:  'dolar_oficial',
  DOLAR_MEP:      'dolar_mep',
  DOLAR_BLUE:     'dolar_blue',
  DOLAR_CCL:      'dolar_ccl',
  RIESGO_PAIS:    'riesgo_pais',
  INFLACION_IPC:  'inflacion_ipc',
  BRENT:          'brent',
  SP500:          'sp500',
  BITCOIN:        'bitcoin',
  UST_1Y:         'ust_1y',
  UST_5Y:         'ust_5y',
  UST_10Y:        'ust_10y',
};


// ------------------------------------------------------------
// getMacroData()
// Returns all macro indicators as a key→record map.
// { data: { [key]: MacroRecord }, error }
//
// MacroRecord shape:
//   { id, key, value, label, change, context, updated_at }
// ------------------------------------------------------------
export async function getMacroData() {
  const { data, error } = await supabase
    .from('macro_data')
    .select('*')
    .order('key');

  if (error) return { data: null, error: error.message };

  // Convert array → map for easy lookup: macro['dolar_oficial'].value
  const map = {};
  for (const row of data) map[row.key] = row;

  return { data: map, error: null };
}


// ------------------------------------------------------------
// getMacroIndicator(key)
// Returns a single indicator by key.
// { indicator: MacroRecord | null, error }
// ------------------------------------------------------------
export async function getMacroIndicator(key) {
  const { data, error } = await supabase
    .from('macro_data')
    .select('*')
    .eq('key', key)
    .single();

  if (error) return { indicator: null, error: error.message };
  return { indicator: data, error: null };
}


// ------------------------------------------------------------
// updateMacroIndicator(key, fields)
// Admin-only update — will fail for regular users due to RLS.
// Useful for manual updates or future cron job.
// { error }
//
// Usage:
//   await updateMacroIndicator('dolar_oficial', {
//     value: '1415',
//     change: '+0,35%',
//     context: 'Cerró en alza tras...'
//   });
// ------------------------------------------------------------
export async function updateMacroIndicator(key, fields) {
  const { error } = await supabase
    .from('macro_data')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('key', key);

  return { error: error?.message ?? null };
}


// ------------------------------------------------------------
// getLastUpdated()
// Returns the most recent updated_at timestamp across all indicators.
// Useful for showing "last refreshed" in the UI.
// { timestamp: string | null, error }
// ------------------------------------------------------------
export async function getLastUpdated() {
  const { data, error } = await supabase
    .from('macro_data')
    .select('updated_at')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (error) return { timestamp: null, error: error.message };
  return { timestamp: data.updated_at, error: null };
}


// ------------------------------------------------------------
// formatMacroForDashboard(macroMap)
// Transforms the raw Supabase map into the shape the
// dashboard cards expect, matching the current HTML structure.
//
// Returns an array of card objects:
//   { key, label, value, change, changeColor, sub, context }
// ------------------------------------------------------------
export function formatMacroForDashboard(macroMap) {
  if (!macroMap) return [];

  const colorFor = (change) => {
    if (!change) return 'neu';
    const c = change.trim();
    if (c.startsWith('+')) return 'pos';
    if (c.startsWith('-') || c.startsWith('▼')) return 'neg';
    return 'neu';
  };

  return [
    {
      key:         MACRO_KEYS.DOLAR_OFICIAL,
      label:       macroMap[MACRO_KEYS.DOLAR_OFICIAL]?.label  ?? 'Dólar Oficial BNA',
      value:       `$${Number(macroMap[MACRO_KEYS.DOLAR_OFICIAL]?.value ?? 0).toLocaleString('es-AR')}`,
      change:      macroMap[MACRO_KEYS.DOLAR_OFICIAL]?.change ?? '—',
      changeColor: colorFor(macroMap[MACRO_KEYS.DOLAR_OFICIAL]?.change),
      sub:         'BNA venta',
      context:     macroMap[MACRO_KEYS.DOLAR_OFICIAL]?.context ?? null,
    },
    {
      key:         MACRO_KEYS.DOLAR_MEP,
      label:       macroMap[MACRO_KEYS.DOLAR_MEP]?.label  ?? 'Dólar MEP',
      value:       `$${Number(macroMap[MACRO_KEYS.DOLAR_MEP]?.value ?? 0).toLocaleString('es-AR')}`,
      change:      macroMap[MACRO_KEYS.DOLAR_MEP]?.change ?? '—',
      changeColor: colorFor(macroMap[MACRO_KEYS.DOLAR_MEP]?.change),
      sub:         'Bolsa',
      context:     macroMap[MACRO_KEYS.DOLAR_MEP]?.context ?? null,
    },
    {
      key:         MACRO_KEYS.DOLAR_BLUE,
      label:       macroMap[MACRO_KEYS.DOLAR_BLUE]?.label  ?? 'Dólar Blue',
      value:       `$${Number(macroMap[MACRO_KEYS.DOLAR_BLUE]?.value ?? 0).toLocaleString('es-AR')}`,
      change:      macroMap[MACRO_KEYS.DOLAR_BLUE]?.change ?? '—',
      changeColor: colorFor(macroMap[MACRO_KEYS.DOLAR_BLUE]?.change),
      sub:         'Informal',
      context:     macroMap[MACRO_KEYS.DOLAR_BLUE]?.context ?? null,
    },
    {
      key:         MACRO_KEYS.RIESGO_PAIS,
      label:       macroMap[MACRO_KEYS.RIESGO_PAIS]?.label  ?? 'Riesgo País EMBI+',
      value:       `${macroMap[MACRO_KEYS.RIESGO_PAIS]?.value ?? '—'} pb`,
      change:      macroMap[MACRO_KEYS.RIESGO_PAIS]?.change ?? '—',
      changeColor: colorFor(macroMap[MACRO_KEYS.RIESGO_PAIS]?.change),
      sub:         'JP Morgan',
      context:     macroMap[MACRO_KEYS.RIESGO_PAIS]?.context ?? null,
    },
    {
      key:         MACRO_KEYS.INFLACION_IPC,
      label:       macroMap[MACRO_KEYS.INFLACION_IPC]?.label  ?? 'IPC — INDEC',
      value:       `${macroMap[MACRO_KEYS.INFLACION_IPC]?.value ?? '—'}%`,
      change:      macroMap[MACRO_KEYS.INFLACION_IPC]?.change ?? '—',
      changeColor: colorFor(macroMap[MACRO_KEYS.INFLACION_IPC]?.change),
      sub:         'Mensual',
      context:     macroMap[MACRO_KEYS.INFLACION_IPC]?.context ?? null,
    },
    {
      key:         MACRO_KEYS.BRENT,
      label:       macroMap[MACRO_KEYS.BRENT]?.label  ?? 'Brent Crude',
      value:       `us$ ${macroMap[MACRO_KEYS.BRENT]?.value ?? '—'}`,
      change:      macroMap[MACRO_KEYS.BRENT]?.change ?? '—',
      changeColor: colorFor(macroMap[MACRO_KEYS.BRENT]?.change),
      sub:         'USD/barril',
      context:     macroMap[MACRO_KEYS.BRENT]?.context ?? null,
    },
    {
      key:         MACRO_KEYS.SP500,
      label:       macroMap[MACRO_KEYS.SP500]?.label  ?? 'S&P 500',
      value:       Number(macroMap[MACRO_KEYS.SP500]?.value ?? 0).toLocaleString('es-AR'),
      change:      macroMap[MACRO_KEYS.SP500]?.change ?? '—',
      changeColor: colorFor(macroMap[MACRO_KEYS.SP500]?.change),
      sub:         'ByMA / NYSE',
      context:     macroMap[MACRO_KEYS.SP500]?.context ?? null,
    },
    {
      key:         MACRO_KEYS.BITCOIN,
      label:       macroMap[MACRO_KEYS.BITCOIN]?.label  ?? 'Bitcoin',
      value:       `us$ ${Number(macroMap[MACRO_KEYS.BITCOIN]?.value ?? 0).toLocaleString('es-AR')}`,
      change:      macroMap[MACRO_KEYS.BITCOIN]?.change ?? '—',
      changeColor: colorFor(macroMap[MACRO_KEYS.BITCOIN]?.change),
      sub:         'USD',
      context:     macroMap[MACRO_KEYS.BITCOIN]?.context ?? null,
    },
  ];
}


// ------------------------------------------------------------
// formatTreasuries(macroMap)
// Returns the 3 treasury cards (1y, 5y, 10y).
// ------------------------------------------------------------
export function formatTreasuries(macroMap) {
  if (!macroMap) return [];

  return [
    {
      key:    MACRO_KEYS.UST_1Y,
      label:  'UST 1 año',
      value:  `${macroMap[MACRO_KEYS.UST_1Y]?.value ?? '—'}%`,
      change: macroMap[MACRO_KEYS.UST_1Y]?.change ?? '—',
      sub:    'T-Bill',
      ref:    false,
    },
    {
      key:    MACRO_KEYS.UST_5Y,
      label:  'UST 5 años',
      value:  `${macroMap[MACRO_KEYS.UST_5Y]?.value ?? '—'}%`,
      change: macroMap[MACRO_KEYS.UST_5Y]?.change ?? '—',
      sub:    'T-Note',
      ref:    false,
    },
    {
      key:    MACRO_KEYS.UST_10Y,
      label:  'UST 10 años ★ ref.',
      value:  `${macroMap[MACRO_KEYS.UST_10Y]?.value ?? '—'}%`,
      change: macroMap[MACRO_KEYS.UST_10Y]?.change ?? '—',
      sub:    'T-Note — Benchmark',
      ref:    true,
    },
  ];
}