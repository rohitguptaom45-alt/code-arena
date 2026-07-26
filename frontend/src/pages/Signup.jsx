import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { registerUserRemoteFirst, getAvatarOptions } from '../utils/auth.js'
import { applySignupReferral, addNotification } from '../utils/appData.js'
import { setUser } from '../store/authSlice.js'

const accountTypes = ['Student', 'Professional', 'Freelancer', 'Recruiter']

function passwordStrength(pw) {
  if (!pw) return { label: '', pct: 0, color: 'bg-border' }
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const levels = [
    { label: 'Too short', pct: 15, color: 'bg-danger' },
    { label: 'Weak', pct: 35, color: 'bg-danger' },
    { label: 'Okay', pct: 55, color: 'bg-warning' },
    { label: 'Good', pct: 75, color: 'bg-warning' },
    { label: 'Strong', pct: 100, color: 'bg-success' },
  ]
  return levels[Math.min(score, levels.length - 1)]
}

export default function Signup() {
  const [searchParams] = useSearchParams()
  const refUsername = searchParams.get('ref')
  const [step, setStep] = useState(1) // 1 = profile details, 2 = create password
  const [accepted, setAccepted] = useState(false)
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    bio: '',
    type: 'Student',
    github: '',
    avatar: getAvatarOptions()[0],
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleContinue = (e) => {
    e.preventDefault()
    setError('')
    if (!form.fullName.trim() || !form.username.trim()) {
      setError('Please fill in your name and username.')
      return
    }
    setStep(2)
  }

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (!accepted) {
      setError('Please accept the Terms & Conditions to continue.')
      return
    }

    setSubmitting(true)
    const { confirmPassword, ...userData } = form
    const result = await registerUserRemoteFirst(userData)
    setSubmitting(false)

    if (result.error) {
      setError(result.error)
      return
    }
    if (refUsername) {
      applySignupReferral(result.user.username, refUsername)
    }
    addNotification(result.user.username, {
      type: 'welcome',
      text: `Welcome to CodeArena, ${result.user.fullName || result.user.username}! Explore contests to get started.`,
      link: '/contests',
    })
    dispatch(setUser(result.user))
    navigate('/')
  }

  const strength = passwordStrength(form.password)

  return (
    <div className="max-w-lg mx-auto px-5 py-14">
      <h1 className="font-display font-bold text-2xl text-ink mb-1">Create your account</h1>
      <p className="text-sm text-ink-soft mb-6">
        Already have an account? <Link to="/login" className="text-accent font-medium hover:underline">Log in</Link>
      </p>

      {refUsername && (
        <div className="mb-6 px-4 py-2.5 rounded-2xl bg-success/10 border border-success/30 text-sm text-success">
          🎉 You were invited by <strong>@{refUsername}</strong> — sign up and you'll both earn bonus points!
        </div>
      )}

      <div className="flex items-center gap-2 mb-8">
        <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? 'bg-accent' : 'bg-border'}`} />
        <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? 'bg-accent' : 'bg-border'}`} />
      </div>
      <div className="flex justify-between text-xs text-ink-soft mb-6 -mt-4">
        <span className={step === 1 ? 'font-semibold text-accent' : ''}>1. Your details</span>
        <span className={step === 2 ? 'font-semibold text-accent' : ''}>2. Create password</span>
      </div>

      {step === 1 && (
        <>
          <div className="flex gap-3 mb-6">
            <button type="button" className="flex-1 py-2.5 rounded-2xl border border-border text-sm font-medium hover:bg-bg-soft">🔵 Google</button>
            <button type="button" className="flex-1 py-2.5 rounded-2xl border border-border text-sm font-medium hover:bg-bg-soft">🐙 GitHub</button>
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-ink-soft">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleContinue} className="space-y-4">
            {error && (
              <div className="px-4 py-2.5 rounded-2xl bg-danger/10 border border-danger/30 text-sm text-danger">{error}</div>
            )}

            <div>
              <label className="text-xs font-semibold text-ink-soft block mb-1.5">Choose an avatar</label>
              <div className="flex flex-wrap gap-2">
                {getAvatarOptions().map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, avatar: emoji }))}
                    className={`w-10 h-10 rounded-2xl grid place-items-center text-lg border transition-colors ${
                      form.avatar === emoji ? 'border-accent bg-bg-soft' : 'border-border hover:bg-bg-soft'
                    }`}
                    aria-label={`Avatar ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-ink-soft block mb-1.5">Full Name</label>
                <input
                  required
                  value={form.fullName}
                  onChange={update('fullName')}
                  placeholder="Rohit Gupta"
                  className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-soft block mb-1.5">Username</label>
                <input
                  required
                  value={form.username}
                  onChange={update('username')}
                  placeholder="rohit_gupta"
                  className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-ink-soft block mb-1.5">I am a</label>
                <select
                  value={form.type}
                  onChange={update('type')}
                  className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent-soft"
                >
                  {accountTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-soft block mb-1.5">GitHub username</label>
                <input
                  value={form.github}
                  onChange={update('github')}
                  placeholder="rohit-gupta"
                  className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-ink-soft block mb-1.5">Bio</label>
              <textarea
                value={form.bio}
                onChange={update('bio')}
                rows={2}
                placeholder="Full stack dev who loves DSA battles."
                className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent-soft"
              />
            </div>

            <button type="submit" className="w-full py-3 rounded-2xl bg-accent text-white font-semibold hover:bg-accent-hover transition-colors shadow-lift">
              Continue →
            </button>
          </form>
        </>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="px-4 py-2.5 rounded-2xl bg-danger/10 border border-danger/30 text-sm text-danger">{error}</div>
          )}

          <div className="flex items-center gap-3 mb-2 px-4 py-3 rounded-2xl bg-bg-soft border border-border">
            <span className="w-9 h-9 rounded-xl bg-white grid place-items-center text-lg">{form.avatar}</span>
            <div className="text-sm">
              <div className="font-semibold text-ink">{form.fullName}</div>
              <div className="text-ink-soft text-xs">@{form.username}</div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-soft block mb-1.5">Create a password</label>
            <input
              type="password"
              required
              autoFocus
              value={form.password}
              onChange={update('password')}
              placeholder="At least 6 characters"
              className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
            />
            {form.password && (
              <div className="mt-2">
                <div className="h-1.5 rounded-full bg-border overflow-hidden">
                  <div className={`h-full ${strength.color} transition-all`} style={{ width: `${strength.pct}%` }} />
                </div>
                <p className="text-xs text-ink-soft mt-1">{strength.label}</p>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-ink-soft block mb-1.5">Confirm password</label>
            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={update('confirmPassword')}
              placeholder="Re-enter your password"
              className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
            />
            {form.confirmPassword && (
              <p className={`text-xs mt-1 ${form.confirmPassword === form.password ? 'text-success' : 'text-danger'}`}>
                {form.confirmPassword === form.password ? '✓ Passwords match' : '✕ Passwords do not match'}
              </p>
            )}
          </div>

          <label className="flex items-start gap-2 text-xs text-ink-soft">
            <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="accent-accent mt-0.5" />
            I agree to the <Link to="/more" className="text-accent hover:underline">Terms & Conditions</Link> and <Link to="/more" className="text-accent hover:underline">Privacy Policy</Link>.
          </label>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 rounded-2xl border border-border text-sm font-medium text-ink hover:bg-bg-soft">
              ← Back
            </button>
            <button type="submit" disabled={submitting} className="flex-1 py-3 rounded-2xl bg-accent text-white font-semibold hover:bg-accent-hover transition-colors shadow-lift disabled:opacity-60">
              {submitting ? 'Creating…' : 'Create Account'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
