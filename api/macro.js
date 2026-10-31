function getHeaderValue(headers, name) {
  const value = headers[name] || headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value || '';
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(String(value).replace(/[^0-9,.-]/g, '').replace(',', '.'));
  return Number.isFinite(num) ? num : null;
}

function readLastValue(data) {
  if (Array.isArray(data) && data.length) {
    return readLastValue(data[data.length - 1]);
  }
  if (!data || typeof data !== 'object') return null;
  const keys = ['valor', 'value', 'precio', 'indice', 'monto', 'cierre', 'last', 'ultimo'];
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = toNumber(data[key]);
      if (value !== null) return value;
    }
  }
  for (const key of Object.keys(data)) {
    const value = toNumber(data[key]);
    if (value !== null) return value;
  }
  return null;
}

function percentChange(current, previous) {
  if (!Number.isFinite(current) || !Number.isFinite(previous) || previous === 0) return null;
  const delta = ((current - previous) / Math.abs(previous)) * 100;
  return delta;
}

async function fetchOptionalSource(label, operation) {
  try {
    return await operation();
  } catch (error) {
    console.warn(`Macro source unavailable: ${label}`);
    return null;
  }
}

async function fetchJson(url, init = {}) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'User-Agent': 'Mozilla/5.0 (compatible; Habito/1.0; +https://habito.app)',
      ...(init.headers || {}),
    },
    ...init,
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Request failed for ${url}: ${response.status} ${text}`);
  }
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Invalid JSON from ${url}: ${text.slice(0, 200)}`);
  }
}

async function fetchDolarRate(type) {
  const normalizedType = type === 'mep' ? 'bolsa' : type;
  const url = `https://dolarapi.com/v1/dolares/${normalizedType}`;
  const data = await fetchJson(url);
  const value = toNumber(data?.venta ?? data?.compra ?? data?.price ?? data?.value);
  return Number.isFinite(value) ? value : null;
}

async function fetchArgentinaInflacion() {
  const data = await fetchJson('https://api.argentinadatos.com/v1/finanzas/indices/inflacion');
  return readLastValue(data);
}

async function fetchArgentinaInflacionInteranual() {
  const data = await fetchJson('https://api.argentinadatos.com/v1/finanzas/indices/inflacionInteranual');
  return readLastValue(data);
}

async function fetchArgentinaInflacionEsperada() {
  const data = await fetchJson('https://api.argentinadatos.com/v1/finanzas/rem/ultimo');
  if (!Array.isArray(data)) return null;

  const candidate = data.find((item) => {
    const indicator = String(item?.indicador || '').toLowerCase();
    const period = String(item?.periodo || '').toLowerCase();
    const hasInflationText = indicator.includes('infl') || indicator.includes('ipc');
    const hasExpectedWindow = period.includes('prox. 12 meses') || period.includes('próx. 12 meses');
    return hasInflationText && hasExpectedWindow;
  });

  const value = candidate?.mediana ?? candidate?.promedio ?? null;
  if (value === null || value === undefined) return null;
  return Number(value);
}

async function fetchArgentinaRiskPais() {
  const url = 'https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais/ultimo';
  const data = await fetchJson(url);
  const value = toNumber(data?.valor ?? data?.value ?? data?.riesgo_pais ?? data?.indice);
  return Number.isFinite(value) ? value : null;
}

async function fetchArgentinaUVA() {
  const data = await fetchJson('https://api.argentinadatos.com/v1/finanzas/indices/uva');
  return readLastValue(data);
}

