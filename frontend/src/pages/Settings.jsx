import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfileRemoteFirst, changePasswordRemoteFirst, getAvatarOptions } from '../utils/auth.js'
import { getStoredTheme, applyTheme } from '../utils/theme.js'
import { updateUser, clearUser } from '../store/authSlice.js'
import { getFollowCounts } from '../utils/appData.js'

const sections = ['Profile', 'Account', 'Security', 'Privacy & Safety', 'Notifications', 'Appearance', 'Contact Us']
const accountTypes = ['Student', 'Professional', 'Freelancer', 'Recruiter']
const CONTACT_EMAIL = 'rohitgupta0m45@gmail.com'
const INSTAGRAM_USERNAME = 'laracrystgc'

function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}
function MailIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3.5 6.5 12 13l8.5-6.5" />
    </svg>
  )
}

export default function Settings() {
  const [active, setActive] = useState('Profile')
  const [darkMode, setDarkMode] = useState(getStoredTheme() === 'dark')
  const [twoFA, setTwoFA] = useState(false)
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const [form, setForm] = useState(
    user ? { fullName: user.fullName, bio: user.bio, type: user.type, github: user.github, avatar: user.avatar } : null
  )
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')
  const [pwSubmitting, setPwSubmitting] = useState(false)

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
  const followCounts = getFollowCounts(user.username)

  const handleSave = async () => {
    setSaving(true)
    const result = await updateProfileRemoteFirst(user.username, form)
    setSaving(false)
    if (result.user) {
      dispatch(updateUser(form))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleToggleDarkMode = () => {
    const next = !darkMode
    setDarkMode(next)
    applyTheme(next ? 'dark' : 'light')
  }

  const handleLogout = () => dispatch(clearUser())

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPwError('')
    setPwSuccess('')
    if (pwForm.newPassword.length < 6) {
      setPwError('New password must be at least 6 characters.')
      return
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('New passwords do not match.')
      return
    }
    setPwSubmitting(true)
    const result = await changePasswordRemoteFirst(pwForm.oldPassword, pwForm.newPassword)
    setPwSubmitting(false)
    if (result.error) {
      setPwError(result.error)
      return
    }
    setPwSuccess('Password updated.')
    setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
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
          onClick={handleLogout}
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

            <div className="flex gap-4 mb-2">
              <div className="border border-border rounded-2xl px-4 py-3 text-center">
                <div className="font-display font-bold text-lg text-ink">{followCounts.followers}</div>
                <div className="text-[11px] text-ink-soft">Followers</div>
              </div>
              <div className="border border-border rounded-2xl px-4 py-3 text-center">
                <div className="font-display font-bold text-lg text-ink">{followCounts.following}</div>
                <div className="text-[11px] text-ink-soft">Following</div>
              </div>
              <Link to="/profile" className="border border-dashed border-border rounded-2xl px-4 py-3 text-center text-xs text-accent font-medium flex items-center hover:bg-bg-soft">
                View full profile →
              </Link>
            </div>

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
              <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 rounded-2xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover disabled:opacity-60">
                {saving ? 'Saving…' : 'Save Changes'}
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
          <div className="space-y-6 max-w-md">
            <h2 className="font-display font-bold text-xl text-ink mb-4">Security</h2>

            <form onSubmit={handleChangePassword} className="space-y-3 border border-border rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-ink">Change Password</h3>
              {pwError && <div className="px-3 py-2 rounded-xl bg-danger/10 text-danger text-xs">{pwError}</div>}
              {pwSuccess && <div className="px-3 py-2 rounded-xl bg-success/10 text-success text-xs">{pwSuccess}</div>}
              <input
                type="password"
                required
                value={pwForm.oldPassword}
                onChange={(e) => setPwForm((f) => ({ ...f, oldPassword: e.target.value }))}
                placeholder="Current password"
                className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm"
              />
              <input
                type="password"
                required
                value={pwForm.newPassword}
                onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
                placeholder="New password"
                className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm"
              />
              <input
                type="password"
                required
                value={pwForm.confirmPassword}
                onChange={(e) => setPwForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
                className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm"
              />
              <button type="submit" disabled={pwSubmitting} className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover disabled:opacity-60">
                {pwSubmitting ? 'Updating…' : 'Update Password'}
              </button>
              <p className="text-[11px] text-ink-soft">
                This calls the CodeArena backend's password-change endpoint. If it isn't running locally, this will show an error rather than silently pretending to succeed.
              </p>
            </form>

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

        {active === 'Privacy & Safety' && (
          <div className="max-w-lg space-y-6">
            <div>
              <h2 className="font-display font-bold text-xl text-ink mb-2">Privacy & Safety</h2>
              <p className="text-sm text-ink-soft">How your data and activity are handled on CodeArena, and what's expected of everyone using it.</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-ink mb-2">Who can see what</h3>
              <ul className="text-sm text-ink-soft space-y-2 list-disc pl-5">
                <li>Your username, avatar, streak, points, and contest results are public on the Leaderboard and your Profile.</li>
                <li>Your email, phone number, and password are never shown to other users.</li>
                <li>Direct messages are only visible to you and the person you're messaging.</li>
                <li>Contest submissions may be reviewed by contest hosts for plagiarism checks.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-ink mb-2">Fair play rules</h3>
              <ul className="text-sm text-ink-soft space-y-2 list-disc pl-5">
                <li>No plagiarism — submitting someone else's solution as your own gets you disqualified from that contest.</li>
                <li>No multi-accounting to farm points, referral bonuses, or leaderboard rank.</li>
                <li>No sharing paid contest problems or solutions before the contest window ends.</li>
                <li>Referral and points abuse (fake accounts, self-referrals) will result in points being reversed.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-ink mb-2">Community conduct</h3>
              <ul className="text-sm text-ink-soft space-y-2 list-disc pl-5">
                <li>Be respectful in chat and community channels — no harassment, hate speech, or spam.</li>
                <li>Don't share others' personal information without consent.</li>
                <li>Report abusive behavior or suspicious accounts using the report option in chat.</li>
                <li>Repeated violations can lead to a temporary suspension or permanent ban.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-ink mb-2">Your data</h3>
              <ul className="text-sm text-ink-soft space-y-2 list-disc pl-5">
                <li>Account and activity data is stored to power your profile, streak, and points — never sold to third parties.</li>
                <li>You can request account deletion at any time from the Account tab.</li>
                <li>Payment verification details (UTR/reference numbers) are used only to confirm your subscription payment.</li>
              </ul>
            </div>
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
              <div>
                <span className="text-sm text-ink block">Dark Mode</span>
                <span className="text-xs text-ink-soft">Applies across the whole app, and remembers your choice.</span>
              </div>
              <button
                onClick={handleToggleDarkMode}
                className={`w-12 h-7 rounded-full transition-colors relative ${darkMode ? 'bg-accent' : 'bg-border'}`}
              >
                <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${darkMode ? 'translate-x-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
        )}

        {active === 'Contact Us' && (
          <div className="max-w-md space-y-5">
            <h2 className="font-display font-bold text-xl text-ink mb-2">Contact Us</h2>
            <p className="text-sm text-ink-soft">Questions, bug reports, or feedback — reach out directly.</p>

            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('CodeArena — Question')}`}
              className="flex items-center gap-4 border border-border rounded-2xl p-4 hover:border-accent-soft hover:bg-bg-soft transition-colors"
            >
              <span className="w-11 h-11 rounded-2xl bg-accent-soft text-white grid place-items-center shrink-0">
                <MailIcon className="w-5 h-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">Email</span>
                <span className="block text-xs text-ink-soft">{CONTACT_EMAIL}</span>
              </span>
              <span className="ml-auto text-xs font-semibold text-accent">Compose →</span>
            </a>

            <a
              href={`https://instagram.com/${INSTAGRAM_USERNAME}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 border border-border rounded-2xl p-4 hover:border-accent-soft hover:bg-bg-soft transition-colors"
            >
              <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent to-accent-soft text-white grid place-items-center shrink-0">
                <InstagramIcon className="w-5 h-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">Instagram</span>
                <span className="block text-xs text-ink-soft">@{INSTAGRAM_USERNAME}</span>
              </span>
              <span className="ml-auto text-xs font-semibold text-accent">Open →</span>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
