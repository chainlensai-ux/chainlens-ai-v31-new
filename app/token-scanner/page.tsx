"use client";

import { useState } from "react";
import clsx from "clsx";

type ScanResult = {
  chain?: string;
  contract?: string;
  goldrush?: any;
  dexscreener?: any;
  gmgn?: any;
  analysis?: any;
  cortex?: any;
  issues?: string[];
};

const TABS = ["Overview", "Market", "Contract", "AI Summary", "Raw Data"] as const;
type TabKey = (typeof TABS)[number];

export default function TokenScannerPage() {
  const [contract, setContract] = useState("");
  const [data, setData] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("Overview");

  async function scanToken(contract: string) {
    try {
      const res = await fetch("/api/token/scan", {
        method: "POST",
        body: JSON.stringify({ contract }),
      });

      if (!res.ok) {
        console.error("Scan failed:", res.status);
        return null;
      }

      const json = (await res.json()) as ScanResult;
      return json;
    } catch (err) {
      console.error("Frontend scan error:", err);
      return null;
    }
  }

  async function handleScan() {
    if (!contract) return;
    setLoading(true);
    setData(null);

    const result = await scanToken(contract);
    setData(result);
    setActiveTab("Overview");

    setLoading(false);
  }

  const riskLevel = getRiskLevel(data);
  const chainBadge = getChainBadge(data?.chain);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050510] via-[#050712] to-[#050510] text-neutral-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex flex-col gap-3 mb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-200">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(216,180,254,0.8)]" />
              ChainLens AI · Token Scanner Elite
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Token Scanner Elite
            </h1>
            <p className="mt-2 max-w-xl text-sm text-neutral-400">
              Paste any contract — ChainLens AI detects the chain, pulls on‑chain + market data,
              analyzes the contract, and compresses everything into an AI‑powered summary.
            </p>
          </div>

          {riskLevel && (
            <div className="mt-4 md:mt-0">
              <RiskPill level={riskLevel} />
            </div>
          )}
        </header>

        {/* Input card */}
        <div className="mb-6 rounded-2xl border border-white/5 bg-white/5/10 bg-gradient-to-br from-white/5 via-white/0 to-purple-500/10 p-4 shadow-[0_0_40px_rgba(139,92,246,0.25)] backdrop-blur">
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
            Contract address
          </label>
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              placeholder="0x..."
              value={contract}
              onChange={(e) => setContract(e.target.value)}
              className="flex-1 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none ring-0 transition focus:border-purple-400 focus:bg-black/60"
            />
            <button
              onClick={handleScan}
              disabled={loading}
              className={clsx(
                "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition",
                "bg-gradient-to-r from-purple-500 via-fuchsia-500 to-emerald-400 text-white shadow-[0_0_25px_rgba(168,85,247,0.7)]",
                "hover:shadow-[0_0_35px_rgba(168,85,247,0.9)] hover:brightness-110",
                loading && "opacity-60 cursor-not-allowed"
              )}
            >
              {loading ? "Scanning..." : "Scan Token"}
            </button>
          </div>

          {data && (
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-neutral-300">
              {chainBadge}
              {data.contract && (
                <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 font-mono">
                  {shorten(data.contract)}
                </span>
              )}
              {data.dexscreener?.pairs?.length && (
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1">
                  {data.dexscreener.pairs.length} pairs detected
                </span>
              )}
              {data.issues && data.issues.length > 0 && (
                <span className="rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-red-200">
                  {data.issues.length} issue{data.issues.length > 1 ? "s" : ""} detected
                </span>
              )}
            </div>
          )}
        </div>

        {/* Tabs + content */}
        {data && (
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 rounded-2xl border border-white/5 bg-black/40 p-2 backdrop-blur">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={clsx(
                    "px-3 py-1.5 text-xs font-medium rounded-xl transition",
                    activeTab === tab
                      ? "bg-gradient-to-r from-purple-500/80 to-emerald-400/80 text-white shadow-[0_0_18px_rgba(168,85,247,0.7)]"
                      : "text-neutral-400 hover:text-neutral-100 hover:bg-white/5"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Panels */}
            <div className="grid gap-4 md:grid-cols-3">
              {/* Left column: main content */}
              <div className="md:col-span-2 space-y-4">
                {activeTab === "Overview" && <OverviewPanel data={data} />}
                {activeTab === "Market" && <MarketPanel data={data} />}
                {activeTab === "Contract" && <ContractPanel data={data} />}
                {activeTab === "AI Summary" && <AISummaryPanel data={data} />}
                {activeTab === "Raw Data" && <RawDataPanel data={data} />}
              </div>

              {/* Right column: side info */}
              <div className="space-y-4">
                <SideMetaCard data={data} />
                <IssuesCard issues={data.issues} />
              </div>
            </div>
          </div>
        )}

        {!data && !loading && (
          <p className="mt-10 text-center text-sm text-neutral-500">
            Paste a contract above and hit{" "}
            <span className="text-purple-300 font-medium">Scan Token</span> to see ChainLens AI in
            action.
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------- UI helpers ---------- */

function RiskPill({ level }: { level: "low" | "medium" | "high" }) {
  const label =
    level === "low" ? "Low risk" : level === "medium" ? "Moderate risk" : "High risk / caution";
  const colors =
    level === "low"
      ? "from-emerald-500/90 to-emerald-400/80 text-emerald-50"
      : level === "medium"
      ? "from-amber-500/90 to-amber-400/80 text-amber-50"
      : "from-red-500/90 to-red-400/80 text-red-50";

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-medium shadow-[0_0_20px_rgba(0,0,0,0.6)]",
        colors
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-white" />
      {label}
    </div>
  );
}

function getRiskLevel(data: ScanResult | null): "low" | "medium" | "high" | null {
  if (!data) return null;
  const issues = data.issues ?? [];
  if (issues.length === 0) return "low";
  if (issues.length <= 2) return "medium";
  return "high";
}

function getChainBadge(chain?: string) {
  if (!chain) return null;
  const normalized = chain.toLowerCase();

  const map: Record<
    string,
    { label: string; color: string }
  > = {
    base: { label: "Base", color: "bg-sky-500/20 border-sky-400/40 text-sky-100" },
    ethereum: { label: "Ethereum", color: "bg-neutral-500/20 border-neutral-300/40 text-neutral-100" },
    eth: { label: "Ethereum", color: "bg-neutral-500/20 border-neutral-300/40 text-neutral-100" },
    bnb: { label: "BNB Chain", color: "bg-amber-500/20 border-amber-400/40 text-amber-100" },
    polygon: { label: "Polygon", color: "bg-fuchsia-500/20 border-fuchsia-400/40 text-fuchsia-100" },
  };

  const meta = map[normalized] ?? {
    label: chain.toUpperCase(),
    color: "bg-purple-500/20 border-purple-400/40 text-purple-100",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium",
        meta.color
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {meta.label}
    </span>
  );
}

function shorten(addr?: string, chars = 4) {
  if (!addr) return "";
  if (addr.length <= chars * 2 + 2) return addr;
  return `${addr.slice(0, 2 + chars)}…${addr.slice(-chars)}`;
}

/* ---------- Panels ---------- */

function OverviewPanel({ data }: { data: ScanResult }) {
  const name =
    data.goldrush?.token?.name ??
    data.gmgn?.name ??
    data.dexscreener?.pairs?.[0]?.baseToken?.name ??
    "Unknown";
  const symbol =
    data.goldrush?.token?.symbol ??
    data.gmgn?.symbol ??
    data.dexscreener?.pairs?.[0]?.baseToken?.symbol ??
    "?";
  const decimals =
    data.goldrush?.token?.decimals ??
    data.gmgn?.decimals ??
    data.dexscreener?.pairs?.[0]?.baseToken?.decimals ??
    "?";
  const pairsCount = data.dexscreener?.pairs?.length ?? 0;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/5 bg-black/40 p-4 backdrop-blur">
        <h2 className="text-sm font-semibold text-neutral-100">Token overview</h2>
        <p className="mt-1 text-xs text-neutral-400">
          High‑level snapshot of the token based on on‑chain + market data.
        </p>

        <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <InfoRow label="Name" value={name} />
          <InfoRow label="Symbol" value={symbol} />
          <InfoRow label="Decimals" value={String(decimals)} />
          <InfoRow label="Pairs (DexScreener)" value={String(pairsCount)} />
        </div>
      </div>

      <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-4 text-xs text-neutral-200">
        <p className="font-medium text-purple-100">How to read this:</p>
        <p className="mt-1 text-neutral-300">
          Use <span className="font-semibold text-purple-200">Overview</span> to sanity‑check the
          token, <span className="font-semibold text-emerald-200">Market</span> to understand
          liquidity + volume, <span className="font-semibold text-sky-200">Contract</span> to spot
          risk, and <span className="font-semibold text-fuchsia-200">AI Summary</span> to get the
          full story in plain English.
        </p>
      </div>
    </div>
  );
}

