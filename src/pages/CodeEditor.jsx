import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Editor from '@monaco-editor/react'
import { quizzes, tutorials } from '../data/mockData.js'
import { problemBank } from '../data/problems.js'
import { recordProblemSolved } from '../utils/appData.js'

const modes = [
  { id: 'compiler', label: '💻 Compiler', desc: 'Write & run code' },
  { id: 'quizzes', label: '🧠 Quizzes', desc: 'Test your knowledge' },
  { id: 'tutorials', label: '📘 Tutorials', desc: 'Learn step by step' },
]

export default function CodeEditor() {
  const [mode, setMode] = useState('compiler')

  return (
    <div className="bg-white">
      <div className="border-b border-border bg-bg-soft/60">
        <div className="max-w-[1400px] mx-auto px-5 flex gap-1 overflow-x-auto">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-5 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                mode === m.id ? 'border-accent text-accent' : 'border-transparent text-ink-soft hover:text-ink'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'compiler' && <CompilerView />}
      {mode === 'quizzes' && <QuizzesView />}
      {mode === 'tutorials' && <TutorialsView />}
    </div>
  )
}

const languages = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
]

const MONACO_LANG = { javascript: 'javascript', python: 'python', java: 'java', cpp: 'cpp' }

const GRADED_LANGUAGES = ['javascript', 'python'] // languages with a real auto-grader wired up

function deepClone(v) {
  return JSON.parse(JSON.stringify(v))
}

// Sorts every array level so triplets/groups/etc. can be compared regardless of order.
function normalize(v) {
  if (Array.isArray(v)) {
    return v.map(normalize).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
  }
  return v
}

function valuesMatch(actual, expected, unordered) {
  if (unordered) return JSON.stringify(normalize(actual)) === JSON.stringify(normalize(expected))
  return JSON.stringify(actual) === JSON.stringify(expected)
}

// ---- JavaScript: real function-call harness, runs directly in the browser ----
function runJsAgainstTests(code, problem) {
  let solveFn
  try {
    // eslint-disable-next-line no-new-func
    solveFn = new Function(`${code}\nif (typeof solve !== 'function') { throw new Error("Define a function named solve(${problem.params.join(', ')})."); }\nreturn solve;`)()
  } catch (err) {
    return { compileError: err.message }
  }
  const results = problem.testCases.map((tc) => {
    try {
      const actual = solveFn(...tc.args.map(deepClone))
      return { pass: valuesMatch(actual, tc.expected, problem.unordered), actual, expected: tc.expected, args: tc.args }
    } catch (err) {
      return { pass: false, actual: `Runtime error: ${err.message}`, expected: tc.expected, args: tc.args }
    }
  })
  return { results }
}

// ---- Python: real function-call harness, executed remotely via Piston, one call per test case ----
async function runPythonAgainstTests(code, problem) {
  const results = []
  for (const tc of problem.testCases) {
    const argsJson = JSON.stringify(tc.args)
    const driver = `${code}

import json
_args = json.loads(${JSON.stringify(argsJson)})
try:
    _result = solve(*_args)
    print("__OK__" + json.dumps(_result))
except Exception as e:
    print("__ERR__" + str(e))
`
    const res = await runViaPiston('python', driver, '')
    if (res.error) {
      results.push({ pass: false, actual: `Error: ${res.error}`, expected: tc.expected, args: tc.args })
      continue
    }
    const line = (res.output || '').trim().split('\n').pop()
    if (line.startsWith('__OK__')) {
      try {
        const actual = JSON.parse(line.slice(6))
        results.push({ pass: valuesMatch(actual, tc.expected, problem.unordered), actual, expected: tc.expected, args: tc.args })
      } catch {
        results.push({ pass: false, actual: line, expected: tc.expected, args: tc.args })
      }
    } else {
      results.push({ pass: false, actual: line.replace('__ERR__', 'Runtime error: ') || '(no output)', expected: tc.expected, args: tc.args })
    }
  }
  return { results }
}

