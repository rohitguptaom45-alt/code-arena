import React from 'react'
import { Link } from 'react-router-dom'

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
          <div className="flex gap-3 mt-4 text-lg items-center">
            <a href={`mailto:${CONTACT_EMAIL}`} aria-label="Email" className="hover:text-accent-soft" title={CONTACT_EMAIL}>
              <MailIcon className="w-5 h-5" />
            </a>
            <a href={`https://instagram.com/${INSTAGRAM_USERNAME}`} target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-accent-soft" title={`@${INSTAGRAM_USERNAME}`}>
              <InstagramIcon className="w-5 h-5" />
            </a>
            <a href="#" aria-label="GitHub" className="hover:text-accent-soft">🐙</a>
            <a href="#" aria-label="Discord" className="hover:text-accent-soft">💬</a>
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