function MarketPanel({ data }: { data: ScanResult }) {
  const pair = data.dexscreener?.pairs?.[0];
  const price = pair?.priceUsd ?? pair?.priceNative ?? "Unknown";
  const liquidity = pair?.liquidity?.usd ?? pair?.liquidity ?? "Unknown";
  const volume24h = pair?.volume?.h24 ?? pair?.volume24h ?? "Unknown";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
        <h2 className="text-sm font-semibold text-neutral-100">Market snapshot</h2>
        <p className="mt-1 text-xs text-neutral-400">
          Live market data from DexScreener and other sources.
        </p>

        <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          <InfoRow label="Price" value={String(price)} />
          <InfoRow label="Liquidity (USD)" value={String(liquidity)} />
          <InfoRow label="Volume 24h" value={String(volume24h)} />
          <InfoRow
            label="Pairs tracked"
            value={String(data.dexscreener?.pairs?.length ?? 0)}
          />
        </div>
      </div>

      <CodeBlock title="DexScreener raw" payload={data.dexscreener} />
    </div>
  );
}

function ContractPanel({ data }: { data: ScanResult }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-sky-500/30 bg-sky-500/5 p-4">
        <h2 className="text-sm font-semibold text-neutral-100">Contract analysis</h2>
        <p className="mt-1 text-xs text-neutral-400">
          Bytecode‑level insights, ownership, tax logic, blacklist/whitelist patterns, and other
          risk signals.
        </p>
      </div>

      <CodeBlock title="Analysis" payload={data.analysis} />
      <CodeBlock title="GoldRush raw" payload={data.goldrush} />
    </div>
  );
}

