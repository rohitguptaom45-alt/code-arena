import React, { useState } from 'react'

const sections = ['Profile', 'Account', 'Security', 'Privacy', 'Notifications', 'Appearance']

export default function Settings() {
  const [active, setActive] = useState('Profile')
  const [darkMode, setDarkMode] = useState(false)
  const [twoFA, setTwoFA] = useState(false)

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
        <button className="w-full text-left px-4 py-2.5 rounded-2xl text-sm font-medium text-danger hover:bg-danger/10 mt-4">
          Delete Account
        </button>
      </aside>

      <div className="border border-border rounded-2xl p-8">
        {active === 'Profile' && (
          <div className="space-y-4 max-w-md">
            <h2 className="font-display font-bold text-xl text-ink mb-4">Profile</h2>
            <div>
              <label className="text-xs font-semibold text-ink-soft block mb-1.5">Display Name</label>
              <input defaultValue="Aarav Mehta" className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-soft block mb-1.5">Username</label>
              <input defaultValue="aarav_codes" className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm" />
            </div>
            <button className="px-5 py-2.5 rounded-2xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover">Save Changes</button>
          </div>
        )}

        {active === 'Account' && (
          <div className="space-y-4 max-w-md">
            <h2 className="font-display font-bold text-xl text-ink mb-4">Account</h2>
            <div>
              <label className="text-xs font-semibold text-ink-soft block mb-1.5">Email</label>
              <input defaultValue="aarav@example.com" className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-soft block mb-1.5">Payment Methods</label>
              <div className="border border-border rounded-2xl px-4 py-3 text-sm text-ink-soft flex justify-between items-center">
                <span>•••• •••• •••• 4242</span>
                <span className="text-xs text-accent">Manage</span>
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
                <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${twoFA ? 'left-5.5 translate-x-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
            <div>
              <h3 className="text-sm font-medium text-ink mb-2">Connected Accounts</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1.5 rounded-xl border border-border text-xs">🐙 GitHub — Connected</span>
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
