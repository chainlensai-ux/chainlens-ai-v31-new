"use client";

import { motion } from "framer-motion";

export default function ClarkBot() {
  return (
    <section className="relative flex justify-center mt-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="w-full max-w-3xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Glow background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-cyan-500/20 blur-2xl"
        />

        {/* Floating orb */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute w-40 h-40 bg-blue-500/40 rounded-full blur-3xl -top-10 -right-10"
        />

        {/* Title */}
        <h2 className="text-3xl font-semibold text-white relative z-10">
          Clark AI Preview
        </h2>

        <p className="text-white/70 mt-2 relative z-10">
          A glimpse of how Clark thinks, responds, and analyzes your Base
          ecosystem in real time.
        </p>

        {/* Fake chat bubble */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="mt-8 bg-black/40 border border-white/10 rounded-xl p-4 text-white/90 relative z-10"
        >
          <p>
            <span className="text-blue-300 font-semibold">Clark:</span>  
            Wallet 0x92… just accumulated 14.2 ETH into a fresh Base deployer.
            Risk score: <span className="text-yellow-300">Medium</span>.  
            Narrative alignment: <span className="text-green-300">AI Agents</span>.
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
