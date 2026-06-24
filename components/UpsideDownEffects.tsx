'use client'
import React, { useEffect, useMemo, useState } from 'react'

export function SwarmParticles() {
  const particles = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: Math.random() * 3 + 1.5,
    color: ['#FF6B6B', '#CC0000', '#FF1744', '#8B0000', '#9B006B'][Math.floor(Math.random() * 5)],
    opacity: Math.random() * 0.6 + 0.2,
    duration: Math.random() * 12 + 10,
    delay: -(Math.random() * 20),
    glow: Math.random() > 0.5,
  })), [])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2, overflow: 'hidden' }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            background: p.color,
            opacity: p.opacity,
            boxShadow: p.glow ? `0 0 8px ${p.color}, 0 0 16px ${p.color}` : 'none',
            animation: `particleDrift ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

export function LightningOverlay() {
  const [bolt, setBolt] = useState<{ x: number; active: boolean }>({ x: 50, active: false })

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | undefined
    let fireTimer: ReturnType<typeof setTimeout> | undefined

    const fire = () => {
      setBolt({ x: Math.random() * 70 + 15, active: true })
      hideTimer = setTimeout(() => setBolt(b => ({ ...b, active: false })), 250)
    }

    const schedule = () => {
      fireTimer = setTimeout(() => {
        fire()
        schedule()
      }, Math.random() * 7000 + 4000)
    }

    schedule()

    return () => {
      if (hideTimer) clearTimeout(hideTimer)
      if (fireTimer) clearTimeout(fireTimer)
    }
  }, [])

  if (!bolt.active) return null

  const boltPoints = `${bolt.x}%,0 ${bolt.x - 4}%,25% ${bolt.x + 6}%,45% ${bolt.x - 3}%,65% ${bolt.x + 4}%,85% ${bolt.x}%,100%`

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <filter id="lightning-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <polyline
          points={boltPoints}
          fill="none"
          stroke="#FF1744"
          strokeWidth="2"
          filter="url(#lightning-glow)"
          style={{ animation: 'lightningFlash 0.25s ease-out' }}
        />
        <polyline points={boltPoints} fill="none" stroke="white" strokeWidth="0.8" opacity="0.6" />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at ${bolt.x}% 40%, rgba(255,23,68,0.15) 0%, transparent 50%)`,
        }}
      />
    </div>
  )
}

export function UpsideDownMist() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '25%',
          background: 'linear-gradient(to top, rgba(74,14,107,0.12) 0%, transparent 100%)',
          animation: 'mistFlow 9s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '40%',
          background: 'radial-gradient(ellipse, rgba(139,0,0,0.08) 0%, transparent 70%)',
          animation: 'mistFlow 13s ease-in-out -3s infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: 0,
          width: '40%',
          height: '50%',
          background: 'radial-gradient(ellipse, rgba(74,14,107,0.07) 0%, transparent 70%)',
          animation: 'mistFlow 11s ease-in-out -6s infinite',
        }}
      />
    </div>
  )
}

export function PortalGate() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', height: '100%' }}>
      <div style={{ position: 'relative', width: '140px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            position: 'absolute',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            border: '1px solid rgba(139,0,0,0.5)',
            boxShadow: '0 0 20px rgba(139,0,0,0.4), inset 0 0 20px rgba(139,0,0,0.2)',
            animation: 'portalSpin 20s linear infinite, gatePulse 3s ease-in-out infinite',
          }}
        />

        <div
          style={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            border: '1px solid rgba(74,14,107,0.7)',
            boxShadow: '0 0 15px rgba(74,14,107,0.5)',
            animation: 'portalSpinReverse 12s linear infinite',
          }}
        />

        <div
          style={{
            width: '55px',
            height: '55px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #4A0E6B 0%, #8B0000 40%, #050208 100%)',
            boxShadow: '0 0 30px rgba(139,0,0,0.7), 0 0 60px rgba(74,14,107,0.4)',
            animation: 'gatePulse 3s ease-in-out infinite',
          }}
        />

        <div
          style={{
            position: 'absolute',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            animation: 'portalSpin 6s linear infinite',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#FF1744',
              boxShadow: '0 0 10px #FF1744, 0 0 20px #DC143C',
            }}
          />
        </div>
      </div>

      <p
        style={{
          color: '#5A3A3A',
          fontSize: '0.65rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          animation: 'vecnaFlicker 6s infinite',
        }}
      >
        THE VOID AWAITS YOUR QUESTION
      </p>
      <p style={{ color: '#3A2020', fontSize: '0.6rem', letterSpacing: '0.15em' }}>
        upload a document &middot; ask anything
      </p>
    </div>
  )
}
