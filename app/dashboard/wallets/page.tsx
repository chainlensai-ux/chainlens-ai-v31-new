"use client";

import { useState } from "react";

export default function WalletAnalyzer() {
  const [address, setAddress] = useState("");
  const [chain, setChain] = useState("eth");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyzeWallet = async () => {
    if (!address) {
      alert("Please enter a wallet address");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, chain }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error analyzing wallet");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "700px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        Multi‑Chain Wallet Analyzer
      </h1>

      <input
        type="text"
        placeholder="Enter wallet address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "15px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      <select
        value={chain}
        onChange={(e) => setChain(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "15px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      >
        <option value="eth">Ethereum</option>
        <option value="base">Base</option>
        <option value="polygon">Polygon</option>
        <option value="solana">Solana</option>
        <option value="bnb">BNB</option>
        <option value="optimism">Optimism</option>
        <option value="arbitrum">Arbitrum</option>
      </select>

      <button
        onClick={analyzeWallet}
        disabled={loading}
        style={{
          width: "100%",
          padding: "14px",
          background: "#6a5acd",
          color: "white",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        {loading ? "Analyzing..." : "Analyze Wallet"}
      </button>

      {result && (
        <div style={{ marginTop: "30px" }}>
          <h2>Results</h2>
          <pre
            style={{
              background: "#111",
              color: "#0f0",
              padding: "20px",
              borderRadius: "8px",
              overflowX: "auto",
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
