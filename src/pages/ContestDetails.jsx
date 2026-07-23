import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { contests } from '../data/mockData.js'
import LoginRequiredModal from '../components/LoginRequiredModal.jsx'

export default function ContestDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const contest = contests.find((c) => c.id === id) || contests[0]

  return (
    <div className="max-w-5xl mx-auto px-5 py-14">
      <button onClick={() => navigate(-1)} className="text-sm text-ink-soft hover:text-accent mb-6">← Back</button>

      <div className={`h-40 md:h-56 rounded-2xl bg-gradient-to-br ${contest.banner} flex items-end p-6 mb-8`}>
        <h1 className="font-display font-extrabold text-2xl md:text-4xl text-white drop-shadow">{contest.name}</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="font-display font-bold text-xl text-ink mb-3">Description</h2>
            <p className="text-ink-soft text-sm leading-relaxed">{contest.tagline} Solve a curated set of problems, submit within the time window, and climb the live leaderboard. Partial scoring is awarded per test case passed.</p>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-ink mb-3">Rules</h2>
            <ul className="text-sm text-ink-soft space-y-2 list-disc pl-5">
              <li>Plagiarism of any kind results in disqualification.</li>
              <li>Multiple submissions are allowed; only the best scoring submission counts.</li>
              <li>Use of AI assistants during the contest is not permitted unless stated otherwise.</li>
              <li>Ties are broken by earliest submission time.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-ink mb-3">Timeline</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-border pb-2"><span className="text-ink-soft">Registration closes</span><span className="font-medium text-ink">2 hrs before start</span></div>
              <div className="flex justify-between border-b border-border pb-2"><span className="text-ink-soft">Contest duration</span><span className="font-medium text-ink">{contest.duration}</span></div>
              <div className="flex justify-between"><span className="text-ink-soft">Results announced</span><span className="font-medium text-ink">Within 24 hrs</span></div>
            </div>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-ink mb-3">Discussion</h2>
            <div className="border border-border rounded-2xl p-5 text-sm text-ink-soft">
              Join the discussion after the contest ends — top solutions and editorial walkthroughs will be posted here.
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="border border-border rounded-2xl p-5 bg-bg-soft space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-ink-soft">Difficulty</span><span className="font-semibold text-ink">{contest.difficulty}</span></div>
            <div className="flex justify-between"><span className="text-ink-soft">Prize Pool</span><span className="font-semibold text-accent">{contest.prizePool}</span></div>
            <div className="flex justify-between"><span className="text-ink-soft">Entry Fee</span><span className="font-semibold text-ink">{contest.entryFee}</span></div>
            <div className="flex justify-between"><span className="text-ink-soft">Participants</span><span className="font-semibold text-ink">{contest.participants.toLocaleString('en-IN')}</span></div>
            <div>
              <span className="text-ink-soft block mb-1">Languages Allowed</span>
              <div className="flex flex-wrap gap-1.5">
                {contest.languages.map((l) => (
                  <span key={l} className="px-2 py-1 rounded-full bg-white border border-border text-xs">{l}</span>
                ))}
              </div>
            </div>
            <button onClick={() => setModalOpen(true)} className="w-full py-2.5 rounded-2xl bg-accent text-white font-semibold hover:bg-accent-hover mt-2">
              Register Now
            </button>
          </div>

          <div className="border border-border rounded-2xl p-5 text-sm">
            <h3 className="font-display font-semibold text-ink mb-2">Related Contests</h3>
            <ul className="space-y-2">
              {contests.filter((c) => c.id !== contest.id).slice(0, 3).map((c) => (
                <li key={c.id}>
                  <Link to={`/contests/${c.id}`} className="text-ink-soft hover:text-accent">{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <LoginRequiredModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
