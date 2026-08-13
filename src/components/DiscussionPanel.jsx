import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getComments, addComment, deleteComment, toggleCommentLike } from '../utils/appData.js'
import { getAvatarEmoji } from '../utils/auth.js'
export default function DiscussionPanel({ type, id, dark = false, placeholder = 'Ask a question or share a tip…' }) {
  const user = useSelector((s) => s.auth.user)
  const [text, setText] = useState('')
  const [comments, setComments] = useState([])
  const [error, setError] = useState('')
  const refresh = () => setComments(getComments(type, id))
  useEffect(() => {
    refresh()
  }, [type, id])
  const handlePost = () => {
    if (!user) {
      setError('Log in to join the discussion.')
      return
    }
    const res = addComment(type, id, user.username, text)
    if (res.error) {
      setError(res.error)
      return
    }
    setError('')
    setText('')
    refresh()
  }
  const handleLike = (cid) => {
    if (!user) return
    const res = toggleCommentLike(cid, user.username)
    if (!res.error) refresh()
  }
  const handleDelete = (cid) => {
    if (!user) return
    const res = deleteComment(cid, user.username)
    if (!res.error) refresh()
  }
  const mutedText = dark ? 'text-white/60' : 'text-ink-soft'
  const mainText = dark ? 'text-white' : 'text-ink'
  return (
    <div>
      {error && <div className="mb-2 text-xs text-danger">{error}</div>}
      <div className="flex gap-2 mb-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handlePost()
          }}
          placeholder={user ? placeholder : 'Log in to post'}
          className={`flex-1 px-3 py-2 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft ${dark ? 'bg-ink-soft/40 border-white/10 text-white placeholder:text-white/40' : 'border-border'}`}
        />
        <button
          onClick={handlePost}
          className="px-3 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-hover shrink-0"
        >
          Post
        </button>
      </div>
      <div className="space-y-3">
        {comments.length === 0 && <p className={`text-xs ${mutedText}`}>No comments yet — be the first.</p>}
        {comments.map((c) => (
          <div key={c.id} className="flex gap-2.5">
            <span className="w-7 h-7 rounded-full bg-accent-soft grid place-items-center text-xs shrink-0">
              {getAvatarEmoji()}
            </span>
            <div className="flex-1">
              <div className={`flex items-center gap-2 text-[11px] ${mutedText}`}>
                <span className={`font-semibold ${mainText}`}>@{c.username}</span>
                <span>{new Date(c.at).toLocaleString()}</span>
              </div>
              <p className={`text-sm mt-0.5 ${mainText}`}>{c.text}</p>
              <div className={`flex items-center gap-3 mt-1 text-[11px] ${mutedText}`}>
                <button onClick={() => handleLike(c.id)} className="hover:text-accent">
                  {(c.likes || []).includes(user?.username?.toLowerCase()) ? '❤️' : '🤍'} {(c.likes || []).length}
                </button>
                {user && c.username === user.username.toLowerCase() && (
                  <button onClick={() => handleDelete(c.id)} className="hover:text-danger">
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
