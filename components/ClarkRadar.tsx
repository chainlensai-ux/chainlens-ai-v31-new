'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

// ─── Mock data ────────────────────────────────────────────────────────────

const WHALE_ALERTS = [
  { token: 'ETH', amount: '$2.4M',  action: 'Large transfer detected',  severity: 'HIGH',   up: true  },
  { token: 'SOL', amount: '$890K',  action: 'Whale accumulation signal', severity: 'MEDIUM', up: true  },
  { token: 'UNI', amount: '$1.8M',  action: 'Large sell pressure',       severity: 'HIGH',   up: false },
]

const AI_SIGNALS = [
  { name: 'Bitcoin',  sym: 'BTC',  bar: 78, label: 'BULLISH', color: '#f59e0b' },
  { name: 'Ethereum', sym: 'ETH',  bar: 62, label: 'BULLISH', color: '#627EEA' },
  { name: 'Base Eco', sym: 'BASE', bar: 44, label: 'NEUTRAL', color: '#2DD4BF' },
]

const LIVE_ACTIVITY = [
  { text: '0x7a25…88D bought $12K BRETT on Base',  time: '30s' },
  { text: 'New pair BONK/WETH deployed on Base',    time: '1m'  },
  { text: '0xd8dA…6045 sold 50K TOSHI',             time: '4m'  },
  { text: 'Whale bridged 18 ETH → Base chain',      time: '9m'  },
  { text: 'Smart wallet added $80K LP on AERO',     time: '14m' },
]

const SEVERITY_STYLE: Record<string, string> = {
  HIGH:   'text-rose-400  bg-rose-400/[0.08]  border-rose-400/[0.2]',
  MEDIUM: 'text-amber-400 bg-amber-400/[0.08] border-amber-400/[0.2]',
  LOW:    'text-[#2DD4BF] bg-[#2DD4BF]/[0.08] border-[#2DD4BF]/[0.2]',
}

const SIGNAL_STYLE: Record<string, string> = {
  BULLISH: 'text-[#2DD4BF] bg-[#2DD4BF]/[0.08] border-[#2DD4BF]/[0.2]',
  NEUTRAL: 'text-amber-400 bg-amber-400/[0.08] border-amber-400/[0.2]',
  BEARISH: 'text-rose-400  bg-rose-400/[0.08]  border-rose-400/[0.2]',
}

// ─── Section card ─────────────────────────────────────────────────────────

