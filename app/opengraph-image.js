import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#161c2a',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '80px',
        }}
      >
        {/* Wordmark row: logo mark + "AImates" */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '48px' }}>
          {/* Logo mark — two overlapping circles with horizontal bar */}
          <svg
            width="108"
            height="56"
            viewBox="0 0 108 56"
            style={{ marginRight: '28px' }}
          >
            <circle cx="27" cy="28" r="23" fill="none" stroke="#2dd4bf" strokeWidth="4" />
            <circle cx="65" cy="28" r="23" fill="none" stroke="#2dd4bf" strokeWidth="4" />
            {/* horizontal bar clipped inside both circles */}
            <line x1="4" y1="28" x2="88" y2="28" stroke="#2dd4bf" strokeWidth="4" strokeLinecap="round" />
          </svg>

          {/* "AI" teal + "mates" white */}
          <div style={{ display: 'flex', fontSize: '86px', fontWeight: '700', letterSpacing: '-2px', lineHeight: 1 }}>
            <span style={{ color: '#2dd4bf' }}>AI</span>
            <span style={{ color: '#ffffff' }}>mates</span>
          </div>
        </div>

        {/* Tool title */}
        <div
          style={{
            fontSize: '44px',
            fontWeight: '600',
            color: '#ffffff',
            textAlign: 'center',
            letterSpacing: '-0.5px',
            marginBottom: '20px',
          }}
        >
          AI Content Repurposing Engine
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '26px',
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: '820px',
            lineHeight: 1.5,
          }}
        >
          One YouTube URL → blog post, Twitter thread, LinkedIn post, email, quotes &amp; short-form — in 60 seconds
        </div>

        {/* Domain badge at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: '52px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '22px',
            color: '#2dd4bf',
            letterSpacing: '0.3px',
          }}
        >
          theaimates.com
        </div>
      </div>
    ),
    { ...size }
  )
}
