import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
function formatCountdown(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
const difficultyColor = {
  Easy: 'text-success bg-success/10',
  Medium: 'text-warning bg-warning/10',
  Hard: 'text-danger bg-danger/10',
}
export default function ContestCard({ contest, onRegister }) {
  const [secondsLeft, setSecondsLeft] = useState(contest.startsInSeconds)
  useEffect(() => {
    const t = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="card-lift bg-white border border-border rounded-2xl overflow-hidden shadow-soft flex flex-col">
      <div className={`h-28 bg-gradient-to-br ${contest.banner} flex items-center justify-between px-5`}>
        <span className="text-white font-display font-bold text-lg drop-shadow-sm">{contest.name}</span>
        <span className="text-3xl">🏆</span>
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <p className="text-sm text-ink-soft">{contest.tagline}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className={`px-2.5 py-1 rounded-full font-medium ${difficultyColor[contest.difficulty]}`}>
            {contest.difficulty}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-muted text-ink-soft font-medium">⏱ {contest.duration}</span>
          <span className="px-2.5 py-1 rounded-full bg-muted text-ink-soft font-medium">
            👥 {contest.participants.toLocaleString('en-IN')}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-muted text-ink-soft font-medium">
            {contest.isLikedByMe ? '❤️' : '🤍'} {(contest.likesCount ?? contest._count?.likes ?? 0).toLocaleString('en-IN')}
          </span>
          {contest.isProtected && (
            <span className="px-2.5 py-1 rounded-full bg-warning/15 text-warning font-semibold flex items-center gap-1">
              🔒 Protected
            </span>
          )}
        </div>
        <div className="flex items-center justify-between text-sm pt-1">
          <div>
            <div className="text-ink-soft text-xs">Prize Pool</div>
            <div className="font-display font-bold text-accent">{contest.prizePool}</div>
          </div>
          <div>
            <div className="text-ink-soft text-xs text-right">Access</div>
            <div className="font-semibold text-ink text-xs">{contest.isProtected ? '🔒 Password' : '🌐 Open'}</div>
          </div>
        </div>
        <div className="bg-bg-soft rounded-xl px-3 py-2 flex items-center justify-between text-sm">
          <span className="text-ink-soft">Starts in</span>
          <span className="font-mono font-semibold text-ink">{formatCountdown(secondsLeft)}</span>
        </div>
        <div className="flex gap-2 mt-auto pt-2">
          <Link
            to={`/contests/${contest.id}`}
            className="flex-1 text-center py-2.5 rounded-2xl border border-border text-sm font-medium text-ink hover:bg-bg-soft transition-colors"
          >
            Details
          </Link>
          <button
            onClick={() => onRegister(contest)}
            className="flex-1 py-2.5 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  )
}
