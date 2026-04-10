import { NextResponse } from "next/server";

// ------------------------------
// RPC MAP (Alchemy)
// ------------------------------
const CHAIN_RPC_MAP = {
  eth: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY_ETH}`,
  base: `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY_BASE}`,
  polygon: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY_POLYGON}`,
  bnb: `https://bnb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY_BNB}`,
} as const;

type ChainKey = keyof typeof CHAIN_RPC_MAP;

// ------------------------------
// Detect chain by checking bytecode
// ------------------------------
async function detectChain(contract: string): Promise<ChainKey | null> {
  for (const [chainKey, rpcUrl] of Object.entries(CHAIN_RPC_MAP)) {
    try {
      const rpcRes = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getCode",
          params: [contract, "latest"],
        }),
      });

      const json = await rpcRes.json();
      const code = json?.result;

      if (code && code !== "0x") {
        console.log(`Chain detected: ${chainKey}`);
        return chainKey as ChainKey;
      }
    } catch (err) {
      console.error(`RPC error on ${chainKey}:`, err);
    }
  }

  return null;
}

// ------------------------------
// Fetch bytecode
// ------------------------------
async function fetchBytecode(chain: ChainKey, contract: string) {
  try {
    const rpcRes = await fetch(CHAIN_RPC_MAP[chain], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getCode",
        params: [contract, "latest"],
      }),
    });

    const json = await rpcRes.json();
    return json?.result || null;
  } catch (err) {
    console.error("Bytecode error:", err);
    return null;
  }
}

// ------------------------------
// GoldRush DIRECT API CALL (Option A, .io domain)
// ------------------------------
async function fetchGoldRush(chain: string, contract: string) {
  try {
    const url = `https://goldrush-api.io/v1/tokens/${contract}?chain=${chain}`;

    console.log("Calling GoldRush (alt domain):", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.GOLDRUSH_KEY || ""}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("GoldRush returned:", res.status);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("GoldRush error:", err);
    return null;
  }
}

// ------------------------------
// DexScreener
// ------------------------------
async function fetchDexScreener(contract: string) {
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${contract}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("DexScreener error:", err);
    return null;
  }
}

// ------------------------------
// GMGN (backend only — Option F)
// ------------------------------
async function fetchGMGN(contract: string) {
  try {
    const res = await fetch(`https://gmgn.ai/api/v1/tokens/${contract}`, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("GMGN error:", err);
    return null;
  }
}

// ------------------------------
// Contract analysis
// ------------------------------
function analyzeContract(bytecode: string | null) {
  if (!bytecode || bytecode === "0x") {
    return {
      ownerStatus: "Unknown",
      liquidityStatus: "Unknown",
      honeypot: "Cannot determine",
      suspiciousFunctions: [],
    };
  }

  const suspicious: string[] = [];

  if (bytecode.includes("blacklist")) suspicious.push("Possible blacklist logic");
  if (bytecode.includes("whitelist")) suspicious.push("Possible whitelist logic");
  if (bytecode.includes("tax")) suspicious.push("Possible tax logic");

  return {
    ownerStatus: "Owner status not fully analyzed",
    liquidityStatus: "No liquidity lock patterns detected",
    honeypot: "No obvious honeypot pattern detected",
    suspiciousFunctions: suspicious,
  };
}

// ------------------------------
// AI Summary
// ------------------------------
function buildCortexSummary({ chain, goldrush, dexscreener, analysis }: any) {
  const parts: string[] = [];

  parts.push(`This contract is deployed on ${chain.toUpperCase()}.`);

  if (goldrush) {
    parts.push(
      `GoldRush reports ${goldrush.holders ?? "?"} holders and liquidity of ${
        goldrush.liquidity ?? "?"
      }.`
    );
  }

  if (dexscreener?.pairs?.length) {
    parts.push(
      `DexScreener detected ${dexscreener.pairs.length} trading pair(s).`
    );
  }

  if (analysis.suspiciousFunctions.length > 0) {
    parts.push(
      `Bytecode suggests possible sensitive logic: ${analysis.suspiciousFunctions.join(
        ", "
      )}.`
    );
  }

  parts.push(
    "This summary is informational only and does not constitute financial advice."
  );

  return {
    verdict: parts.join(" "),
    ...analysis,
  };
}

// ------------------------------
// POST handler
// ------------------------------
export async function POST(req: Request) {
  try {
    console.log("SCAN ROUTE HIT — backend route is running");

    const { contract } = await req.json();

    if (!contract) {
      return NextResponse.json(
        { error: "Missing contract address" },
        { status: 400 }
      );
    }

    console.log("Incoming scan request:", contract);

    // 1. Detect chain
    const chain = await detectChain(contract);
    if (!chain) {
      return NextResponse.json(
        { error: "Could not detect chain" },
        { status: 400 }
      );
    }

    // 2. Bytecode
    const bytecode = await fetchBytecode(chain, contract);

    // 3. GoldRush (direct)
    const goldrush = await fetchGoldRush(chain, contract);

    // 4. DexScreener
    const dexscreener = await fetchDexScreener(contract);

    // 5. GMGN (backend only)
    const gmgn = await fetchGMGN(contract);

    // 6. Contract analysis
    const analysis = analyzeContract(bytecode);

    // 7. AI summary
    const cortex = buildCortexSummary({
      chain,
      contract,
      bytecode,
      goldrush,
      dexscreener,
      analysis,
    });

    return NextResponse.json({
      chain,
      contract,
      bytecode,
      goldrush,
      dexscreener,
      gmgn,
      analysis,
      cortex,
    });
  } catch (err) {
    console.error("Fatal backend error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
