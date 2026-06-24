'use client'
import React, { useState } from 'react'
import ChatWindow from '@/components/ChatWindow'
import FileUploader from '@/components/FileUploader'
import { askGemini } from '@/lib/gemini'
import { LightningOverlay, UpsideDownMist, SwarmParticles } from '@/components/UpsideDownEffects'
import type { Message } from '@/types'

export default function Home() {
  const [documentText, setDocumentText] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [input, setInput] = useState('')

  const hasDocument = Boolean(documentText && uploadedFile)
  const canSend = hasDocument && input.trim().length > 0 && !isLoading

  function handleTextExtracted(text: string, file: File) {
    setDocumentText(text)
    setUploadedFile(file)
    setMessages([])
    setInput('')
  }

  function clearDocument() {
    setDocumentText('')
    setUploadedFile(null)
    setMessages([])
    setInput('')
  }

  function clearChat() {
    setMessages([])
    setInput('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSend) return

    const question = input.trim()
    const userMsg = createMessage('user', question)
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setIsLoading(true)

    try {
      const answer = await askGemini(documentText, question, nextMessages)
      setMessages([...nextMessages, createMessage('assistant', answer)])
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error occurred'
      setMessages([...nextMessages, createMessage('assistant', msg)])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main
      className="relative flex min-h-screen overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 20% 50%, rgba(74,14,107,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,0,0,0.15) 0%, transparent 50%), #050208',
      }}
    >
      <UpsideDownMist />
      <LightningOverlay />
      <SwarmParticles />

      {/* LEFT PANEL */}
      <div
        className="relative z-10 flex w-2/5 flex-col border-r p-8"
        style={{
          background: '#0D0A14',
          borderRightColor: '#2A1A3A',
          boxShadow: 'inset 0 0 30px rgba(74,14,107,0.15), 0 0 20px rgba(0,0,0,0.5)',
        }}
      >
        {/* Title */}
        <header className="mb-8">
          <h1
            className="text-5xl font-black uppercase tracking-widest"
            style={{
              color: '#E8D5C4',
              textShadow: '0 0 7px #FF1744, 0 0 15px #DC143C, 0 0 35px #8B0000',
              animation: 'vecnaFlicker 7s infinite',
            }}
          >
            DocChat
          </h1>
          <p
            className="mt-2 text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: '#9B7B6B' }}
          >
            ENTER THE DOCUMENT
          </p>
        </header>

        {/* File Uploader */}
        <div className="mb-6">
          <FileUploader onTextExtracted={handleTextExtracted} />
        </div>

        {/* File Loaded Card */}
        {uploadedFile ? (
          <div
            className="rounded-lg border-l-4 p-4"
            style={{
              background: '#0D0A14',
              borderLeftColor: '#8B0000',
              boxShadow: '-2px 0 8px #8B000040, inset 0 0 15px rgba(74,14,107,0.1)',
            }}
          >
            <div className="mb-3 flex items-center gap-3">
              <div
                className="h-3 w-3 rounded-full"
                style={{
                  background: '#DC143C',
                  boxShadow: '0 0 6px #FF1744',
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium" style={{ color: '#E8D5C4' }}>
                  {uploadedFile.name}
                </p>
                <p className="mt-1 text-xs" style={{ color: '#9B7B6B' }}>
                  {documentText.length.toLocaleString()} chars
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearDocument}
              className="w-full rounded-lg border px-3 py-2 text-xs font-semibold uppercase transition-all"
              style={{
                borderColor: '#8B0000',
                color: '#DC143C',
                background: 'transparent',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#8B000020'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Clear
            </button>
          </div>
        ) : null}
      </div>

      {/* RIGHT PANEL */}
      <div className="relative z-10 flex w-3/5 flex-col" style={{ background: '#050208' }}>
        <ChatWindow messages={messages} isLoading={isLoading} />

        {/* Input Bar */}
        <div
          className="border-t p-4"
          style={{
            background: '#0D0A14',
            borderTopColor: '#2A1A3A',
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
            <textarea
              className="flex-1 resize-none rounded-lg border p-3 text-sm outline-none transition-all"
              style={{
                background: '#050208',
                borderColor: '#2A1A3A',
                color: '#E8D5C4',
              }}
              placeholder={hasDocument ? 'Ask about your document...' : 'Upload first...'}
              rows={1}
              value={input}
              disabled={!hasDocument || isLoading}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  e.currentTarget.form?.requestSubmit()
                }
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = '#8B0000'
                e.currentTarget.style.boxShadow = '0 0 10px #8B000040'
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = '#2A1A3A'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearChat}
                className="text-xs font-semibold uppercase transition-all"
                style={{ color: '#9B7B6B' }}
                disabled={messages.length === 0}
                onMouseEnter={e => e.currentTarget.style.color = '#DC143C'}
                onMouseLeave={e => e.currentTarget.style.color = '#9B7B6B'}
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={!canSend}
                className="rounded-lg px-6 py-2 text-sm font-semibold uppercase transition-all"
                style={{
                  background: '#8B0000',
                  color: '#E8D5C4',
                  boxShadow: '0 0 15px #8B000060',
                  animation: 'redPulse 2s infinite',
                  opacity: canSend ? 1 : 0.5,
                }}
                onMouseEnter={e => {
                  if (canSend) {
                    e.currentTarget.style.background = '#DC143C'
                    e.currentTarget.style.boxShadow = '0 0 25px #DC143C80'
                  }
                }}
                onMouseLeave={e => {
                  if (canSend) {
                    e.currentTarget.style.background = '#8B0000'
                    e.currentTarget.style.boxShadow = '0 0 15px #8B000060'
                  }
                }}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

function createMessage(role: Message['role'], content: string): Message {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date(),
  }
}
