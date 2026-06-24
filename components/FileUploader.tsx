'use client'
import React, { useRef, useState } from 'react'
import { extractTextFromFile } from '@/lib/extractText'

export default function FileUploader({ onTextExtracted }: { onTextExtracted: (text: string, file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const [isExtracting, setIsExtracting] = useState(false)

  const handleFile = async (file: File) => {
    setError('')
    setIsExtracting(true)
    try {
      const text = await extractTextFromFile(file)
      onTextExtracted(text, file)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not extract text'
      setError(msg)
    } finally {
      setIsExtracting(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) void handleFile(file)
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) void handleFile(file)
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="min-h-[240px] cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all"
        style={{
          background: '#050208',
          borderColor: '#8B0000',
          animation: 'borderPulse 3s infinite',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept=".pdf,.docx,.xlsx,.txt,.md,.png,.jpg,.jpeg,.webp"
          onChange={handleChange}
          disabled={isExtracting}
        />

        {isExtracting ? (
          <>
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#2A1A3A] border-t-[#DC143C]" />
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#9B7B6B' }}>
              EXTRACTING...
            </p>
          </>
        ) : (
          <>
            <div
              className="mb-4 text-5xl"
              style={{
                animation: 'levitate 2.5s ease-in-out infinite',
                filter: 'drop-shadow(0 0 8px #8B0000)',
              }}
            >
              ↑
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#9B7B6B' }}>
              DROP YOUR DOCUMENT
            </p>
            <p className="mt-2 text-xs" style={{ color: '#5A3A3A' }}>
              pdf · docx · xlsx · txt · images
            </p>
          </>
        )}
      </div>

      {error ? (
        <p className="rounded-lg p-3 text-xs" style={{ background: '#FF174420', color: '#FF1744' }}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

