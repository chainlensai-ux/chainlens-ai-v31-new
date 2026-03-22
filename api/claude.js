const CLARK_SYSTEM = `You are Clark, ChainLens AI — the sharpest onchain analyst in the room.

Personality and voice: confident, direct, data-driven. You state conclusions like a desk that already did the work. You never hedge with soft language.

Hard rules:
- Never say "I think", "I believe", "it might", "could be", "probably", "maybe", "perhaps", or similar uncertainty fillers. Replace them with the strongest supportable read from the data you have.
- Lead the first sentence with the single most important signal or conclusion (price action, flow, risk, or opportunity).
- Be concise and specific. Short paragraphs beat essays.
- Ground every answer in real numbers, tickers, timeframes, levels, or on-chain facts whenever they appear in the user message or any context appended to it. Name the source when citing (e.g. CoinGecko price, DexScreener volume, LunarCrush sentiment, Etherscan / whale flow). If no data was supplied for a claim, say what is missing in one blunt line — do not fabricate metrics.
- Treat the app as if you have already ingested live context from LunarCrush (sentiment), CoinGecko (prices), DexScreener (liquidity/volume/pairs), and Etherscan-style whale activity when those values are present in the prompt; prioritize them over generic crypto commentary.
- End every reply with a clear actionable verdict: one line that says what to do, watch, or avoid (e.g. "Verdict: …").`;

const CG_BASE = 'https://api.coingecko.com/api/v3';
const DEX_TOP_VOL_URL =
  'https://api.dexscreener.com/latest/dex/search?q=USDC&sort=volume&order=desc&limit=20';
const ETHERSCAN_V2 = 'https://api.etherscan.io/v2/api';
const WHALE_WATCH = '0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549';

const LUNAR_TOPIC_MAP = {
  btc: 'bitcoin',
  bitcoin: 'bitcoin',
  eth: 'ethereum',
  ethereum: 'ethereum',
  sol: 'solana',
  sol: 'solana',
  solana: 'solana',
  doge: 'dogecoin',
  dogecoin: 'dogecoin',
  xrp: 'xrp',
  ripple: 'xrp',
  ada: 'cardano',
  cardano: 'cardano',
  avax: 'avalanche-2',
  avalanche: 'avalanche-2',
  bnb: 'binancecoin',
  link: 'chainlink',
  matic: 'matic-network',
  polygon: 'matic-network',
  pepe: 'pepe',
  arb: 'arbitrum',
  arbitrum: 'arbitrum',
};