// ---- Java / C++ / Python: executed via Piston. Runtime versions are fetched from Piston
// itself (rather than hardcoded) because Piston requires an exact version match and its
// available versions change over time — a stale hardcoded version is the #1 reason a
// language "stops working" with this API. We resolve once and cache in memory.
const PISTON_ALIASES = {
  python: ['python', 'python3'],
  java: ['java'],
  cpp: ['c++', 'cpp', 'g++'],
}
let runtimesCache = null
let runtimesCacheAt = 0

async function getRuntimes() {
  if (runtimesCache && Date.now() - runtimesCacheAt < 10 * 60 * 1000) return runtimesCache
  const res = await fetch('https://emkc.org/api/v2/piston/runtimes')
  if (!res.ok) throw new Error(`Couldn't load compiler runtime list (${res.status}).`)
  runtimesCache = await res.json()
  runtimesCacheAt = Date.now()
  return runtimesCache
}

async function resolveRuntime(languageId) {
  const wanted = PISTON_ALIASES[languageId] || [languageId]
  try {
    const runtimes = await getRuntimes()
    const match = runtimes.find((r) => wanted.includes(r.language) || (r.aliases || []).some((a) => wanted.includes(a)))
    if (match) return { language: match.language, version: match.version }
  } catch {
    // fall through to a best-effort static guess below if the runtime list itself is unreachable
  }
  const fallback = { python: { language: 'python', version: '3.10.0' }, java: { language: 'java', version: '15.0.2' }, cpp: { language: 'c++', version: '10.2.0' } }
  return fallback[languageId] || null
}

async function runViaPiston(languageId, code, stdin) {
  const runtime = await resolveRuntime(languageId)
  if (!runtime) return { output: '', error: 'Unsupported language.' }
  try {
    const res = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: runtime.language,
        version: runtime.version,
        files: [{ content: code }],
        stdin: stdin || '',
      }),
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) return { output: '', error: `Compiler service error (${res.status}): ${data?.message || 'Try again in a moment.'}` }
    if (!data) return { output: '', error: 'Compiler service returned an unexpected response.' }
    if (data.compile && data.compile.code !== 0) return { output: '', error: data.compile.stderr || data.compile.output || 'Compile error.' }
    if (data.run) {
      const combined = (data.run.stdout || '') + (data.run.stderr ? '\n' + data.run.stderr : '')
      return { output: combined || '(no output)', error: null }
    }
    return { output: '', error: data.message || 'Execution failed.' }
  } catch (err) {
    return { output: '', error: `Couldn't reach the compiler service — check your internet connection. (${err.message})` }
  }
}


function pythonStub(problem) {
  return `def solve(${problem.params.join(', ')}):\n    pass\n`
}
function genericStub(languageId) {
  return languageId === 'java'
    ? 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Run freely here — auto-grading is available for JavaScript and Python.");\n    }\n}'
    : languageId === 'cpp'
    ? '#include <iostream>\nint main() {\n    std::cout << "Run freely here — auto-grading is available for JavaScript and Python.";\n    return 0;\n}'
    : ''
}

function starterFor(languageId, problem) {
  if (languageId === 'javascript') return problem.starter
  if (languageId === 'python') return pythonStub(problem)
  return genericStub(languageId)
}

const difficultyColors = {
  Easy: 'bg-success/10 text-success',
  Medium: 'bg-warning/10 text-warning',
  Hard: 'bg-danger/10 text-danger',
}

function ProblemPicker({ problem, onSelect }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [diff, setDiff] = useState('All')

  const filtered = problemBank.filter((p) => {
    const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase()) || p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
    const matchesDiff = diff === 'All' || p.difficulty === diff
    return matchesQuery && matchesDiff
  })

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-border text-sm font-medium hover:bg-bg-soft"
      >
        <span>📚 {problemBank.length} problems — click to browse</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="mt-2 border border-border rounded-xl p-3 bg-bg-soft">
          <div className="flex gap-2 mb-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or tag..."
              className="flex-1 px-2.5 py-1.5 rounded-lg border border-border text-xs"
            />
            <select value={diff} onChange={(e) => setDiff(e.target.value)} className="px-2 py-1.5 rounded-lg border border-border text-xs bg-white">
              {['All', 'Easy', 'Medium', 'Hard'].map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div className="max-h-64 overflow-y-auto space-y-1">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => { onSelect(p); setOpen(false) }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between hover:bg-white ${p.id === problem.id ? 'bg-white font-semibold' : ''}`}
              >
                <span className="truncate">{p.title}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ml-2 ${difficultyColors[p.difficulty]}`}>{p.difficulty}</span>
              </button>
            ))}
            {filtered.length === 0 && <p className="text-xs text-ink-soft text-center py-4">No matches.</p>}
          </div>
        </div>
      )}
    </div>
  )
}

