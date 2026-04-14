export default function ClarkRadar() {
  return (
    <div className="p-4 bg-neutral-900">
      <h2 className="text-lg font-bold">Clark Radar</h2>
      <div className="mt-2 grid grid-cols-3 gap-4">
        <div className="rounded bg-neutral-800 p-2">Coin A</div>
        <div className="rounded bg-neutral-800 p-2">Coin B</div>
        <div className="rounded bg-neutral-800 p-2">Coin C</div>
      </div>
    </div>
  );
}
