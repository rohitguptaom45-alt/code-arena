import React, { useState } from 'react'
import {
  updateContestDetailsRemoteFirst,
  updateContestTimeRemoteFirst,
  changeContestPasswordRemoteFirst,
  cancelContestRemoteFirst,
  deleteContestRemoteFirst,
} from '../utils/contestApi.js'
import {
  createProblemRemote,
  addProblemTestCasesRemote,
  addProblemLanguagesRemote,
  addPreloadedCodeRemote,
  deleteProblemRemote,
} from '../utils/problemApi.js'

const allLanguages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'SQL', 'Go', 'Rust']

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

function toLocalDatetimeString(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function emptyTestCase() {
  return { input: '', output: '' }
}

function emptyNewProblem() {
  return {
    title: '',
    statement: '',
    difficulty: 'medium',
    constraints: '',
    testCases: [emptyTestCase()],
    codeTemplates: {},
  }
}

export default function EditContestModal({
  open,
  onClose,
  contest,
  problems = [],
  onUpdated,
  onDeleted,
}) {
  const [activeTab, setActiveTab] = useState('details')
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })

  // Form states
  const [detailsForm, setDetailsForm] = useState(() => ({
    title: contest?.name || '',
    description: contest?.tagline || '',
    visibility: contest?.visibility || 'public',
    totalPoints: contest?.totalPoints ?? 500,
    languages: Array.isArray(contest?.languages) ? contest.languages.filter(l => l !== 'Any') : ['JavaScript'],
    isProtected: Boolean(contest?.isProtected),
    password: '',
  }))

  const [scheduleForm, setScheduleForm] = useState(() => ({
    startingFrom: toLocalDatetimeString(contest?.startingFrom),
    endingAt: toLocalDatetimeString(contest?.endingAt),
  }))

  const [passwordForm, setPasswordForm] = useState({
    password: '',
  })

  // Add Problem form
  const [newProblem, setNewProblem] = useState(emptyNewProblem())
  const [newProblemActiveTab, setNewProblemActiveTab] = useState('')
  // Quick add testcase to existing problem
  const [targetProblemId, setTargetProblemId] = useState(null)
  const [extraTestCases, setExtraTestCases] = useState([emptyTestCase()])
  // Quick add starter code to existing problem
  const [targetCodeProblemId, setTargetCodeProblemId] = useState(null)
  const [extraCodeMap, setExtraCodeMap] = useState({})
  const [extraCodeActiveLang, setExtraCodeActiveLang] = useState('')

  if (!open || !contest) return null

  const clearFeedback = () => setFeedback({ type: '', message: '' })

  const toggleLanguage = (lang) => {
    setDetailsForm((f) => {
      const langs = f.languages.includes(lang)
        ? f.languages.filter((l) => l !== lang)
        : [...f.languages, lang]
      return { ...f, languages: langs }
    })
  }

  // Handle saving details
  const handleSaveDetails = async (e) => {
    e.preventDefault()
    clearFeedback()
    if (!detailsForm.title.trim()) {
      setFeedback({ type: 'error', message: 'Title cannot be empty.' })
      return
    }
    if (detailsForm.languages.length === 0) {
      setFeedback({ type: 'error', message: 'Please select at least one allowed language.' })
      return
    }

    setBusy(true)
    const payload = {
      title: detailsForm.title.trim(),
      description: detailsForm.description.trim(),
      visibility: detailsForm.visibility,
      totalPoints: Number(detailsForm.totalPoints) || 0,
      languages: detailsForm.languages,
      isProtected: detailsForm.isProtected,
    }
    if (detailsForm.isProtected && detailsForm.password.trim()) {
      payload.password = detailsForm.password.trim()
    }
    const res = await updateContestDetailsRemoteFirst(contest.id, payload)
    setBusy(false)

    if (res.error) {
      setFeedback({ type: 'error', message: res.error })
    } else {
      setFeedback({ type: 'success', message: 'Contest details updated successfully!' })
      onUpdated?.(res.contest)
    }
  }

  // Handle saving schedule
  const handleSaveSchedule = async (e) => {
    e.preventDefault()
    clearFeedback()
    if (!scheduleForm.startingFrom || !scheduleForm.endingAt) {
      setFeedback({ type: 'error', message: 'Both start and end time are required.' })
      return
    }
    const start = new Date(scheduleForm.startingFrom)
    const end = new Date(scheduleForm.endingAt)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setFeedback({ type: 'error', message: 'Invalid date/time.' })
      return
    }
    if (start >= end) {
      setFeedback({ type: 'error', message: 'End time must be strictly after start time.' })
      return
    }

    setBusy(true)
    const res = await updateContestTimeRemoteFirst(contest.id, start.toISOString(), end.toISOString())
    setBusy(false)

    if (res.error) {
      setFeedback({ type: 'error', message: res.error })
    } else {
      setFeedback({ type: 'success', message: 'Contest schedule updated successfully!' })
      onUpdated?.(res.contest)
    }
  }

  // Handle password change
  const handleSavePassword = async (e) => {
    e.preventDefault()
    clearFeedback()
    if (!passwordForm.password.trim()) {
      setFeedback({ type: 'error', message: 'Please provide a non-empty password.' })
      return
    }

    setBusy(true)
    const res = await changeContestPasswordRemoteFirst(contest.id, passwordForm.password.trim())
    setBusy(false)

    if (res.error) {
      setFeedback({ type: 'error', message: res.error })
    } else {
      setFeedback({ type: 'success', message: 'Contest password changed successfully!' })
      setPasswordForm({ password: '' })
    }
  }

  // Testcase handling for new problem
  const updateNewProblemTestCase = (idx, field, value) => {
    setNewProblem((np) => ({
      ...np,
      testCases: np.testCases.map((tc, i) => (i === idx ? { ...tc, [field]: value } : tc)),
    }))
  }

  const addNewProblemTestCase = () => {
    setNewProblem((np) => ({
      ...np,
      testCases: [...np.testCases, emptyTestCase()],
    }))
  }

  const removeNewProblemTestCase = (idx) => {
    setNewProblem((np) => ({
      ...np,
      testCases: np.testCases.filter((_, i) => i !== idx),
    }))
  }

  // Create problem in contest
  const handleCreateProblem = async (e) => {
    e.preventDefault()
    clearFeedback()
    if (!newProblem.title.trim() || !newProblem.statement.trim()) {
      setFeedback({ type: 'error', message: 'Problem title and statement are required.' })
      return
    }

    const validTestCases = newProblem.testCases.filter(
      (tc) => tc.input.trim() && tc.output.trim()
    )

    setBusy(true)
    const constraintsArr = newProblem.constraints
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean)

    const created = await createProblemRemote(contest.id, {
      title: newProblem.title.trim(),
      statement: newProblem.statement.trim(),
      difficulty: newProblem.difficulty,
      tags: [],
      constraints: constraintsArr.length ? constraintsArr : ['1 <= n <= 10^5'],
    })

    if (created.error || !created.problem) {
      setBusy(false)
      setFeedback({ type: 'error', message: created.error || 'Failed to create problem.' })
      return
    }

    if (validTestCases.length > 0) {
      await addProblemTestCasesRemote(contest.id, created.problem.id, validTestCases)
    }

    const contestLangs = Array.isArray(contest?.languages) ? contest.languages : []
    const languageIds = contestLangs.map((l) => PROBLEM_LANGUAGE_IDS[l]).filter(Boolean)

    if (languageIds.length > 0) {
      await addProblemLanguagesRemote(contest.id, created.problem.id, languageIds)
    }

    if (newProblem.codeTemplates && typeof newProblem.codeTemplates === 'object') {
      for (const [langName, code] of Object.entries(newProblem.codeTemplates)) {
        const langId = PROBLEM_LANGUAGE_IDS[langName]
        if (langId && languageIds.includes(langId) && code && code.trim()) {
          await addPreloadedCodeRemote(contest.id, created.problem.id, langId, code.trim())
        }
      }
    }

    setBusy(false)
    setFeedback({ type: 'success', message: `Problem "${newProblem.title}" added with ${validTestCases.length} testcase(s)!` })
    setNewProblem(emptyNewProblem())
    onUpdated?.(null) // trigger refetch
  }

  // Save starter code to existing problem
  const handleSaveProblemStarterCode = async (problemId) => {
    clearFeedback()
    const contestLangs = Array.isArray(contest?.languages) ? contest.languages : []
    const languageIds = contestLangs.map((l) => PROBLEM_LANGUAGE_IDS[l]).filter(Boolean)

    const entries = Object.entries(extraCodeMap).filter(([_, code]) => code && code.trim())
    if (entries.length === 0) {
      setFeedback({ type: 'error', message: 'Please write starter code for at least one language.' })
      return
    }

    setBusy(true)
    if (languageIds.length > 0) {
      await addProblemLanguagesRemote(contest.id, problemId, languageIds)
    }

    let savedCount = 0
    for (const [langName, code] of entries) {
      const langId = PROBLEM_LANGUAGE_IDS[langName]
      if (langId && code.trim()) {
        const res = await addPreloadedCodeRemote(contest.id, problemId, langId, code.trim())
        if (!res.error) savedCount++
      }
    }

    setBusy(false)
    setFeedback({ type: 'success', message: `Saved starter code for ${savedCount} language(s)!` })
    setTargetCodeProblemId(null)
    setExtraCodeMap({})
    onUpdated?.(null)
  }

  // Quick add test cases to existing problem
  const handleAddExtraTestCases = async (problemId) => {
    clearFeedback()
    const valid = extraTestCases.filter((tc) => tc.input.trim() && tc.output.trim())
    if (valid.length === 0) {
      setFeedback({ type: 'error', message: 'Enter at least one valid input/output test case.' })
      return
    }
    setBusy(true)
    const res = await addProblemTestCasesRemote(contest.id, problemId, valid)
    setBusy(false)
    if (res.error) {
      setFeedback({ type: 'error', message: res.error })
    } else {
      setFeedback({ type: 'success', message: `Added ${valid.length} testcase(s) successfully!` })
      setExtraTestCases([emptyTestCase()])
      setTargetProblemId(null)
      onUpdated?.(null)
    }
  }

  // Cancel Contest
  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this contest? Participants will see it as cancelled.')) return
    clearFeedback()
    setBusy(true)
    const res = await cancelContestRemoteFirst(contest.id)
    setBusy(false)
    if (res.error) {
      setFeedback({ type: 'error', message: res.error })
    } else {
      setFeedback({ type: 'success', message: 'Contest has been cancelled.' })
      onUpdated?.({ ...contest, isCancelled: true })
    }
  }

  // Delete Contest
  const handleDelete = async () => {
    if (!window.confirm('Delete this contest permanently? This cannot be undone.')) return
    clearFeedback()
    setBusy(true)
    const res = await deleteContestRemoteFirst(contest.id)
    setBusy(false)
    if (res.error) {
      setFeedback({ type: 'error', message: res.error })
    } else {
      onClose()
      onDeleted?.()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-border overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-bg-soft">
          <div>
            <h2 className="font-display font-bold text-xl text-ink">Manage Contest</h2>
            <p className="text-xs text-ink-soft">Update details, schedule, password, or problems</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-border text-ink-soft hover:text-ink grid place-items-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-6 overflow-x-auto gap-2 bg-white">
          {[
            { id: 'details', label: 'Details' },
            { id: 'schedule', label: 'Schedule' },
            { id: 'security', label: 'Password' },
            { id: 'problems', label: `Problems (${problems.length})` },
            { id: 'danger', label: 'Danger Zone' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                clearFeedback()
              }}
              className={`py-3 px-3 text-xs md:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-ink-soft hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Feedback Alert */}
        {feedback.message && (
          <div
            className={`mx-6 mt-4 px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between ${
              feedback.type === 'error'
                ? 'bg-danger/10 text-danger border border-danger/20'
                : 'bg-success/10 text-success border border-success/20'
            }`}
          >
            <span>{feedback.message}</span>
            <button onClick={clearFeedback} className="ml-2 hover:opacity-75">✕</button>
          </div>
        )}

        {/* Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6">
          {/* TAB: DETAILS */}
          {activeTab === 'details' && (
            <form onSubmit={handleSaveDetails} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-ink-soft block mb-1">Contest Title</label>
                <input
                  value={detailsForm.title}
                  onChange={(e) => setDetailsForm({ ...detailsForm, title: e.target.value })}
                  placeholder="Contest title"
                  className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-soft block mb-1">Tagline / Description</label>
                <textarea
                  rows={3}
                  value={detailsForm.description}
                  onChange={(e) => setDetailsForm({ ...detailsForm, description: e.target.value })}
                  placeholder="Describe your contest"
                  className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-ink-soft block mb-1">Visibility</label>
                  <select
                    value={detailsForm.visibility}
                    onChange={(e) => setDetailsForm({ ...detailsForm, visibility: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft bg-white"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-soft block mb-1">Total Points</label>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={detailsForm.totalPoints}
                    onChange={(e) => setDetailsForm({ ...detailsForm, totalPoints: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-soft block mb-1.5">Allowed Languages</label>
                <div className="flex flex-wrap gap-2">
                  {allLanguages.map((lang) => {
                    const selected = detailsForm.languages.includes(lang)
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleLanguage(lang)}
                        className={`px-3 py-1.5 rounded-2xl text-xs font-medium border transition-colors ${
                          selected
                            ? 'bg-accent text-white border-accent'
                            : 'border-border text-ink-soft hover:bg-bg-soft'
                        }`}
                      >
                        {lang}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-bg-soft border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-ink">Password Protection</span>
                    <p className="text-[11px] text-ink-soft">Require participants to enter a password to join.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDetailsForm((f) => ({ ...f, isProtected: !f.isProtected }))}
                    className={`w-12 h-7 rounded-full transition-colors relative ${detailsForm.isProtected ? 'bg-accent' : 'bg-border'}`}
                  >
                    <span
                      className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${detailsForm.isProtected ? 'translate-x-[22px]' : 'left-0.5'}`}
                    />
                  </button>
                </div>
                {detailsForm.isProtected && (
                  <div>
                    <label className="text-xs font-semibold text-ink-soft block mb-1">
                      {contest.isProtected ? 'Change Password (optional)' : 'Set Password'}
                    </label>
                    <input
                      type="text"
                      value={detailsForm.password}
                      onChange={(e) => setDetailsForm({ ...detailsForm, password: e.target.value })}
                      placeholder={contest.isProtected ? 'Leave blank to keep existing password' : 'Enter new contest password'}
                      className="w-full px-3.5 py-2 rounded-xl border border-border text-xs bg-white focus:outline-none focus:ring-2 focus:ring-accent-soft"
                    />
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={busy}
                  className="px-6 py-2.5 rounded-2xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover shadow-soft disabled:opacity-60"
                >
                  {busy ? 'Saving…' : 'Save Details'}
                </button>
              </div>
            </form>
          )}

          {/* TAB: SCHEDULE */}
          {activeTab === 'schedule' && (
            <form onSubmit={handleSaveSchedule} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-ink-soft block mb-1">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    value={scheduleForm.startingFrom}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, startingFrom: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-soft block mb-1">End Date & Time</label>
                  <input
                    type="datetime-local"
                    min={scheduleForm.startingFrom || undefined}
                    value={scheduleForm.endingAt}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, endingAt: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
                  />
                </div>
              </div>

              <p className="text-xs text-ink-soft">
                Participants will be able to solve problems within this window. Rescheduling updates the countdown clock immediately.
              </p>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={busy}
                  className="px-6 py-2.5 rounded-2xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover shadow-soft disabled:opacity-60"
                >
                  {busy ? 'Updating…' : 'Update Schedule'}
                </button>
              </div>
            </form>
          )}

          {/* TAB: PASSWORD / SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-bg-soft border border-border text-xs text-ink-soft">
                {contest.isProtected ? (
                  <p>
                    🔒 This contest is currently <strong>password protected</strong>. Only users with the password can join.
                  </p>
                ) : (
                  <p>
                    🌐 This contest is <strong>publicly open</strong> without a password.
                  </p>
                )}
              </div>

              {contest.isProtected && (
                <form onSubmit={handleSavePassword} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-ink-soft block mb-1">Set New Password</label>
                    <input
                      type="password"
                      value={passwordForm.password}
                      onChange={(e) => setPasswordForm({ password: e.target.value })}
                      placeholder="Enter new password"
                      className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={busy || !passwordForm.password.trim()}
                      className="px-6 py-2.5 rounded-2xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover shadow-soft disabled:opacity-60"
                    >
                      {busy ? 'Updating…' : 'Change Password'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB: PROBLEMS & TESTCASES */}
          {activeTab === 'problems' && (
            <div className="space-y-6">
              {/* Existing Problems list */}
              {problems.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-ink-soft uppercase tracking-wider mb-2">
                    Current Problems ({problems.length})
                  </h3>
                  <div className="space-y-2">
                    {problems.map((p, idx) => (
                      <div key={p.id} className="border border-border rounded-2xl p-3.5 bg-bg-soft/40">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-white border border-border text-xs font-bold grid place-items-center">
                              {idx + 1}
                            </span>
                            <span className="font-semibold text-sm text-ink">{p.title}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted font-medium capitalize">
                              {p.difficulty}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                setTargetProblemId(targetProblemId === p.id ? null : p.id)
                                setExtraTestCases([emptyTestCase()])
                                setTargetCodeProblemId(null)
                              }}
                              className="text-xs text-accent hover:underline font-semibold"
                            >
                              {targetProblemId === p.id ? 'Cancel' : '+ Add Testcases'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setTargetCodeProblemId(targetCodeProblemId === p.id ? null : p.id)
                                setExtraCodeMap({})
                                setTargetProblemId(null)
                              }}
                              className="text-xs text-accent hover:underline font-semibold"
                            >
                              {targetCodeProblemId === p.id ? 'Cancel' : '+ Starter Code'}
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                if (!window.confirm(`Delete problem "${p.title}"?`)) return
                                setBusy(true)
                                const del = await deleteProblemRemote(contest.id, p.id)
                                setBusy(false)
                                if (del.error) {
                                  setFeedback({ type: 'error', message: del.error })
                                } else {
                                  setFeedback({ type: 'success', message: `Problem "${p.title}" deleted.` })
                                  onUpdated?.(null)
                                }
                              }}
                              className="text-xs text-danger hover:underline font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* Expandable test case adder for existing problem */}
                        {targetProblemId === p.id && (
                          <div className="mt-3 pt-3 border-t border-border space-y-3">
                            <p className="text-xs font-semibold text-ink">Add Multiple Test Cases to "{p.title}":</p>
                            {extraTestCases.map((etc, etcIdx) => (
                              <div key={etcIdx} className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded-xl border border-border">
                                <div>
                                  <span className="text-[10px] text-ink-soft font-mono block mb-1">Input {etcIdx + 1}</span>
                                  <textarea
                                    rows={2}
                                    value={etc.input}
                                    onChange={(e) => {
                                      const val = e.target.value
                                      setExtraTestCases((list) =>
                                        list.map((item, i) => (i === etcIdx ? { ...item, input: val } : item))
                                      )
                                    }}
                                    placeholder="Input data"
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-border text-xs font-mono resize-none"
                                  />
                                </div>
                                <div>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] text-ink-soft font-mono">Expected Output {etcIdx + 1}</span>
                                    {extraTestCases.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => setExtraTestCases((list) => list.filter((_, i) => i !== etcIdx))}
                                        className="text-[10px] text-danger hover:underline"
                                      >
                                        Remove
                                      </button>
                                    )}
                                  </div>
                                  <textarea
                                    rows={2}
                                    value={etc.output}
                                    onChange={(e) => {
                                      const val = e.target.value
                                      setExtraTestCases((list) =>
                                        list.map((item, i) => (i === etcIdx ? { ...item, output: val } : item))
                                      )
                                    }}
                                    placeholder="Expected output"
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-border text-xs font-mono resize-none"
                                  />
                                </div>
                              </div>
                            ))}

                            <div className="flex justify-between items-center pt-1">
                              <button
                                type="button"
                                onClick={() => setExtraTestCases((list) => [...list, emptyTestCase()])}
                                className="text-xs text-accent font-semibold hover:underline"
                              >
                                + Add another test case
                              </button>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => handleAddExtraTestCases(p.id)}
                                className="px-4 py-1.5 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover disabled:opacity-60"
                              >
                                {busy ? 'Saving…' : 'Save Test Cases'}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Expandable starter code adder for existing problem */}
                        {targetCodeProblemId === p.id && (
                          <div className="mt-3 pt-3 border-t border-border space-y-3">
                            <p className="text-xs font-semibold text-ink">Configure Starter Code Templates for "{p.title}":</p>
                            {(() => {
                              const availLangs = (contest?.languages || []).filter((l) => PROBLEM_LANGUAGE_IDS[l])
                              const activeL = extraCodeActiveLang || availLangs[0] || ''

                              if (availLangs.length === 0) {
                                return (
                                  <p className="text-xs text-ink-soft italic">
                                    No supported languages in this contest.
                                  </p>
                                )
                              }

                              return (
                                <div className="bg-white p-3 rounded-xl border border-border space-y-2.5">
                                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                                    {availLangs.map((lang) => {
                                      const hasCode = Boolean((extraCodeMap[lang] || '').trim())
                                      const isAct = activeL === lang
                                      return (
                                        <button
                                          key={lang}
                                          type="button"
                                          onClick={() => setExtraCodeActiveLang(lang)}
                                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                                            isAct ? 'bg-ink text-white' : 'bg-bg-soft text-ink-soft border border-border'
                                          }`}
                                        >
                                          <span>{lang}</span>
                                          {hasCode && <span className={`w-1.5 h-1.5 rounded-full ${isAct ? 'bg-accent' : 'bg-emerald-500'}`} />}
                                        </button>
                                      )
                                    })}
                                  </div>

                                  {activeL && (
                                    <div className="space-y-1.5">
                                      <div className="flex justify-between items-center text-[11px]">
                                        <span className="text-ink-soft font-mono font-medium">{activeL} Code</span>
                                        <div className="flex items-center gap-2">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setExtraCodeMap((m) => ({
                                                ...m,
                                                [activeL]: DEFAULT_BOILERPLATES[activeL] || `// Starter code for ${activeL}\n`,
                                              }))
                                            }
                                            className="text-xs text-accent hover:underline font-semibold"
                                          >
                                            Insert boilerplate
                                          </button>
                                          {(extraCodeMap[activeL] || '').trim() && (
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setExtraCodeMap((m) => ({
                                                  ...m,
                                                  [activeL]: '',
                                                }))
                                              }
                                              className="text-xs text-danger hover:underline font-medium"
                                            >
                                              Clear
                                            </button>
                                          )}
                                        </div>
                                      </div>

                                      <textarea
                                        rows={5}
                                        value={extraCodeMap[activeL] || ''}
                                        onChange={(e) =>
                                          setExtraCodeMap((m) => ({
                                            ...m,
                                            [activeL]: e.target.value,
                                          }))
                                        }
                                        placeholder={`// Starter code for ${activeL}...`}
                                        className="w-full px-3 py-2 text-xs font-mono bg-slate-900 text-slate-100 placeholder-slate-500 rounded-lg border border-slate-700 resize-y focus:outline-none"
                                        spellCheck={false}
                                      />
                                    </div>
                                  )}

                                  <div className="flex justify-end pt-1">
                                    <button
                                      type="button"
                                      disabled={busy}
                                      onClick={() => handleSaveProblemStarterCode(p.id)}
                                      className="px-4 py-1.5 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover disabled:opacity-60"
                                    >
                                      {busy ? 'Saving…' : 'Save Starter Code'}
                                    </button>
                                  </div>
                                </div>
                              )
                            })()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Problem with Multiple Testcases */}
              <div className="border border-border rounded-2xl p-4 bg-white space-y-3">
                <h3 className="font-display font-bold text-sm text-ink">+ Add New Problem</h3>
                <div>
                  <label className="text-xs font-semibold text-ink-soft block mb-1">Title</label>
                  <input
                    value={newProblem.title}
                    onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
                    placeholder="e.g. Reverse Linked List"
                    className="w-full px-3 py-2 rounded-xl border border-border text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-ink-soft block mb-1">Difficulty</label>
                    <select
                      value={newProblem.difficulty}
                      onChange={(e) => setNewProblem({ ...newProblem, difficulty: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-border text-sm bg-white"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-soft block mb-1">Constraints</label>
                    <input
                      value={newProblem.constraints}
                      onChange={(e) => setNewProblem({ ...newProblem, constraints: e.target.value })}
                      placeholder="1 <= n <= 10^5"
                      className="w-full px-3 py-2 rounded-xl border border-border text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-ink-soft block mb-1">Problem Statement</label>
                  <textarea
                    rows={3}
                    value={newProblem.statement}
                    onChange={(e) => setNewProblem({ ...newProblem, statement: e.target.value })}
                    placeholder="Describe the problem, input format, output format..."
                    className="w-full px-3 py-2 rounded-xl border border-border text-sm resize-none"
                  />
                </div>

                {/* Multiple Test Cases for New Problem */}
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-ink">
                      Test Cases ({newProblem.testCases.length})
                    </label>
                    <button
                      type="button"
                      onClick={addNewProblemTestCase}
                      className="text-xs text-accent font-semibold hover:underline"
                    >
                      + Add Test Case
                    </button>
                  </div>

                  {newProblem.testCases.map((tc, tcIdx) => (
                    <div key={tcIdx} className="border border-border rounded-xl p-3 bg-bg-soft/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-ink-soft">Test Case #{tcIdx + 1}</span>
                        {newProblem.testCases.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeNewProblemTestCase(tcIdx)}
                            className="text-xs text-danger hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-mono text-ink-soft block mb-0.5">Input</label>
                          <textarea
                            rows={2}
                            value={tc.input}
                            onChange={(e) => updateNewProblemTestCase(tcIdx, 'input', e.target.value)}
                            placeholder="Input"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-border text-xs font-mono resize-none bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-ink-soft block mb-0.5">Output</label>
                          <textarea
                            rows={2}
                            value={tc.output}
                            onChange={(e) => updateNewProblemTestCase(tcIdx, 'output', e.target.value)}
                            placeholder="Expected Output"
                            className="w-full px-2.5 py-1.5 rounded-lg border border-border text-xs font-mono resize-none bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Starter Code Templates for New Problem */}
                <div className="pt-2 space-y-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-ink">
                      Starter Code Templates <span className="font-normal text-ink-soft text-[11px]">(optional)</span>
                    </label>
                  </div>

                  {(() => {
                    const modalLangs = (contest?.languages || []).filter((l) => PROBLEM_LANGUAGE_IDS[l])
                    const activeLang = newProblemActiveTab || modalLangs[0] || ''

                    if (modalLangs.length === 0) {
                      return (
                        <p className="text-xs text-ink-soft italic">
                          This contest has no supported code execution languages.
                        </p>
                      )
                    }

                    return (
                      <div className="bg-bg-soft/40 border border-border rounded-xl p-3 space-y-2.5">
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                          {modalLangs.map((lang) => {
                            const hasCode = Boolean((newProblem.codeTemplates?.[lang] || '').trim())
                            const isActive = activeLang === lang
                            return (
                              <button
                                key={lang}
                                type="button"
                                onClick={() => setNewProblemActiveTab(lang)}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                                  isActive
                                    ? 'bg-ink text-white'
                                    : 'bg-white text-ink-soft border border-border'
                                }`}
                              >
                                <span>{lang}</span>
                                {hasCode && (
                                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-accent' : 'bg-emerald-500'}`} />
                                )}
                              </button>
                            )
                          })}
                        </div>

                        {activeLang && (
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="text-ink-soft font-mono font-medium">{activeLang} Template</span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setNewProblem((np) => ({
                                      ...np,
                                      codeTemplates: {
                                        ...(np.codeTemplates || {}),
                                        [activeLang]: DEFAULT_BOILERPLATES[activeLang] || `// Starter code for ${activeLang}\n`,
                                      },
                                    }))
                                  }
                                  className="text-accent hover:underline font-semibold"
                                >
                                  Insert boilerplate
                                </button>
                                {(newProblem.codeTemplates?.[activeLang] || '').trim() && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setNewProblem((np) => ({
                                        ...np,
                                        codeTemplates: {
                                          ...(np.codeTemplates || {}),
                                          [activeLang]: '',
                                        },
                                      }))
                                    }
                                    className="text-danger hover:underline"
                                  >
                                    Clear
                                  </button>
                                )}
                              </div>
                            </div>
                            <textarea
                              rows={5}
                              value={newProblem.codeTemplates?.[activeLang] || ''}
                              onChange={(e) =>
                                setNewProblem((np) => ({
                                  ...np,
                                  codeTemplates: {
                                    ...(np.codeTemplates || {}),
                                    [activeLang]: e.target.value,
                                  },
                                }))
                              }
                              placeholder={`// Starter code for ${activeLang}...`}
                              className="w-full px-3 py-2 text-xs font-mono bg-slate-900 text-slate-100 placeholder-slate-500 rounded-lg border border-slate-700 resize-y focus:outline-none"
                              spellCheck={false}
                            />
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    disabled={busy || !newProblem.title.trim()}
                    onClick={handleCreateProblem}
                    className="px-5 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover disabled:opacity-60"
                  >
                    {busy ? 'Creating…' : 'Add Problem'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DANGER ZONE */}
          {activeTab === 'danger' && (
            <div className="space-y-4">
              <div className="border border-warning/30 rounded-2xl p-4 bg-warning/5 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-ink">Cancel Contest</h4>
                  <p className="text-xs text-ink-soft mt-0.5">
                    Mark this contest as cancelled. Participants will not be able to submit solutions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={busy || contest.isCancelled}
                  className="px-4 py-2 rounded-xl border border-warning text-warning text-xs font-semibold hover:bg-warning hover:text-white transition-colors disabled:opacity-50"
                >
                  {contest.isCancelled ? 'Cancelled' : 'Cancel Contest'}
                </button>
              </div>

              <div className="border border-danger/30 rounded-2xl p-4 bg-danger/5 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-danger">Delete Contest</h4>
                  <p className="text-xs text-ink-soft mt-0.5">
                    Permanently delete this contest, its problems, and submissions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={busy}
                  className="px-4 py-2 rounded-xl bg-danger text-white text-xs font-semibold hover:bg-danger/90 transition-colors disabled:opacity-50"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