function CompilerView() {
  const user = useSelector((s) => s.auth.user)
  const [problem, setProblem] = useState(problemBank[0])
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(starterFor('javascript', problemBank[0]))
  const [output, setOutput] = useState('Run your code to see output here.')
  const [running, setRunning] = useState(false)
  const [activeTab, setActiveTab] = useState('console')
  const [theme, setTheme] = useState('light')
  const [seconds, setSeconds] = useState(90 * 60)
  const [lastRun, setLastRun] = useState(null) // { results }

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    setCode(starterFor(language, problem))
    setOutput('Run your code to see output here.')
    setLastRun(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, problem.id])

  const timeStr = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
  const isGraded = GRADED_LANGUAGES.includes(language)

  const handleRun = async () => {
    setRunning(true)
    setActiveTab('console')
    if (language === 'javascript') {
      const r = runJsAgainstTests(code, { ...problem, testCases: [problem.testCases[0]] })
      setOutput(r.compileError ? `❌ ${r.compileError}` : formatResults(r.results, false))
    } else if (language === 'python') {
      const r = await runPythonAgainstTests(code, { ...problem, testCases: [problem.testCases[0]] })
      setOutput(formatResults(r.results, false))
    } else {
      const r = await runViaPiston(language, code, '')
      setOutput(r.error ? `❌ ${r.error}` : r.output)
    }
    setRunning(false)
  }

  const handleSubmit = async () => {
    setRunning(true)
    setActiveTab('console')

    if (!isGraded) {
      setOutput('⚠️ Auto-grading is available for JavaScript and Python right now. Java/C++ can still be run freely above — full multi-language grading is on the roadmap.')
      setRunning(false)
      return
    }

    const r = language === 'javascript' ? runJsAgainstTests(code, problem) : await runPythonAgainstTests(code, problem)

    if (r.compileError) {
      setOutput(`❌ ${r.compileError}`)
      setRunning(false)
      return
    }

    const results = r.results
    const passedCount = results.filter((x) => x.pass).length
    const total = results.length
    const allPassed = passedCount === total
    setLastRun({ results })

    if (allPassed && user) recordProblemSolved(user.username)

    setOutput(
      `${allPassed ? '✅' : '⚠️'} ${passedCount}/${total} test cases passed\n\n` +
        formatResults(results, true) +
        (allPassed
          ? user
            ? '\n\n+10 points added to your account. Streak updated.'
            : '\n\nLog in to earn points and keep your streak for solved problems.'
          : '\n\nSome test cases failed — check the details above and try again.')
    )
    setRunning(false)
  }

  function formatResults(results, verbose) {
    return results
      .map((r, i) => {
        const status = r.pass ? '✅ PASS' : '❌ FAIL'
        if (!verbose) return `${status}\nOutput: ${JSON.stringify(r.actual)}\nExpected: ${JSON.stringify(r.expected)}`
        return `Test ${i + 1}: ${status}${r.pass ? '' : `\n  Input: ${JSON.stringify(r.args)}\n  Got: ${JSON.stringify(r.actual)}\n  Expected: ${JSON.stringify(r.expected)}`}`
      })
      .join('\n')
  }

  return (
    <div className={theme === 'dark' ? 'bg-ink' : 'bg-white'}>
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[1.1fr_1.4fr_0.9fr] gap-0 min-h-[calc(100vh-112px)]">
        <div className={`border-r border-border p-6 overflow-y-auto ${theme === 'dark' ? 'text-white/80' : 'text-ink-soft'}`}>
          <ProblemPicker problem={problem} onSelect={setProblem} />

          <div className="flex items-center justify-between mb-4">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${difficultyColors[problem.difficulty]}`}>{problem.difficulty}</span>
            <span className="font-mono text-sm font-semibold text-accent">⏱ {timeStr}</span>
          </div>
          <h1 className={`font-display font-bold text-xl mb-1 ${theme === 'dark' ? 'text-white' : 'text-ink'}`}>{problem.title}</h1>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {problem.tags.map((t) => <span key={t} className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-medium">{t}</span>)}
          </div>
          <p className="text-sm leading-relaxed mb-4">{problem.statement}</p>

          <div className="mb-4">
            <h3 className={`font-semibold text-sm mb-2 ${theme === 'dark' ? 'text-white' : 'text-ink'}`}>Function signature</h3>
            <div className="font-mono text-xs bg-muted rounded-xl p-3">solve({problem.params.join(', ')})</div>
          </div>

          <div>
            <h3 className={`font-semibold text-sm mb-2 ${theme === 'dark' ? 'text-white' : 'text-ink'}`}>Examples</h3>
            <div className="space-y-2">
              {problem.testCases.slice(0, 3).map((tc, i) => (
                <div key={i} className="font-mono text-xs bg-muted rounded-xl p-3">
                  <div>Input: {problem.params.map((p, j) => `${p} = ${JSON.stringify(tc.args[j])}`).join(', ')}</div>
                  <div>Output: {JSON.stringify(tc.expected)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-r border-border flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-soft">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-sm font-medium bg-white border border-border rounded-xl px-3 py-1.5"
            >
              {languages.map((l) => <option key={l.id} value={l.id}>{l.label}{GRADED_LANGUAGES.includes(l.id) ? '' : ' (freeform)'}</option>)}
            </select>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="text-sm px-3 py-1.5 rounded-xl border border-border hover:bg-white"
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={MONACO_LANG[language] || 'plaintext'}
              value={code}
              onChange={(value) => setCode(value ?? '')}
              theme={theme === 'dark' ? 'vs-dark' : 'vs'}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                padding: { top: 12 },
              }}
              loading={<div className="h-full grid place-items-center text-sm text-ink-soft">Loading editor…</div>}
            />
          </div>
          <div className="flex gap-3 px-4 py-3 border-t border-border bg-bg-soft">
            <button
              onClick={handleRun}
              disabled={running}
              className="px-5 py-2 rounded-2xl border border-border font-semibold text-sm text-ink hover:bg-white disabled:opacity-50"
            >
              {running ? 'Running…' : '▶ Run (1st example)'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={running}
              className="px-5 py-2 rounded-2xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover disabled:opacity-50"
            >
              Submit
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex border-b border-border">
            {['console', 'test cases', 'leaderboard'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`flex-1 py-3 text-sm font-medium capitalize ${activeTab === t ? 'text-accent border-b-2 border-accent' : 'text-ink-soft'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {activeTab === 'console' && (
            <pre className="p-4 font-mono text-xs whitespace-pre-wrap flex-1 text-ink-soft overflow-y-auto">{output}</pre>
          )}

          {activeTab === 'test cases' && (
            <div className="p-4 flex-1 overflow-y-auto space-y-2">
              {problem.testCases.map((tc, i) => {
                const result = lastRun?.results?.[i]
                return (
                  <div key={i} className={`font-mono text-xs rounded-xl p-3 border ${result ? (result.pass ? 'border-success/40 bg-success/5' : 'border-danger/40 bg-danger/5') : 'border-border bg-muted'}`}>
                    <div className="flex justify-between mb-1">
                      <span>Case {i + 1}</span>
                      {result && <span>{result.pass ? '✅' : '❌'}</span>}
                    </div>
                    <div>Args: {JSON.stringify(tc.args)}</div>
                    <div>Expected: {JSON.stringify(tc.expected)}</div>
                    {result && !result.pass && <div>Got: {JSON.stringify(result.actual)}</div>}
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="p-4 space-y-2 overflow-y-auto">
              {['shreya.codes', 'devraj_99', 'nullptr_ninja', 'ananya_dev'].map((u, i) => (
                <div key={u} className="flex items-center justify-between text-sm border border-border rounded-xl px-3 py-2">
                  <span className="text-ink-soft">#{i + 1} {u}</span>
                  <span className="font-mono text-accent text-xs">{40 - i * 3}ms</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


const difficultyStyles = {
  Easy: 'bg-success/10 text-success',
  Medium: 'bg-warning/10 text-warning',
  Hard: 'bg-danger/10 text-danger',
}

function QuizzesView() {
  const [langFilter, setLangFilter] = useState('All')
  const [diffFilter, setDiffFilter] = useState('All')
  const [activeQuiz, setActiveQuiz] = useState(null)

  const languagesList = ['All', ...new Set(quizzes.map((q) => q.language))]
  const difficulties = ['All', 'Easy', 'Medium', 'Hard']

  const filtered = quizzes.filter(
    (q) => (langFilter === 'All' || q.language === langFilter) && (diffFilter === 'All' || q.difficulty === diffFilter)
  )

  if (activeQuiz) {
    return <QuizRunner quiz={activeQuiz} onExit={() => setActiveQuiz(null)} />
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <h1 className="font-display font-bold text-2xl text-ink mb-1">Coding Quizzes</h1>
      <p className="text-ink-soft text-sm mb-6">Sharpen your fundamentals across languages and difficulty levels.</p>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex gap-2 flex-wrap">
          {languagesList.map((l) => (
            <button
              key={l}
              onClick={() => setLangFilter(l)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-medium border transition-colors ${
                langFilter === l ? 'bg-ink text-white border-ink' : 'border-border text-ink-soft hover:bg-bg-soft'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setDiffFilter(d)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-medium border transition-colors ${
                diffFilter === d ? 'bg-accent text-white border-accent' : 'border-border text-ink-soft hover:bg-bg-soft'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {filtered.map((quiz) => (
          <button
            key={quiz.id}
            onClick={() => setActiveQuiz(quiz)}
            className="card-lift text-left bg-white border border-border rounded-2xl p-6 hover:border-accent-soft"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-ink-soft">{quiz.language}</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${difficultyStyles[quiz.difficulty]}`}>
                {quiz.difficulty}
              </span>
            </div>
            <h3 className="font-display font-semibold text-ink mb-1">{quiz.title}</h3>
            <p className="text-xs text-ink-soft">{quiz.questions.length} questions · ~{quiz.questions.length * 1} min</p>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-ink-soft col-span-2 text-center py-10">No quizzes match those filters.</p>
        )}
      </div>
    </div>
  )
}

function QuizRunner({ quiz, onExit }) {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [finished, setFinished] = useState(false)

  const question = quiz.questions[step]

  const handleAnswer = (idx) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    if (idx === question.correct) setScore((s) => s + 1)
  }

  const handleNext = () => {
    if (step + 1 < quiz.questions.length) {
      setStep((s) => s + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      setFinished(true)
    }
  }

  if (finished) {
    const pct = Math.round((score / quiz.questions.length) * 100)
    return (
      <div className="max-w-lg mx-auto px-5 py-16 text-center">
        <div className="text-5xl mb-4">{pct >= 80 ? '🏆' : pct >= 50 ? '🎯' : '📚'}</div>
        <h2 className="font-display font-bold text-2xl text-ink mb-2">Quiz Complete!</h2>
        <p className="text-ink-soft mb-6">
          You scored <span className="font-semibold text-accent">{score}/{quiz.questions.length}</span> on {quiz.title}
        </p>
        <div className="flex justify-center gap-3">
          <button onClick={onExit} className="px-5 py-2.5 rounded-2xl border border-border font-semibold text-sm hover:bg-bg-soft">
            Back to Quizzes
          </button>
          <button
            onClick={() => { setStep(0); setSelected(null); setScore(0); setAnswered(false); setFinished(false) }}
            className="px-5 py-2.5 rounded-2xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover"
          >
            Retry Quiz
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onExit} className="text-sm text-ink-soft hover:text-accent">← Exit quiz</button>
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${difficultyStyles[quiz.difficulty]}`}>{quiz.difficulty}</span>
      </div>

      <div className="w-full h-1.5 bg-bg-soft rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-accent transition-all" style={{ width: `${((step + 1) / quiz.questions.length) * 100}%` }} />
      </div>

      <p className="text-xs text-ink-soft mb-2">Question {step + 1} of {quiz.questions.length}</p>
      <h2 className="font-display font-semibold text-xl text-ink mb-6">{question.q}</h2>

      <div className="space-y-3 mb-6">
        {question.options.map((opt, idx) => {
          let style = 'border-border hover:border-accent-soft'
          if (answered) {
            if (idx === question.correct) style = 'border-success bg-success/10'
            else if (idx === selected) style = 'border-danger bg-danger/10'
          }
          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={`w-full text-left px-4 py-3 rounded-2xl border text-sm text-ink transition-colors ${style}`}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {answered && (
        <button onClick={handleNext} className="w-full py-3 rounded-2xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover">
          {step + 1 < quiz.questions.length ? 'Next Question →' : 'See Results'}
        </button>
      )}
    </div>
  )
}

function TutorialsView() {
  const langKeys = Object.keys(tutorials)
  const [activeLang, setActiveLang] = useState(langKeys[0])
  const [activeLesson, setActiveLesson] = useState(0)

  const lang = tutorials[activeLang]
  const lesson = lang.lessons[activeLesson]

  const selectLang = (key) => {
    setActiveLang(key)
    setActiveLesson(0)
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-10 grid md:grid-cols-[220px_1fr] gap-8">
      <aside className="space-y-5">
        <div>
          <p className="text-xs font-semibold text-ink-soft mb-2 uppercase tracking-wide">Language</p>
          <div className="space-y-1">
            {langKeys.map((key) => (
              <button
                key={key}
                onClick={() => selectLang(key)}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors ${
                  activeLang === key ? 'bg-accent text-white' : 'text-ink-soft hover:bg-bg-soft'
                }`}
              >
                <span>{tutorials[key].icon}</span> {tutorials[key].label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-ink-soft mb-2 uppercase tracking-wide">Lessons</p>
          <div className="space-y-1">
            {lang.lessons.map((l, i) => (
              <button
                key={l.title}
                onClick={() => setActiveLesson(i)}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                  activeLesson === i ? 'bg-bg-soft text-accent' : 'text-ink-soft hover:bg-bg-soft'
                }`}
              >
                {i + 1}. {l.title}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{lang.icon}</span>
          <span className="text-xs font-medium text-ink-soft">{lang.label} · Lesson {activeLesson + 1}/{lang.lessons.length}</span>
        </div>
        <h1 className="font-display font-bold text-2xl text-ink mb-4">{lesson.title}</h1>
        <p className="text-sm text-ink-soft leading-relaxed mb-6">{lesson.body}</p>
        <div className="rounded-2xl overflow-hidden border border-border">
          <div className="bg-bg-soft px-4 py-2 text-xs font-mono text-ink-soft border-b border-border">example.{activeLang === 'javascript' ? 'js' : activeLang === 'python' ? 'py' : activeLang === 'java' ? 'java' : 'cpp'}</div>
          <pre className="bg-[#1e1e1e] text-[#d4d4d4] font-mono text-xs p-5 overflow-x-auto whitespace-pre">{lesson.code}</pre>
        </div>

        <div className="flex justify-between mt-8">
          <button
            disabled={activeLesson === 0}
            onClick={() => setActiveLesson((l) => l - 1)}
            className="px-5 py-2.5 rounded-2xl border border-border text-sm font-medium disabled:opacity-40 hover:bg-bg-soft"
          >
            ← Previous
          </button>
          <button
            disabled={activeLesson === lang.lessons.length - 1}
            onClick={() => setActiveLesson((l) => l + 1)}
            className="px-5 py-2.5 rounded-2xl bg-accent text-white text-sm font-medium disabled:opacity-40 hover:bg-accent-hover"
          >
            Next Lesson →
          </button>
        </div>
      </div>
    </div>
  )
}
