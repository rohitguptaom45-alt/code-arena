import React, { useEffect, useRef, useState } from 'react'
import {
  directMessages as initialDirectMessages,
  communityChannels as initialCommunityChannels,
  currentUser,
  getDmAutoReply,
  getCommunityAutoReply,
} from '../data/mockData.js'
import { connectSocket, disconnectSocket, SOCKET_EVENTS } from '../utils/socket.js'

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function initials(name) {
  return name.replace(/[._]/g, ' ').trim()[0]?.toUpperCase() || '?'
}

export default function Chat() {
  const [mode, setMode] = useState('direct')
  const [dms, setDms] = useState(initialDirectMessages)
  const [channels, setChannels] = useState(initialCommunityChannels)
  const [activeDmId, setActiveDmId] = useState(initialDirectMessages[0]?.id ?? null)
  const [activeChannelId, setActiveChannelId] = useState(initialCommunityChannels[0]?.id ?? null)
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const [mobileShowThread, setMobileShowThread] = useState(false)
  const [typing, setTyping] = useState(false)
  const [socketConnected, setSocketConnected] = useState(false)
  const scrollRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  const activeDm = dms.find((d) => d.id === activeDmId) || null
  const activeChannel = channels.find((c) => c.id === activeChannelId) || null
  const activeThread = mode === 'direct' ? activeDm : activeChannel

  const filteredDms = dms.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
  const filteredChannels = channels.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

  // Real-time layer: tries to connect to the Socket.IO server (same host as the REST
  // backend). If nothing's listening there, we quietly stay in local demo mode below —
  // the chat UI keeps working either way, it just won't be live across two browsers
  // until a real socket server is running.
  useEffect(() => {
    const s = connectSocket()

    const onConnect = () => setSocketConnected(true)
    const onDisconnect = () => setSocketConnected(false)
    const onIncoming = (payload) => {
      if (!payload) return
      if (payload.threadType === 'direct') {
        setDms((prev) =>
          prev.map((d) =>
            d.id === payload.threadId
              ? { ...d, messages: [...d.messages, { id: Date.now(), from: 'them', text: payload.text, time: timeNow() }] }
              : d
          )
        )
      } else if (payload.threadType === 'community') {
        setChannels((prev) =>
          prev.map((c) =>
            c.id === payload.threadId
              ? { ...c, messages: [...c.messages, { id: Date.now(), from: 'other', user: payload.from, text: payload.text, time: timeNow() }] }
              : c
          )
        )
      }
    }

    s.on('connect', onConnect)
    s.on('disconnect', onDisconnect)
    s.on(SOCKET_EVENTS.MESSAGE, onIncoming)

    return () => {
      s.off('connect', onConnect)
      s.off('disconnect', onDisconnect)
      s.off(SOCKET_EVENTS.MESSAGE, onIncoming)
      disconnectSocket()
    }
  }, [])

  useEffect(() => {
    if (!activeThread) return
    const s = connectSocket()
    if (s.connected) s.emit(SOCKET_EVENTS.JOIN_ROOM, { threadType: mode, threadId: activeThread.id })
  }, [activeThread?.id, mode])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [activeThread?.messages.length, typing, activeThread?.id])

  useEffect(() => () => clearTimeout(typingTimeoutRef.current), [])

  function selectDm(id) {
    setActiveDmId(id)
    setMobileShowThread(true)
    setTyping(false)
  }

  function selectChannel(id) {
    setActiveChannelId(id)
    setMobileShowThread(true)
    setTyping(false)
  }

  function sendMessage(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text || !activeThread) return
    setDraft('')

    const s = connectSocket()
    if (s.connected) {
      s.emit(SOCKET_EVENTS.MESSAGE, {
        threadType: mode,
        threadId: activeThread.id,
        from: currentUser.username,
        text,
      })
    }

    if (mode === 'direct') {
      const newMsg = { id: Date.now(), from: 'me', text, time: timeNow() }
      setDms((prev) =>
        prev.map((d) => (d.id === activeThread.id ? { ...d, messages: [...d.messages, newMsg] } : d))
      )
      if (!s.connected) {
        // No live server — simulate a reply so the demo still feels alive.
        setTyping(true)
        clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = setTimeout(() => {
          setTyping(false)
          const reply = { id: Date.now() + 1, from: 'them', text: getDmAutoReply(), time: timeNow() }
          setDms((prev) =>
            prev.map((d) => (d.id === activeThread.id ? { ...d, messages: [...d.messages, reply] } : d))
          )
        }, 1400)
      }
    } else {
      const newMsg = { id: Date.now(), from: 'me', user: currentUser.username, text, time: timeNow() }
      setChannels((prev) =>
        prev.map((c) => (c.id === activeThread.id ? { ...c, messages: [...c.messages, newMsg] } : c))
      )
      if (!s.connected) {
        setTyping(true)
        clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = setTimeout(() => {
          setTyping(false)
          const auto = getCommunityAutoReply()
          const reply = { id: Date.now() + 1, from: 'other', user: auto.user, text: auto.text, time: timeNow() }
          setChannels((prev) =>
            prev.map((c) => (c.id === activeThread.id ? { ...c, messages: [...c.messages, reply] } : c))
          )
        }, 1600)
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-0 sm:px-5 py-0 sm:py-10">
      <div className="hidden sm:flex items-center justify-between mb-6 px-5 sm:px-0">
        <div>
          <h1 className="font-display font-bold text-3xl text-ink">Chat & Community</h1>
          <p className="text-ink-soft mt-2 text-sm">Message other coders directly, or drop into a community channel.</p>
        </div>
        <span
          className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 ${
            socketConnected ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
          }`}
          title={socketConnected ? 'Connected to the real-time chat server' : "No Socket.IO server detected at localhost:8000 — showing simulated replies"}
        >
          {socketConnected ? '🟢 Live' : '🟡 Demo mode'}
        </span>
      </div>

      <div className="sm:border sm:border-border sm:rounded-2xl overflow-hidden bg-white flex h-[calc(100vh-64px)] sm:h-[640px]">
        <aside
          className={`w-full sm:w-80 shrink-0 border-r border-border flex flex-col ${
            mobileShowThread ? 'hidden sm:flex' : 'flex'
          }`}
        >
          <div className="p-4 border-b border-border space-y-3">
            <div className="flex gap-2 bg-bg-soft rounded-2xl p-1">
              <button
                onClick={() => setMode('direct')}
                className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  mode === 'direct' ? 'bg-white shadow-soft text-accent' : 'text-ink-soft'
                }`}
              >
                Direct Messages
              </button>
              <button
                onClick={() => setMode('community')}
                className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  mode === 'community' ? 'bg-white shadow-soft text-accent' : 'text-ink-soft'
                }`}
              >
                Community
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft text-sm">🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={mode === 'direct' ? 'Search people…' : 'Search channels…'}
                className="w-full pl-9 pr-3 py-2 rounded-2xl border border-border text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-accent-soft"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {mode === 'direct'
              ? filteredDms.map((dm) => (
                  <button
                    key={dm.id}
                    onClick={() => selectDm(dm.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 border-b border-border text-left hover:bg-bg-soft/60 transition-colors ${
                      activeDmId === dm.id && mode === 'direct' ? 'bg-bg-soft' : ''
                    }`}
                  >
                    <span className="relative shrink-0">
                      <span className="w-11 h-11 rounded-full bg-accent-soft text-white grid place-items-center font-semibold">
                        {initials(dm.name)}
                      </span>
                      {dm.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success border-2 border-white" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm text-ink truncate">{dm.name}</span>
                        <span className="text-xs shrink-0">{dm.country}</span>
                      </span>
                      <span className="block text-xs text-ink-soft truncate mt-0.5">
                        {dm.messages[dm.messages.length - 1]?.text}
                      </span>
                    </span>
                  </button>
                ))
              : filteredChannels.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => selectChannel(ch.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 border-b border-border text-left hover:bg-bg-soft/60 transition-colors ${
                      activeChannelId === ch.id && mode === 'community' ? 'bg-bg-soft' : ''
                    }`}
                  >
                    <span className="w-11 h-11 shrink-0 rounded-2xl bg-bg-soft grid place-items-center text-lg">
                      {ch.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm text-ink truncate">{ch.name}</span>
                        <span className="text-[11px] text-ink-soft shrink-0">
                          {ch.members.toLocaleString()} members
                        </span>
                      </span>
                      <span className="block text-xs text-ink-soft truncate mt-0.5">
                        {ch.messages[ch.messages.length - 1]?.user}: {ch.messages[ch.messages.length - 1]?.text}
                      </span>
                    </span>
                  </button>
                ))}
            {mode === 'direct' && filteredDms.length === 0 && (
              <p className="text-center text-sm text-ink-soft py-10">No conversations found.</p>
            )}
            {mode === 'community' && filteredChannels.length === 0 && (
              <p className="text-center text-sm text-ink-soft py-10">No channels found.</p>
            )}
          </div>
        </aside>

        <section className={`flex-1 min-w-0 flex-col ${mobileShowThread ? 'flex' : 'hidden sm:flex'}`}>
          {activeThread ? (
            <>
              <div className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-border">
                <button
                  onClick={() => setMobileShowThread(false)}
                  className="sm:hidden w-8 h-8 grid place-items-center rounded-full hover:bg-bg-soft text-ink-soft"
                  aria-label="Back"
                >
                  ←
                </button>
                {mode === 'direct' ? (
                  <>
                    <span className="relative shrink-0">
                      <span className="w-10 h-10 rounded-full bg-accent-soft text-white grid place-items-center font-semibold">
                        {initials(activeDm.name)}
                      </span>
                      {activeDm.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border-2 border-white" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm text-ink truncate">{activeDm.name}</span>
                        <span className="text-xs">{activeDm.country}</span>
                      </span>
                      <span className="block text-xs text-ink-soft truncate">
                        {activeDm.online ? 'Online' : activeDm.role}
                      </span>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-10 h-10 shrink-0 rounded-2xl bg-bg-soft grid place-items-center text-lg">
                      {activeChannel.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="font-semibold text-sm text-ink truncate block"># {activeChannel.name}</span>
                      <span className="block text-xs text-ink-soft truncate">
                        {activeChannel.members.toLocaleString()} members
                      </span>
                    </span>
                  </>
                )}
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3 bg-bg-soft/30">
                {activeThread.messages.map((m) => {
                  const isMe = m.from === 'me'
                  return (
                    <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] sm:max-w-[65%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                        {mode === 'community' && !isMe && (
                          <span className="text-[11px] font-medium text-accent mb-0.5 px-1">{m.user}</span>
                        )}
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isMe
                              ? 'bg-accent text-white rounded-br-md'
                              : 'bg-white border border-border text-ink rounded-bl-md'
                          }`}
                        >
                          {m.text}
                        </div>
                        <span className="text-[11px] text-ink-soft/70 mt-1 px-1">{m.time}</span>
                      </div>
                    </div>
                  )
                })}
                {typing && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-border rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-ink-soft/50 animate-bounce [animation-delay:-0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-ink-soft/50 animate-bounce [animation-delay:-0.1s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-ink-soft/50 animate-bounce" />
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={sendMessage} className="flex items-center gap-2 px-4 sm:px-5 py-3 border-t border-border">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={mode === 'direct' ? `Message ${activeDm.name}…` : `Message #${activeChannel.name}…`}
                  className="flex-1 px-4 py-2.5 rounded-2xl border border-border text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-accent-soft"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="px-4 sm:px-5 py-2.5 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors shadow-soft disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 grid place-items-center text-ink-soft text-sm">
              Select a conversation to start chatting.
            </div>
          )}
        </section>

        {activeThread && (
          <aside className="hidden lg:flex w-72 shrink-0 border-l border-border flex-col p-5 overflow-y-auto bg-bg-soft/40">
            {mode === 'direct' ? (
              <>
                <div className="flex flex-col items-center text-center mb-5">
                  <span className="w-20 h-20 rounded-full bg-accent-soft text-white grid place-items-center font-display font-bold text-2xl mb-3">
                    {initials(activeDm.name)}
                  </span>
                  <h3 className="font-display font-semibold text-ink">{activeDm.name}</h3>
                  <p className="text-xs text-ink-soft mt-1">{activeDm.country} · {activeDm.online ? 'Online now' : 'Offline'}</p>
                </div>
                <div className="border border-border rounded-2xl p-4 bg-white text-sm mb-4">
                  <div className="text-ink-soft text-xs mb-1">Status</div>
                  <div className="font-medium text-ink">{activeDm.role}</div>
                </div>
                <div className="border border-border rounded-2xl p-4 bg-white text-sm mb-4">
                  <div className="text-ink-soft text-xs mb-2">Shared history</div>
                  <div className="flex justify-between text-xs text-ink-soft">
                    <span>Messages</span><span className="font-semibold text-ink">{activeDm.messages.length}</span>
                  </div>
                </div>
                <button className="w-full py-2.5 rounded-2xl border border-border text-sm font-medium text-ink-soft hover:bg-white">
                  🔇 Mute conversation
                </button>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center text-center mb-5">
                  <span className="w-20 h-20 rounded-2xl bg-white border border-border grid place-items-center text-3xl mb-3">
                    {activeChannel.icon}
                  </span>
                  <h3 className="font-display font-semibold text-ink"># {activeChannel.name}</h3>
                  <p className="text-xs text-ink-soft mt-1">{activeChannel.members.toLocaleString()} members</p>
                </div>
                <div className="border border-border rounded-2xl p-4 bg-white text-sm mb-4">
                  <div className="text-ink-soft text-xs mb-1">About this channel</div>
                  <p className="text-ink text-sm leading-relaxed">{activeChannel.description}</p>
                </div>
                <div className="border border-border rounded-2xl p-4 bg-white text-sm mb-4">
                  <div className="text-ink-soft text-xs mb-2">Recently active</div>
                  <div className="space-y-2">
                    {[...new Set(activeChannel.messages.map((m) => m.user).filter(Boolean))].slice(0, 5).map((u) => (
                      <div key={u} className="flex items-center gap-2 text-xs">
                        <span className="w-6 h-6 rounded-full bg-accent-soft text-white grid place-items-center font-semibold text-[10px]">{initials(u)}</span>
                        <span className="text-ink-soft truncate">{u}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="w-full py-2.5 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover">
                  🔔 Get channel notifications
                </button>
              </>
            )}
          </aside>
        )}
      </div>
    </div>
  )
}
