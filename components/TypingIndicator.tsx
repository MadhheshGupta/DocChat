'use client'
import React from 'react'

export default function TypingIndicator() {
  return (
    <div className="mb-4 flex justify-start">
      <div
        className="flex flex-col rounded-xl px-4 py-3"
        style={{
          background: '#0D0A14',
          border: '1px solid #2A1A2A',
          borderLeft: '3px solid #8B0000',
          boxShadow: '-2px 0 8px #8B000030',
        }}
      >
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          {[0, 1, 2, 3, 4].map(i => (
            <div
              key={i}
              style={{
                width: i === 2 ? '10px' : '7px',
                height: i === 2 ? '10px' : '7px',
                borderRadius: '50%',
                background: '#DC143C',
                animation: `dotGlow 1.4s ease-in-out ${i * 180}ms infinite`,
              }}
            />
          ))}
        </div>
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #DC143C, #4A0E6B, transparent)',
            marginTop: '8px',
            transformOrigin: 'left',
            animation: 'powerLine 2.5s ease-in-out infinite',
          }}
        />
        <p
          style={{
            color: '#9B7B6B',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            marginTop: '6px',
            animation: 'vecnaFlicker 4s infinite',
          }}
        >
          ELEVEN IS REACHING OUT...
        </p>
      </div>
    </div>
  )
}
