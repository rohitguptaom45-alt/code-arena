import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchAll } from '../utils/appData.js'
import { contests as mockContests } from '../data/mockData.js'

export default function SearchBar({ variant = 'desktop', onNavigate }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ users: [], contests: [] })
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!query.trim()) {
      setResults({ users: [], contests: [] })
      return
    }
    setResults(searchAll(query, mockContests))
  }, [query])

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const go = (path) => {
    setOpen(false)
    setQuery('')
    navigate(path)
    if (onNavigate) onNavigate()
  }

  const hasResults = results.users.length > 0 || results.contests.length > 0
  const showDropdown = open && query.trim().length > 0

  return (
    <div className={`relative ${variant === 'mobile' ? 'w-full' : 'w-64'}`} ref={ref}>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft text-sm pointer-events-none">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search contests or users..."
          className="w-full pl-9 pr-3 py-2 text-sm rounded-2xl border border-border bg-bg-soft text-ink placeholder:text-ink-soft/70 focus:outline-none focus:ring-2 focus:ring-accent/40"
        />
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[280px] max-h-96 overflow-y-auto bg-white border border-border rounded-2xl shadow-lift p-2 z-50">
          {!hasResults ? (
            <p className="text-center text-xs text-ink-soft py-6">No matches for "{query}"</p>
          ) : (
            <>
              {results.users.length > 0 && (
                <div className="mb-2">
                  <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">Users</p>
                  {results.users.map((u) => (
                    <button
                      key={u.username}
                      onClick={() => go(`/u/${u.username}`)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-bg-soft text-left"
                    >
                      <span className="w-8 h-8 rounded-full bg-accent-soft grid place-items-center text-base shrink-0">
                        {u.avatar || '🧑‍💻'}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm text-ink font-medium truncate">{u.fullName}</span>
                        <span className="block text-xs text-ink-soft truncate">@{u.username}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {results.contests.length > 0 && (
                <div>
                  <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">Contests</p>
                  {results.contests.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => go(`/contests/${c.id}`)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-bg-soft text-left"
                    >
                      <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-accent-soft grid place-items-center text-sm shrink-0">
                        🏁
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm text-ink font-medium truncate">{c.name}</span>
                        <span className="block text-xs text-ink-soft truncate">{c.difficulty} · {c.duration}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
