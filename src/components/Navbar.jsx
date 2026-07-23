import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getCurrentUser, logoutUser } from '../utils/auth.js'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Contests', to: '/contests' },
  { label: 'Leaderboard', to: '/leaderboard' },
  { label: 'Chat', to: '/chat' },
  { label: 'Subscription', to: '/subscription' },
]

export default function Navbar({ darkMode, setDarkMode }) {
  const [moreOpen, setMoreOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [user, setUser] = useState(getCurrentUser())
  const navigate = useNavigate()

  useEffect(() => {
    const sync = () => setUser(getCurrentUser())
    window.addEventListener('codearena-auth-change', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('codearena-auth-change', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const handleLogout = () => {
    logoutUser()
    setProfileOpen(false)
    setMobileOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-9 h-9 rounded-2xl bg-ink text-white grid place-items-center font-mono font-bold text-sm">
            &lt;/&gt;
          </span>
          <span className="font-display font-bold text-lg text-ink">
            Code<span className="text-accent">Arena</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${
                  isActive ? 'text-accent bg-bg-soft' : 'text-ink-soft hover:text-accent hover:bg-bg-soft'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="relative">
            <button
              onClick={() => setMoreOpen((v) => !v)}
              onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
              className="px-4 py-2 rounded-2xl text-sm font-medium text-ink-soft hover:text-accent hover:bg-bg-soft transition-colors"
            >
              More ▾
            </button>
            {moreOpen && (
              <div className="absolute top-full mt-2 left-0 w-48 bg-white border border-border rounded-2xl shadow-lift p-2">
                {[
                  { label: 'Code Editor (Demo)', to: '/editor' },
                  { label: 'Developers', to: '/developers' },
                  { label: 'Settings', to: '/settings' },
                  { label: 'About Us', to: '/more' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="block px-3 py-2 text-sm rounded-xl text-ink-soft hover:bg-bg-soft hover:text-accent"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button className="w-9 h-9 rounded-full grid place-items-center text-ink-soft hover:bg-bg-soft" aria-label="Search">
            🔍
          </button>
          <button className="w-9 h-9 rounded-full grid place-items-center text-ink-soft hover:bg-bg-soft" aria-label="Notifications">
            🔔
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-9 h-9 rounded-full grid place-items-center text-ink-soft hover:bg-bg-soft"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                onBlur={() => setTimeout(() => setProfileOpen(false), 150)}
                className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-2xl hover:bg-bg-soft"
              >
                <span className="w-8 h-8 rounded-full bg-accent-soft grid place-items-center text-base">
                  {user.avatar}
                </span>
                <span className="text-sm font-medium text-ink">{user.fullName}</span>
              </button>
              {profileOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-border rounded-2xl shadow-lift p-3">
                  <div className="px-2 pb-2 mb-2 border-b border-border">
                    <p className="text-sm font-semibold text-ink truncate">{user.fullName}</p>
                    <p className="text-xs text-ink-soft truncate">@{user.username} · {user.type}</p>
                  </div>
                  <Link to="/settings" className="block px-2 py-2 text-sm rounded-xl text-ink-soft hover:bg-bg-soft hover:text-accent">
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-2 py-2 text-sm rounded-xl text-danger hover:bg-danger/10"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-ink-soft hover:text-accent">
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-semibold rounded-2xl bg-accent text-white hover:bg-accent-hover transition-colors shadow-soft"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-xl" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
          ☰
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white px-5 py-3 space-y-1">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className="block px-3 py-2 rounded-xl text-sm text-ink-soft hover:bg-bg-soft">
              {item.label}
            </Link>
          ))}
          <Link to="/developers" className="block px-3 py-2 rounded-xl text-sm text-ink-soft hover:bg-bg-soft">More</Link>

          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="w-8 h-8 rounded-full bg-accent-soft grid place-items-center text-base">{user.avatar}</span>
                <span className="text-sm font-medium text-ink">{user.fullName}</span>
              </div>
              <Link to="/settings" className="block px-3 py-2 rounded-xl text-sm text-ink-soft hover:bg-bg-soft">Settings</Link>
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-xl text-sm text-danger hover:bg-danger/10">
                Log out
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" className="flex-1 text-center px-4 py-2 text-sm rounded-2xl border border-border">Login</Link>
              <Link to="/signup" className="flex-1 text-center px-4 py-2 text-sm rounded-2xl bg-accent text-white">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
