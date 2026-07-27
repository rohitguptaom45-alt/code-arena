import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginUserRemoteFirst } from '../utils/auth.js'
import { setUser } from '../store/authSlice.js'

export default function Login() {
  const [remember, setRemember] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const result = await loginUserRemoteFirst(username, password)
    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }
    dispatch(setUser(result.user))
    navigate('/')
  }

  return (
    <div className="min-h-[calc(100vh-64px)] grid md:grid-cols-2">
      <div className="hidden md:flex flex-col items-center justify-center bg-bg-soft p-12 relative overflow-hidden">
        <div className="text-7xl mb-6">👨‍💻</div>
        <h2 className="font-display font-bold text-2xl text-ink text-center max-w-sm">
          Welcome back to the arena.
        </h2>
        <p className="text-ink-soft text-sm text-center max-w-xs mt-3">
          Your streak, rank, and unfinished contests are waiting for you.
        </p>
      </div>

      <div className="flex items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h1 className="font-display font-bold text-2xl text-ink mb-1">Log in</h1>
          <p className="text-sm text-ink-soft mb-6">New to CodeArena? <Link to="/signup" className="text-accent font-medium hover:underline">Create an account</Link></p>

          <div className="flex gap-3 mb-6">
            <button type="button" className="flex-1 py-2.5 rounded-2xl border border-border text-sm font-medium hover:bg-bg-soft flex items-center justify-center gap-2">
              <span>🔵</span> Google
            </button>
            <button type="button" className="flex-1 py-2.5 rounded-2xl border border-border text-sm font-medium hover:bg-bg-soft flex items-center justify-center gap-2">
              <span>🐙</span> GitHub
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-ink-soft">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {error && (
            <div className="px-4 py-2.5 rounded-2xl bg-danger/10 border border-danger/30 text-sm text-danger mb-4">
              {error}
            </div>
          )}

          <label className="text-xs font-semibold text-ink-soft block mb-1.5">Username</label>
          <input
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="rohit_gupta"
            className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-accent-soft"
          />

          <label className="text-xs font-semibold text-ink-soft block mb-1.5">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-accent-soft"
          />

          <div className="flex items-center justify-between mb-6 text-sm">
            <label className="flex items-center gap-2 text-ink-soft">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-accent" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-accent font-medium hover:underline">Forgot password?</Link>
          </div>

          <button type="submit" disabled={submitting} className="w-full py-3 rounded-2xl bg-accent text-white font-semibold hover:bg-accent-hover transition-colors shadow-lift disabled:opacity-60">
            {submitting ? 'Logging in…' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  )
}
