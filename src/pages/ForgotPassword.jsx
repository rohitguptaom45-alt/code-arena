import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userExistsByEmail, resetPasswordLocal } from '../utils/auth.js'

export default function ForgotPassword() {
  const [step, setStep] = useState(1) // 1 = find account, 2 = set new password
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const navigate = useNavigate()

  const handleFindAccount = (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) {
      setError('Enter your email.')
      return
    }
    if (!userExistsByEmail(email)) {
      setError('No account found with that email on this device.')
      return
    }
    setStep(2)
  }

  const handleReset = (e) => {
    e.preventDefault()
    setError('')
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    const result = resetPasswordLocal(email, newPassword)
    if (result.error) {
      setError(result.error)
      return
    }
    setDone(true)
  }

  return (
    <div className="max-w-md mx-auto px-5 py-20">
      <h1 className="font-display font-bold text-2xl text-ink mb-1">Reset your password</h1>
      <p className="text-sm text-ink-soft mb-6">
        Remembered it? <Link to="/login" className="text-accent font-medium hover:underline">Back to login</Link>
      </p>

      {done ? (
        <div className="text-center py-10">
          <div className="text-4xl mb-3">✅</div>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">Password updated</h2>
          <p className="text-sm text-ink-soft mb-6">You can now log in with your new password.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover"
          >
            Go to Login
          </button>
        </div>
      ) : step === 1 ? (
        <form onSubmit={handleFindAccount} className="space-y-4">
          {error && <div className="px-4 py-2.5 rounded-2xl bg-danger/10 border border-danger/30 text-sm text-danger">{error}</div>}
          <div>
            <label className="text-xs font-semibold text-ink-soft block mb-1.5">Email</label>
            <input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
            />
          </div>
          <p className="text-[11px] text-ink-soft">
            This checks for your account on this device. There's no email/SMS verification step yet, so treat this like a local
            recovery option rather than a secure production reset flow.
          </p>
          <button type="submit" className="w-full py-3 rounded-2xl bg-accent text-white font-semibold hover:bg-accent-hover shadow-lift">
            Continue →
          </button>
        </form>
      ) : (
        <form onSubmit={handleReset} className="space-y-4">
          {error && <div className="px-4 py-2.5 rounded-2xl bg-danger/10 border border-danger/30 text-sm text-danger">{error}</div>}
          <div className="px-4 py-2.5 rounded-2xl bg-bg-soft border border-border text-sm text-ink-soft">
            Resetting password for <strong className="text-ink">{email.trim().toLowerCase()}</strong>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-soft block mb-1.5">New password</label>
            <input
              type="password"
              autoFocus
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-soft block mb-1.5">Confirm new password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
            />
            {confirmPassword && (
              <p className={`text-xs mt-1 ${confirmPassword === newPassword ? 'text-success' : 'text-danger'}`}>
                {confirmPassword === newPassword ? '✓ Passwords match' : '✕ Passwords do not match'}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 rounded-2xl border border-border text-sm font-medium text-ink hover:bg-bg-soft">
              ← Back
            </button>
            <button type="submit" className="flex-1 py-3 rounded-2xl bg-accent text-white font-semibold hover:bg-accent-hover shadow-lift">
              Reset Password
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
