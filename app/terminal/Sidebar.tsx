"use client";

import FeatureBar from "@/components/FeatureBar";

interface TerminalSidebarProps {
  selectedFeature: string | null;
  onSelectFeature: (featureKey: string) => void;
}

export default function Sidebar({ selectedFeature, onSelectFeature }: TerminalSidebarProps) {
  return (
    <aside className="flex h-full w-56 shrink-0 flex-col border-r border-white/10 bg-[#06060a] p-4 [font-family:var(--font-inter),_Inter,_sans-serif]">
      <div className="mb-4 rounded-2xl border border-white/15 bg-[linear-gradient(145deg,rgba(28,12,40,0.72),rgba(9,15,23,0.66))] px-3 py-2 shadow-[0_12px_36px_rgba(168,85,247,0.2),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition hover:shadow-[0_18px_48px_rgba(236,72,153,0.28),0_0_36px_rgba(45,212,191,0.24)]">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/90 [font-family:var(--font-plex-mono),_'IBM_Plex_Mono',_monospace]">
          CLARK TERMINAL
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/15 bg-[linear-gradient(145deg,rgba(23,11,34,0.66),rgba(8,14,21,0.62))] p-2 shadow-[0_12px_36px_rgba(124,58,237,0.2),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition hover:shadow-[0_18px_52px_rgba(236,72,153,0.26),0_0_34px_rgba(45,212,191,0.2)]">
        <div className="h-full overflow-y-auto p-1">
          <FeatureBar
            onSelectFeature={onSelectFeature}
            activeFeature={selectedFeature}
            grouped
            compact
          />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-[rgba(45,212,191,0.45)] bg-[linear-gradient(135deg,rgba(236,72,153,0.16),rgba(168,85,247,0.14),rgba(45,212,191,0.16))] px-3 py-2 text-center text-[10px] uppercase tracking-[0.14em] text-[#9ff7e8] shadow-[0_10px_30px_rgba(45,212,191,0.16)] transition hover:shadow-[0_16px_42px_rgba(236,72,153,0.24),0_0_30px_rgba(45,212,191,0.24)] [font-family:var(--font-plex-mono),_'IBM_Plex_Mono',_monospace]">
        ELITE PLAN
      </div>
    </aside>
  );
}
