import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getAvatarEmoji } from '../utils/auth.js'
import {
  fetchCommunityRemote,
  joinCommunityRemote,
  leaveCommunityRemote,
  deleteCommunityRemote,
  fetchCommunityMembersRemote,
  removeCommunityMemberRemote,
  sendCommunityMessageRemote,
  fetchCommunityMessagesRemote,
  deleteCommunityMessageRemote,
  pinCommunityMessageRemote,
  unpinCommunityMessageRemote,
} from '../utils/communityGroupApi.js'
import LoginRequiredModal from '../components/LoginRequiredModal.jsx'

function timeAgo(iso) {
  const diffSec = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000))
  if (diffSec < 60) return `${diffSec}s`
  const diffMin = Math.round(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m`
  const diffHr = Math.round(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h`
  return `${Math.round(diffHr / 24)}d`
}

export default function CommunityDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useSelector((s) => s.auth.user)
  const [community, setCommunity] = useState(null)
  const [messages, setMessages] = useState([])
  const [members, setMembers] = useState([])
  const [showMembers, setShowMembers] = useState(false)
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [loginModal, setLoginModal] = useState(false)

  const load = async () => {
    const res = await fetchCommunityRemote(id)
    setCommunity(res.community)
    setError(res.error || '')
  }
  const loadMessages = async () => {
    const res = await fetchCommunityMessagesRemote(id)
    setMessages(res.messages)
  }
  const loadMembers = async () => {
    const res = await fetchCommunityMembersRemote(id)
    setMembers(res.members)
  }

  useEffect(() => {
    load()
    loadMessages()
  }, [id])

  const handleToggleMembership = async () => {
    if (!user) return setLoginModal(true)
    if (community.isMember) {
      const res = await leaveCommunityRemote(id)
      if (!res.error) setCommunity((c) => ({ ...c, isMember: false, memberCount: Math.max(0, c.memberCount - 1) }))
      return
    }
    const res = await joinCommunityRemote(id)
    if (!res.error) setCommunity((c) => ({ ...c, isMember: true, memberCount: c.memberCount + 1 }))
  }

  const handleSend = async () => {
    if (!user || !text.trim()) return
    const res = await sendCommunityMessageRemote(id, text.trim())
    if (!res.error) {
      setText('')
      loadMessages()
    }
  }

  const handleDeleteMessage = async (messageId) => {
    const res = await deleteCommunityMessageRemote(messageId)
    if (!res.error) setMessages((m) => m.filter((msg) => msg.id !== messageId))
  }

  const handleTogglePin = async (message) => {
    const res = message.isPinned ? await unpinCommunityMessageRemote(message.id) : await pinCommunityMessageRemote(message.id)
    if (!res.error) loadMessages()
  }

  const handleDeleteCommunity = async () => {
    if (!window.confirm('Delete this community permanently?')) return
    const res = await deleteCommunityRemote(id)
    if (!res.error) navigate('/communities')
  }

  const handleShowMembers = () => {
    setShowMembers((v) => !v)
    if (!showMembers && members.length === 0) loadMembers()
  }

  const handleRemoveMember = async (memberId) => {
    const res = await removeCommunityMemberRemote(id, memberId)
    if (!res.error) setMembers((m) => m.filter((mem) => mem.id !== memberId))
  }

  if (error) {
    return <div className="max-w-2xl mx-auto px-5 py-20 text-center text-ink-soft">{error}</div>
  }
  if (!community) {
    return <div className="max-w-2xl mx-auto px-5 py-20 text-center text-ink-soft">Loading community…</div>
  }

  const isOwner = user && community.ownerId === user.id

  return (
    <div className="max-w-3xl mx-auto px-5 py-14">
      <LoginRequiredModal open={loginModal} onClose={() => setLoginModal(false)} />
      <div className="flex items-start gap-4 mb-6">
        <span className="w-16 h-16 rounded-3xl bg-accent-soft grid place-items-center text-3xl shrink-0">
          {getAvatarEmoji(community.avatar)}
        </span>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-bold text-2xl text-ink">{community.name}</h1>
          <p className="text-sm text-ink-soft mt-1">{community.description}</p>
          <button onClick={handleShowMembers} className="text-xs text-ink-soft hover:text-accent mt-1">
            {community.memberCount} members
          </button>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={handleToggleMembership}
            className={`px-4 py-2 rounded-2xl text-sm font-semibold whitespace-nowrap ${
              community.isMember ? 'border border-border text-ink hover:bg-bg-soft' : 'bg-accent text-white hover:bg-accent-hover'
            }`}
          >
            {community.isMember ? 'Leave' : 'Join'}
          </button>
          {isOwner && (
            <button onClick={handleDeleteCommunity} className="text-xs text-danger hover:underline">
              Delete community
            </button>
          )}
        </div>
      </div>

      {showMembers && (
        <div className="border border-border rounded-2xl p-4 mb-6">
          <h3 className="font-semibold text-sm text-ink mb-3">Members</h3>
          <div className="space-y-2">
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between text-sm">
                <Link to={`/u/${m.username}`} className="flex items-center gap-2 hover:text-accent">
                  <span className="w-7 h-7 rounded-full bg-bg-soft grid place-items-center text-sm">{getAvatarEmoji(m.avatar)}</span>
                  @{m.username}
                </Link>
                {isOwner && m.id !== user.id && (
                  <button onClick={() => handleRemoveMember(m.id)} className="text-xs text-danger hover:underline">
                    Remove
                  </button>
                )}
              </div>
            ))}
            {members.length === 0 && <p className="text-xs text-ink-soft">No members yet.</p>}
          </div>
        </div>
      )}

      <div className="border border-border rounded-2xl p-5 mb-4">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend()
            }}
            placeholder={user ? 'Message the community…' : 'Log in to chat'}
            className="flex-1 px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="px-4 py-2.5 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover disabled:opacity-60"
          >
            Send
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {messages.length === 0 && <p className="text-sm text-ink-soft text-center py-10">No messages yet — say hi.</p>}
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-3 p-3 rounded-2xl ${m.isPinned ? 'bg-bg-soft' : ''}`}>
            <span className="w-8 h-8 rounded-full bg-accent-soft grid place-items-center text-sm shrink-0">
              {getAvatarEmoji(m.owner?.avatar)}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs text-ink-soft">
                <span className="font-semibold text-ink">@{m.owner?.username}</span>
                <span>· {timeAgo(m.createdAt)}</span>
                {m.isPinned && <span>· 📌 pinned</span>}
              </div>
              <p className="text-sm text-ink mt-0.5 whitespace-pre-wrap break-words">{m.content}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-ink-soft">
                {isOwner && (
                  <button onClick={() => handleTogglePin(m)} className="hover:text-accent">
                    {m.isPinned ? 'Unpin' : 'Pin'}
                  </button>
                )}
                {user && (isOwner || m.owner?.username === user.username) && (
                  <button onClick={() => handleDeleteMessage(m.id)} className="hover:text-danger">
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