async function fetchFredSeries(seriesId) {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) return null;
  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${encodeURIComponent(seriesId)}&api_key=${encodeURIComponent(apiKey)}&file_type=json&limit=2`;
  const data = await fetchJson(url);
  const observations = Array.isArray(data?.observations) ? data.observations : [];
  if (!observations.length) return null;
  const last = observations[observations.length - 1];
  const previous = observations.length > 1 ? observations[observations.length - 2] : null;
  const value = toNumber(last?.value);
  const change = percentChange(value, toNumber(previous?.value));
  return { value, change };
}

function normalizeStockSymbol(value) {
  return String(value || '')
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/[^A-Za-z0-9\-\.\^]/g, '')
    .toUpperCase();
}

async function fetchYahooTicker(symbol) {
  const normalized = normalizeStockSymbol(symbol);
  if (!normalized) return null;
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(normalized)}?range=1mo&interval=1d`;
    const data = await fetchJson(url);
    const result = Array.isArray(data?.chart?.result) ? data.chart.result[0] : null;
    const meta = result?.meta || {};
    const quote = result?.indicators?.quote?.[0];
    const closes = Array.isArray(quote?.close) ? quote.close.filter(value => Number.isFinite(Number(value))) : [];
    const price = toNumber(meta?.regularMarketPrice ?? closes[closes.length - 1]);
    const previousClose = toNumber(closes?.[closes.length - 2] ?? meta?.previousClose);
    const change = percentChange(price, previousClose);
    return { value: price, change };
  } catch (error) {
    console.warn('Yahoo ticker fetch failed for', symbol, error.message);
    return null;
  }
}

function buildStockRows(symbols = []) {
  const uniqueSymbols = [...new Set(symbols
    .map(normalizeStockSymbol)
    .filter(Boolean))];

  return Promise.all(uniqueSymbols.map(async (symbol) => {
    const quote = await fetchYahooTicker(symbol);
    if (!quote || !Number.isFinite(quote.value)) return null;
    const change = Number.isFinite(quote.change) ? quote.change : null;
    return {
      key: `stock_${symbol}` ,
      label: symbol,
      value: String(quote.value),
      change: change === null ? null : `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
      context: 'Fuente: Yahoo Finance',
      updated_at: new Date().toISOString(),
    };
  }));
}

function mapRows(raw) {
  const rows = [];

  const pushRow = (key, label, value, change = null, context = null) => {
    if (value === null || value === undefined || value === '') return;
    rows.push({
      key,
      label,
      value: String(value),
      change: change === null || !Number.isFinite(change) ? null : `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
      context,
      updated_at: new Date().toISOString(),
    });
  };

  pushRow('dolar_oficial', 'Dólar Oficial BNA', raw.dolarOficial, null, 'Fuente: dolarapi.com');
  pushRow('dolar_mep', 'Dólar MEP (Bolsa)', raw.dolarMep, null, 'Fuente: dolarapi.com');
  pushRow('dolar_blue', 'Dólar Blue', raw.dolarBlue, null, 'Fuente: dolarapi.com');
  pushRow('riesgo_pais', 'Riesgo País EMBI+', raw.riesgoPais, null, 'Fuente: argentinadatos.com');
  pushRow('inflacion_ipc', 'IPC — INDEC', raw.inflacionIpc, null, 'Fuente: argentinadatos.com');
  pushRow('inflacion_interanual', 'Inflación Interanual', raw.inflacionInteranual, null, 'Fuente: argentinadatos.com');
  pushRow('inflacion_esperada', 'Inflación Esperada', raw.inflacionEsperada, null, 'Fuente: argentinadatos.com');
  pushRow('uva', 'UVA', raw.uva, null, 'Fuente: argentinadatos.com');
  pushRow('ust_1y', 'UST 1 año', raw.ust1y, raw.ust1yChange, 'Fuente: FRED');
  pushRow('ust_5y', 'UST 5 años', raw.ust5y, raw.ust5yChange, 'Fuente: FRED');
  pushRow('ust_10y', 'UST 10 años', raw.ust10y, raw.ust10yChange, 'Fuente: FRED');
  pushRow('brent', 'Brent Crude', raw.brent, raw.brentChange, 'Fuente: FRED');
  pushRow('wti', 'WTI Crude', raw.wti, raw.wtiChange, 'Fuente: FRED');
  pushRow('bitcoin', 'Bitcoin', raw.bitcoin, raw.bitcoinChange, 'Fuente: Yahoo Finance');

  return rows;
}

async function upsertMacroRows(rows) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  const restUrl = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/macro_data?on_conflict=key`;
  const response = await fetch(restUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(rows),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Supabase upsert failed: ${response.status} ${text}`);
  }
  return text ? JSON.parse(text) : [];
}

