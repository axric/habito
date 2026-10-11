const MAX_REQUEST_CHARS = 24000;
const MAX_MESSAGES = 20;

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST').status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const openAiKey = process.env.OPENAI_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!openAiKey || !supabaseUrl || !supabaseAnonKey) {
    response.status(500).json({ error: 'Advisor service is not configured.' });
    return;
  }

  const authorization = request.headers.authorization || '';
  const tokenMatch = authorization.match(/^Bearer\s+(.+)$/i);
  if (!tokenMatch) {
    response.status(401).json({ error: 'Sign in to use the advisor.' });
    return;
  }

  try {
    const userResponse = await fetch(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/user`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${tokenMatch[1]}`,
      },
    });

    if (!userResponse.ok) {
      response.status(401).json({ error: 'Your session is invalid or expired. Please sign in again.' });
      return;
    }

    const body = request.body;
    if (!body || typeof body.system !== 'string' || !Array.isArray(body.messages)) {
      response.status(400).json({ error: 'Invalid advisor request.' });
      return;
    }

    const bodySize = JSON.stringify(body).length;
    if (bodySize > MAX_REQUEST_CHARS || body.messages.length > MAX_MESSAGES) {
      response.status(413).json({ error: 'Advisor request is too large. Start a new conversation and try again.' });
      return;
    }

    if (
      !body.system.trim() ||
      body.system.length > 8000 ||
      body.messages.some(message =>
        !message ||
        !['user', 'assistant'].includes(message.role) ||
        typeof message.content !== 'string' ||
        !message.content.trim() ||
        message.content.length > 8000
      )
    ) {
      response.status(400).json({ error: 'Invalid advisor request.' });
      return;
    }

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        max_tokens: 1000,
        messages: [
          { role: 'system', content: body.system },
          ...body.messages,
        ],
      }),
    });

    const result = await aiResponse.json();
    if (!aiResponse.ok) {
      console.error('OpenAI advisor request failed.', aiResponse.status, result.error?.type || result.error?.code);
      response.status(502).json({ error: 'The advisor could not complete the request. Please try again later.' });
      return;
    }

    const content = result.choices?.[0]?.message?.content;
    if (typeof content !== 'string' || !content.trim()) {
      console.error('OpenAI advisor returned no message content.');
      response.status(502).json({ error: 'The advisor returned an empty response. Please try again.' });
      return;
    }

    response.setHeader('Cache-Control', 'no-store').status(200).json({ content });
  } catch (error) {
    console.error('Unable to complete advisor request.', error);
    response.status(502).json({ error: 'The advisor is temporarily unavailable. Please try again.' });
  }
};
