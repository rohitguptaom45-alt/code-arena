import React from 'react'
import { Link } from 'react-router-dom'

export default function LoginRequiredModal({ open, onClose }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center px-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-lift max-w-sm w-full p-8 text-center animate-[fadeIn_.2s_ease]">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-bg-soft grid place-items-center text-2xl mb-4">🔒</div>
        <h3 className="font-display font-bold text-xl text-ink mb-2">Login Required</h3>
        <p className="text-sm text-ink-soft mb-6">
          Please login or create an account to participate in coding contests.
        </p>
        <div className="flex gap-3">
          <Link to="/login" onClick={onClose} className="flex-1 py-2.5 rounded-2xl border border-border text-sm font-medium text-ink hover:bg-bg-soft">
            Login
          </Link>
          <Link to="/signup" onClick={onClose} className="flex-1 py-2.5 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover">
            Create Account
          </Link>
        </div>
        <button onClick={onClose} className="mt-4 text-xs text-ink-soft/60 hover:text-ink-soft">Maybe later</button>
      </div>
    </div>
  )
}
