import React, { useState } from 'react'
import { getPayments, approvePayment, rejectPayment } from '../utils/appData.js'
const ADMIN_PASSCODE = 'codearena-admin'
export default function AdminPayments() {
  const [unlocked, setUnlocked] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const [payments, setPayments] = useState([])
  const refresh = () => setPayments(getPayments())
  const handleUnlock = (e) => {
    e.preventDefault()
    if (passcode === ADMIN_PASSCODE) {
      setUnlocked(true)
      refresh()
    } else {
      setError('Incorrect passcode.')
    }
  }
  if (!unlocked) {
    return (
      <div className="max-w-sm mx-auto px-5 py-24">
        <h1 className="font-display font-bold text-2xl text-ink mb-2">Admin access</h1>
        <p className="text-sm text-ink-soft mb-6">Enter the admin passcode to review pending UPI payments.</p>
        <form onSubmit={handleUnlock} className="space-y-3">
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Passcode"
            className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
          />
          {error && <p className="text-xs text-danger">{error}</p>}
          <button className="w-full py-2.5 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover">
            Unlock
          </button>
        </form>
        <p className="text-xs text-ink-soft/70 mt-4">
          This is a lightweight local gate, not real authentication. Set your own passcode in{' '}
          <code className="font-mono">src/pages/AdminPayments.jsx</code> before deploying.
        </p>
      </div>
    )
  }
  const pending = payments.filter((p) => p.status === 'pending')
  const resolved = payments.filter((p) => p.status !== 'pending')
  const handleApprove = (id) => {
    approvePayment(id)
    refresh()
  }
  const handleReject = (id) => {
    rejectPayment(id)
    refresh()
  }
  return (
    <div className="max-w-3xl mx-auto px-5 py-14">
      <h1 className="font-display font-bold text-2xl text-ink mb-1">Payment verification queue</h1>
      <p className="text-sm text-ink-soft mb-8">
        Match each UTR against your UPI bank statement, then approve or reject. Approving instantly activates the user's
        subscription.
      </p>

      <h2 className="font-display font-semibold text-lg text-ink mb-3">Pending ({pending.length})</h2>
      {pending.length === 0 ? (
        <p className="text-sm text-ink-soft mb-8">Nothing waiting for review.</p>
      ) : (
        <div className="space-y-3 mb-10">
          {pending.map((p) => (
            <div
              key={p.id}
              className="border border-border rounded-2xl px-4 py-3 flex items-center justify-between text-sm"
            >
              <div>
                <div className="font-semibold text-ink">
                  @{p.username} — {p.plan} · ₹{p.amount}
                </div>
                <div className="text-ink-soft text-xs font-mono">
                  UTR {p.utr} · {new Date(p.createdAt).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(p.id)}
                  className="px-3 py-1.5 rounded-xl bg-success text-white text-xs font-semibold hover:opacity-90"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(p.id)}
                  className="px-3 py-1.5 rounded-xl bg-danger text-white text-xs font-semibold hover:opacity-90"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="font-display font-semibold text-lg text-ink mb-3">History ({resolved.length})</h2>
      <div className="space-y-2">
        {resolved.map((p) => (
          <div
            key={p.id}
            className="border border-border rounded-2xl px-4 py-2.5 flex items-center justify-between text-sm"
          >
            <span className="text-ink-soft">
              @{p.username} — {p.plan} · ₹{p.amount}
            </span>
            <span className={`text-xs font-semibold ${p.status === 'approved' ? 'text-success' : 'text-danger'}`}>
              {p.status === 'approved' ? '✅ Approved' : '✗ Rejected'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
