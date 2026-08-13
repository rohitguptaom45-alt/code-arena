import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { adminApi, setAdminSecretKey, getAdminSecretKey, clearAdminSecretKey } from '../utils/api.js'

function initials(name) {
  return (name || '?').replace(/[._]/g, ' ').trim()[0]?.toUpperCase() || '?'
}

export default function AdminDashboard() {
  const user = useSelector((s) => s.auth.user)
  const [unlocked, setUnlocked] = useState(!!getAdminSecretKey())
  const [keyInput, setKeyInput] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

  const [tab, setTab] = useState('users')
  const [users, setUsers] = useState([])
  const [userSearch, setUserSearch] = useState('')
  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [chatMessages, setChatMessages] = useState([])

  const tryUnlock = async (e) => {
    e?.preventDefault()
    if (!user || user.role !== 'admin') {
      setError('You must be logged in with an admin account.')
      return
    }
    setChecking(true)
    setError('')
    setAdminSecretKey(keyInput.trim())
    try {
      await adminApi.getUsers(1)
      setUnlocked(true)
    } catch (err) {
      clearAdminSecretKey()
      setError(err.message || 'Invalid secret key.')
    }
    setChecking(false)
  }

  const loadUsers = async () => {
    try {
      const res = await adminApi.getUsers(1, userSearch)
      setUsers(res?.data?.users || [])
    } catch (err) {
      setError(err.message)
    }
  }
  const loadChats = async () => {
    try {
      const res = await adminApi.getChats(1)
      setChats(res?.data?.chats || [])
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    if (!unlocked) return
    if (tab === 'users') loadUsers()
    if (tab === 'chats') loadChats()
  }, [unlocked, tab])

  const openChat = async (chat) => {
    setActiveChat(chat)
    try {
      const res = await adminApi.getChatMessages(chat.id, 1)
      setChatMessages(res?.data?.messages || [])
    } catch (err) {
      setError(err.message)
    }
  }

  const handleToggleStatus = async (u) => {
    const nextStatus = u.status === 'suspended' ? 'active' : 'suspended'
    try {
      await adminApi.setUserStatus(u.id, nextStatus)
      loadUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteMessage = async (messageId) => {
    try {
      await adminApi.deleteMessage(messageId)
      openChat(activeChat)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleLock = () => {
    clearAdminSecretKey()
    setUnlocked(false)
    setKeyInput('')
  }

  if (!unlocked) {
    return (
      <div className="max-w-sm mx-auto px-5 py-24">
        <h1 className="font-display font-bold text-2xl text-ink mb-2">Admin dashboard</h1>
        <p className="text-sm text-ink-soft mb-6">
          Enter the admin secret key to view users, chats and messages. You also need an admin account.
        </p>
        <form onSubmit={tryUnlock} className="space-y-3">
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="Admin secret key"
            className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
          />
          {error && <p className="text-xs text-danger">{error}</p>}
          <button disabled={checking} className="w-full py-2.5 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover disabled:opacity-60">
            {checking ? 'Checking…' : 'Unlock'}
          </button>
        </form>
        <p className="text-xs text-ink-soft/70 mt-4">
          The key is set on the backend as <code className="font-mono">ADMIN_SECRET_KEY</code> and only works for accounts with the{' '}
          <code className="font-mono">admin</code> role.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-ink">Admin dashboard</h1>
        <button onClick={handleLock} className="text-xs text-ink-soft hover:text-ink">
          Lock
        </button>
      </div>

      <div className="flex gap-2 bg-bg-soft rounded-2xl p-1 mb-6 max-w-xs">
        {['users', 'chats'].map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
              tab === key ? 'bg-white shadow-soft text-accent' : 'text-ink-soft'
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-danger mb-4">{error}</p>}

      {tab === 'users' && (
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              loadUsers()
            }}
            className="flex gap-2 mb-4 max-w-sm"
          >
            <input
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search users…"
              className="flex-1 px-4 py-2 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
            />
            <button className="px-3 py-2 rounded-2xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover">Search</button>
          </form>
          <div className="border border-border rounded-2xl overflow-hidden">
            {users.map((u) => (
              <div key={u.id} className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0">
                <span className="w-9 h-9 rounded-full bg-accent-soft text-white grid place-items-center text-xs font-bold shrink-0">{initials(u.fullName || u.username)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{u.fullName || u.username}</p>
                  <p className="text-xs text-ink-soft truncate">
                    @{u.username} · {u.email} · {u.role}
                  </p>
                </div>
                <span className={`text-[11px] px-2 py-1 rounded-full ${u.status === 'suspended' ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
                  {u.status}
                </span>
                <button onClick={() => handleToggleStatus(u)} className="px-2.5 py-1.5 rounded-lg border border-border text-[11px] text-ink-soft hover:bg-bg-soft">
                  {u.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                </button>
              </div>
            ))}
            {users.length === 0 && <p className="text-center text-sm text-ink-soft py-8">No users found.</p>}
          </div>
        </div>
      )}

      {tab === 'chats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-border rounded-2xl overflow-hidden h-fit">
            {chats.map((c) => (
              <button
                key={c.id}
                onClick={() => openChat(c)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-bg-soft ${activeChat?.id === c.id ? 'bg-accent-soft/15' : ''}`}
              >
                <span className="w-9 h-9 rounded-full bg-accent-soft text-white grid place-items-center text-xs font-bold shrink-0">
                  {c.isGroup ? '#' : initials(c.members?.[0]?.user?.username)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{c.isGroup ? c.name : c.members.map((m) => m.user.username).join(' & ')}</p>
                  <p className="text-xs text-ink-soft">
                    {c.isGroup ? `Group · admin @${c.admin?.username}` : 'Direct'} · {c._count?.messages ?? 0} messages
                  </p>
                </div>
              </button>
            ))}
            {chats.length === 0 && <p className="text-center text-sm text-ink-soft py-8">No chats yet.</p>}
          </div>
          <div className="border border-border rounded-2xl p-4 max-h-[70vh] overflow-y-auto">
            {!activeChat ? (
              <p className="text-sm text-ink-soft text-center py-8">Select a chat to view its messages.</p>
            ) : (
              <div className="space-y-3">
                {chatMessages.map((m) => (
                  <div key={m.id} className="flex items-start gap-2 text-sm">
                    <span className="font-medium text-ink shrink-0">@{m.sender?.username}:</span>
                    <span className="flex-1 text-ink-soft">{m.isDeleted ? <em>deleted</em> : m.content || '📎 attachment'}</span>
                    {!m.isDeleted && (
                      <button onClick={() => handleDeleteMessage(m.id)} className="text-[11px] text-danger hover:underline shrink-0">
                        Delete
                      </button>
                    )}
                  </div>
                ))}
                {chatMessages.length === 0 && <p className="text-sm text-ink-soft text-center py-8">No messages in this chat.</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
