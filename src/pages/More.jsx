import React from 'react'
import { Link } from 'react-router-dom'
import { developers } from '../data/mockData.js'
const CONTACT_EMAIL = 'rohitgupta0m45@gmail.com'
const INSTAGRAM_USERNAME = 'laracrystgc'
function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  )
}
function MailIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3.5 6.5 12 13l8.5-6.5" />
    </svg>
  )
}
const groups = {
  Support: ['Help Center', 'FAQs', 'Report a Bug'],
  Community: ['Community', 'Feedback', 'API Documentation', 'Download Mobile App'],
  Legal: ['Privacy Policy', 'Terms & Conditions'],
}
const timeline = [
  {
    year: '2023',
    title: 'A Hostel Room Idea',
    text: 'Rohit and Nagender started building CodeArena over a weekend, just to make DSA practice with friends less boring.',
  },
  {
    year: '2024',
    title: 'First 1,000 Coders',
    text: 'Weekly contests, a leaderboard, and a scrappy in-browser editor brought in our first real community.',
  },
  {
    year: '2025',
    title: 'Tournaments & Chat',
    text: 'Added language-specific tournaments, quizzes, tutorials, and community chat so coders could learn together, not just compete.',
  },
  {
    year: '2026',
    title: 'Still Building',
    text: 'Still run mostly by students, between classes and exams — now growing into a full learning + competition platform.',
  },
]
export default function More() {
  const founders = developers.slice(0, 2)
  return (
    <div className="max-w-5xl mx-auto px-5 py-14">
      <div className="text-center mb-14">
        <span className="inline-block px-3 py-1 rounded-full bg-bg-soft text-xs font-medium text-ink-soft mb-4">
          About CodeArena
        </span>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-ink mb-4">Built by coders, for coders.</h1>
        <p className="text-ink-soft max-w-xl mx-auto text-sm leading-relaxed">
          CodeArena started as a student side-project and turned into a place where developers battle it out in
          contests, learn from tutorials, quiz themselves, and talk shop in one community.
        </p>
      </div>

      <section className="bg-bg-soft rounded-2xl p-8 grid md:grid-cols-3 gap-8 mb-16">
        <div>
          <div className="text-2xl mb-2">🎯</div>
          <h3 className="font-display font-semibold text-ink mb-2">Our Mission</h3>
          <p className="text-sm text-ink-soft">
            Make world-class competitive programming accessible to every developer, everywhere — no matter what college
            they're from.
          </p>
        </div>
        <div>
          <div className="text-2xl mb-2">🔭</div>
          <h3 className="font-display font-semibold text-ink mb-2">Our Vision</h3>
          <p className="text-sm text-ink-soft">
            A global arena where skill, not pedigree, decides who gets noticed, hired, and funded.
          </p>
        </div>
        <div>
          <div className="text-2xl mb-2">🚀</div>
          <h3 className="font-display font-semibold text-ink mb-2">Our Journey</h3>
          <p className="text-sm text-ink-soft">
            Started in 2023 as a weekend project by two engineering students; still growing, one contest at a time.
          </p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-display font-bold text-xl text-ink mb-6 text-center">The Founders</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {founders.map((f) => (
            <div
              key={f.name}
              className="card-lift bg-white border border-border rounded-2xl p-6 flex gap-4 items-start"
            >
              <div className="w-14 h-14 shrink-0 rounded-full bg-accent-soft text-white grid place-items-center text-xl font-semibold">
                {f.name[0]}
              </div>
              <div>
                <h3 className="font-display font-semibold text-ink">{f.name}</h3>
                <p className="text-xs text-accent font-medium">{f.role}</p>
                <p className="text-xs text-ink-soft mb-2">{f.qualification}</p>
                <p className="text-sm text-ink-soft leading-relaxed">{f.bio}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-ink-soft mt-4">
          Meet the whole crew on the{' '}
          <Link to="/developers" className="text-accent hover:underline">
            Developers
          </Link>{' '}
          page.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-display font-bold text-xl text-ink mb-6 text-center">How We Got Here</h2>
        <div className="space-y-5">
          {timeline.map((t) => (
            <div key={t.year} className="flex gap-4">
              <div className="w-16 shrink-0 text-right font-display font-bold text-accent text-sm pt-0.5">{t.year}</div>
              <div className="w-px bg-border relative">
                <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-accent" />
              </div>
              <div className="pb-1">
                <h4 className="font-semibold text-sm text-ink">{t.title}</h4>
                <p className="text-sm text-ink-soft mt-0.5">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-display font-bold text-xl text-ink mb-6 text-center">Get in Touch</h2>
        <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('CodeArena — Question')}`}
            className="card-lift flex items-center gap-4 border border-border rounded-2xl p-5 hover:border-accent-soft bg-white"
          >
            <span className="w-12 h-12 rounded-2xl bg-accent-soft text-white grid place-items-center shrink-0">
              <MailIcon className="w-5 h-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">Email us</span>
              <span className="block text-xs text-ink-soft">{CONTACT_EMAIL}</span>
            </span>
          </a>
          <a
            href={`https://instagram.com/${INSTAGRAM_USERNAME}`}
            target="_blank"
            rel="noreferrer"
            className="card-lift flex items-center gap-4 border border-border rounded-2xl p-5 hover:border-accent-soft bg-white"
          >
            <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-accent-soft text-white grid place-items-center shrink-0">
              <InstagramIcon className="w-5 h-5" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">Follow us</span>
              <span className="block text-xs text-ink-soft">@{INSTAGRAM_USERNAME}</span>
            </span>
          </a>
        </div>
      </section>

      <section>
        <h2 className="font-display font-bold text-xl text-ink mb-6 text-center">More From CodeArena</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(groups).map(([title, items]) => (
            <div key={title}>
              <h3 className="font-display font-semibold text-sm text-ink mb-3">{title}</h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <button
                    key={item}
                    className="card-lift w-full text-left px-4 py-2.5 rounded-2xl border border-border text-sm text-ink-soft hover:border-accent-soft hover:text-ink"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
