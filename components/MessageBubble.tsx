'use client'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Message } from '@/types'

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className="max-w-[75%]">
        <div
          className="rounded-xl px-4 py-3 text-sm leading-relaxed"
          style={{
            background: isUser ? '#130E1E' : '#0D0A14',
            border: isUser ? '1px solid #4A0E6B' : '1px solid #2A1A2A',
            borderLeft: isUser ? '3px solid #DC143C' : '3px solid #8B0000',
            boxShadow: isUser
              ? '-2px 0 8px #DC143C80, inset 0 0 15px rgba(74,14,107,0.2)'
              : '-2px 0 8px #8B000030',
            color: '#E8D5C4',
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h1 style={{ color: '#E8D5C4', fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', borderBottom: '1px solid #8B0000', paddingBottom: '0.25rem' }}>{children}</h1>,
              h2: ({ children }) => <h2 style={{ color: '#E8D5C4', fontSize: '1rem', fontWeight: '600', marginBottom: '0.4rem', marginTop: '0.75rem' }}>{children}</h2>,
              h3: ({ children }) => <h3 style={{ color: '#DC143C', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.3rem', marginTop: '0.5rem' }}>{children}</h3>,
              p: ({ children }) => <p style={{ marginBottom: '0.5rem', lineHeight: '1.7', color: '#E8D5C4' }}>{children}</p>,
              strong: ({ children }) => <strong style={{ color: '#FF6B6B', fontWeight: '700' }}>{children}</strong>,
              em: ({ children }) => <em style={{ color: '#9B7B6B', fontStyle: 'italic' }}>{children}</em>,
              ul: ({ children }) => <ul style={{ paddingLeft: '1.25rem', marginBottom: '0.5rem', listStyleType: 'disc' }}>{children}</ul>,
              ol: ({ children }) => <ol style={{ paddingLeft: '1.25rem', marginBottom: '0.5rem' }}>{children}</ol>,
              li: ({ children }) => <li style={{ color: '#E8D5C4', marginBottom: '0.25rem', lineHeight: '1.6' }}>{children}</li>,
              table: ({ children }) => (
                <div style={{ overflowX: 'auto', marginBottom: '0.75rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>{children}</table>
                </div>
              ),
              thead: ({ children }) => <thead style={{ background: 'rgba(139,0,0,0.3)' }}>{children}</thead>,
              th: ({ children }) => <th style={{ color: '#DC143C', padding: '0.4rem 0.75rem', textAlign: 'left', borderBottom: '1px solid #8B0000', fontWeight: '600', fontSize: '0.75rem', letterSpacing: '0.05em' }}>{children}</th>,
              td: ({ children }) => <td style={{ color: '#E8D5C4', padding: '0.4rem 0.75rem', borderBottom: '1px solid rgba(139,0,0,0.2)', fontSize: '0.8rem', lineHeight: '1.5' }}>{children}</td>,
              tr: ({ children }) => <tr style={{ transition: 'background 0.2s' }}>{children}</tr>,
              code: ({ children }) => <code style={{ background: 'rgba(139,0,0,0.2)', color: '#FF6B6B', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.8rem', fontFamily: 'monospace' }}>{children}</code>,
              blockquote: ({ children }) => <blockquote style={{ borderLeft: '3px solid #8B0000', paddingLeft: '0.75rem', color: '#9B7B6B', fontStyle: 'italic', marginBottom: '0.5rem' }}>{children}</blockquote>,
              hr: () => <hr style={{ border: 'none', borderTop: '1px solid rgba(139,0,0,0.3)', margin: '0.75rem 0' }} />,
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        <p className="mt-2 text-xs" style={{ color: '#5A3A3A', textAlign: isUser ? 'right' : 'left' }}>
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}

