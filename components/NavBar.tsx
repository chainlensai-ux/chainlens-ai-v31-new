"use client";

import { motion } from "framer-motion";

export default function NavBar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full fixed top-0 left-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-semibold text-white">Clark</h1>

        <div className="flex items-center gap-6 text-white/70">
          <button className="hover:text-white transition">Home</button>
          <button className="hover:text-white transition">Docs</button>
          <button className="hover:text-white transition">Login</button>
        </div>
      </div>
    </motion.nav>
  );
}
