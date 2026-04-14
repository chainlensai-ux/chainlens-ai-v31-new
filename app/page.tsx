import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex h-screen flex-col items-center justify-center bg-neutral-950 text-neutral-100">
      {/* Hero Section */}
      <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-fuchsia-500">
        ChainLens AI
      </h1>
      <p className="mt-4 text-lg text-neutral-400">
        Your crypto cockpit powered by Clark AI.
      </p>

      {/* CTA Button */}
      <Link href="/terminal">
        <button className="mt-8 rounded-lg bg-purple-600 px-6 py-3 font-semibold hover:bg-purple-500 transition">
          Enter Terminal
        </button>
      </Link>
    </main>
  );
}
