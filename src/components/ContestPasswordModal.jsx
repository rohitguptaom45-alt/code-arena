import React, { useState } from 'react'

export default function ContestPasswordModal({ open, onClose, contestTitle, onConfirm }) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!open) return null

  const handleClose = () => {
    setPassword('')
    setError('')
    setShowPassword(false)
    onClose()
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!password.trim()) {
      setError('Please enter the contest password')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const res = await onConfirm(password.trim())
      if (res?.error) {
        setError(res.error)
        setSubmitting(false)
      } else {
        handleClose()
      }
    } catch (err) {
      setError(err.message || 'Failed to join contest')
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-border space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent grid place-items-center text-xl shrink-0">
            🔒
          </div>
          <div>
            <h2 className="font-display font-bold text-lg md:text-xl text-ink">Password Protected</h2>
            <p className="text-xs text-ink-soft mt-0.5">
              {contestTitle ? (
                <span>
                  Enter password to join <strong className="text-ink font-semibold">{contestTitle}</strong>
                </span>
              ) : (
                'Enter the contest password provided by the host'
              )}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-ink-soft block mb-1.5">Contest Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (error) setError('')
                }}
                placeholder="Enter password..."
                className="w-full pl-4 pr-12 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-ink-soft hover:text-ink"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {error && <p className="text-xs text-danger mt-1.5 font-medium">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-2xl border border-border text-xs font-semibold text-ink-soft hover:bg-bg-soft transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !password.trim()}
              className="px-5 py-2.5 rounded-2xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover shadow-soft transition-colors disabled:opacity-60"
            >
              {submitting ? 'Verifying…' : 'Unlock & Join'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