function Section({
  title,
  accent,
  delay = 0,
  children,
}: {
  title: string
  accent?: string
  delay?: number
  children: ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      className="rounded-2xl overflow-hidden"
      style={{ background: '#080e1a', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
      >
        <span
          className="text-[10px] font-bold uppercase tracking-[0.15em]"
          style={{ color: '#3d5268' }}
        >
          {title}
        </span>
        {accent && (
          <span
            className="text-[9px] font-bold tracking-wider"
            style={{ fontFamily: 'var(--font-plex-mono)', color: '#2DD4BF' }}
          >
            {accent}
          </span>
        )}
      </div>
      <div className="p-4">{children}</div>
    </motion.div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────

export default function ClarkRadar({ onSelectRadar }: { onSelectRadar: (val: string) => void }) {
  return (
    <div>

      {/* Panel header — sticky so it stays visible while scrolling */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-5 h-14"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#0f1117' }}
      >
        <span
          className="text-[14px] font-bold tracking-tight"
          style={{ color: '#f1f5f9' }}
        >
          Market Intelligence
        </span>
        <div className="flex items-center gap-2">
          <div
            className="w-[7px] h-[7px] rounded-full bg-[#2DD4BF]"
            style={{ boxShadow: '0 0 8px rgba(45,212,191,0.9)' }}
          />
          <span
            className="text-[10px] font-bold text-[#2DD4BF] tracking-widest"
            style={{ fontFamily: 'var(--font-plex-mono)' }}
          >
            LIVE
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-3 py-4 space-y-3">

        {/* ── Whale Alerts ─────────────────────────── */}
        <Section title="Whale Alerts" delay={0}>
          <div className="space-y-2.5">
            {WHALE_ALERTS.map((w, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {/* Token icon */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-[10px] font-bold"
                  style={{
                    background: w.up ? 'rgba(45,212,191,0.1)' : 'rgba(251,113,133,0.1)',
                    color:      w.up ? '#2DD4BF'               : '#fb7185',
                    border:     `1px solid ${w.up ? 'rgba(45,212,191,0.2)' : 'rgba(251,113,133,0.2)'}`,
                  }}
                >
                  {w.token}
                </div>
                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[12px] font-bold leading-tight"
                    style={{ fontFamily: 'var(--font-plex-mono)', color: '#e2e8f0' }}
                  >
                    {w.amount}
                  </p>
                  <p className="text-[10px] mt-0.5 truncate" style={{ color: '#3d5268' }}>
                    {w.action}
                  </p>
                </div>
                {/* Severity badge */}
                <span
                  className={`shrink-0 text-[8px] font-bold px-1.5 py-0.5 rounded border ${SEVERITY_STYLE[w.severity]}`}
                  style={{ fontFamily: 'var(--font-plex-mono)' }}
                >
                  {w.severity}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── AI Signals ───────────────────────────── */}
        <Section title="AI Signals" accent="CORTEX" delay={0.07}>
          <div className="space-y-4">
            {AI_SIGNALS.map((s, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-[8px] font-bold shrink-0"
                      style={{
                        background: `${s.color}15`,
                        color: s.color,
                        border: `1px solid ${s.color}28`,
                      }}
                    >
                      {s.sym.slice(0, 2)}
                    </div>
                    <span className="text-[12px] font-semibold" style={{ color: '#cbd5e1' }}>
                      {s.name}
                    </span>
                  </div>
                  <span
                    className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${SIGNAL_STYLE[s.label]}`}
                    style={{ fontFamily: 'var(--font-plex-mono)' }}
                  >
                    {s.label}
                  </span>
                </div>
                {/* Progress bar */}
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${s.bar}%`,
                      background:
                        s.label === 'BULLISH'
                          ? 'linear-gradient(90deg, rgba(45,212,191,0.55), #2DD4BF)'
                          : s.label === 'BEARISH'
                          ? 'linear-gradient(90deg, rgba(251,113,133,0.55), #fb7185)'
                          : 'linear-gradient(90deg, rgba(251,191,36,0.55), #fbbf24)',
                    }}
                  />
                </div>
                <p
                  className="text-[10px] mt-1 text-right"
                  style={{ fontFamily: 'var(--font-plex-mono)', color: '#2d4258' }}
                >
                  {s.bar}%
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Live Activity ────────────────────────── */}
        <Section title="Live Activity" accent="LIVE" delay={0.14}>
          <div className="space-y-2.5">
            {LIVE_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div
                  className="shrink-0 w-1.5 h-1.5 rounded-full mt-[5px]"
                  style={{ background: '#2DD4BF', boxShadow: '0 0 5px rgba(45,212,191,0.75)' }}
                />
                <p
                  className="flex-1 text-[11px] leading-relaxed"
                  style={{ color: '#64748b' }}
                >
                  {a.text}
                </p>
                <span
                  className="shrink-0 text-[9px] mt-0.5"
                  style={{ fontFamily: 'var(--font-plex-mono)', color: '#2d4258' }}
                >
                  {a.time}
                </span>
              </div>
            ))}
          </div>
          <div
            className="mt-4 flex items-center gap-2 pt-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]"
              style={{ boxShadow: '0 0 5px rgba(45,212,191,0.8)' }}
            />
            <span className="text-[11px]" style={{ color: '#3d5268' }}>
              CORTEX monitoring live
            </span>
          </div>
        </Section>

      </div>
    </div>
  )
}
