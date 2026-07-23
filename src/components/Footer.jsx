import React from 'react'
import { Link } from 'react-router-dom'

const columns = [
  { title: 'Quick Links', links: ['Home', 'Contests', 'Leaderboard', 'Subscription'] },
  { title: 'Resources', links: ['API Documentation', 'Blog', 'Announcements', 'Download App'] },
  { title: 'Community', links: ['Discussions', 'Feedback', 'Report Bug', 'Developers'] },
  { title: 'Legal', links: ['Privacy Policy', 'Terms & Conditions', 'Careers'] },
]

export default function Footer() {
  return (
    <footer className="bg-ink text-white mt-24">
      <div className="max-w-7xl mx-auto px-5 py-14 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-9 h-9 rounded-2xl bg-accent text-white grid place-items-center font-mono font-bold text-sm">&lt;/&gt;</span>
            <span className="font-display font-bold text-lg">Code<span className="text-accent-soft">Arena</span></span>
          </div>
          <p className="text-sm text-white/60 max-w-xs">Compete • Debug • Build • Win. A premium arena for developers to sharpen skills and win real prizes.</p>
          <div className="flex gap-3 mt-4 text-lg">
            <a href="#" aria-label="GitHub" className="hover:text-accent-soft">🐙</a>
            <a href="#" aria-label="LinkedIn" className="hover:text-accent-soft">💼</a>
            <a href="#" aria-label="Discord" className="hover:text-accent-soft">💬</a>
            <a href="#" aria-label="YouTube" className="hover:text-accent-soft">▶️</a>
          </div>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="font-display font-semibold mb-3 text-sm text-white/90">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l}>
                  <Link to="/more" className="text-sm text-white/60 hover:text-accent-soft transition-colors">{l}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <span>© {new Date().getFullYear()} CodeArena. All rights reserved.</span>
          <span>Built with ❤️ by passionate developers to empower every coder.</span>
        </div>
      </div>
    </footer>
  )
}
