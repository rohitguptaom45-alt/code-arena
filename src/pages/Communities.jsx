import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getAvatarEmoji, getAvatarOptions } from '../utils/auth.js'
import {
  fetchCommunitiesRemote,
  searchCommunitiesRemote,
  createCommunityRemote,
  joinCommunityRemote,
  leaveCommunityRemote,
} from '../utils/communityGroupApi.js'
import LoginRequiredModal from '../components/LoginRequiredModal.jsx'

function CreateCommunityModal({ onClose, onCreated }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [avatar, setAvatar] = useState(getAvatarOptions()[0].id)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) return setError('Give your community a name.')
    setSaving(true)
    setError('')
    const res = await createCommunityRemote({ name: name.trim(), description: description.trim(), avatar })
    setSaving(false)
    if (res.error) return setError(res.error)
    onCreated(res.community)
  }

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50 px-4" onClick={onClose}>
      <div
        className="bg-white rounded-3xl p-6 w-full max-w-md shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display font-bold text-xl text-ink mb-4">Create a community</h2>
        <div className="flex gap-2 flex-wrap mb-4">
          {getAvatarOptions().map(({ id, emoji }) => (
            <button
              key={id}
              type="button"
              onClick={() => setAvatar(id)}
              className={`w-10 h-10 rounded-2xl grid place-items-center text-lg border transition-colors ${
                avatar === id ? 'border-accent bg-bg-soft' : 'border-border hover:bg-bg-soft'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Community name"
          className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-accent-soft"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's this community about?"
          rows={3}
          className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-accent-soft"
        />
        {error && <p className="text-xs text-danger mb-3">{error}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2.5 rounded-2xl border border-border text-sm font-semibold hover:bg-bg-soft">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={saving}
            className="px-4 py-2.5 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover disabled:opacity-60"
          >
            {saving ? 'Creating…' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Communities() {
  const user = useSelector((s) => s.auth.user)
  const [communities, setCommunities] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [loginModal, setLoginModal] = useState(false)

  const load = async () => {
    setLoading(true)
    const res = query.trim() ? await searchCommunitiesRemote(query.trim()) : await fetchCommunitiesRemote()
    setLoading(false)
    setError(res.error || '')
    setCommunities(res.communities)
  }

  useEffect(() => {
    load()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    load()
  }

  const handleToggleMembership = async (community) => {
    if (!user) return setLoginModal(true)
    if (community.isMember) {
      const res = await leaveCommunityRemote(community.id)
      if (!res.error) setCommunities((cs) => cs.map((c) => (c.id === community.id ? { ...c, isMember: false, memberCount: Math.max(0, c.memberCount - 1) } : c)))
      return
    }
    const res = await joinCommunityRemote(community.id)
    if (!res.error) setCommunities((cs) => cs.map((c) => (c.id === community.id ? { ...c, isMember: true, memberCount: c.memberCount + 1 } : c)))
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-14">
      <LoginRequiredModal open={loginModal} onClose={() => setLoginModal(false)} />
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-ink">Communities</h1>
          <p className="text-ink-soft mt-2 text-sm">Join groups of coders, chat, and share what you're building.</p>
        </div>
        {user ? (
          <button
            onClick={() => setShowCreate(true)}
            className="px-5 py-2.5 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover shadow-soft whitespace-nowrap"
          >
            + Create Community
          </button>
        ) : (
          <button
            onClick={() => setLoginModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover shadow-soft whitespace-nowrap"
          >
            + Create Community
          </button>
        )}
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search communities..."
          className="px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft w-full md:w-80"
        />
      </form>

      {loading && <p className="text-sm text-ink-soft">Loading communities…</p>}
      {!loading && error && <p className="text-sm text-danger">{error}</p>}
      {!loading && !error && communities.length === 0 && (
        <p className="text-sm text-ink-soft text-center py-16">No communities yet — be the first to create one.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((c) => (
          <div key={c.id} className="card-lift bg-white border border-border rounded-2xl p-6">
            <Link to={`/communities/${c.id}`} className="flex items-center gap-3 mb-3">
              <span className="w-11 h-11 rounded-2xl bg-accent-soft grid place-items-center text-xl shrink-0">
                {getAvatarEmoji(c.avatar)}
              </span>
              <div className="min-w-0">
                <h3 className="font-display font-semibold text-ink truncate">{c.name}</h3>
                <p className="text-xs text-ink-soft">{c.memberCount} members</p>
              </div>
            </Link>
            <p className="text-sm text-ink-soft line-clamp-2 mb-4">{c.description || 'No description yet.'}</p>
            <button
              onClick={() => handleToggleMembership(c)}
              className={`w-full py-2 rounded-xl text-sm font-semibold transition-colors ${
                c.isMember ? 'border border-border text-ink hover:bg-bg-soft' : 'bg-accent text-white hover:bg-accent-hover'
              }`}
            >
              {c.isMember ? 'Leave' : 'Join'}
            </button>
          </div>
        ))}
      </div>

      {showCreate && (
        <CreateCommunityModal
          onClose={() => setShowCreate(false)}
          onCreated={(community) => {
            setShowCreate(false)
            if (community) setCommunities((cs) => [community, ...cs])
          }}
        />
      )}
    </div>
  )
}