function AISummaryPanel({ data }: { data: ScanResult }) {
  const summary =
    typeof data.cortex === "string"
      ? data.cortex
      : data.cortex?.summary ?? data.cortex?.text ?? null;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-500/10 via-purple-500/5 to-emerald-500/10 p-4 shadow-[0_0_30px_rgba(217,70,239,0.4)]">
        <h2 className="text-sm font-semibold text-neutral-50">AI summary</h2>
        <p className="mt-1 text-xs text-neutral-300">
          ChainLens AI compresses all on‑chain, market, and contract data into a human‑readable
          explanation.
        </p>

        <div className="mt-3 rounded-xl bg-black/40 p-3 text-sm text-neutral-100">
          {summary ? (
            <pre className="whitespace-pre-wrap text-sm text-neutral-100">{summary}</pre>
          ) : (
            <span className="text-neutral-400">
              No AI summary returned. Check backend logs or try another contract.
            </span>
          )}
        </div>
      </div>

      <CodeBlock title="AI raw payload" payload={data.cortex} />
    </div>
  );
}

function RawDataPanel({ data }: { data: ScanResult }) {
  return (
    <div className="space-y-4">
      <CodeBlock title="Full response" payload={data} />
    </div>
  );
}

/* ---------- Side cards ---------- */

function SideMetaCard({ data }: { data: ScanResult }) {
  const name =
    data.goldrush?.token?.name ??
    data.gmgn?.name ??
    data.dexscreener?.pairs?.[0]?.baseToken?.name ??
    "Unknown";
  const symbol =
    data.goldrush?.token?.symbol ??
    data.gmgn?.symbol ??
    data.dexscreener?.pairs?.[0]?.baseToken?.symbol ??
    "?";

  return (
    <div className="rounded-2xl border border-white/5 bg-black/40 p-4 text-xs backdrop-blur">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
        Snapshot
      </p>
      <p className="mt-2 text-sm font-semibold text-neutral-100">
        {name} <span className="text-neutral-400">({symbol})</span>
      </p>
      {data.contract && (
        <p className="mt-1 font-mono text-[11px] text-neutral-400">
          {shorten(data.contract, 6)}
        </p>
      )}

      <div className="mt-3 space-y-1 text-[11px] text-neutral-400">
        <p>
          <span className="text-neutral-500">Chain:</span> {data.chain ?? "Unknown"}
        </p>
        <p>
          <span className="text-neutral-500">Pairs:</span>{" "}
          {data.dexscreener?.pairs?.length ?? 0}
        </p>
        <p>
          <span className="text-neutral-500">Issues:</span>{" "}
          {data.issues?.length ?? 0}
        </p>
      </div>
    </div>
  );
}

function IssuesCard({ issues }: { issues?: string[] }) {
  if (!issues || issues.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs text-emerald-100">
        <p className="font-semibold">No critical issues detected</p>
        <p className="mt-1 text-emerald-200/80">
          Always double‑check contract + liquidity, but nothing major was flagged by ChainLens AI.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-xs text-red-100">
      <p className="font-semibold">
        {issues.length} issue{issues.length > 1 ? "s" : ""} detected
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-4">
        {issues.map((issue, i) => (
          <li key={i}>{issue}</li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Generic components ---------- */

function InfoRow({ label, value }: { label: string; value: string }): import("react/jsx-runtime").JSX.Element {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">
        {label}
      </span>
      <span className="text-sm text-neutral-100">{value}</span>
    </div>
  );
}

function CodeBlock({ title, payload }: { title: string; payload: any }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/60 p-3 text-xs">
      <div className="mb-2 flex items-center justify-between text-[11px] text-neutral-400">
        <span>{title}</span>
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em]">
          Raw
        </span>
      </div>
      <pre className="max-h-72 overflow-auto whitespace-pre-wrap font-mono text-[11px] text-neutral-300">
        {payload ? JSON.stringify(payload, null, 2) : "// no data"}
      </pre>
    </div>
  );
}
