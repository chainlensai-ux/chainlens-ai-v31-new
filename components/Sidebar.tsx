"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const item = (href: string, label: string) => (
    <Link
      href={href}
      className={`block px-4 py-2 rounded-lg mb-2 transition ${
        pathname === href
          ? "bg-white/10 text-white font-semibold"
          : "text-white/60 hover:text-white hover:bg-white/5"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="w-64 h-screen bg-black/40 border-r border-white/10 p-4">
      <h1 className="text-xl font-bold mb-6">Clark</h1>

      {item("/dashboard/wallets", "Wallet Scanner")}
      {item("/dashboard/tokens", "Token Scanner")}
      {item("/dashboard/live", "Live Feed")}
      {item("/dashboard/agents", "Agents")}
      {item("/dashboard/settings", "Settings")}
    </div>
  );
}
