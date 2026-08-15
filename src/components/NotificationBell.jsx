import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../utils/appData.js'
import { fetchNotificationsRemote } from '../utils/chatSocialApi.js'  //aab iske andar check karenge yahak socket nahi mila k
const TYPE_ICON = {
  follow: '👥',
  contest: '🏁',
  welcome: '👋',
  info: '🔔',
  FRIEND_REQUEST: '🤝',
}
const READ_REMOTE_KEY = 'codearena_read_remote_notifications'
function getReadRemoteIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(READ_REMOTE_KEY) || '[]'))
  } catch {
    return new Set()
  }
}
function markRemoteRead(id) {
  const ids = getReadRemoteIds()
  ids.add(id)
  localStorage.setItem(READ_REMOTE_KEY, JSON.stringify([...ids]))
}
function markAllRemoteRead(ids) {
  const set = getReadRemoteIds()
  ids.forEach((id) => set.add(id))
  localStorage.setItem(READ_REMOTE_KEY, JSON.stringify([...set]))
}
function normalizeRemote(n, readIds) {
  return {
    id: `remote:${n.id}`,
    type: 'FRIEND_REQUEST',
    text: `${n.fullName || n.username} wants to chat with you`,
    at: n.createdAt || new Date().toISOString(),
    read: readIds.has(n.id),
    link: '/chat',
    _remoteId: n.id,
  }
}
function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
export default function NotificationBell({ username }) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [remoteNotifications, setRemoteNotifications] = useState([])
  const ref = useRef(null)
  const navigate = useNavigate()
  const refresh = async () => {
    setNotifications(getNotifications(username))
    const res = await fetchNotificationsRemote()
    const readIds = getReadRemoteIds()
    setRemoteNotifications(res.notifications.map((n) => normalizeRemote(n, readIds)))
  }
  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 4000)
    return () => clearInterval(interval)
  }, [username])
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  const merged = [...notifications, ...remoteNotifications].sort((a, b) => new Date(b.at) - new Date(a.at))
  const unread = merged.filter((n) => !n.read).length
  const handleOpen = () => {
    setOpen((v) => !v)
    refresh()
  }
  const handleItemClick = (n) => {
    if (n._remoteId) markRemoteRead(n._remoteId)
    else markNotificationRead(n.id)
    refresh()
    setOpen(false)
    if (n.link) navigate(n.link)
  }
  const handleMarkAllRead = () => {
    markAllNotificationsRead(username)
    markAllRemoteRead(remoteNotifications.map((n) => n._remoteId))
    refresh()
  }
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={handleOpen}
        className="relative w-9 h-9 rounded-full grid place-items-center text-ink-soft hover:bg-bg-soft"
        aria-label="Notifications"
      >
        🔔
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-accent text-white text-[10px] font-bold grid place-items-center leading-none">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-border rounded-2xl shadow-lift p-2 z-50">
          <div className="flex items-center justify-between px-2 py-1.5 mb-1">
            <span className="text-sm font-semibold text-ink">Notifications</span>
            {merged.length > 0 && (
              <button onClick={handleMarkAllRead} className="text-xs font-medium text-accent hover:underline">
                Mark all read
              </button>
            )}
          </div>
          {merged.length === 0 ? (
            <p className="text-center text-xs text-ink-soft py-8">You're all caught up 🎉</p>
          ) : (
            <div className="space-y-1">
              {merged.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleItemClick(n)}
                  className={`w-full text-left flex items-start gap-2.5 px-2.5 py-2.5 rounded-xl transition-colors ${n.read ? 'hover:bg-bg-soft' : 'bg-accent-soft/15 hover:bg-accent-soft/25'}`}
                >
                  <span className="text-lg leading-none mt-0.5">{TYPE_ICON[n.type] || '🔔'}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm text-ink leading-snug">{n.text}</span>
                    <span className="block text-[11px] text-ink-soft mt-0.5">{timeAgo(n.at)}</span>
                  </span>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1.5" />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
