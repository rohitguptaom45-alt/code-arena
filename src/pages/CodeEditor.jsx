import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { languageStarters, quizzes, tutorials } from '../data/mockData.js'
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

const testCases = [
  { input: 'nums = [2,7,11,15], target = 9', expected: '[0,1]' },
  { input: 'nums = [3,2,4], target = 6', expected: '[1,2]' },
  { input: 'nums = [3,3], target = 6', expected: '[0,1]' },
]

const hints = [
  'Try storing values you have already seen in a hash map for O(1) lookups.',
  'For each number, check if its complement (target - num) already exists.',
  'You only need a single pass through the array.',
]

function runJavaScript(code) {
  const logs = []
  const fakeConsole = { log: (...args) => logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')) }
  try {
    const fn = new Function('console', code)
    fn(fakeConsole)
    return { output: logs.join('\n') || '(no output)', error: null }
  } catch (err) {
    return { output: '', error: err.message }
  }
}

// Real execution for non-JS languages via the public Piston API (https://github.com/engineer-man/piston).
// Free, no API key, rate-limited — fine for a small app; swap in a paid judge for production scale.
const PISTON_RUNTIMES = {
  python: { language: 'python', version: '3.10.0' },
  java: { language: 'java', version: '15.0.2' },
  cpp: { language: 'cpp', version: '10.2.0' },
}

async function runViaPiston(languageId, code, stdin) {
  const runtime = PISTON_RUNTIMES[languageId]
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
    if (!res.ok) return { output: '', error: `Compiler service error (${res.status}). Try again in a moment.` }
    const data = await res.json()
    if (data.compile && data.compile.stderr) {
      return { output: '', error: data.compile.stderr }
    }
    if (data.run) {
      return { output: (data.run.stdout || '') + (data.run.stderr ? '\n' + data.run.stderr : '') || '(no output)', error: null }
    }
    return { output: '', error: data.message || 'Execution failed.' }
  } catch (err) {
    return { output: '', error: `Couldn't reach the compiler service — check your connection. (${err.message})` }
  }
}

async function executeCode(languageId, code, stdin) {
  if (languageId === 'javascript') return runJavaScript(code)
  return runViaPiston(languageId, code, stdin)
}

function CompilerView() {
  const user = useSelector((s) => s.auth.user)
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(languageStarters.javascript)
  const [customInput, setCustomInput] = useState('2 7 11 15\n9')
  const [output, setOutput] = useState('Run your code to see output here.')
  const [running, setRunning] = useState(false)
  const [activeTab, setActiveTab] = useState('console')
  const [theme, setTheme] = useState('light')
  const [seconds, setSeconds] = useState(90 * 60)

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    setCode(languageStarters[language])
  }, [language])

  const timeStr = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

  const handleRun = async () => {
    setRunning(true)
    setActiveTab('console')
    const result = await executeCode(language, code, customInput)
    setOutput(result.error ? `Error:\n${result.error}` : result.output)
    setRunning(false)
  }

  const handleSubmit = async () => {
    setRunning(true)
    setActiveTab('console')
    const result = await executeCode(language, code, customInput)

    if (result.error) {
      setOutput(`❌ ${result.error}`)
      setRunning(false)
      return
    }

    const normalized = (result.output || '').replace(/\s+/g, '')
    const passedCount = testCases.filter((tc) => normalized.includes(tc.expected.replace(/\s+/g, ''))).length
    const total = testCases.length
    const passed = passedCount > 0

    if (passed && user) {
      recordProblemSolved(user.username)
    }

    setOutput(
      `${passed ? '✅' : '⚠️'} ${passedCount}/${total} test cases matched\n\nOutput:\n${result.output}` +
        (passed
          ? user
            ? '\n\n+10 points added to your account. Streak updated.'
            : '\n\nLog in to earn points and keep your streak for solved problems.'
          : '\n\nNo test cases matched — check your logic and try again.')
    )
    setRunning(false)
  }

  return (
    <div className={theme === 'dark' ? 'bg-ink' : 'bg-white'}>
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[1.1fr_1.4fr_0.9fr] gap-0 min-h-[calc(100vh-112px)]">
        <div className={`border-r border-border p-6 overflow-y-auto ${theme === 'dark' ? 'text-white/80' : 'text-ink-soft'}`}>
          <div className="flex items-center justify-between mb-4">
            <span className="px-2.5 py-1 rounded-full bg-warning/10 text-warning text-xs font-semibold">Medium</span>
            <span className="font-mono text-sm font-semibold text-accent">⏱ {timeStr}</span>
          </div>
          <h1 className={`font-display font-bold text-xl mb-3 ${theme === 'dark' ? 'text-white' : 'text-ink'}`}>Two Sum</h1>
          <p className="text-sm leading-relaxed mb-4">
            Given an array of integers <code className="font-mono bg-muted px-1 rounded">nums</code> and an integer <code className="font-mono bg-muted px-1 rounded">target</code>,
            return indices of the two numbers such that they add up to target. You may assume exactly one solution exists, and you may not use the same element twice.
          </p>
          <div className="text-sm space-y-2 mb-6">
            <div><strong className={theme === 'dark' ? 'text-white' : 'text-ink'}>Example:</strong></div>
            <div className="font-mono text-xs bg-muted rounded-xl p-3">Input: nums = [2,7,11,15], target = 9<br/>Output: [0,1]</div>
          </div>

          <div className="mb-6">
            <h3 className={`font-semibold text-sm mb-2 ${theme === 'dark' ? 'text-white' : 'text-ink'}`}>Test Cases</h3>
            <div className="space-y-2">
              {testCases.map((tc, i) => (
                <div key={i} className="font-mono text-xs bg-muted rounded-xl p-3">
                  <div>Input: {tc.input}</div>
                  <div>Expected: {tc.expected}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className={`font-semibold text-sm mb-2 ${theme === 'dark' ? 'text-white' : 'text-ink'}`}>Hints</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs">
              {hints.map((h, i) => <li key={i}>{h}</li>)}
            </ul>
          </div>
        </div>

        <div className="border-r border-border flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-soft">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-sm font-medium bg-white border border-border rounded-xl px-3 py-1.5"
            >
              {languages.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
            </select>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="text-sm px-3 py-1.5 rounded-xl border border-border hover:bg-white"
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
          <textarea
            spellCheck={false}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`flex-1 w-full p-4 font-mono text-sm resize-none focus:outline-none ${
              theme === 'dark' ? 'bg-[#1e1e1e] text-[#d4d4d4]' : 'bg-white text-ink'
            }`}
          />
          <div className="flex gap-3 px-4 py-3 border-t border-border bg-bg-soft">
            <button
              onClick={handleRun}
              disabled={running}
              className="px-5 py-2 rounded-2xl border border-border font-semibold text-sm text-ink hover:bg-white disabled:opacity-50"
            >
              {running ? 'Running…' : '▶ Run Code'}
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
            {['console', 'input', 'leaderboard'].map((t) => (
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

          {activeTab === 'input' && (
            <div className="p-4 flex-1 flex flex-col">
              <label className="text-xs font-semibold text-ink-soft mb-2">Custom Input</label>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="flex-1 font-mono text-xs border border-border rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-accent-soft"
              />
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