module.exports = async function handler(request, response) {
  if (!['GET', 'POST'].includes(request.method)) {
    response.setHeader('Allow', 'GET, POST');
    response.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const authHeader = getHeaderValue(request.headers, 'authorization');
  const tokenMatch = authHeader.match(/^Bearer\s+(.+)$/i);
  const token = tokenMatch ? tokenMatch[1] : null;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    response.status(500).json({ error: 'Supabase environment variables are not configured.' });
    return;
  }

  if (!token) {
    response.status(401).json({ error: 'Sign in to refresh macro data.' });
    return;
  }

  try {
    const userResponse = await fetch(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/user`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userResponse.ok) {
      response.status(401).json({ error: 'Your session is invalid or expired.' });
      return;
    }

    const body = request.body || {};
    const requestedSymbols = Array.isArray(body.symbols) ? body.symbols : [];
    const [dolarOficial, dolarMep, dolarBlue, inflacion, inflacionInteranual, inflacionEsperada, riesgoPais, uva, ust1y, ust5y, ust10y, brent, wti, bitcoin] = await Promise.all([
      fetchOptionalSource('dolar oficial', () => fetchDolarRate('oficial')),
      fetchOptionalSource('dolar MEP', () => fetchDolarRate('mep')),
      fetchOptionalSource('dolar blue', () => fetchDolarRate('blue')),
      fetchOptionalSource('inflacion', fetchArgentinaInflacion),
      fetchOptionalSource('inflacion interanual', fetchArgentinaInflacionInteranual),
      fetchOptionalSource('inflacion esperada', fetchArgentinaInflacionEsperada),
      fetchOptionalSource('riesgo pais', fetchArgentinaRiskPais),
      fetchOptionalSource('UVA', fetchArgentinaUVA),
      fetchOptionalSource('UST 1Y', () => fetchFredSeries('DGS1')),
      fetchOptionalSource('UST 5Y', () => fetchFredSeries('DGS5')),
      fetchOptionalSource('UST 10Y', () => fetchFredSeries('DGS10')),
      fetchOptionalSource('Brent', () => fetchFredSeries('DCOILBRENTEU')),
      fetchOptionalSource('WTI', () => fetchFredSeries('DCOILWTICO')),
      fetchOptionalSource('Bitcoin', () => fetchYahooTicker('BTC-USD')),
    ]);

    const rows = mapRows({
      dolarOficial: dolarOficial,
      dolarMep: dolarMep,
      dolarBlue: dolarBlue,
      inflacionIpc: inflacion,
      inflacionInteranual: inflacionInteranual,
      inflacionEsperada: inflacionEsperada,
      riesgoPais: riesgoPais,
      uva: uva,
      ust1y: ust1y?.value,
      ust1yChange: ust1y?.change,
      ust5y: ust5y?.value,
      ust5yChange: ust5y?.change,
      ust10y: ust10y?.value,
      ust10yChange: ust10y?.change,
      brent: brent?.value,
      brentChange: brent?.change,
      wti: wti?.value,
      wtiChange: wti?.change,
      bitcoin: bitcoin?.value,
      bitcoinChange: bitcoin?.change,
    });

    const stockRows = await buildStockRows(requestedSymbols);
    const mergedRows = [
      ...rows,
      ...stockRows.filter(Boolean),
    ];

    const written = mergedRows.length ? await upsertMacroRows(mergedRows) : [];

    response.setHeader('Cache-Control', 'no-store');
    response.status(200).json({
      ok: true,
      updated: mergedRows.length,
      records: written,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Macro data sync failed.', error);
    response.status(502).json({
      error: 'Could not refresh macro data.',
      details: error.message,
    });
  }
};
