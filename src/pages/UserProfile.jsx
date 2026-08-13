import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import FollowButton from '../components/FollowButton.jsx'
import { getUserByUsername, getFollowCounts } from '../utils/appData.js'
import { getAvatarEmoji } from '../utils/auth.js'
export default function UserProfile() {
  const { username } = useParams()
  const navigate = useNavigate()
  const currentUser = useSelector((s) => s.auth.user)
  const profile = getUserByUsername(username)
  if (!profile) {
    return (
      <div className="max-w-md mx-auto px-5 py-24 text-center">
        <h1 className="font-display font-bold text-2xl text-ink mb-2">User not found</h1>
        <p className="text-sm text-ink-soft mb-6">@{username} doesn't seem to have an account here.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover"
        >
          Go back
        </button>
      </div>
    )
  }
  if (currentUser && currentUser.username === profile.username) {
    return (
      <div className="max-w-md mx-auto px-5 py-24 text-center">
        <h1 className="font-display font-bold text-2xl text-ink mb-2">This is you!</h1>
        <p className="text-sm text-ink-soft mb-6">Head to your own profile to manage stats and settings.</p>
        <Link
          to="/profile"
          className="px-6 py-2.5 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover"
        >
          Go to my profile
        </Link>
      </div>
    )
  }
  const followCounts = getFollowCounts(profile.username)
  const stats = [
    {
      label: 'Problems Solved',
      value: profile.problemsSolved || 0,
      icon: '🧩',
    },
    {
      label: 'Contests Participated',
      value: (profile.contestsParticipated || []).length,
      icon: '🏁',
    },
    {
      label: 'Contests Won',
      value: profile.contestsWon || 0,
      icon: '🏆',
    },
    {
      label: 'Followers',
      value: followCounts.followers,
      icon: '👥',
    },
    {
      label: 'Following',
      value: followCounts.following,
      icon: '➕',
    },
    {
      label: 'Longest Streak',
      value: profile.streakLongest || 0,
      icon: '🔥',
    },
  ]
  return (
    <div className="max-w-4xl mx-auto px-5 py-14">
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div className="flex items-center gap-4">
          <span className="w-20 h-20 rounded-3xl bg-accent-soft grid place-items-center text-4xl">
            {getAvatarEmoji(profile.avatar)}
          </span>
          <div>
            <h1 className="font-display font-bold text-2xl text-ink">{profile.fullName}</h1>
            <p className="text-ink-soft text-sm">
              @{profile.username} · {profile.type}
            </p>
            {profile.github && (
              <a
                href={profile.github.startsWith('http') ? profile.github : `https://github.com/${profile.github}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-1 text-xs text-accent hover:underline"
              >
                🐙 GitHub profile
              </a>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {profile.remoteId && (
            <>
              <button
                onClick={() => navigate(currentUser ? `/chat?with=${profile.remoteId}` : '/login')}
                className="px-4 py-1.5 rounded-full text-sm font-semibold border border-border text-ink hover:bg-bg-soft"
              >
                💬 Message
              </button>
              <button
                onClick={() => navigate(currentUser ? `/chat?newGroupWith=${profile.remoteId}` : '/login')}
                className="px-4 py-1.5 rounded-full text-sm font-semibold border border-border text-ink hover:bg-bg-soft"
                title="Start a group chat with this person"
              >
                👥 Add to group
              </button>
            </>
          )}
          <FollowButton username={profile.username} remoteId={profile.remoteId} />
        </div>
      </div>

      {profile.bio && <p className="text-sm text-ink-soft mb-8 border-l-2 border-accent pl-3">{profile.bio}</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-border rounded-2xl p-5 text-center bg-white">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="font-display font-extrabold text-2xl text-ink">{s.value}</div>
            <div className="text-xs text-ink-soft mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
