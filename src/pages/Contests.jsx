import React, { useMemo, useState } from 'react'
import ContestCard from '../components/ContestCard.jsx'
import LoginRequiredModal from '../components/LoginRequiredModal.jsx'
import { contests } from '../data/mockData.js'

const filters = ['All', 'Easy', 'Medium', 'Hard']

export default function Contests() {
  const [active, setActive] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return contests.filter((c) => {
      const matchesDifficulty = active === 'All' || c.difficulty === active
      const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase())
      return matchesDifficulty && matchesQuery
    })
  }, [active, query])

  return (
    <div className="max-w-7xl mx-auto px-5 py-14">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-ink">All Contests</h1>
        <p className="text-ink-soft mt-2 text-sm">Browse live, upcoming, and practice contests across every category.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-8">
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-4 py-2 rounded-2xl text-sm font-medium border transition-colors ${
                active === f ? 'bg-accent text-white border-accent' : 'border-border text-ink-soft hover:bg-bg-soft'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search contests..."
          className="px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft w-full md:w-72"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-ink-soft">No contests match your filters.</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <ContestCard key={c.id} contest={c} onRegister={() => setModalOpen(true)} />
          ))}
        </div>
      )}

      <LoginRequiredModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
