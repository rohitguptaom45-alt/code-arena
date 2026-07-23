import React, { useState } from 'react'
import { leaderboard } from '../data/mockData.js'

const tabs = ['Weekly', 'Monthly', 'All Time']
const medalIcon = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const [tab, setTab] = useState('Weekly')
  const top3 = leaderboard.slice(0, 3)
  const rest = leaderboard.slice(3)
  const podiumOrder = [top3[1], top3[0], top3[2]] // 2nd, 1st, 3rd for visual podium
  const podiumHeight = ['h-28', 'h-40', 'h-24']

  return (
    <div className="max-w-6xl mx-auto px-5 py-14">
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-ink">Leaderboard</h1>
          <p className="text-ink-soft mt-2 text-sm">Top performers across the CodeArena community.</p>
        </div>
        <div className="flex gap-2 bg-bg-soft rounded-2xl p-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                tab === t ? 'bg-white shadow-soft text-accent' : 'text-ink-soft'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-4 items-end mb-14 max-w-xl mx-auto">
        {podiumOrder.map((user, i) => (
          <div key={user.username} className="text-center animate-[fadeUp_.5s_ease]">
            <div className="text-3xl mb-1">{medalIcon[i === 1 ? 0 : i === 0 ? 1 : 2]}</div>
            <div className="w-14 h-14 mx-auto rounded-full bg-accent-soft grid place-items-center text-lg font-bold text-white mb-2">
              {user.username[0].toUpperCase()}
            </div>
            <div className="text-sm font-semibold text-ink truncate">{user.username}</div>
            <div className="text-xs text-ink-soft mb-2">{user.rating} rating</div>
            <div className={`rounded-t-2xl bg-gradient-to-b from-accent-soft to-accent ${podiumHeight[i]}`} />
          </div>
        ))}
        <style>{`@keyframes fadeUp { from { opacity:0; transform: translateY(12px);} to { opacity:1; transform: translateY(0);} }`}</style>
      </div>

      {/* Table */}
      <div className="border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[50px_1fr_70px_80px_70px_60px] md:grid-cols-[60px_1fr_90px_120px_110px_100px] gap-2 px-5 py-3 bg-bg-soft text-xs font-semibold text-ink-soft">
          <span>Rank</span>
          <span>User</span>
          <span>Country</span>
          <span>Rating</span>
          <span>Solved</span>
          <span>Wins</span>
        </div>
        {leaderboard.map((user) => (
          <div
            key={user.username}
            className="grid grid-cols-[50px_1fr_70px_80px_70px_60px] md:grid-cols-[60px_1fr_90px_120px_110px_100px] gap-2 px-5 py-3 items-center border-t border-border hover:bg-bg-soft/60 text-sm"
          >
            <span className="font-mono text-ink-soft flex items-center gap-1">
              {user.rank <= 3 ? medalIcon[user.rank - 1] : user.rank}
            </span>
            <span className="flex items-center gap-2 min-w-0">
              <span className="w-7 h-7 shrink-0 rounded-full bg-muted grid place-items-center text-xs font-semibold">
                {user.username[0].toUpperCase()}
              </span>
              <span className="truncate font-medium text-ink">{user.username}</span>
            </span>
            <span>{user.country}</span>
            <span className="font-semibold text-accent">{user.rating}</span>
            <span className="text-ink-soft">{user.solved}</span>
            <span className="text-ink-soft">{user.wins}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
