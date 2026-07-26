import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { isFollowing, toggleFollow } from '../utils/appData.js'

export default function FollowButton({ username, size = 'md', className = '' }) {
  const user = useSelector((s) => s.auth.user)
  const navigate = useNavigate()
  const [following, setFollowing] = useState(user ? isFollowing(user.username, username) : false)

  if (user && user.username === username.trim().toLowerCase()) return null

  const handleClick = () => {
    if (!user) {
      navigate('/login')
      return
    }
    toggleFollow(user.username, username)
    setFollowing((f) => !f)
  }

  const sizing = size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'

  return (
    <button
      onClick={handleClick}
      className={`rounded-full font-semibold transition-colors shrink-0 ${sizing} ${
        following
          ? 'border border-border text-ink-soft hover:border-danger hover:text-danger'
          : 'bg-accent text-white hover:bg-accent-hover'
      } ${className}`}
    >
      {following ? '✓ Following' : '+ Follow'}
    </button>
  )
}
