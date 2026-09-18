import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { createContest } from '../utils/appData.js'
import { createContestRemoteFirst } from '../utils/contestApi.js'
import {
  createProblemRemote,
  addProblemTestCasesRemote,
  addProblemLanguagesRemote,
  addPreloadedCodeRemote,
} from '../utils/problemApi.js'
const types = ['Debugging Challenge', 'DSA Battle', 'Frontend / React', 'SQL Clash', 'Java Championship', 'Custom']
const difficulties = ['Easy', 'Medium', 'Hard']
const allLanguages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'SQL']
const PROBLEM_LANGUAGE_IDS = {
  JavaScript: 'javascript',
  Python: 'python',
  Java: 'java',
  'C++': 'cpp',
}
const DEFAULT_BOILERPLATES = {
  JavaScript: `// JavaScript Starter Template
function solution(input) {
  // Write your code here
  return input;
}
`,
  Python: `# Python Starter Template
def solution(input_data):
    # Write your code here
    pass
`,
  Java: `// Java Starter Template
import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        // Write your code here
    }
}
`,
  'C++': `// C++ Starter Template
#include <iostream>
using namespace std;

int main() {
    // Write your code here
    return 0;
}
`,
}
const banners = [
  {
    id: 'from-accent to-accent-soft',
    label: 'Orange',
  },
  {
    id: 'from-ink to-ink-soft',
    label: 'Dark',
  },
  {
    id: 'from-accent-soft to-accent',
    label: 'Peach',
  },
  {
    id: 'from-ink-soft to-accent',
    label: 'Slate',
  },
]
function emptyProblem() {
  return {
    title: '',
    statement: '',
    difficulty: 'Medium',
    constraints: '',
    testCases: [
      { input: '', output: '' },
    ],
    codeTemplates: {},
  }
}
export default function CreateContest() {
  const user = useSelector((s) => s.auth.user)
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    tagline: '',
    type: types[0],
    difficulty: 'Medium',
    startDateTime: '',
    endDateTime: '',
    prizePool: '',
    totalPoints: 500,
    visibility: 'public',
    isProtected: false,
    password: '',
    languages: ['JavaScript'],
    banner: banners[0].id,
  })
  const [problems, setProblems] = useState([emptyProblem()])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-5 py-24 text-center">
        <h1 className="font-display font-bold text-2xl text-ink mb-2">Login required</h1>
        <p className="text-sm text-ink-soft mb-6">Create an account to host your own contest.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover"
        >
          Go to login
        </button>
      </div>
    )
  }
  const update = (field) => (e) =>
    setForm((f) => ({
      ...f,
      [field]: e.target.value,
    }))
  const toggleLanguage = (lang) => {
    setForm((f) => ({
      ...f,
      languages: f.languages.includes(lang) ? f.languages.filter((l) => l !== lang) : [...f.languages, lang],
    }))
  }
  const updateProblem = (idx, field, value) => {
    setProblems((ps) =>
      ps.map((p, i) =>
        i === idx
          ? {
              ...p,
              [field]: value,
            }
          : p
      )
    )
  }
  const addProblem = () => setProblems((ps) => [...ps, emptyProblem()])
  const removeProblem = (idx) => setProblems((ps) => ps.filter((_, i) => i !== idx))

  const addTestCase = (problemIdx) => {
    setProblems((ps) =>
      ps.map((p, i) =>
        i === problemIdx
          ? { ...p, testCases: [...(p.testCases || []), { input: '', output: '' }] }
          : p
      )
    )
  }

  const removeTestCase = (problemIdx, tcIdx) => {
    setProblems((ps) =>
      ps.map((p, i) =>
        i === problemIdx
          ? { ...p, testCases: (p.testCases || []).filter((_, ti) => ti !== tcIdx) }
          : p
      )
    )
  }

  const updateTestCase = (problemIdx, tcIdx, field, value) => {
    setProblems((ps) =>
      ps.map((p, i) =>
        i === problemIdx
          ? {
              ...p,
              testCases: (p.testCases || []).map((tc, ti) =>
                ti === tcIdx ? { ...tc, [field]: value } : tc
              ),
            }
          : p
      )
    )
  }

  const [activeTemplateTabs, setActiveTemplateTabs] = useState({})

  const updateCodeTemplate = (problemIdx, langName, code) => {
    setProblems((ps) =>
      ps.map((p, i) =>
        i === problemIdx
          ? {
              ...p,
              codeTemplates: {
                ...(p.codeTemplates || {}),
                [langName]: code,
              },
            }
          : p
      )
    )
  }

  const setTemplateTab = (problemIdx, langName) => {
    setActiveTemplateTabs((prev) => ({ ...prev, [problemIdx]: langName }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) return setError('Give your contest a name.')
    if (!form.startDateTime) return setError('Pick a start time.')
    if (!form.endDateTime) return setError('Pick an end time.')
    if (form.languages.length === 0) return setError('Select at least one allowed language.')
    if (form.isProtected && !form.password.trim()) return setError('Set a password, or turn off password protection.')
    const startTime = new Date(form.startDateTime)
    const endTime = new Date(form.endDateTime)
    if (Number.isNaN(startTime.getTime())) return setError('Invalid start time.')
    if (Number.isNaN(endTime.getTime())) return setError('Invalid end time.')
    if (endTime.getTime() <= startTime.getTime()) return setError('End time must be after the start time.')
    setSubmitting(true)
    const remoteResult = await createContestRemoteFirst({
      title: form.name.trim(),
      description: form.tagline.trim() || 'A contest hosted by a fellow coder.',
      contentType: 'contest',
      visibility: form.visibility,
      startingFrom: startTime.toISOString(),
      endingAt: endTime.toISOString(),
      totalPoints: Number(form.totalPoints) || 0,
      isProtected: form.isProtected,
      password: form.isProtected ? form.password.trim() : undefined,
      languages: form.languages,
    })
    setSubmitting(false)
    if (remoteResult.contest) {
      const languageIds = form.languages.map((l) => PROBLEM_LANGUAGE_IDS[l]).filter(Boolean)
      for (const p of problems.filter((p) => p.title.trim() && p.statement.trim())) {
        const constraintsArr = (p.constraints || '')
          .split('\n')
          .map((c) => c.trim())
          .filter(Boolean)
        const created = await createProblemRemote(remoteResult.contest.id, {
          title: p.title.trim(),
          statement: p.statement.trim(),
          difficulty: (p.difficulty || form.difficulty).toLowerCase(),
          tags: [],
          constraints: constraintsArr.length ? constraintsArr : ['1 <= n <= 10^5'],
        })
        if (!created.problem) continue
        const validTestCases = (p.testCases || [])
          .map((tc) => ({ input: tc.input.trim(), output: tc.output.trim() }))
          .filter((tc) => tc.input && tc.output)
        if (validTestCases.length > 0) {
          await addProblemTestCasesRemote(remoteResult.contest.id, created.problem.id, validTestCases)
        }
        if (languageIds.length) {
          await addProblemLanguagesRemote(remoteResult.contest.id, created.problem.id, languageIds)
        }
        // Save code templates for supported languages
        if (p.codeTemplates && typeof p.codeTemplates === 'object') {
          for (const [langName, code] of Object.entries(p.codeTemplates)) {
            const langId = PROBLEM_LANGUAGE_IDS[langName]
            if (langId && languageIds.includes(langId) && code && code.trim()) {
              await addPreloadedCodeRemote(remoteResult.contest.id, created.problem.id, langId, code.trim())
            }
          }
        }
      }
      navigate(`/contests/${remoteResult.contest.id}`)
      return
    }
    const durationMins = Math.round((endTime.getTime() - startTime.getTime()) / 60000)
    const contest = createContest(
      {
        name: form.name.trim(),
        tagline: form.tagline.trim() || 'A contest hosted by a fellow coder.',
        type: form.type,
        difficulty: form.difficulty,
        duration: durationMins >= 60 ? `${Math.round((durationMins / 60) * 10) / 10} hr` : `${durationMins} min`,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        entryFee: 'Free',
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
      <p className="text-sm text-ink-soft mb-8">
        Build a debugging round, DSA battle, or any format you like. Live instantly once created.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="px-4 py-2.5 rounded-2xl bg-danger/10 border border-danger/30 text-sm text-danger">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-ink-soft block mb-1.5">Contest name</label>
            <input
              value={form.name}
              onChange={update('name')}
              placeholder="Midnight Debugging Sprint"
              className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-soft block mb-1.5">Type</label>
            <select
              value={form.type}
              onChange={update('type')}
              className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent-soft"
            >
              {types.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-ink-soft block mb-1.5">Tagline / description</label>
          <textarea
            value={form.tagline}
            onChange={update('tagline')}
            rows={2}
            placeholder="Fix planted bugs across 5 files before the timer runs out."
            className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent-soft"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-ink-soft block mb-1.5">Difficulty</label>
            <select
              value={form.difficulty}
              onChange={update('difficulty')}
              className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent-soft"
            >
              {difficulties.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-soft block mb-1.5">Prize pool (optional)</label>
            <input
              value={form.prizePool}
              onChange={update('prizePool')}
              placeholder="₹500 or bragging rights"
              className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-ink-soft block mb-1.5">Total points</label>
            <input
              type="number"
              min={0}
              value={form.totalPoints}
              onChange={update('totalPoints')}
              className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-soft block mb-1.5">Visibility</label>
            <select
              value={form.visibility}
              onChange={update('visibility')}
              className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent-soft"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-soft block mb-1.5">Password protect</label>
            <div className="flex items-center gap-2 h-[42px]">
              <button
                type="button"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    isProtected: !f.isProtected,
                  }))
                }
                className={`w-12 h-7 rounded-full transition-colors relative ${form.isProtected ? 'bg-accent' : 'bg-border'}`}
              >
                <span
                  className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${form.isProtected ? 'translate-x-[22px]' : 'left-0.5'}`}
                />
              </button>
              {form.isProtected && (
                <input
                  value={form.password}
                  onChange={update('password')}
                  placeholder="Contest password"
                  className="flex-1 px-3 py-2 rounded-xl border border-border text-sm"
                />
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-ink-soft block mb-1.5">Start time</label>
            <input
              type="datetime-local"
              value={form.startDateTime}
              onChange={update('startDateTime')}
              className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-ink-soft block mb-1.5">End time</label>
            <input
              type="datetime-local"
              value={form.endDateTime}
              min={form.startDateTime || undefined}
              onChange={update('endDateTime')}
              className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-ink-soft block mb-1.5">Allowed languages</label>
          <div className="flex flex-wrap gap-2">
            {allLanguages.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => toggleLanguage(l)}
                className={`px-3 py-1.5 rounded-2xl text-xs font-medium border ${form.languages.includes(l) ? 'bg-accent text-white border-accent' : 'border-border text-ink-soft hover:bg-bg-soft'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-ink-soft block mb-1.5">Banner style</label>
          <div className="flex gap-2">
            {banners.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() =>
                  setForm((f) => ({
                    ...f,
                    banner: b.id,
                  }))
                }
                className={`h-10 w-16 rounded-xl bg-gradient-to-br ${b.id} border-2 ${form.banner === b.id ? 'border-ink' : 'border-transparent'}`}
                title={b.label}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-ink-soft">Problems</label>
            <button type="button" onClick={addProblem} className="text-xs font-semibold text-accent hover:underline">
              + Add problem
            </button>
          </div>
          <div className="space-y-4">
            {problems.map((p, idx) => {
              const templateLangs = form.languages.filter((l) => PROBLEM_LANGUAGE_IDS[l])
              const currentActiveLang = activeTemplateTabs[idx] || templateLangs[0] || ''
              const configuredTemplatesCount = templateLangs.filter((l) => Boolean((p.codeTemplates?.[l] || '').trim())).length

              return (
              <div key={idx} className="border border-border rounded-2xl p-5 space-y-3 bg-white shadow-soft">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-accent/10 text-accent font-bold text-xs grid place-items-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-ink">Problem #{idx + 1}</span>
                  </div>
                  {problems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProblem(idx)}
                      className="text-xs text-danger hover:underline font-semibold"
                    >
                      ✕ Remove Problem
                    </button>
                  )}
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-ink-soft block mb-1">Title</label>
                    <input
                      value={p.title}
                      onChange={(e) => updateProblem(idx, 'title', e.target.value)}
                      placeholder="e.g. Invert Binary Tree"
                      className="w-full px-3.5 py-2 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-soft block mb-1">Difficulty</label>
                    <select
                      value={p.difficulty || form.difficulty}
                      onChange={(e) => updateProblem(idx, 'difficulty', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent-soft"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-soft block mb-1">Problem Statement</label>
                  <textarea
                    value={p.statement}
                    onChange={(e) => updateProblem(idx, 'statement', e.target.value)}
                    rows={3}
                    placeholder="Describe the problem, input format, and output expectations..."
                    className="w-full px-3.5 py-2 rounded-xl border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent-soft"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-soft block mb-1">Constraints</label>
                  <textarea
                    value={p.constraints}
                    onChange={(e) => updateProblem(idx, 'constraints', e.target.value)}
                    rows={2}
                    placeholder={'1 <= n <= 10^5\n-1000 <= arr[i] <= 1000'}
                    className="w-full px-3.5 py-2 rounded-xl border border-border text-xs font-mono resize-none focus:outline-none focus:ring-2 focus:ring-accent-soft"
                  />
                </div>

                {/* Multi-TestCase Section */}
                <div className="pt-2 border-t border-border/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-ink">Test Cases</span>
                      <span className="text-[11px] text-ink-soft ml-1.5 font-normal">
                        ({(p.testCases || []).length} case{(p.testCases || []).length === 1 ? '' : 's'})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => addTestCase(idx)}
                      className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1"
                    >
                      + Add Test Case
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {(p.testCases || []).map((tc, tcIdx) => (
                      <div key={tcIdx} className="border border-border/80 rounded-xl p-3 bg-bg-soft/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-ink-soft">Test Case #{tcIdx + 1}</span>
                          {(p.testCases || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTestCase(idx, tcIdx)}
                              className="text-[11px] text-danger hover:underline font-medium"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="text-[10px] font-mono text-ink-soft block mb-1">Input</label>
                            <textarea
                              rows={2}
                              value={tc.input}
                              onChange={(e) => updateTestCase(idx, tcIdx, 'input', e.target.value)}
                              placeholder="Input values"
                              className="w-full px-2.5 py-1.5 rounded-lg border border-border text-xs font-mono resize-none bg-white focus:outline-none focus:ring-1 focus:ring-accent-soft"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono text-ink-soft block mb-1">Expected Output</label>
                            <textarea
                              rows={2}
                              value={tc.output}
                              onChange={(e) => updateTestCase(idx, tcIdx, 'output', e.target.value)}
                              placeholder="Expected output"
                              className="w-full px-2.5 py-1.5 rounded-lg border border-border text-xs font-mono resize-none bg-white focus:outline-none focus:ring-1 focus:ring-accent-soft"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Code Templates (Starter Code) Section */}
                <div className="pt-3 border-t border-border/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-ink">Code Templates (Starter Code)</span>
                      <span className="text-[11px] text-ink-soft ml-1.5 font-normal">
                        (Pre-loaded code for participants)
                      </span>
                    </div>
                    {configuredTemplatesCount > 0 && (
                      <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        {configuredTemplatesCount} template{configuredTemplatesCount > 1 ? 's' : ''} configured
                      </span>
                    )}
                  </div>

                  {templateLangs.length === 0 ? (
                    <div className="text-xs text-ink-soft bg-bg-soft/40 p-3 rounded-xl border border-border/60">
                      Select supported languages (JavaScript, Python, Java, C++) in the contest settings above to provide starter code templates.
                    </div>
                  ) : (
                    <div className="bg-bg-soft/30 border border-border/80 rounded-xl p-3 space-y-3">
                      {/* Language Selection Tabs */}
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                        {templateLangs.map((lang) => {
                          const hasTemplate = Boolean((p.codeTemplates?.[lang] || '').trim())
                          const isActive = currentActiveLang === lang
                          return (
                            <button
                              key={lang}
                              type="button"
                              onClick={() => setTemplateTab(idx, lang)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                isActive
                                  ? 'bg-ink text-white shadow-sm'
                                  : 'bg-white text-ink-soft hover:text-ink border border-border/80 hover:border-ink/20'
                              }`}
                            >
                              <span>{lang}</span>
                              {hasTemplate && (
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    isActive ? 'bg-accent' : 'bg-emerald-500'
                                  }`}
                                  title="Template provided"
                                />
                              )}
                            </button>
                          )
                        })}
                      </div>

                      {/* Code Area for currentActiveLang */}
                      {currentActiveLang && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-ink-soft">
                              <strong className="text-ink font-semibold">{currentActiveLang}</strong> starter code:
                              {(p.codeTemplates?.[currentActiveLang] || '').trim() ? (
                                <span className="text-emerald-600 ml-1.5 font-medium">● Configured</span>
                              ) : (
                                <span className="text-ink-soft/70 ml-1.5 font-normal">(Empty — participant will get generic skeleton)</span>
                              )}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  updateCodeTemplate(
                                    idx,
                                    currentActiveLang,
                                    DEFAULT_BOILERPLATES[currentActiveLang] || `// Starter code for ${currentActiveLang}\n`
                                  )
                                }
                                className="text-accent hover:underline font-semibold"
                              >
                                Insert boilerplate
                              </button>
                              {(p.codeTemplates?.[currentActiveLang] || '').trim() && (
                                <button
                                  type="button"
                                  onClick={() => updateCodeTemplate(idx, currentActiveLang, '')}
                                  className="text-danger hover:underline font-medium"
                                >
                                  Clear
                                </button>
                              )}
                            </div>
                          </div>

                          <textarea
                            rows={6}
                            value={p.codeTemplates?.[currentActiveLang] || ''}
                            onChange={(e) => updateCodeTemplate(idx, currentActiveLang, e.target.value)}
                            placeholder={`// Starter code for ${currentActiveLang} participants...\n// If left empty, participant will get the platform default skeleton.`}
                            className="w-full px-3 py-2.5 text-xs font-mono bg-slate-900 text-slate-100 placeholder-slate-500 rounded-xl border border-slate-700 resize-y focus:outline-none focus:ring-2 focus:ring-accent-soft leading-relaxed"
                            spellCheck={false}
                          />
                          <p className="text-[10px] text-ink-soft">
                            Participants will see this code pre-loaded when they select {currentActiveLang} in the contest editor.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              )
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-2xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover shadow-lift disabled:opacity-60"
        >
          {submitting ? 'Publishing…' : 'Publish contest'}
        </button>
      </form>
    </div>
  )
}