/** Strip protocol and path so VERCEL_URL / production URL always become a bare host. */
function normalizeDeploymentHost(h) {
  if (!h || typeof h !== 'string') return '';
  return h.replace(/^https?:\/\//i, '').trim().split('/')[0];
}

/**
 * Base URL for same-project /api/* calls. Prefer the incoming request host (correct preview + custom domain),
 * then VERCEL_URL / production URL (always https).
 */
function internalOrigin(req) {
  const proto = (req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim() || 'https';
  const xfHost = req.headers['x-forwarded-host']?.split(',')[0].trim();
  const hostHeader = req.headers.host;
  const fromRequest = xfHost || hostHeader;
  if (fromRequest && !/^127\.0\.0\.1(?::\d+)?$/.test(fromRequest) && !/^localhost(?::\d+)?$/i.test(fromRequest)) {
    const p = proto === 'http' && fromRequest.includes('localhost') ? 'http' : 'https';
    return `${p}://${fromRequest}`;
  }
  const vu = normalizeDeploymentHost(process.env.VERCEL_URL);
  if (vu) return `https://${vu}`;
  const prod = normalizeDeploymentHost(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  if (prod) return `https://${prod}`;
  if (fromRequest) return `${proto}://${fromRequest}`;
  return 'http://127.0.0.1:3000';
}

/** CoinGecko Pro uses x_cg_pro_api_key; Demo uses x_cg_demo_api_key (header name x-cg-demo-api-key). */
function appendCoinGeckoKeyToUrl(fullUrl) {
  const pro = (process.env.COINGECKO_PRO_API_KEY || '').trim();
  const demo = (process.env.COINGECKO_DEMO_API_KEY || '').trim();
  const generic = (process.env.COINGECKO_API_KEY || process.env.CG_API_KEY || '').trim();
  const sep = fullUrl.includes('?') ? '&' : '?';
  if (pro) return `${fullUrl}${sep}x_cg_pro_api_key=${encodeURIComponent(pro)}`;
  const key = demo || generic;
  if (key) return `${fullUrl}${sep}x_cg_demo_api_key=${encodeURIComponent(key)}`;
  return fullUrl;
}

async function scanPost(origin, url) {
  try {
    const target = `${origin.replace(/\/$/, '')}/api/scan`;
    const r = await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const text = await r.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = { _parseError: true, snippet: text.slice(0, 400) };
    }
    const cgError =
      json &&
      typeof json === 'object' &&
      (typeof json.error === 'string' ||
        (json.error && typeof json.error === 'object' && json.error.status?.error_code));
    const ok = r.ok && !json._parseError && !cgError;
    return { ok, status: r.status, json, skipped: !ok };
  } catch (e) {
    return { ok: false, status: 0, json: { _fetchError: String(e.message || e) }, skipped: true };
  }
}

function safeStringify(obj, maxLen = 10000) {
  try {
    const s = JSON.stringify(obj);
    return s.length > maxLen ? s.slice(0, maxLen) + '…[truncated]' : s;
  } catch {
    return String(obj).slice(0, 800);
  }
}

function extractLunarTopics(prompt) {
  const text = String(prompt || '');
  const seen = new Set();
  const out = [];

  const dollarRe = /\$([A-Za-z][A-Za-z0-9]{1,15})\b/g;
  let m;
  while ((m = dollarRe.exec(text)) !== null) {
    const sym = m[1].toLowerCase();
    const topic = LUNAR_TOPIC_MAP[sym] || sym;
    if (!seen.has(topic)) {
      seen.add(topic);
      out.push(topic);
    }
  }

  const wordRe =
    /\b(bitcoin|btc|ethereum|eth|solana|sol|dogecoin|doge|xrp|ripple|cardano|ada|avalanche|avax|bnb|binancecoin|chainlink|link|polygon|matic|pepe|arbitrum|arb)\b/gi;
  while ((m = wordRe.exec(text)) !== null) {
    const w = m[1].toLowerCase();
    const topic = LUNAR_TOPIC_MAP[w];
    if (topic && !seen.has(topic)) {
      seen.add(topic);
      out.push(topic);
    }
  }

  return out.slice(0, 4);
}

function slimDexPairs(pairs) {
  if (!Array.isArray(pairs)) return [];
  return pairs.slice(0, 12).map((p) => ({
    chainId: p.chainId,
    pair: p.pairAddress,
    base: p.baseToken
      ? { symbol: p.baseToken.symbol, name: p.baseToken.name, address: p.baseToken.address }
      : null,
    priceUsd: p.priceUsd,
    priceChange: p.priceChange,
    volume: p.volume,
    liquidity: p.liquidity,
    url: p.url,
  }));
}

async function fetchLunarForTopic(origin, topic) {
  try {
    const base = origin.replace(/\/$/, '');
    const r = await fetch(`${base}/api/lunarsentiment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, interval: '1d', limit: 12 }),
    });
    const text = await r.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      return null;
    }
    if (!r.ok) return null;
    const arr = Array.isArray(json.data) ? json.data : [];
    const latest = arr[0];
    return {
      topic,
      lunarCrushSentimentGauge0to100: latest?.value ?? null,
      classification: latest?.value_classification ?? null,
      samplePoints: arr.slice(0, 5).map((d) => ({
        value: d.value,
        classification: d.value_classification,
        time: d.time,
      })),
    };
  } catch {
    return null;
  }
}

async function fetchWhaleMovesViaScan(origin, ethUsd) {
  const price = Number.isFinite(ethUsd) && ethUsd > 0 ? ethUsd : 3000;
  const minUsd = 50000;
  const minEth = minUsd / price;
  const nowSec = Math.floor(Date.now() / 1000);
  const sinceSec = nowSec - 7200;

  const latestBlockUrl = `${ETHERSCAN_V2}?chainid=1&module=proxy&action=eth_blockNumber&apikey=ENV`;
  const sinceBlockUrl = `${ETHERSCAN_V2}?chainid=1&module=block&action=getblocknobytime&timestamp=${sinceSec}&closest=before&apikey=ENV`;

  const [latestBox, sinceBox] = await Promise.all([
    scanPost(origin, latestBlockUrl),
    scanPost(origin, sinceBlockUrl),
  ]);

  if (!latestBox.ok || latestBox.json?.error) {
    return { error: 'eth_blockNumber failed', detail: safeStringify(latestBox.json, 800) };
  }
  if (sinceBox.json?.status === '0' && typeof sinceBox.json?.result === 'string') {
    return { error: 'getblocknobytime failed', detail: sinceBox.json.result };
  }

  const latestRaw = latestBox.json?.result != null ? String(latestBox.json.result) : '';
  const latestBlock = latestRaw.startsWith('0x')
    ? parseInt(latestRaw, 16)
    : parseInt(latestRaw, 10);
  if (!Number.isFinite(latestBlock) || latestBlock <= 0) {
    return { error: 'bad latest block', detail: latestRaw };
  }

  let sinceBlock = parseInt(String(sinceBox.json?.result ?? ''), 10);
  if (!Number.isFinite(sinceBlock) || sinceBlock < 0) {
    return { error: 'bad since block', detail: String(sinceBox.json?.result) };
  }

  let startBlock = sinceBlock;
  const endBlock = latestBlock;
  if (startBlock > endBlock) startBlock = Math.max(0, endBlock - 3000);

  const txUrl =
    `${ETHERSCAN_V2}?chainid=1&module=account&action=txlist&address=${WHALE_WATCH}` +
    `&startblock=${startBlock}&endblock=${endBlock}&page=1&offset=1000&sort=desc&apikey=ENV`;

  const txBox = await scanPost(origin, txUrl);
  if (!txBox.ok) return { error: 'txlist scan HTTP', status: txBox.status };
  const data = txBox.json;
  if (data?.status === '0' && typeof data?.result === 'string') {
    return { error: 'Etherscan txlist', detail: data.result };
  }
  const rawList = data?.result;
  if (!Array.isArray(rawList)) {
    return { error: 'txlist not array', detail: typeof rawList };
  }

  const watchLower = WHALE_WATCH.toLowerCase();
  const txs = rawList
    .filter((tx) => {
      if (!tx || tx.isError === '1') return false;
      if (tx.txreceipt_status === '0') return false;
      const txTs = parseInt(tx.timeStamp, 10) || 0;
      if (txTs < sinceSec) return false;
      const ethVal = parseFloat(tx.value) / 1e18;
      return ethVal >= minEth;
    })
    .sort((a, b) => (parseFloat(b.value) || 0) - (parseFloat(a.value) || 0))
    .slice(0, 6)
    .map((tx) => {
      const ethVal = parseFloat(tx.value) / 1e18;
      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        eth: Math.round(ethVal * 1000) / 1000,
        usdApprox: Math.round(ethVal * price),
        timestampUtc: tx.timeStamp
          ? new Date(parseInt(tx.timeStamp, 10) * 1000).toISOString()
          : null,
        directionVsWatch:
          (tx.from || '').toLowerCase() === watchLower ? 'out' : 'in',
      };
    });

  return { watchWallet: WHALE_WATCH, minEthFilter: Math.round(minEth * 1e6) / 1e6, moves: txs };
}

async function buildLiveContextBlock(req, userPrompt) {
  try {
    let origin = internalOrigin(req);
    const priceUrl = appendCoinGeckoKeyToUrl(
      `${CG_BASE}/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true`
    );
    const globalUrl = appendCoinGeckoKeyToUrl(`${CG_BASE}/global`);

    const topics = extractLunarTopics(userPrompt);

    let priceBox = await scanPost(origin, priceUrl);
    let globalBox = await scanPost(origin, globalUrl);
    let dexBox = await scanPost(origin, DEX_TOP_VOL_URL);

    const altOrigin =
      normalizeDeploymentHost(process.env.VERCEL_URL) &&
      `https://${normalizeDeploymentHost(process.env.VERCEL_URL)}`;
    if ((!priceBox.ok || !globalBox.ok || !dexBox.ok) && altOrigin && altOrigin !== origin.replace(/\/$/, '')) {
      if (!priceBox.ok) priceBox = await scanPost(altOrigin, priceUrl);
      if (!globalBox.ok) globalBox = await scanPost(altOrigin, globalUrl);
      if (!dexBox.ok) dexBox = await scanPost(altOrigin, DEX_TOP_VOL_URL);
      if (priceBox.ok || globalBox.ok || dexBox.ok) origin = altOrigin;
    }

    const lunarSettled = await Promise.all(
      topics.map((t) => fetchLunarForTopic(origin, t).catch(() => null))
    );
    const lunarResults = lunarSettled.filter(Boolean);

    let ethUsd = 3000;
    if (priceBox.ok && priceBox.json?.ethereum?.usd) {
      ethUsd = Number(priceBox.json.ethereum.usd) || ethUsd;
    }

    let whaleBox = null;
    try {
      whaleBox = await fetchWhaleMovesViaScan(origin, ethUsd);
    } catch {
      whaleBox = { error: 'whale_context_unavailable' };
    }

    const parts = [];

    parts.push(
      'CHAIN_LENS_INTERNAL_API_BASE: ' +
        origin +
        (appendCoinGeckoKeyToUrl(`${CG_BASE}/global`) === `${CG_BASE}/global`
          ? ' (CoinGecko URLs have no server key; set COINGECKO_PRO_API_KEY or COINGECKO_DEMO_API_KEY / COINGECKO_API_KEY on Vercel)'
          : '')
    );

    parts.push(
      'COIN_GECKO_BTC_ETH (via /api/scan): ' +
        (priceBox.ok
          ? safeStringify(priceBox.json, 2500)
          : '(skipped — unavailable or auth error)')
    );

    parts.push(
      'COIN_GECKO_GLOBAL (via /api/scan): ' +
        (globalBox.ok
          ? safeStringify(globalBox.json?.data ?? globalBox.json, 3500)
          : '(skipped — unavailable or auth error)')
    );

    const dexPairs = dexBox.json?.pairs;
    parts.push(
      'DEXSCREENER_TOP_VOLUME_PAIRS (via /api/scan): ' +
        (dexBox.ok && Array.isArray(dexPairs) && dexPairs.length
          ? safeStringify(slimDexPairs(dexPairs), 6000)
          : '(skipped — unavailable)')
    );

    parts.push(
      'ETHERSCAN_WHALE_MOVES (via /api/scan, ETH mainnet, high-flow watch wallet): ' +
        (whaleBox && !whaleBox.error
          ? safeStringify(whaleBox, 4000)
          : '(skipped — unavailable)')
    );

    if (topics.length) {
      parts.push(
        'LUNARCRUSH_SENTIMENT_GAUGE (via /api/lunarsentiment; LUNARCRUSH_KEY on server): ' +
          (lunarResults.length
            ? safeStringify(lunarResults, 6000)
            : '(skipped — no data or LUNARCRUSH_KEY / route error)')
      );
    } else {
      parts.push(
        'LUNARCRUSH_SENTIMENT_GAUGE: no token/topic detected in user message (skip). If needed, infer only from other context above.'
      );
    }

    return parts.join('\n\n');
  } catch (e) {
    return (
      'LIVE_CONTEXT_PARTIAL: aggregation error — continuing without full live block. ' +
      String(e.message || e)
    );
  }
}

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

  const { prompt, max_tokens = 700 } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'No prompt provided' });
  }

  // Check API key is configured
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY environment variable is not set in Vercel');
    return res.status(500).json({
      error: 'AI service not configured. Add ANTHROPIC_API_KEY to Vercel environment variables.',
      code: 'MISSING_API_KEY',
    });
  }

  let liveContext = '';
  try {
    liveContext = await buildLiveContextBlock(req, prompt);
  } catch (e) {
    liveContext = 'LIVE_CONTEXT_FETCH_ERROR: ' + String(e.message || e);
  }

  const system = `${CLARK_SYSTEM}

---
LIVE CONTEXT (fetched server-side before this request; cite explicitly when using numbers below)
${liveContext}
---`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens,
        system,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('Anthropic API error:', data.error);
      // Give a clear message for auth errors
      if (data.error.type === 'authentication_error') {
        return res.status(500).json({
          error: 'Invalid Anthropic API key. Check ANTHROPIC_API_KEY in Vercel settings.',
          code: 'INVALID_API_KEY',
        });
      }
      return res.status(500).json({ error: data.error.message });
    }

    return res.status(200).json({ text: data.content[0].text });
  } catch (err) {
    console.error('Claude API fetch error:', err.message);
    return res.status(500).json({ error: 'Server error. Try again.' });
  }
}
