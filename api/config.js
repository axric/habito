module.exports = function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET').status(405).end();
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    response.status(500).json({ error: 'Supabase environment variables are not configured.' });
    return;
  }

  response
    .setHeader('Cache-Control', 'no-store')
    .status(200)
    .json({ supabaseUrl, supabaseAnonKey });
};
