import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { directMessages as initialDirectMessages, currentUser, getDmAutoReply } from '../data/mockData.js'
import { connectSocket, disconnectSocket, SOCKET_EVENTS } from '../utils/socket.js'
import { getAvatarEmoji, getAvatarOptions } from '../utils/auth.js'
import {
  fetchUserCommunitiesRemote,
  fetchCommunitiesRemote,
  searchCommunitiesRemote,
  createCommunityRemote,
  joinCommunityRemote,
  leaveCommunityRemote,
  deleteCommunityRemote,
  fetchCommunityMessagesRemote,
  sendCommunityMessageRemote,
  deleteCommunityMessageRemote,
  pinCommunityMessageRemote,
  unpinCommunityMessageRemote,
  fetchCommunityMembersRemote,
} from '../utils/communityGroupApi.js'
import LoginRequiredModal from '../components/LoginRequiredModal.jsx'

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}
function initials(name) {
  return name.replace(/[._]/g, ' ').trim()[0]?.toUpperCase() || '?'
}

function CommunityBrowseModal({ onClose, myCommunityIds, onJoined, onCreated }) {
  const [tab, setTab] = useState('browse')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [avatar, setAvatar] = useState(getAvatarOptions()[0].id)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    const res = query.trim() ? await searchCommunitiesRemote(query.trim()) : await fetchCommunitiesRemote()
    setLoading(false)
    setResults(res.communities)
  }

  useEffect(() => {
    load()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    load()
  }

  const handleJoin = async (community) => {
    const res = await joinCommunityRemote(community.id)
    if (!res.error) onJoined(community)
  }

  const handleCreate = async () => {
    if (!name.trim()) return setError('Give your community a name.')
    setSaving(true)
    setError('')
    const res = await createCommunityRemote({ name: name.trim(), description: description.trim(), avatar })
    setSaving(false)
    if (res.error) return setError(res.error)
    onCreated(res.community)
  }

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50 px-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-soft max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-2 bg-bg-soft rounded-2xl p-1 mb-4">
          <button
            onClick={() => setTab('browse')}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${tab === 'browse' ? 'bg-white shadow-soft text-accent' : 'text-ink-soft'}`}
          >
            Browse & Join
          </button>
          <button
            onClick={() => setTab('create')}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${tab === 'create' ? 'bg-white shadow-soft text-accent' : 'text-ink-soft'}`}
          >
            Create New
          </button>
        </div>

        {tab === 'browse' ? (
          <>
            <form onSubmit={handleSearch} className="mb-4">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search communities..."
                className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
              />
            </form>
            {loading && <p className="text-sm text-ink-soft text-center py-6">Loading…</p>}
            {!loading && results.length === 0 && <p className="text-sm text-ink-soft text-center py-6">No communities found.</p>}
            <div className="space-y-2">
              {results.map((c) => {
                const joined = myCommunityIds.has(c.id)
                return (
                  <div key={c.id} className="flex items-center gap-3 p-3 rounded-2xl border border-border">
                    <span className="w-10 h-10 rounded-2xl bg-accent-soft grid place-items-center text-lg shrink-0">
                      {getAvatarEmoji(c.avatar)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-ink truncate">{c.name}</p>
                      <p className="text-xs text-ink-soft truncate">{c.memberCount} members</p>
                    </div>
                    <button
                      onClick={() => handleJoin(c)}
                      disabled={joined}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-accent text-white hover:bg-accent-hover disabled:opacity-50 shrink-0"
                    >
                      {joined ? 'Joined' : 'Join'}
                    </button>
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <>
            <div className="flex gap-2 flex-wrap mb-4">
              {getAvatarOptions().map(({ id, emoji }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAvatar(id)}
                  className={`w-10 h-10 rounded-2xl grid place-items-center text-lg border transition-colors ${
                    avatar === id ? 'border-accent bg-bg-soft' : 'border-border hover:bg-bg-soft'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Community name"
              className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-accent-soft"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this community about?"
              rows={3}
              className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-accent-soft"
            />
            {error && <p className="text-xs text-danger mb-3">{error}</p>}
            <button
              onClick={handleCreate}
              disabled={saving}
              className="w-full py-2.5 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover disabled:opacity-60"
            >
              {saving ? 'Creating…' : 'Create community'}
            </button>
          </>
        )}

        <button onClick={onClose} className="w-full mt-3 text-xs text-ink-soft hover:text-ink">
          Close
        </button>
      </div>
    </div>
  )
}

export default function Chat() {
  const user = useSelector((s) => s.auth.user)
  const [mode, setMode] = useState('direct')
  const [dms, setDms] = useState(initialDirectMessages)
  const [activeDmId, setActiveDmId] = useState(initialDirectMessages[0]?.id ?? null)
  const [search, setSearch] = useState('')
  const [draft, setDraft] = useState('')
  const [mobileShowThread, setMobileShowThread] = useState(false)
  const [typing, setTyping] = useState(false)
  const [socketConnected, setSocketConnected] = useState(false)
  const scrollRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  const [communities, setCommunities] = useState([])
  const [activeCommunityId, setActiveCommunityId] = useState(null)
  const [communityMessages, setCommunityMessages] = useState([])
  const [communityMembers, setCommunityMembers] = useState(null)
  const [showMembers, setShowMembers] = useState(false)
  const [browseModalOpen, setBrowseModalOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  const activeDm = dms.find((d) => d.id === activeDmId) || null
  const activeCommunity = communities.find((c) => c.id === activeCommunityId) || null
  const activeThread = mode === 'direct' ? activeDm : activeCommunity
  const filteredDms = dms.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
  const filteredCommunities = communities.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

  const loadMyCommunities = async () => {
    if (!user) return
    const res = await fetchUserCommunitiesRemote()
    setCommunities(res.communities)
    if (!activeCommunityId && res.communities.length > 0) setActiveCommunityId(res.communities[0].id)
  }

  useEffect(() => {
    if (mode === 'community' && user) loadMyCommunities()
  }, [mode, user])

  const loadCommunityMessages = async () => {
    if (!activeCommunityId) return
    const res = await fetchCommunityMessagesRemote(activeCommunityId)
    setCommunityMessages(res.messages)
  }

  useEffect(() => {
    if (mode === 'community' && activeCommunityId) loadCommunityMessages()
  }, [activeCommunityId, mode])

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
      } else if (payload.threadType === 'community' && payload.threadId === activeCommunityId) {
        loadCommunityMessages()
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
  }, [activeCommunityId])

  useEffect(() => {
    if (!activeThread) return
    const s = connectSocket()
    if (s.connected) s.emit(SOCKET_EVENTS.JOIN_ROOM, { threadType: mode, threadId: activeThread.id })
  }, [activeThread?.id, mode])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [activeDm?.messages.length, communityMessages.length, typing, activeThread?.id])

  useEffect(() => () => clearTimeout(typingTimeoutRef.current), [])

  function selectDm(id) {
    setActiveDmId(id)
    setMobileShowThread(true)
    setTyping(false)
  }
  function selectCommunity(id) {
    setActiveCommunityId(id)
    setShowMembers(false)
    setCommunityMembers(null)
    setMobileShowThread(true)
  }
  function switchMode(next) {
    if (next === 'community' && !user) {
      setLoginModalOpen(true)
      return
    }
    setMode(next)
  }

  async function sendMessage(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text || !activeThread) return
    setDraft('')
    if (mode === 'direct') {
      const s = connectSocket()
      if (s.connected) s.emit(SOCKET_EVENTS.MESSAGE, { threadType: 'direct', threadId: activeThread.id, from: currentUser.username, text })
      const newMsg = { id: Date.now(), from: 'me', text, time: timeNow() }
      setDms((prev) => prev.map((d) => (d.id === activeThread.id ? { ...d, messages: [...d.messages, newMsg] } : d)))
      if (!s.connected) {
        setTyping(true)
        clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = setTimeout(() => {
          setTyping(false)
          const reply = { id: Date.now() + 1, from: 'them', text: getDmAutoReply(), time: timeNow() }
          setDms((prev) => prev.map((d) => (d.id === activeThread.id ? { ...d, messages: [...d.messages, reply] } : d)))
        }, 1400)
      }
    } else {
      const res = await sendCommunityMessageRemote(activeThread.id, text)
      if (!res.error) loadCommunityMessages()
    }
  }

  const handleJoinedFromModal = (community) => {
    setBrowseModalOpen(false)
    setCommunities((cs) => (cs.some((c) => c.id === community.id) ? cs : [{ ...community, isMember: true }, ...cs]))
    setActiveCommunityId(community.id)
  }
  const handleCreatedFromModal = (community) => {
    setBrowseModalOpen(false)
    if (community) {
      setCommunities((cs) => [community, ...cs])
      setActiveCommunityId(community.id)
    }
  }

  const handleLeaveCommunity = async () => {
    if (!activeCommunity) return
    const res = await leaveCommunityRemote(activeCommunity.id)
    if (!res.error) {
      setCommunities((cs) => cs.filter((c) => c.id !== activeCommunity.id))
      setActiveCommunityId(null)
    }
  }
  const handleDeleteCommunity = async () => {
    if (!activeCommunity || !window.confirm('Delete this community permanently?')) return
    const res = await deleteCommunityRemote(activeCommunity.id)
    if (!res.error) {
      setCommunities((cs) => cs.filter((c) => c.id !== activeCommunity.id))
      setActiveCommunityId(null)
    }
  }
  const handleShowMembers = async () => {
    setShowMembers((v) => !v)
    if (!showMembers && communityMembers === null && activeCommunity) {
      const res = await fetchCommunityMembersRemote(activeCommunity.id)
      setCommunityMembers(res.members)
    }
  }
  const handleDeleteMessage = async (messageId) => {
    const res = await deleteCommunityMessageRemote(messageId)
    if (!res.error) setCommunityMessages((m) => m.filter((msg) => msg.id !== messageId))
  }
  const handleTogglePin = async (message) => {
    const res = message.isPinned ? await unpinCommunityMessageRemote(message.id) : await pinCommunityMessageRemote(message.id)
    if (!res.error) loadCommunityMessages()
  }

  const isCommunityOwner = user && activeCommunity && activeCommunity.ownerId === user.remoteId

  return (
    <div className="max-w-7xl mx-auto px-0 sm:px-5 py-0 sm:py-10">
      <LoginRequiredModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      <div className="hidden sm:flex items-center justify-between mb-6 px-5 sm:px-0">
        <div>
          <h1 className="font-display font-bold text-3xl text-ink">Chat & Community</h1>
          <p className="text-ink-soft mt-2 text-sm">Message other coders directly, or create/join your own community and chat there.</p>
        </div>
        <span
          className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 ${socketConnected ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}
          title={socketConnected ? 'Connected to the real-time chat server' : 'No Socket.IO server detected at localhost:8000 — showing simulated replies'}
        >
          {socketConnected ? '🟢 Live' : '🟡 Demo mode'}
        </span>
      </div>

      <div className="sm:border sm:border-border sm:rounded-2xl overflow-hidden bg-white flex h-[calc(100vh-64px)] sm:h-[640px]">
        <aside className={`w-full sm:w-80 shrink-0 border-r border-border flex flex-col ${mobileShowThread ? 'hidden sm:flex' : 'flex'}`}>
          <div className="p-4 border-b border-border space-y-3">
            <div className="flex gap-2 bg-bg-soft rounded-2xl p-1">
              <button
                onClick={() => switchMode('direct')}
                className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${mode === 'direct' ? 'bg-white shadow-soft text-accent' : 'text-ink-soft'}`}
              >
                Direct Messages
              </button>
              <button
                onClick={() => switchMode('community')}
                className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${mode === 'community' ? 'bg-white shadow-soft text-accent' : 'text-ink-soft'}`}
              >
                Community
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft text-sm">🔍</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={mode === 'direct' ? 'Search people…' : 'Search your communities…'}
                className="w-full pl-9 pr-3 py-2 rounded-2xl border border-border text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-accent-soft"
              />
            </div>
            {mode === 'community' && (
              <button
                onClick={() => setBrowseModalOpen(true)}
                className="w-full py-2 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover"
              >
                + Create or join a community
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {mode === 'direct'
              ? filteredDms.map((dm) => (
                  <button
                    key={dm.id}
                    onClick={() => selectDm(dm.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 border-b border-border text-left hover:bg-bg-soft/60 transition-colors ${activeDmId === dm.id && mode === 'direct' ? 'bg-bg-soft' : ''}`}
                  >
                    <span className="relative shrink-0">
                      <span className="w-11 h-11 rounded-full bg-accent-soft text-white grid place-items-center font-semibold">
                        {initials(dm.name)}
                      </span>
                      {dm.online && <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-success border-2 border-white" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm text-ink truncate">{dm.name}</span>
                        <span className="text-xs shrink-0">{dm.country}</span>
                      </span>
                      <span className="block text-xs text-ink-soft truncate mt-0.5">{dm.messages[dm.messages.length - 1]?.text}</span>
                    </span>
                  </button>
                ))
              : filteredCommunities.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => selectCommunity(c.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 border-b border-border text-left hover:bg-bg-soft/60 transition-colors ${activeCommunityId === c.id && mode === 'community' ? 'bg-bg-soft' : ''}`}
                  >
                    <span className="w-11 h-11 shrink-0 rounded-2xl bg-bg-soft grid place-items-center text-lg">
                      {getAvatarEmoji(c.avatar)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm text-ink truncate">{c.name}</span>
                        <span className="text-[11px] text-ink-soft shrink-0">{c.memberCount} members</span>
                      </span>
                      <span className="block text-xs text-ink-soft truncate mt-0.5">{c.description || 'No description yet.'}</span>
                    </span>
                  </button>
                ))}
            {mode === 'direct' && filteredDms.length === 0 && <p className="text-center text-sm text-ink-soft py-10">No conversations found.</p>}
            {mode === 'community' && filteredCommunities.length === 0 && (
              <p className="text-center text-sm text-ink-soft py-10">
                You haven't joined any communities yet — create or join one above.
              </p>
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
                      {activeDm.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border-2 border-white" />}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm text-ink truncate">{activeDm.name}</span>
                        <span className="text-xs">{activeDm.country}</span>
                      </span>
                      <span className="block text-xs text-ink-soft truncate">{activeDm.online ? 'Online' : activeDm.role}</span>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-10 h-10 shrink-0 rounded-2xl bg-bg-soft grid place-items-center text-lg">
                      {getAvatarEmoji(activeCommunity.avatar)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <button onClick={handleShowMembers} className="font-semibold text-sm text-ink truncate block hover:text-accent">
                        # {activeCommunity.name}
                      </button>
                      <span className="block text-xs text-ink-soft truncate">{activeCommunity.memberCount} members</span>
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      {isCommunityOwner ? (
                        <button onClick={handleDeleteCommunity} className="text-xs text-danger hover:underline">
                          Delete
                        </button>
                      ) : (
                        <button onClick={handleLeaveCommunity} className="text-xs text-ink-soft hover:text-danger">
                          Leave
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>

              {mode === 'community' && showMembers && (
                <div className="border-b border-border p-4 max-h-40 overflow-y-auto">
                  <p className="text-xs font-semibold text-ink-soft mb-2">Members</p>
                  <div className="space-y-1.5">
                    {(communityMembers || []).map((m) => (
                      <div key={m.id} className="flex items-center gap-2 text-sm">
                        <span className="w-6 h-6 rounded-full bg-bg-soft grid place-items-center text-xs">{getAvatarEmoji(m.avatar)}</span>
                        @{m.username}
                      </div>
                    ))}
                    {communityMembers && communityMembers.length === 0 && <p className="text-xs text-ink-soft">No members yet.</p>}
                  </div>
                </div>
              )}

              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3 bg-bg-soft/30">
                {mode === 'direct'
                  ? activeThread.messages.map((m) => {
                      const isMe = m.from === 'me'
                      return (
                        <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] sm:max-w-[65%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-accent text-white rounded-br-md' : 'bg-white border border-border text-ink rounded-bl-md'}`}>
                              {m.text}
                            </div>
                            <span className="text-[11px] text-ink-soft/70 mt-1 px-1">{m.time}</span>
                          </div>
                        </div>
                      )
                    })
                  : communityMessages.map((m) => {
                      const isMe = user && m.owner?.username?.toLowerCase() === user.username?.toLowerCase()
                      return (
                        <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] sm:max-w-[65%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                            {!isMe && <span className="text-[11px] font-medium text-accent mb-0.5 px-1">@{m.owner?.username}</span>}
                            <div
                              className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-accent text-white rounded-br-md' : 'bg-white border border-border text-ink rounded-bl-md'} ${m.isPinned ? 'ring-2 ring-warning/50' : ''}`}
                            >
                              {m.content}
                            </div>
                            <div className="flex items-center gap-2 mt-1 px-1">
                              <span className="text-[11px] text-ink-soft/70">{new Date(m.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
                              {m.isPinned && <span className="text-[11px] text-warning">📌 pinned</span>}
                              {isCommunityOwner && (
                                <button onClick={() => handleTogglePin(m)} className="text-[11px] text-ink-soft hover:text-accent">
                                  {m.isPinned ? 'Unpin' : 'Pin'}
                                </button>
                              )}
                              {(isMe || isCommunityOwner) && (
                                <button onClick={() => handleDeleteMessage(m.id)} className="text-[11px] text-ink-soft hover:text-danger">
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                {mode === 'community' && communityMessages.length === 0 && (
                  <p className="text-center text-sm text-ink-soft py-10">No messages yet — say hi to your community.</p>
                )}
                {typing && mode === 'direct' && (
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
                  placeholder={mode === 'direct' ? `Message ${activeDm.name}…` : `Message #${activeCommunity.name}…`}
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
            <div className="flex-1 grid place-items-center text-ink-soft text-sm text-center px-6">
              {mode === 'community'
                ? "You haven't joined a community yet — use \"Create or join a community\" to get started."
                : 'Select a conversation to start chatting.'}
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
                  <p className="text-xs text-ink-soft mt-1">
                    {activeDm.country} · {activeDm.online ? 'Online now' : 'Offline'}
                  </p>
                </div>
                <div className="border border-border rounded-2xl p-4 bg-white text-sm mb-4">
                  <div className="text-ink-soft text-xs mb-1">Status</div>
                  <div className="font-medium text-ink">{activeDm.role}</div>
                </div>
                <div className="border border-border rounded-2xl p-4 bg-white text-sm mb-4">
                  <div className="text-ink-soft text-xs mb-2">Shared history</div>
                  <div className="flex justify-between text-xs text-ink-soft">
                    <span>Messages</span>
                    <span className="font-semibold text-ink">{activeDm.messages.length}</span>
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
                    {getAvatarEmoji(activeCommunity.avatar)}
                  </span>
                  <h3 className="font-display font-semibold text-ink"># {activeCommunity.name}</h3>
                  <p className="text-xs text-ink-soft mt-1">{activeCommunity.memberCount} members</p>
                </div>
                <div className="border border-border rounded-2xl p-4 bg-white text-sm mb-4">
                  <div className="text-ink-soft text-xs mb-1">About this community</div>
                  <p className="text-ink text-sm leading-relaxed">{activeCommunity.description || 'No description yet.'}</p>
                </div>
                <button onClick={handleShowMembers} className="w-full py-2.5 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover">
                  👥 View members
                </button>
                {isCommunityOwner ? (
                  <button onClick={handleDeleteCommunity} className="w-full mt-2 py-2.5 rounded-2xl border border-border text-sm font-medium text-danger hover:bg-white">
                    Delete community
                  </button>
                ) : (
                  <button onClick={handleLeaveCommunity} className="w-full mt-2 py-2.5 rounded-2xl border border-border text-sm font-medium text-ink-soft hover:bg-white">
                    Leave community
                  </button>
                )}
              </>
            )}
          </aside>
        )}
      </div>

      {browseModalOpen && (
        <CommunityBrowseModal
          onClose={() => setBrowseModalOpen(false)}
          myCommunityIds={new Set(communities.map((c) => c.id))}
          onJoined={handleJoinedFromModal}
          onCreated={handleCreatedFromModal}
        />
      )}
    </div>
  )
}
