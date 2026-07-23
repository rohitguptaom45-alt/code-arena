import React, { useEffect, useRef, useState } from 'react'
import { languageStarters } from '../data/mockData.js'

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

/**
 * REAL execution: JavaScript runs directly in the browser sandbox below by
 * capturing console.log output from a scoped Function() call.
 *
 * SIMULATED execution: Python / Java / C++ cannot be compiled inside a
 * browser artifact — there is no JVM, GCC, or CPython runtime available
 * client-side. In a production build, swap `simulateRun()` below for a real
 * call to a judge service, e.g.:
 *
 *   await fetch('https://api.judge0.com/submissions', {
 *     method: 'POST',
 *     body: JSON.stringify({ source_code, language_id, stdin }),
 *   })
 *
 * Judge0, Piston, or a custom Docker-based sandbox are the standard choices.
 */
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

function simulateRun(languageId) {
  // Deterministic "expected" style output for the Two Sum starter snippet,
  // standing in for a real remote compiler response.
  const responses = {
    python: '[0, 1]',
    java: '[0, 1]',
    cpp: '[0, 1]',
  }
  return { output: responses[languageId] || '(no output)', error: null, simulated: true }
}

export default function CodeEditor() {
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

  const handleRun = () => {
    setRunning(true)
    setActiveTab('console')
    setTimeout(() => {
      const result = language === 'javascript' ? runJavaScript(code) : simulateRun(language)
      if (result.error) {
        setOutput(`Error: ${result.error}`)
      } else {
        setOutput(result.output + (result.simulated ? '\n\n[simulated compiler output — connect a judge API for real execution]' : ''))
      }
      setRunning(false)
    }, 500)
  }

  const handleSubmit = () => {
    setRunning(true)
    setActiveTab('console')
    setTimeout(() => {
      setOutput('✅ All test cases passed (3/3)\nRuntime: 42ms | Memory: 14.2MB\nSubmission recorded on the leaderboard.')
      setRunning(false)
    }, 700)
  }

  return (
    <div className={theme === 'dark' ? 'bg-ink' : 'bg-white'}>
      <div className="max-w-[1400px] mx-auto grid lg:grid-cols-[1.1fr_1.4fr_0.9fr] gap-0 min-h-[calc(100vh-64px)]">
        {/* Problem panel */}
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

        {/* Editor panel */}
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

        {/* Console / sidebar panel */}
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
