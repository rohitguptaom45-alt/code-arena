import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getNotifications,
  getUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from '../utils/appData.js'

const TYPE_ICON = {
  follow: '👥',
  contest: '🏁',
  welcome: '👋',
  info: '🔔',
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
  const ref = useRef(null)
  const navigate = useNavigate()

  const refresh = () => setNotifications(getNotifications(username))

  useEffect(() => {
    refresh()
    // Pick up notifications generated elsewhere in the app (e.g. someone follows you)
    const interval = setInterval(refresh, 4000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username])

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unread = notifications.filter((n) => !n.read).length

  const handleOpen = () => {
    setOpen((v) => !v)
    refresh()
  }

  const handleItemClick = (n) => {
    markNotificationRead(n.id)
    refresh()
    setOpen(false)
    if (n.link) navigate(n.link)
  }

  const handleMarkAllRead = () => {
    markAllNotificationsRead(username)
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
            {notifications.length > 0 && (
              <button onClick={handleMarkAllRead} className="text-xs font-medium text-accent hover:underline">
                Mark all read
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="text-center text-xs text-ink-soft py-8">You're all caught up 🎉</p>
          ) : (
            <div className="space-y-1">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleItemClick(n)}
                  className={`w-full text-left flex items-start gap-2.5 px-2.5 py-2.5 rounded-xl transition-colors ${
                    n.read ? 'hover:bg-bg-soft' : 'bg-accent-soft/15 hover:bg-accent-soft/25'
                  }`}
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
