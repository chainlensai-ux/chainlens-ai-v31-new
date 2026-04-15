import Navbar from '@/components/Navbar'
import HeroChat from '@/components/HeroChat'
import Link from 'next/link'

const gradText: React.CSSProperties = {
  background: 'linear-gradient(135deg, #ec4899, #8b5cf6, #64ffda)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#06060a' }}>
      <Navbar />

      {/* ── Hero ── */}
      <section style={{
        padding: '64px 0 44px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ambient orbs */}
        <div style={{ position: 'absolute', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(80px)', width: '440px', height: '440px', top: '-160px', left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(139,92,246,0.22), transparent 70%)' }} />
        <div style={{ position: 'absolute', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(80px)', width: '220px', height: '220px', top: '40px', right: '5%', background: 'radial-gradient(circle, rgba(100,255,218,0.09), transparent 70%)' }} />
        <div style={{ position: 'absolute', borderRadius: '50%', pointerEvents: 'none', filter: 'blur(80px)', width: '200px', height: '200px', top: '60px', left: '5%', background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

          {/* CORTEX eyebrow badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(139,92,246,0.05)',
            border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: '30px',
            padding: '5px 14px',
            marginBottom: '20px',
            fontSize: '9px', fontWeight: 700,
            color: 'rgba(167,139,250,1)',
            letterSpacing: '2px', textTransform: 'uppercase',
            fontFamily: 'var(--font-mono, IBM Plex Mono, monospace)',
            animation: 'cl-fade-up 0.8s ease both',
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
              background: '#64ffda',
              boxShadow: '0 0 8px #64ffda',
              animation: 'cl-pulse 2s infinite',
            }} />
            Powered by CORTEX ENGINE
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-inter, Inter, sans-serif)',
            fontWeight: 900,
            letterSpacing: '-1.5px',
            lineHeight: 1.0,
            marginBottom: '18px',
          }}>
            <span style={{ display: 'block', fontSize: 'clamp(28px, 3.8vw, 48px)', color: '#fff', animation: 'cl-fade-up 0.9s 0.1s ease both' }}>
              See what whales do
            </span>
            <span style={{ display: 'block', fontSize: 'clamp(28px, 3.8vw, 48px)', ...gradText, animation: 'cl-fade-up 0.9s 0.26s ease both' }}>
              before everyone else does
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(13px, 1.4vw, 15px)',
            color: 'rgba(255,255,255,0.5)',
            maxWidth: '460px',
            margin: '0 auto 28px',
            lineHeight: 1.7,
            animation: 'cl-fade-up 0.65s 0.38s ease both',
          }}>
            Ask Clark anything — scan wallets, find early pumps, track smart money, and get real-time onchain intelligence.
          </p>

          {/* Clark chat box */}
          <HeroChat />

          {/* CTA buttons */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '10px', flexWrap: 'wrap',
            marginBottom: '40px',
            animation: 'cl-fade-up 0.7s 0.7s ease both',
          }}>
            <Link href="/app" style={{
              padding: '12px 24px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              color: '#fff', fontSize: '13px', fontWeight: 700,
              textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase',
              boxShadow: '0 0 24px rgba(139,92,246,0.4)',
            }}>
              Start Free
            </Link>
            <Link href="/app" style={{
              padding: '12px 24px', borderRadius: '10px',
              border: '1px solid rgba(139,92,246,0.35)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 700,
              textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              Connect Wallet
            </Link>
          </div>

        </div>
      </section>
    </main>
  )
}
