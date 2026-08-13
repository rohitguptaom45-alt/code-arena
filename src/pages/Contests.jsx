import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ContestCard from '../components/ContestCard.jsx'
import LoginRequiredModal from '../components/LoginRequiredModal.jsx'
import { contests as mockContests } from '../data/mockData.js'
import { getAllContests, registerForContest } from '../utils/appData.js'
import { fetchContestsRemoteFirst, joinContestRemoteFirst } from '../utils/contestApi.js'
const filters = ['All', 'Easy', 'Medium', 'Hard']
export default function Contests() {
  const user = useSelector((s) => s.auth.user)
  const [active, setActive] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [remoteContests, setRemoteContests] = useState([])
  useEffect(() => {
    fetchContestsRemoteFirst().then((res) => setRemoteContests(res.contests))
  }, [])
  const allContests = useMemo(() => {
    const local = getAllContests(mockContests)
    const remoteIds = new Set(remoteContests.map((c) => c.id))
    return [...remoteContests, ...local.filter((c) => !remoteIds.has(c.id))]
  }, [remoteContests])
  const filtered = useMemo(() => {
    return allContests.filter((c) => {
      const matchesDifficulty = active === 'All' || c.difficulty === active
      const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase())
      return matchesDifficulty && matchesQuery
    })
  }, [allContests, active, query])
  const handleRegister = async (contest) => {
    if (!user) {
      setModalOpen(true)
      return
    }
    if (contest.remote) {
      await joinContestRemoteFirst(contest.id)
    }
    registerForContest(contest.id, user.username)
  }
  return (
    <div className="max-w-7xl mx-auto px-5 py-14">
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-ink">All Contests</h1>
          <p className="text-ink-soft mt-2 text-sm">Browse live, upcoming, and practice contests — or host your own.</p>
        </div>
        <Link
          to="/contests/create"
          className="px-5 py-2.5 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover shadow-soft whitespace-nowrap"
        >
          + Create Contest
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-8">
        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-4 py-2 rounded-2xl text-sm font-medium border transition-colors ${active === f ? 'bg-accent text-white border-accent' : 'border-border text-ink-soft hover:bg-bg-soft'}`}
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
            <ContestCard key={c.id} contest={c} onRegister={handleRegister} />
          ))}
        </div>
      )}

      <LoginRequiredModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
