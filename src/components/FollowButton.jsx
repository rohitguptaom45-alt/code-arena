import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { isFollowing, toggleFollow } from '../utils/appData.js'
import { toggleFollowRemote, fetchFollowStatusRemote } from '../utils/socialApi.js'
export default function FollowButton({ username, remoteId, size = 'md', className = '' }) {
  const user = useSelector((s) => s.auth.user)
  const navigate = useNavigate()
  const [following, setFollowing] = useState(user ? isFollowing(user.username, username) : false)
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    if (!user || !remoteId) return
    fetchFollowStatusRemote(remoteId).then((res) => {
      if (typeof res.isFollowing === 'boolean') setFollowing(res.isFollowing)
    })
  }, [user, remoteId])
  if (user && user.username === username.trim().toLowerCase()) return null
  const handleClick = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    if (remoteId) {
      setBusy(true)
      const res = await toggleFollowRemote(remoteId)
      setBusy(false)
      if (typeof res.isFollowing === 'boolean') {
        setFollowing(res.isFollowing)
        return
      }
    }
    toggleFollow(user.username, username)
    setFollowing((f) => !f)
  }
  const sizing = size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'
  return (
    <button
      onClick={handleClick}
      disabled={busy}
      className={`rounded-full font-semibold transition-colors shrink-0 disabled:opacity-60 ${sizing} ${following ? 'border border-border text-ink-soft hover:border-danger hover:text-danger' : 'bg-accent text-white hover:bg-accent-hover'} ${className}`}
    >
      {following ? '✓ Following' : '+ Follow'}
    </button>
  )
}
