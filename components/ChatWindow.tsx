'use client'
import React, { useEffect, useRef } from 'react'
import { Message } from '@/types'
import { PortalGate } from '@/components/UpsideDownEffects'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

export default function ChatWindow({ messages, isLoading }: { messages: Message[]; isLoading: boolean }) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4" style={{ background: '#050208' }}>
      {messages.length === 0 && !isLoading ? (
        <PortalGate />
      ) : (
        <>
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={bottomRef} />
        </>
      )}
    </div>
  )
}
