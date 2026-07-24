import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUser, updateUser, logoutUser, getAvatarOptions } from '../utils/auth.js'

const sections = ['Profile', 'Account', 'Security', 'Privacy', 'Notifications', 'Appearance']
const accountTypes = ['Student', 'Professional', 'Freelancer', 'Recruiter']

export default function Settings() {
  const [active, setActive] = useState('Profile')
  const [darkMode, setDarkMode] = useState(false)
  const [twoFA, setTwoFA] = useState(false)
  const [user, setUser] = useState(getCurrentUser())
  const [form, setForm] = useState(
    user ? { fullName: user.fullName, bio: user.bio, type: user.type, github: user.github, avatar: user.avatar } : null
  )
  const [saved, setSaved] = useState(false)

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-5 py-24 text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h1 className="font-display font-bold text-xl text-ink mb-2">You're not logged in</h1>
        <p className="text-sm text-ink-soft mb-6">Log in to manage your profile, security, and notification settings.</p>
        <Link to="/login" className="inline-block px-5 py-2.5 rounded-2xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover">
          Log In
        </Link>
      </div>
    )
  }

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSave = () => {
    const result = updateUser(user.username, form)
    if (result.user) {
      setUser(result.user)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-14 grid md:grid-cols-[220px_1fr] gap-8">
      <aside className="space-y-1">
        {sections.map((s) => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className={`w-full text-left px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
              active === s ? 'bg-accent text-white' : 'text-ink-soft hover:bg-bg-soft'
            }`}
          >
            {s}
          </button>
        ))}
        <button
          onClick={logoutUser}
          className="w-full text-left px-4 py-2.5 rounded-2xl text-sm font-medium text-ink-soft hover:bg-bg-soft mt-4"
        >
          Log Out
        </button>
        <button className="w-full text-left px-4 py-2.5 rounded-2xl text-sm font-medium text-danger hover:bg-danger/10">
          Delete Account
        </button>
      </aside>

      <div className="border border-border rounded-2xl p-8">
        {active === 'Profile' && (
          <div className="space-y-4 max-w-md">
            <h2 className="font-display font-bold text-xl text-ink mb-4">Profile</h2>

            <div>
              <label className="text-xs font-semibold text-ink-soft block mb-2">Avatar</label>
              <div className="flex flex-wrap gap-2">
                {getAvatarOptions().map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setForm((f) => ({ ...f, avatar: emoji }))}
                    className={`w-10 h-10 rounded-2xl grid place-items-center text-lg border transition-colors ${
                      form.avatar === emoji ? 'border-accent bg-bg-soft' : 'border-border hover:bg-bg-soft'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-ink-soft block mb-1.5">Display Name</label>
              <input value={form.fullName} onChange={update('fullName')} className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm" />
            </div>

            <div>
              <label className="text-xs font-semibold text-ink-soft block mb-1.5">Username</label>
              <input value={user.username} disabled className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm bg-muted text-ink-soft" />
              <p className="text-[11px] text-ink-soft mt-1">Usernames can't be changed after signup.</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-ink-soft block mb-1.5">I am a</label>
              <select value={form.type} onChange={update('type')} className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm bg-white">
                {accountTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-ink-soft block mb-1.5">GitHub Username</label>
              <input value={form.github} onChange={update('github')} placeholder="your-github-handle" className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm" />
            </div>

            <div>
              <label className="text-xs font-semibold text-ink-soft block mb-1.5">Bio</label>
              <textarea value={form.bio} onChange={update('bio')} rows={3} className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm resize-none" />
            </div>

            <div className="flex items-center gap-3">
              <button onClick={handleSave} className="px-5 py-2.5 rounded-2xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover">
                Save Changes
              </button>
              {saved && <span className="text-xs text-success font-medium">✓ Saved</span>}
            </div>
          </div>
        )}

        {active === 'Account' && (
          <div className="space-y-4 max-w-md">
            <h2 className="font-display font-bold text-xl text-ink mb-4">Account</h2>
            <div>
              <label className="text-xs font-semibold text-ink-soft block mb-1.5">Username</label>
              <input value={user.username} disabled className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm bg-muted text-ink-soft" />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-soft block mb-1.5">Account Type</label>
              <input value={user.type} disabled className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm bg-muted text-ink-soft" />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-soft block mb-1.5">Payment Methods</label>
              <div className="border border-border rounded-2xl px-4 py-3 text-sm text-ink-soft flex justify-between items-center">
                <span>No payment method on file</span>
                <Link to="/subscription" className="text-xs text-accent">Add</Link>
              </div>
            </div>
          </div>
        )}

        {active === 'Security' && (
          <div className="space-y-5 max-w-md">
            <h2 className="font-display font-bold text-xl text-ink mb-4">Security</h2>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-ink">Two-Factor Authentication</div>
                <div className="text-xs text-ink-soft">Add an extra layer of security to your account.</div>
              </div>
              <button
                onClick={() => setTwoFA(!twoFA)}
                className={`w-12 h-7 rounded-full transition-colors relative ${twoFA ? 'bg-accent' : 'bg-border'}`}
              >
                <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${twoFA ? 'translate-x-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
            <div>
              <h3 className="text-sm font-medium text-ink mb-2">Connected Accounts</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1.5 rounded-xl border border-border text-xs">
                  🐙 GitHub — {user.github ? `Connected as ${user.github}` : 'Not connected'}
                </span>
                <span className="px-3 py-1.5 rounded-xl border border-border text-xs">🔵 Google — Not connected</span>
              </div>
            </div>
          </div>
        )}

        {active === 'Privacy' && (
          <div className="max-w-md">
            <h2 className="font-display font-bold text-xl text-ink mb-4">Privacy</h2>
            <p className="text-sm text-ink-soft">Control who can view your profile, submissions, and activity logs.</p>
          </div>
        )}

        {active === 'Notifications' && (
          <div className="max-w-md space-y-3">
            <h2 className="font-display font-bold text-xl text-ink mb-4">Notifications</h2>
            {['Contest reminders', 'Leaderboard updates', 'Product announcements'].map((n) => (
              <label key={n} className="flex items-center justify-between text-sm text-ink-soft border-b border-border pb-3">
                {n}
                <input type="checkbox" defaultChecked className="accent-accent" />
              </label>
            ))}
          </div>
        )}

        {active === 'Appearance' && (
          <div className="max-w-md">
            <h2 className="font-display font-bold text-xl text-ink mb-4">Appearance</h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-soft">Dark Mode</span>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-7 rounded-full transition-colors relative ${darkMode ? 'bg-accent' : 'bg-border'}`}
              >
                <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${darkMode ? 'translate-x-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
