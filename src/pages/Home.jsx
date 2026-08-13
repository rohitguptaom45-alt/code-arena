import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ContestCard from '../components/ContestCard.jsx'
import LoginRequiredModal from '../components/LoginRequiredModal.jsx'
import StatCounter from '../components/StatCounter.jsx'
import { contests, categories, techLogos } from '../data/mockData.js'
export default function Home() {
  const [modalOpen, setModalOpen] = useState(false)
  const handleRegister = () => setModalOpen(true)
  return (
    <div>
      <section className="max-w-7xl mx-auto px-5 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-bg-soft text-accent text-xs font-semibold mb-5">
            Compete • Debug • Build • Win
          </span>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl leading-tight text-ink">
            Level Up Your <span className="text-accent">Coding Journey.</span>
          </h1>
          <p className="text-ink-soft mt-5 text-lg max-w-lg">
            Practice coding, compete in debugging battles, join tournaments, climb leaderboards, and win exciting cash
            prizes.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              to="/contests"
              className="px-6 py-3 rounded-2xl bg-accent text-white font-semibold hover:bg-accent-hover transition-colors shadow-lift"
            >
              Join Contest
            </Link>
            <Link
              to="/contests"
              className="px-6 py-3 rounded-2xl border border-border font-semibold text-ink hover:bg-bg-soft transition-colors"
            >
              Explore Problems
            </Link>
          </div>
        </div>

        <div className="relative h-96 hidden md:block">
          <div className="absolute inset-0 bg-bg-soft rounded-2xl" />
          <div className="absolute top-6 left-6 bg-white border border-border rounded-2xl shadow-lift p-4 w-56 float">
            <div className="text-xs text-ink-soft mb-2">editor.js</div>
            <div className="font-mono text-xs text-ink-soft leading-relaxed">
              <div>
                <span className="text-accent">function</span> solve() {'{'}
              </div>
              <div className="pl-3">return nums.map(</div>
              <div className="pl-3">(n) =&gt; n * 2</div>
              <div className="pl-3">);</div>
              <div>{'}'}</div>
            </div>
          </div>
          <div className="absolute bottom-10 left-16 bg-white border border-border rounded-2xl shadow-lift px-4 py-3 flex items-center gap-2 float-slow">
            <span className="text-2xl">🏆</span>
            <span className="text-sm font-semibold text-ink">Rank #1 Achieved</span>
          </div>
          <div className="absolute top-16 right-6 bg-white border border-border rounded-2xl shadow-lift px-4 py-3 float">
            <span className="text-2xl">🐞</span>
          </div>
          <div className="absolute bottom-6 right-10 bg-white border border-border rounded-2xl shadow-lift px-4 py-3 w-40 float-slow">
            <div className="text-xs text-ink-soft mb-1">AI Assistant</div>
            <div className="text-xs text-ink font-medium">Try memoization here →</div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl">💻</div>
        </div>
      </section>

      <section className="border-y border-border bg-bg-soft py-6 overflow-hidden">
        <div className="flex gap-10 animate-[scroll_20s_linear_infinite] whitespace-nowrap">
          {[...techLogos, ...techLogos].map((t, i) => (
            <span key={i} className="text-ink-soft font-semibold text-sm opacity-70">
              {t}
            </span>
          ))}
        </div>
        <style>{`@keyframes scroll { from { transform: translateX(0);} to { transform: translateX(-50%);} }`}</style>
      </section>

      <section className="max-w-7xl mx-auto px-5 py-20 grid grid-cols-2 md:grid-cols-5 gap-8">
        <StatCounter target={1000000} suffix="+" label="Developers" duration={1200} />
        <StatCounter target={50000} suffix="+" label="Coding Contests" />
        <StatCounter target={10000000} suffix="+" label="Problems Solved" />
        <div className="text-center">
          <div className="font-display font-extrabold text-3xl md:text-4xl text-accent">₹5 Cr+</div>
          <div className="text-sm text-ink-soft mt-1">Prize Pool Distributed</div>
        </div>
        <div className="text-center">
          <div className="font-display font-extrabold text-3xl md:text-4xl text-ink">99.9%</div>
          <div className="text-sm text-ink-soft mt-1">Platform Uptime</div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-ink">Featured Contests</h2>
            <p className="text-ink-soft mt-1 text-sm">Handpicked battles happening right now</p>
          </div>
          <Link to="/contests" className="text-accent text-sm font-semibold hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contests.map((c) => (
            <ContestCard key={c.id} contest={c} onRegister={handleRegister} />
          ))}
        </div>
      </section>

      <section className="bg-bg-soft py-16">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-ink mb-8">Contest Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                to="/contests"
                key={cat.name}
                className="card-lift bg-white border border-border rounded-2xl p-5 text-center hover:border-accent-soft"
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="text-sm font-semibold text-ink">{cat.name}</div>
                <div className="text-xs text-ink-soft mt-1">{cat.count} contests</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <LoginRequiredModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
