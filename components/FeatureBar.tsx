export default function FeatureBar() {
  return (
    <aside className="w-64 bg-neutral-900 p-4">
      <h2 className="text-lg font-bold">Feature Bar</h2>
      <ul className="mt-4 space-y-2">
        <li>Wallet Scanner</li>
        <li>Dev Wallet Detector</li>
        <li>Liquidity Lock</li>
        <li>Contract Analyzer</li>
        <li>Whale Distribution</li>
        <li>Multi-Scan Fallback</li>
        <li>Risk Color System</li>
        <li>AI Summary Card</li>
      </ul>
      <button className="mt-6 w-full rounded bg-purple-600 py-2 hover:bg-purple-500">
        Connect Wallet
      </button>
    </aside>
  );
}
