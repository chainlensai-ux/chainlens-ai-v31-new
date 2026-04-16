'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

// ─── Mock data ────────────────────────────────────────────────────────────

const WHALE_ALERTS = [
  { token: 'ETH', amount: '$2.4M', action: 'Large transfer detected', severity: 'HIGH', up: true },
  { token: 'SOL', amount: '$890K', action: 'Whale accumulation signal', severity: 'MEDIUM', up: true },
  { token: 'UNI', amount: '$1.8M', action: 'Large sell pressure', severity: 'HIGH', up: false },
]

const AI_SIGNALS = [
  { name: 'Bitcoin', sym: 'BTC', bar: 78, label: 'BULLISH', color: '#f59e0b' },
  { name: 'Ethereum', sym: 'ETH', bar: 62, label: 'BULLISH', color: '#627EEA' },
  { name: 'Base Eco', sym: 'BASE', bar: 44, label: 'NEUTRAL', color: '#2DD4BF' },
]

const LIVE_ACTIVITY = [
  { text: '0x7a25…88D bought $12K BRETT on Base', time: '30s' },
  { text: 'New pair BONK/WETH deployed on Base', time: '1m' },
  { text: '0xd8dA…6045 sold 50K TOSHI', time: '4m' },
  { text: 'Whale bridged 18 ETH → Base chain', time: '9m' },
  { text: 'Smart wallet added $80K LP on AERO', time: '14m' },
]

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
      style={{
        background: '#070d1a',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow:
          '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {/* Section header row */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.09)',
          background: 'rgba(255,255,255,0.035)',
        }}
      >
        <span
          className="uppercase"
          style={{
            fontSize: '10px',
            fontWeight: 800,
            letterSpacing: '0.15em',
            color: '#4a7494',
            fontFamily: 'var(--font-plex-mono)',
          }}
        >
          {title}
        </span>

        {accent && (
          <span
            className="font-bold tracking-wider"
            style={{
              fontSize: '9px',
              fontFamily: 'var(--font-plex-mono)',
              color: accent,
            }}
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

export default function ClarkRadar({
  onSelectRadar,
}: {
  onSelectRadar?: (key: string) => void
}) {
  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      {/* ── Whale Alerts ───────────────────────────── */}
      <Section title="Whale Alerts" accent="LIVE" delay={0.05}>
        <div className="space-y-3">
          {WHALE_ALERTS.map((w, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-3 py-2 rounded-lg"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-plex-mono)',
                    color: '#7a90a8',
                  }}
                >
                  {w.token}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-inter)',
                    color: '#9fb4c9',
                  }}
                >
                  {w.action}
                </span>
              </div>

              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-plex-mono)',
                  color: w.up ? '#2DD4BF' : '#f43f5e',
                }}
              >
                {w.amount}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── AI Signals ─────────────────────────────── */}
      <Section title="AI Signals" accent="AI" delay={0.1}>
        <div className="space-y-3">
          {AI_SIGNALS.map((s, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-inter)',
                    color: '#9fb4c9',
                  }}
                >
                  {s.name}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-plex-mono)',
                    color: s.color,
                  }}
                >
                  {s.label}
                </span>
              </div>

              <div
                className="rounded-full overflow-hidden"
                style={{
                  height: '6px',
                  background: 'rgba(255,255,255,0.06)',
                }}
              >
                <div
                  style={{
                    width: `${s.bar}%`,
                    height: '100%',
                    background: s.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Live Activity ──────────────────────────── */}
      <Section title="Live Activity" accent="LIVE" delay={0.14}>
        <div className="space-y-2.5">
          {LIVE_ACTIVITY.map((a, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div
                className="shrink-0 rounded-full bg-[#2DD4BF] mt-[5px]"
                style={{
                  width: '6px',
                  height: '6px',
                  boxShadow: '0 0 5px rgba(45,212,191,0.75)',
                }}
              />
              <p
                className="flex-1 leading-relaxed"
                style={{
                  fontSize: '11px',
                  color: '#7a90a8',
                  fontFamily: 'var(--font-inter)',
                }}
              >
                {a.text}
              </p>
              <span
                className="shrink-0 mt-0.5"
                style={{
                  fontSize: '9px',
                  fontFamily: 'var(--font-plex-mono)',
                  color: '#3e5c78',
                }}
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
            className="rounded-full bg-[#2DD4BF] animate-pulse"
            style={{
              width: '6px',
              height: '6px',
              boxShadow: '0 0 5px rgba(45,212,191,0.8)',
            }}
          />
          <span
            style={{
              fontSize: '11px',
              color: '#4e6e88',
              fontFamily: 'var(--font-inter)',
            }}
          >
            CORTEX monitoring live
          </span>
        </div>
      </Section>
    </div>
  )
}
