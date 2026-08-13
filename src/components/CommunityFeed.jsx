import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getPosts, createPost, deletePost, togglePostLike, addPostComment } from '../utils/appData.js'
import { getAvatarEmoji } from '../utils/auth.js'
import {
  fetchDiscussionsRemote,
  createDiscussionRemote,
  deleteDiscussionRemote,
  toggleDiscussionLikeRemote,
  fetchDiscussionRepliesRemote,
  replyToDiscussionRemote,
} from '../utils/socialApi.js'
function timeAgo(iso) {
  const diffSec = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000))
  if (diffSec < 60) return `${diffSec}s`
  const diffMin = Math.round(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m`
  const diffHr = Math.round(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h`
  return `${Math.round(diffHr / 24)}d`
}
function normalizeDiscussion(d) {
  return {
    id: d.id,
    remote: true,
    username: d.owner?.username || 'someone',
    avatar: d.owner?.avatar,
    ownerId: d.ownerId,
    text: d.content,
    at: d.createdAt,
    isEdited: d.isEdited,
    likeCount: d._count?.like ?? 0,
    replyCount: d._count?.replies ?? 0,
  }
}
function PostComposer({ user, onPosted }) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [posting, setPosting] = useState(false)
  const handlePost = async () => {
    if (!user || !text.trim()) return
    setError('')
    setPosting(true)
    const remote = await createDiscussionRemote(text.trim())
    if (remote.discussion) {
      setPosting(false)
      setText('')
      onPosted(normalizeDiscussion(remote.discussion))
      return
    }
    const res = createPost(user.username, text)
    setPosting(false)
    if (res.error) {
      setError(res.error)
      return
    }
    setText('')
    onPosted()
  }
  if (!user) {
    return (
      <div className="border border-border rounded-2xl p-5 mb-6 text-sm text-ink-soft">
        <Link to="/login" className="text-accent font-semibold hover:underline">
          Log in
        </Link>{' '}
        to share something with the community.
      </div>
    )
  }
  return (
    <div className="border border-border rounded-2xl p-5 mb-6">
      <div className="flex gap-3">
        <span className="w-10 h-10 rounded-full bg-accent-soft grid place-items-center text-lg shrink-0">
          {getAvatarEmoji(user.avatar)}
        </span>
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Share a win, ask for help, or talk shop with the community…"
            className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent-soft"
          />
          {error && <p className="text-xs text-danger mt-1">{error}</p>}
          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] text-ink-soft/70">{text.length}/500</span>
            <button
              onClick={handlePost}
              disabled={posting || !text.trim()}
              className="px-5 py-2 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover disabled:opacity-60"
            >
              {posting ? 'Posting…' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
function RepliesViewer({ discussionId, user }) {
  const [replies, setReplies] = useState(null)
  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)
  const load = () => {
    fetchDiscussionRepliesRemote(discussionId).then((res) => setReplies(res.replies))
  }
  useEffect(() => {
    load()
  }, [discussionId])
  const handleReply = async () => {
    if (!user || !text.trim()) return
    setPosting(true)
    const res = await replyToDiscussionRemote(discussionId, text.trim())
    setPosting(false)
    if (!res.error) {
      setText('')
      load()
    }
  }
  return (
    <div className="space-y-2">
      {replies === null && <p className="text-xs text-ink-soft/70">Loading replies…</p>}
      {replies !== null && replies.length === 0 && <p className="text-xs text-ink-soft/70">No replies yet.</p>}
      {replies?.map((r) => (
        <div key={r.id} className="flex gap-2 text-sm">
          <span className="w-6 h-6 rounded-full bg-muted grid place-items-center text-xs shrink-0">{getAvatarEmoji(r.owner?.avatar)}</span>
          <div>
            <span className="font-semibold text-ink mr-1.5">@{r.owner?.username}</span>
            <span className="text-ink-soft">{r.content}</span>
          </div>
        </div>
      ))}
      {user && (
        <div className="flex gap-2 pt-1">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleReply()
            }}
            placeholder="Reply…"
            className="flex-1 px-3 py-1.5 rounded-xl border border-border text-xs focus:outline-none focus:ring-2 focus:ring-accent-soft"
          />
          <button
            onClick={handleReply}
            disabled={posting || !text.trim()}
            className="px-3 py-1.5 rounded-xl bg-bg-soft text-xs font-semibold text-ink hover:bg-muted disabled:opacity-60"
          >
            Reply
          </button>
        </div>
      )}
    </div>
  )
}
function PostCard({ post, user, onChange }) {
  const [commentText, setCommentText] = useState('')
  const [showComments, setShowComments] = useState(false)
  const [liked, setLiked] = useState(post.remote ? false : (post.likes || []).includes(user?.username?.toLowerCase()))
  const [likeCount, setLikeCount] = useState(post.remote ? post.likeCount : (post.likes || []).length)
  const handleLike = async () => {
    if (!user) return
    if (post.remote) {
      const res = await toggleDiscussionLikeRemote(post.id)
      if (!res.error) {
        setLiked(res.isLiked)
        setLikeCount((c) => c + (res.isLiked ? 1 : -1))
      }
      return
    }
    const res = togglePostLike(post.id, user.username)
    if (!res.error) onChange()
  }
  const handleComment = () => {
    if (!user || !commentText.trim() || post.remote) return
    const res = addPostComment(post.id, user.username, commentText)
    if (!res.error) {
      setCommentText('')
      onChange()
    }
  }
  const handleDelete = async () => {
    if (!user) return
    if (post.remote) {
      const res = await deleteDiscussionRemote(post.id)
      if (!res.error) onChange()
      return
    }
    const res = deletePost(post.id, user.username)
    if (!res.error) onChange()
  }
  const isOwner = user && (post.remote ? post.ownerId === user.remoteId : post.username === user.username.toLowerCase())
  return (
    <div className="border border-border rounded-2xl p-5">
      <div className="flex gap-3">
        <Link to={`/u/${post.username}`} className="shrink-0">
          <span className="w-10 h-10 rounded-full bg-accent-soft grid place-items-center text-lg">
            {getAvatarEmoji(post.avatar)}
          </span>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-ink-soft">
            <Link to={`/u/${post.username}`} className="font-semibold text-ink hover:text-accent">
              @{post.username}
            </Link>
            <span>· {timeAgo(post.at)}</span>
            {post.isEdited && <span>· edited</span>}
            {isOwner && (
              <button onClick={handleDelete} className="ml-auto hover:text-danger">
                Delete
              </button>
            )}
          </div>
          <p className="text-sm text-ink mt-1 whitespace-pre-wrap break-words">{post.text}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-ink-soft">
            <button onClick={handleLike} className={`hover:text-accent ${liked ? 'text-danger' : ''}`}>
              {liked ? '❤️' : '🤍'} {likeCount}
            </button>
            <button onClick={() => setShowComments((v) => !v)} className="hover:text-accent">
              💬 {post.remote ? post.replyCount : (post.comments || []).length}
            </button>
          </div>
          {showComments && (
            <div className="mt-3 space-y-2.5">
              {post.remote ? (
                <RepliesViewer discussionId={post.id} user={user} />
              ) : (
                <>
                  {(post.comments || []).map((c) => (
                    <div key={c.id} className="flex gap-2 text-sm">
                      <span className="w-6 h-6 rounded-full bg-muted grid place-items-center text-xs shrink-0">
                        {getAvatarEmoji()}
                      </span>
                      <div>
                        <span className="font-semibold text-ink mr-1.5">@{c.username}</span>
                        <span className="text-ink-soft">{c.text}</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleComment()
                      }}
                      placeholder={user ? 'Reply…' : 'Log in to reply'}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-border text-xs focus:outline-none focus:ring-2 focus:ring-accent-soft"
                    />
                    <button
                      onClick={handleComment}
                      className="px-3 py-1.5 rounded-xl bg-bg-soft text-xs font-semibold text-ink hover:bg-muted"
                    >
                      Reply
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default function CommunityFeed({ showHeading = true }) {
  const user = useSelector((s) => s.auth.user)
  const [posts, setPosts] = useState([])
  const refresh = (prepend) => {
    fetchDiscussionsRemote().then((res) => {
      const remotePosts = res.discussions.map(normalizeDiscussion)
      const local = getPosts()
      const merged = prepend ? [prepend, ...remotePosts, ...local] : [...remotePosts, ...local]
      setPosts(merged)
    })
  }
  useEffect(() => {
    refresh()
  }, [])
  return (
    <div className="max-w-2xl">
      {showHeading && (
        <>
          <h2 className="font-display font-bold text-xl text-ink mb-1">Community</h2>
          <p className="text-sm text-ink-soft mb-6">
            The site-wide discussion feed — not specific to this contest, but a good place to ask questions while you're here.
          </p>
        </>
      )}

      <PostComposer user={user} onPosted={(prepend) => refresh(prepend)} />

      <div className="space-y-4">
        {posts.length === 0 && (
          <div className="text-center py-16 text-sm text-ink-soft">
            No posts yet — be the first to share something with the community.
          </div>
        )}
        {posts.map((p) => (
          <PostCard key={p.id} post={p} user={user} onChange={() => refresh()} />
        ))}
      </div>
    </div>
  )
}
