import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { createContest } from '../utils/appData.js'

const types = ['Debugging Challenge', 'DSA Battle', 'Frontend / React', 'SQL Clash', 'Java Championship', 'Custom']
const difficulties = ['Easy', 'Medium', 'Hard']
const allLanguages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'SQL']
const banners = [
  { id: 'from-accent to-accent-soft', label: 'Orange' },
  { id: 'from-ink to-ink-soft', label: 'Dark' },
  { id: 'from-accent-soft to-accent', label: 'Peach' },
  { id: 'from-ink-soft to-accent', label: 'Slate' },
]

function emptyProblem() {
  return { title: '', statement: '', sampleInput: '', sampleOutput: '' }
}

export default function CreateContest() {
  const user = useSelector((s) => s.auth.user)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    tagline: '',
    type: types[0],
    difficulty: 'Medium',
    durationMinutes: 60,
    startDate: '',
    startTimeOfDay: '18:00',
    entryFeeType: 'free', // free | points
    entryFeePoints: 0,
    prizePool: '',
    languages: ['JavaScript'],
    banner: banners[0].id,
  })
  const [problems, setProblems] = useState([emptyProblem()])
  const [error, setError] = useState('')

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-5 py-24 text-center">
        <h1 className="font-display font-bold text-2xl text-ink mb-2">Login required</h1>
        <p className="text-sm text-ink-soft mb-6">Create an account to host your own contest.</p>
        <button onClick={() => navigate('/login')} className="px-6 py-2.5 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover">
          Go to login
        </button>
      </div>
    )
  }

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const toggleLanguage = (lang) => {
    setForm((f) => ({
      ...f,
      languages: f.languages.includes(lang) ? f.languages.filter((l) => l !== lang) : [...f.languages, lang],
    }))
  }

  const updateProblem = (idx, field, value) => {
    setProblems((ps) => ps.map((p, i) => (i === idx ? { ...p, [field]: value } : p)))
  }
  const addProblem = () => setProblems((ps) => [...ps, emptyProblem()])
  const removeProblem = (idx) => setProblems((ps) => ps.filter((_, i) => i !== idx))

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim()) return setError('Give your contest a name.')
    if (!form.startDate) return setError('Pick a start date.')
    if (form.languages.length === 0) return setError('Select at least one allowed language.')

    const startTime = new Date(`${form.startDate}T${form.startTimeOfDay}:00`)
    if (Number.isNaN(startTime.getTime())) return setError('Invalid start date/time.')

    const contest = createContest(
      {
        name: form.name.trim(),
        tagline: form.tagline.trim() || 'A contest hosted by a fellow coder.',
        type: form.type,
        difficulty: form.difficulty,
        duration: `${form.durationMinutes} min`,
        startTime: startTime.toISOString(),
        entryFee: form.entryFeeType === 'free' ? 'Free' : `${form.entryFeePoints} pts`,
        prizePool: form.prizePool.trim() || 'Bragging rights + leaderboard points',
        languages: form.languages,
        problems: problems.filter((p) => p.title.trim()),
        banner: form.banner,
      },
      user.username
    )

    navigate(`/contests/${contest.id}`)
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-14">
      <h1 className="font-display font-bold text-2xl md:text-3xl text-ink mb-1">Host your own contest</h1>
      <p className="text-sm text-ink-soft mb-8">Build a debugging round, DSA battle, or any format you like. Live instantly once created.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="px-4 py-2.5 rounded-2xl bg-danger/10 border border-danger/30 text-sm text-danger">{error}</div>}

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-ink-soft block mb-1.5">Contest name</label>
            <input value={form.name} onChange={update('name')} placeholder="Midnight Debugging Sprint" className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft" />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-soft block mb-1.5">Type</label>
            <select value={form.type} onChange={update('type')} className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent-soft">
              {types.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-ink-soft block mb-1.5">Tagline / description</label>
          <textarea value={form.tagline} onChange={update('tagline')} rows={2} placeholder="Fix planted bugs across 5 files before the timer runs out." className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent-soft" />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-ink-soft block mb-1.5">Difficulty</label>
            <select value={form.difficulty} onChange={update('difficulty')} className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent-soft">
              {difficulties.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-soft block mb-1.5">Duration (minutes)</label>
            <input type="number" min={5} value={form.durationMinutes} onChange={update('durationMinutes')} className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft" />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-soft block mb-1.5">Prize pool (optional)</label>
            <input value={form.prizePool} onChange={update('prizePool')} placeholder="₹500 or bragging rights" className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-ink-soft block mb-1.5">Start date</label>
            <input type="date" value={form.startDate} onChange={update('startDate')} className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft" />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-soft block mb-1.5">Start time</label>
            <input type="time" value={form.startTimeOfDay} onChange={update('startTimeOfDay')} className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft" />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-ink-soft block mb-1.5">Entry fee</label>
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={form.entryFeeType === 'free'} onChange={() => setForm((f) => ({ ...f, entryFeeType: 'free' }))} className="accent-accent" /> Free
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={form.entryFeeType === 'points'} onChange={() => setForm((f) => ({ ...f, entryFeeType: 'points' }))} className="accent-accent" /> Points entry
            </label>
            {form.entryFeeType === 'points' && (
              <input type="number" min={0} value={form.entryFeePoints} onChange={update('entryFeePoints')} className="w-28 px-3 py-2 rounded-xl border border-border text-sm" placeholder="pts" />
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-ink-soft block mb-1.5">Allowed languages</label>
          <div className="flex flex-wrap gap-2">
            {allLanguages.map((l) => (
              <button key={l} type="button" onClick={() => toggleLanguage(l)} className={`px-3 py-1.5 rounded-2xl text-xs font-medium border ${form.languages.includes(l) ? 'bg-accent text-white border-accent' : 'border-border text-ink-soft hover:bg-bg-soft'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-ink-soft block mb-1.5">Banner style</label>
          <div className="flex gap-2">
            {banners.map((b) => (
              <button key={b.id} type="button" onClick={() => setForm((f) => ({ ...f, banner: b.id }))} className={`h-10 w-16 rounded-xl bg-gradient-to-br ${b.id} border-2 ${form.banner === b.id ? 'border-ink' : 'border-transparent'}`} title={b.label} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-ink-soft">Problems</label>
            <button type="button" onClick={addProblem} className="text-xs font-semibold text-accent hover:underline">+ Add problem</button>
          </div>
          <div className="space-y-4">
            {problems.map((p, idx) => (
              <div key={idx} className="border border-border rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink-soft">Problem {idx + 1}</span>
                  {problems.length > 1 && (
                    <button type="button" onClick={() => removeProblem(idx)} className="text-xs text-danger hover:underline">Remove</button>
                  )}
                </div>
                <input value={p.title} onChange={(e) => updateProblem(idx, 'title', e.target.value)} placeholder="Problem title" className="w-full px-3 py-2 rounded-xl border border-border text-sm" />
                <textarea value={p.statement} onChange={(e) => updateProblem(idx, 'statement', e.target.value)} rows={2} placeholder="Problem statement" className="w-full px-3 py-2 rounded-xl border border-border text-sm resize-none" />
                <div className="grid grid-cols-2 gap-2">
                  <input value={p.sampleInput} onChange={(e) => updateProblem(idx, 'sampleInput', e.target.value)} placeholder="Sample input" className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono" />
                  <input value={p.sampleOutput} onChange={(e) => updateProblem(idx, 'sampleOutput', e.target.value)} placeholder="Sample output" className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full py-3 rounded-2xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover shadow-lift">
          Publish contest
        </button>
      </form>
    </div>
  )
}
