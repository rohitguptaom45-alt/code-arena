import React from 'react'
import { Link } from 'react-router-dom'

const CONTACT_EMAIL = 'rohitgupta0m45@gmail.com'
const INSTAGRAM_USERNAME = 'laracrystgc'
const GITHUB_URL = 'https://github.com/rohitguptaom45-alt'
const LINKEDIN_URL = 'https://www.linkedin.com/in/rohit-gupta-666502423/'

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
function LinkedInIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="7.5" cy="8" r="1.4" />
      <rect x="6.4" y="10.5" width="2.2" height="7" />
      <path d="M11.5 10.5h2.1v1.1c.5-.8 1.4-1.3 2.4-1.3 2 0 2.9 1.3 2.9 3.4v3.8h-2.2v-3.4c0-1-.4-1.7-1.3-1.7-.9 0-1.5.6-1.5 1.7v3.4h-2.4v-7Z" stroke="none" />
    </svg>
  )
}
function GitHubIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 2C6.48 2 2 6.58 2 12.2c0 4.5 2.87 8.3 6.84 9.65.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.46-1.19-1.11-1.51-1.11-1.51-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.55 2.34 1.1 2.91.84.09-.66.35-1.1.63-1.36-2.22-.26-4.56-1.13-4.56-5.04 0-1.11.39-2.02 1.03-2.73-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05a9.4 9.4 0 0 1 5 0c1.9-1.32 2.74-1.05 2.74-1.05.55 1.42.2 2.47.1 2.73.64.71 1.03 1.62 1.03 2.73 0 3.92-2.34 4.78-4.57 5.03.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.2C22 6.58 17.52 2 12 2Z" />
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
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-accent-soft">
              <GitHubIcon className="w-5 h-5" />
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-accent-soft">
              <LinkedInIcon className="w-5 h-5" />
            </a>
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
