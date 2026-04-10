import { NextResponse } from "next/server";

const RPC = {
  eth: process.env.ETH_RPC_URL || "https://eth.llamarpc.com",
  base: process.env.BASE_RPC_URL || "https://mainnet.base.org",
  polygon: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
  bnb: process.env.BNB_RPC_URL || "https://bsc-dataseed.bnbchain.org:443",
};

type ChainConfig = {
  name: string;
  rpc: string;
  nativeSymbol: string;
};

const CHAINS: Record<string, ChainConfig> = {
  eth: {
    name: "Ethereum",
    rpc: RPC.eth,
    nativeSymbol: "ETH",
  },
  base: {
    name: "Base",
    rpc: RPC.base,
    nativeSymbol: "ETH",
  },
  polygon: {
    name: "Polygon",
    rpc: RPC.polygon,
    nativeSymbol: "MATIC",
  },
  bnb: {
    name: "BNB Chain",
    rpc: RPC.bnb,
    nativeSymbol: "BNB",
  },
};

async function getNativeBalance(rpc: string, address: string) {
  try {
    const res = await fetch(rpc, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, "latest"],
      }),
    });

    const data = await res.json();
    return data.result ? parseInt(data.result, 16) / 1e18 : 0;
  } catch {
    return 0;
  }
}

async function getTransactions(rpc: string, address: string) {
  try {
    const res = await fetch(rpc, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "alchemy_getAssetTransfers",
        params: [
          {
            fromAddress: address,
            toAddress: address,
            category: ["external", "internal", "erc20", "erc721"],
            withMetadata: true,
            excludeZeroValue: false,
            maxCount: "0x3e8",
          },
        ],
      }),
    });

    const data = await res.json();
    return data.result?.transfers || [];
  } catch {
    return [];
  }
}

export async function POST(req: Request) {
  try {
    const { address } = await req.json();

    if (!address) {
      return NextResponse.json(
        { error: "Missing wallet address" },
        { status: 400 }
      );
    }

    const results: Record<string, any> = {};

    for (const key of Object.keys(CHAINS)) {
      const chain = CHAINS[key];

      const [balance, txs] = await Promise.all([
        getNativeBalance(chain.rpc, address),
        getTransactions(chain.rpc, address),
      ]);

      results[key] = {
        chain: chain.name,
        nativeBalance: balance,
        transactions: txs,
      };
    }

    return NextResponse.json({ address, results });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
