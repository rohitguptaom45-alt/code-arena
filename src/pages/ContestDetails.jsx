import React, { useMemo, useState } from 'react'
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { contests as mockContests } from '../data/mockData.js'
import { getAllContests, registerForContest, isRegistered, deleteContest } from '../utils/appData.js'
import LoginRequiredModal from '../components/LoginRequiredModal.jsx'

export default function ContestDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const refBy = searchParams.get('ref')
  const user = useSelector((s) => s.auth.user)
  const [modalOpen, setModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [registered, setRegistered] = useState(false)

  const allContests = useMemo(() => getAllContests(mockContests), [])
  const contest = allContests.find((c) => c.id === id) || allContests[0]
  const alreadyRegistered = user ? isRegistered(contest.id, user.username) || registered : false

  const handleRegister = () => {
    if (!user) {
      setModalOpen(true)
      return
    }
    const result = registerForContest(contest.id, user.username, refBy)
    if (!result.error) setRegistered(true)
  }

  const handleInvite = async () => {
    const link = `${window.location.origin}/contests/${contest.id}?ref=${user?.username || ''}`
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      window.prompt('Copy your invite link:', link)
    }
  }

  const handleDelete = () => {
    if (!user || !window.confirm('Delete this contest permanently?')) return
    const result = deleteContest(contest.id, user.username)
    if (!result.error) navigate('/contests')
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-14">
      <button onClick={() => navigate(-1)} className="text-sm text-ink-soft hover:text-accent mb-6">← Back</button>

      <div className={`h-40 md:h-56 rounded-2xl bg-gradient-to-br ${contest.banner} flex items-end p-6 mb-8`}>
        <h1 className="font-display font-extrabold text-2xl md:text-4xl text-white drop-shadow">{contest.name}</h1>
      </div>

      {refBy && !alreadyRegistered && (
        <div className="mb-6 px-4 py-2.5 rounded-2xl bg-success/10 border border-success/30 text-sm text-success">
          🎉 Invited by <strong>@{refBy}</strong> — register and you'll both earn bonus points.
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="font-display font-bold text-xl text-ink mb-3">Description</h2>
            <p className="text-ink-soft text-sm leading-relaxed">{contest.tagline} Solve a curated set of problems, submit within the time window, and climb the live leaderboard. Partial scoring is awarded per test case passed.</p>
            {contest.isCustom && (
              <p className="text-xs text-ink-soft/70 mt-2">Hosted by @{contest.createdBy}</p>
            )}
          </section>

          {contest.isCustom && contest.problems?.length > 0 && (
            <section>
              <h2 className="font-display font-bold text-xl text-ink mb-3">Problems</h2>
              <div className="space-y-3">
                {contest.problems.map((p, i) => (
                  <div key={i} className="border border-border rounded-2xl p-4">
                    <h3 className="font-semibold text-sm text-ink mb-1">{i + 1}. {p.title}</h3>
                    {p.statement && <p className="text-sm text-ink-soft mb-2">{p.statement}</p>}
                    {(p.sampleInput || p.sampleOutput) && (
                      <div className="font-mono text-xs bg-muted rounded-xl p-3">
                        {p.sampleInput && <div>Input: {p.sampleInput}</div>}
                        {p.sampleOutput && <div>Output: {p.sampleOutput}</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

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

            {alreadyRegistered ? (
              <button disabled className="w-full py-2.5 rounded-2xl bg-success/10 text-success font-semibold mt-2 cursor-default">
                ✅ Registered
              </button>
            ) : (
              <button onClick={handleRegister} className="w-full py-2.5 rounded-2xl bg-accent text-white font-semibold hover:bg-accent-hover mt-2">
                Register Now
              </button>
            )}

            <button onClick={handleInvite} className="w-full py-2.5 rounded-2xl border border-border font-semibold text-ink hover:bg-white">
              {copied ? '✅ Link copied!' : '🔗 Invite Friends'}
            </button>

            {user && contest.isCustom && contest.createdBy === user.username && (
              <button onClick={handleDelete} className="w-full py-2 rounded-2xl text-xs text-danger hover:underline">
                Delete this contest
              </button>
            )}
          </div>

          <div className="border border-border rounded-2xl p-5 text-sm">
            <h3 className="font-display font-semibold text-ink mb-2">Related Contests</h3>
            <ul className="space-y-2">
              {allContests.filter((c) => c.id !== contest.id).slice(0, 3).map((c) => (
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
