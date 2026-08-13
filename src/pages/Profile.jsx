import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { refreshStreakIfBroken, getUserRegistrations, getReferralLink, getFollowCounts } from '../utils/appData.js'
import { getCurrentUser, getAvatarEmoji } from '../utils/auth.js'
import { setUser } from '../store/authSlice.js'
function daysAgo(iso) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days <= 0) return 'today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}
export default function Profile() {
  const user = useSelector((s) => s.auth.user)
  const dispatch = useDispatch()
  useEffect(() => {
    if (user) {
      refreshStreakIfBroken(user.username)
      dispatch(setUser(getCurrentUser()))
    }
  }, [])
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-5 py-24 text-center">
        <h1 className="font-display font-bold text-2xl text-ink mb-2">Login required</h1>
        <p className="text-sm text-ink-soft mb-6">Log in to see your profile, streak, and stats.</p>
        <Link
          to="/login"
          className="px-6 py-2.5 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover"
        >
          Go to login
        </Link>
      </div>
    )
  }
  const registrations = getUserRegistrations(user.username)
  const followCounts = getFollowCounts(user.username)
  const stats = [
    {
      label: 'Problems Solved',
      value: user.problemsSolved || 0,
      icon: '🧩',
    },
    {
      label: 'Contests Participated',
      value: (user.contestsParticipated || []).length,
      icon: '🏁',
    },
    {
      label: 'Contests Won',
      value: user.contestsWon || 0,
      icon: '🏆',
    },
    {
      label: 'Points Balance',
      value: user.points || 0,
      icon: '💎',
    },
    {
      label: 'Followers',
      value: followCounts.followers,
      icon: '👥',
    },
    {
      label: 'Following',
      value: followCounts.following,
      icon: '➕',
    },
  ]
  return (
    <div className="max-w-4xl mx-auto px-5 py-14">
      <div className="flex items-center gap-4 mb-8">
        <span className="w-20 h-20 rounded-3xl bg-accent-soft grid place-items-center text-4xl">
          {getAvatarEmoji(user.avatar)}
        </span>
        <div>
          <h1 className="font-display font-bold text-2xl text-ink">{user.fullName}</h1>
          <p className="text-ink-soft text-sm">
            @{user.username} · {user.type}
          </p>
          <p className="text-ink-soft text-xs mt-1">
            Account created{' '}
            {new Date(user.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {user.bio && <p className="text-sm text-ink-soft mb-8 border-l-2 border-accent pl-3">{user.bio}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="border border-border rounded-2xl p-5 text-center bg-white">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="font-display font-extrabold text-2xl text-ink">{s.value}</div>
            <div className="text-xs text-ink-soft mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="border border-border rounded-2xl p-6 bg-white">
          <h3 className="font-display font-semibold text-ink mb-3">🔥 Streak</h3>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-4xl text-accent">{user.streakCurrent || 0}</span>
            <span className="text-sm text-ink-soft">
              day{(user.streakCurrent || 0) === 1 ? '' : 's'} current streak
            </span>
          </div>
          <p className="text-xs text-ink-soft mt-2">Longest streak: {user.streakLongest || 0} days</p>
          <p className="text-xs text-ink-soft/70 mt-3">
            Solve a problem or register for a contest each day to keep your streak alive. It updates automatically based
            on real activity dates — no manual resets.
          </p>
        </div>

        <div className="border border-border rounded-2xl p-6 bg-white">
          <h3 className="font-display font-semibold text-ink mb-3">💳 Subscription</h3>
          {user.subscription?.active ? (
            <>
              <p className="text-sm text-ink">
                Plan: <strong>{user.subscription.plan}</strong>
              </p>
              <p className="text-xs text-ink-soft mt-1">
                Renews {new Date(user.subscription.expiresAt).toLocaleDateString('en-IN')}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-ink-soft">You're on the Free plan.</p>
              <Link to="/subscription" className="inline-block mt-3 text-xs font-semibold text-accent hover:underline">
                Upgrade for more →
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="border border-border rounded-2xl p-6 bg-white mb-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-ink">🎁 Refer & Earn</h3>
          <Link to="/wallet" className="text-xs font-semibold text-accent hover:underline">
            Open Wallet →
          </Link>
        </div>
        <p className="text-sm text-ink-soft mb-3">
          You've referred {user.referralCount || 0} friend{(user.referralCount || 0) === 1 ? '' : 's'}. Share your link
          to earn more points.
        </p>
        <div className="flex gap-2">
          <input
            readOnly
            value={getReferralLink(user.username)}
            className="flex-1 px-3 py-2 rounded-xl border border-border text-xs font-mono bg-bg-soft"
          />
          <button
            onClick={() => navigator.clipboard.writeText(getReferralLink(user.username))}
            className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover"
          >
            Copy
          </button>
        </div>
      </div>

      <div className="border border-border rounded-2xl p-6 bg-white">
        <h3 className="font-display font-semibold text-ink mb-3">Contest Registrations</h3>
        {registrations.length === 0 ? (
          <p className="text-sm text-ink-soft">
            You haven't registered for any contests yet.{' '}
            <Link to="/contests" className="text-accent hover:underline">
              Browse contests →
            </Link>
          </p>
        ) : (
          <ul className="space-y-2">
            {registrations.map((r) => (
              <li key={r.contestId} className="flex justify-between text-sm border-b border-border pb-2 last:border-0">
                <Link to={`/contests/${r.contestId}`} className="text-ink hover:text-accent font-medium">
                  {r.contestId}
                </Link>
                <span className="text-ink-soft text-xs">Registered {daysAgo(r.registeredAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
