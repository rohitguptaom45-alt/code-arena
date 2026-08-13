import React from 'react'
import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-5 py-32 text-center">
      <div className="text-6xl mb-4">🐞</div>
      <h1 className="font-display font-bold text-2xl text-ink mb-2">Page not found</h1>
      <p className="text-ink-soft text-sm mb-6">This route doesn't exist yet — maybe it's still in the backlog.</p>
      <Link to="/" className="px-5 py-2.5 rounded-2xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover">
        Back to Home
      </Link>
    </div>
  )
}
