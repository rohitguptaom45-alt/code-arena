import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getReferralLink, POINTS_PER_RUPEE } from '../utils/appData.js'
export default function Wallet() {
  const user = useSelector((s) => s.auth.user)
  const [copied, setCopied] = useState(false)
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-5 py-24 text-center">
        <h1 className="font-display font-bold text-2xl text-ink mb-2">Login required</h1>
        <p className="text-sm text-ink-soft mb-6">Log in to view your points wallet.</p>
        <Link
          to="/login"
          className="px-6 py-2.5 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover"
        >
          Go to login
        </Link>
      </div>
    )
  }
  const copyLink = () => {
    navigator.clipboard.writeText(getReferralLink(user.username))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const rupeeValue = Math.floor((user.points || 0) / POINTS_PER_RUPEE)
  const history = user.pointsHistory || []
  return (
    <div className="max-w-3xl mx-auto px-5 py-14">
      <h1 className="font-display font-bold text-2xl md:text-3xl text-ink mb-1">Wallet & Points</h1>
      <p className="text-sm text-ink-soft mb-8">
        Earn points by solving problems, joining contests, winning, and referring friends. Redeem them for subscription
        discounts.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-2xl p-6 bg-gradient-to-br from-accent to-accent-soft text-white">
          <div className="text-xs opacity-80 mb-1">Balance</div>
          <div className="font-display font-extrabold text-4xl mb-1">{user.points || 0} pts</div>
          <div className="text-sm opacity-90">
            ≈ ₹{rupeeValue} discount ({POINTS_PER_RUPEE} pts = ₹1)
          </div>
          <Link
            to="/subscription"
            className="inline-block mt-4 px-4 py-2 rounded-xl bg-white/20 text-sm font-semibold hover:bg-white/30"
          >
            Redeem on Subscription →
          </Link>
        </div>

        <div className="border border-border rounded-2xl p-6 bg-white">
          <h3 className="font-display font-semibold text-ink mb-2">🎁 Refer & Earn</h3>
          <p className="text-sm text-ink-soft mb-3">
            +50 pts when a friend signs up with your link. +30 pts when they join a contest through it. You've referred{' '}
            {user.referralCount || 0} friend{(user.referralCount || 0) === 1 ? '' : 's'}.
          </p>
          <div className="flex gap-2">
            <input
              readOnly
              value={getReferralLink(user.username)}
              className="flex-1 px-3 py-2 rounded-xl border border-border text-xs font-mono bg-bg-soft"
            />
            <button
              onClick={copyLink}
              className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover"
            >
              {copied ? '✓' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      <div className="border border-border rounded-2xl p-6 bg-white mb-8">
        <h3 className="font-display font-semibold text-ink mb-3">How to earn points</h3>
        <ul className="text-sm text-ink-soft space-y-2">
          <li className="flex justify-between border-b border-border pb-2">
            <span>Solve a coding problem</span>
            <span className="font-semibold text-accent">+10 pts</span>
          </li>
          <li className="flex justify-between border-b border-border pb-2">
            <span>Register for a contest</span>
            <span className="font-semibold text-accent">+20 pts</span>
          </li>
          <li className="flex justify-between border-b border-border pb-2">
            <span>Win a contest</span>
            <span className="font-semibold text-accent">+100 pts</span>
          </li>
          <li className="flex justify-between border-b border-border pb-2">
            <span>Friend joins a contest via your link</span>
            <span className="font-semibold text-accent">+30 pts</span>
          </li>
          <li className="flex justify-between">
            <span>Friend signs up via your link</span>
            <span className="font-semibold text-accent">+50 pts</span>
          </li>
        </ul>
      </div>

      <div className="border border-border rounded-2xl p-6 bg-white">
        <h3 className="font-display font-semibold text-ink mb-3">Recent activity</h3>
        {history.length === 0 ? (
          <p className="text-sm text-ink-soft">No points activity yet — go solve something!</p>
        ) : (
          <ul className="space-y-2">
            {history.slice(0, 20).map((h, i) => (
              <li key={i} className="flex justify-between text-sm border-b border-border pb-2 last:border-0">
                <span className="text-ink-soft">{h.reason}</span>
                <span className={`font-semibold ${h.amount >= 0 ? 'text-success' : 'text-danger'}`}>
                  {h.amount >= 0 ? '+' : ''}
                  {h.amount} pts
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
