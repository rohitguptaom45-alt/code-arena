import React from 'react'
import { developers, techLogos } from '../data/mockData.js'

export default function Developers() {
  return (
    <div className="max-w-6xl mx-auto px-5 py-14">
      <div className="text-center mb-12">
        <h1 className="font-display font-bold text-3xl text-ink">Meet Our Developers</h1>
        <p className="text-ink-soft mt-2 text-sm">The team building CodeArena, one commit at a time.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {developers.map((dev) => (
          <div key={dev.name} className="card-lift bg-white border border-border rounded-2xl p-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-bg-soft grid place-items-center text-2xl mb-3">
              {dev.name[0]}
            </div>
            <h3 className="font-display font-semibold text-ink">{dev.name}</h3>
            <p className="text-xs text-accent font-medium mb-2">{dev.role}</p>
            <div className="flex flex-wrap justify-center gap-1.5 mb-3">
              {dev.skills.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded-full bg-muted text-xs text-ink-soft">{s}</span>
              ))}
            </div>
            <div className="flex justify-center gap-4 text-xs text-ink-soft mb-3">
              <span>{dev.contributions} commits</span>
              <span>{dev.exp}</span>
            </div>
            <div className="flex justify-center gap-3 text-sm">
              <a href="#" className="hover:text-accent">🐙</a>
              <a href="#" className="hover:text-accent">💼</a>
              <a href="#" className="hover:text-accent">🌐</a>
            </div>
          </div>
        ))}
      </div>

      <section className="text-center mb-16">
        <h2 className="font-display font-bold text-xl text-ink mb-6">Our Tech Stack</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {techLogos.map((t) => (
            <span key={t} className="px-4 py-2 rounded-2xl border border-border text-sm text-ink-soft">{t}</span>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-3 gap-6 mb-16 text-center">
        <div>
          <div className="font-display font-extrabold text-2xl text-accent">2,451</div>
          <div className="text-xs text-ink-soft">Commits this year</div>
        </div>
        <div>
          <div className="font-display font-extrabold text-2xl text-accent">38</div>
          <div className="text-xs text-ink-soft">Open-source contributors</div>
        </div>
        <div>
          <div className="font-display font-extrabold text-2xl text-accent">126</div>
          <div className="text-xs text-ink-soft">Releases shipped</div>
        </div>
      </div>

      <p className="text-center text-ink-soft text-sm">
        Built with ❤️ by passionate developers to empower every coder.
      </p>
    </div>
  )
}
