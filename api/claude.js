export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, messages, system, max_tokens = 700 } = req.body || {};

  // Check API key is configured
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY environment variable is not set in Vercel');
    return res.status(500).json({
      error: 'AI service not configured. Add ANTHROPIC_API_KEY to Vercel environment variables.',
      code: 'MISSING_API_KEY'
    });
  }

  // Support both formats:
  // 1. { prompt, max_tokens } — simple prompt (used by ai() helper in all features)
  // 2. { messages, system, max_tokens } — chat format (used by terminal Clark AI)
  let apiMessages;
  let apiSystem;

  if (messages && Array.isArray(messages)) {
    // Chat format — terminal Clark AI with CORTEX system prompt
    apiMessages = messages;
    apiSystem = system || undefined;
  } else if (prompt) {
    // Simple prompt format — convert to messages
    apiMessages = [{ role: 'user', content: prompt }];
    apiSystem = undefined;
  } else {
    return res.status(400).json({ error: 'Provide prompt or messages' });
  }

  try {
    const body = {
      model: 'claude-haiku-4-5-20251001',
      max_tokens,
      messages: apiMessages,
    };
    if (apiSystem) body.system = apiSystem;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.error) {
      console.error('Anthropic API error:', data.error);
      if (data.error.type === 'authentication_error') {
        return res.status(500).json({
          error: 'Invalid Anthropic API key. Check ANTHROPIC_API_KEY in Vercel settings.',
          code: 'INVALID_API_KEY'
        });
      }
      return res.status(500).json({ error: data.error.message });
    }

    const text = data.content?.[0]?.text || '';
    return res.status(200).json({ text });

  } catch (err) {
    console.error('Claude API fetch error:', err.message);
    return res.status(500).json({ error: 'Server error. Try again.' });
  }
}
