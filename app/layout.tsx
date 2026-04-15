import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ChainLens AI — Crypto Intelligence Platform',
  description: 'AI-powered crypto intelligence — wallet scanner, bear market scoring, paper trading and more.',
  themeColor: '#06060a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={
          {
            '--font-inter': 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
            '--font-mono': '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            background: '#06060a',
            color: '#fff',
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            overflowX: 'hidden',
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  )
}
