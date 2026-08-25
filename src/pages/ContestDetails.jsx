import React, { useEffect, useMemo, useState } from 'react'
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { contests as mockContests } from '../data/mockData.js'
import {
  getAllContests,
  registerForContest,
  isRegistered,
  deleteContest as deleteLocalContest,
} from '../utils/appData.js'
import {
  fetchContestsRemoteFirst,
  joinContestRemoteFirst,
  leaveContestRemoteFirst,
  cancelContestRemoteFirst,
  deleteContestRemoteFirst,
  updateContestDetailsRemoteFirst,
  updateContestTimeRemoteFirst,
  changeContestPasswordRemoteFirst,
  fetchContestParticipantsRemote,
  fetchContestRankRemote,
} from '../utils/contestApi.js'
import { getAvatarEmoji } from '../utils/auth.js'
import {
  postCommentRemote,
  updateCommentRemote,
  deleteCommentRemote,
  fetchContestCommentsRemote,
  toggleCommentLikeRemote,
  toggleContestLikeRemote,
  fetchCommentRepliesRemote,
  replyToCommentRemote,
} from '../utils/socialApi.js'
import { fetchContestProblemsRemote } from '../utils/problemApi.js'
import {
  getComments,
  addComment,
  deleteComment,
  toggleCommentLike,
  getLikeCount,
  hasLiked,
  toggleLike,
  getRatingSummary,
  getUserRating,
  submitRating,
  getFeedback,
  submitFeedback,
} from '../utils/appData.js'
import LoginRequiredModal from '../components/LoginRequiredModal.jsx'
import CommunityFeed from '../components/CommunityFeed.jsx'
function normalizeRemoteComment(c, myUsername) {
  const likedByMe = false
  return {
    id: c.id,
    remote: true,
    username: (c.owner?.username || 'user').toLowerCase(),
    avatar: c.owner?.avatar,
    text: c.content,
    at: c.createdAt,
    likes: likedByMe && myUsername ? [myUsername.toLowerCase()] : [],
  }
}
function parseDurationMs(duration) {
  const m = String(duration || '').match(/([\d.]+)\s*(hr|hour|min)/i)
  if (!m) return 60 * 60000
  const val = parseFloat(m[1])
  return m[2].toLowerCase().startsWith('h') ? val * 3600000 : val * 60000
}
function getContestTimes(contest) {
  const startMs = contest.startingFrom
    ? new Date(contest.startingFrom).getTime()
    : contest.startTime
      ? new Date(contest.startTime).getTime()
      : Date.now() + (contest.startsInSeconds || 0) * 1000
  const endMs = contest.endingAt
    ? new Date(contest.endingAt).getTime()
    : contest.endTime
      ? new Date(contest.endTime).getTime()
      : startMs + parseDurationMs(contest.duration)
  return {
    startMs,
    endMs,
  }
}
function formatCountdown(ms) {
  if (ms <= 0) return '0s'
  const totalSec = Math.floor(ms / 1000)
  const d = Math.floor(totalSec / 86400)
  const h = Math.floor((totalSec % 86400) / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  const parts = []
  if (d) parts.push(`${d}d`)
  if (d || h) parts.push(`${h}h`)
  if (d || h || m) parts.push(`${m}m`)
  parts.push(`${s}s`)
  return parts.join(' ')
}
const difficultyColors = {
  Easy: 'bg-success/10 text-success',
  Medium: 'bg-warning/10 text-warning',
  Hard: 'bg-danger/10 text-danger',
}
function capitalize(s) {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1)
}
function CommentReplies({ commentId, user }) {
  const [open, setOpen] = useState(false)
  const [replies, setReplies] = useState(null)
  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)
  const load = () => {
    fetchCommentRepliesRemote(commentId).then((res) => setReplies(res.replies))
  }
  const handleOpen = () => {
    setOpen((v) => !v)
    if (replies === null) load()
  }
  const handleReply = async () => {
    if (!user || !text.trim()) return
    setPosting(true)
    const res = await replyToCommentRemote(commentId, text.trim())
    setPosting(false)
    if (!res.error) {
      setText('')
      load()
    }
  }
  return (
    <div className="mt-1">
      <button onClick={handleOpen} className="text-xs text-ink-soft hover:text-accent">
        {open ? 'Hide replies' : 'Reply'}
      </button>
      {open && (
        <div className="mt-2 pl-4 border-l border-border space-y-2">
          {replies === null && <p className="text-xs text-ink-soft/70">Loading replies…</p>}
          {replies !== null && replies.length === 0 && <p className="text-xs text-ink-soft/70">No replies yet.</p>}
          {replies?.map((r) => (
            <div key={r.id} className="flex gap-2 text-sm">
              <span className="w-6 h-6 rounded-full bg-muted grid place-items-center text-xs shrink-0">
                {getAvatarEmoji(r.owner?.avatar)}
              </span>
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
      )}
    </div>
  )
}
function ProblemCard({ problem, index, contestId, canSolve, status, locked }) {
  const p = problem
  const diffLabel = capitalize(p.difficulty)
  const diffClass = difficultyColors[diffLabel] || 'bg-muted text-ink-soft'
  const solveHref = `/editor?contestId=${contestId}&problemId=${p.id}`

  let ctaLabel = 'Solve'
  let ctaIcon = '▶'
  if (status === 'ended') {
    ctaLabel = 'Practice'
    ctaIcon = '↻'
  } else if (status === 'upcoming') {
    ctaLabel = 'Locked'
    ctaIcon = '🔒'
  }

  return (
    <div className="group relative border border-border rounded-2xl p-4 hover:border-accent hover:shadow-soft transition-all bg-white">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-7 h-7 shrink-0 rounded-full bg-bg-soft text-ink-soft text-xs font-semibold grid place-items-center mt-0.5">
            {index + 1}
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm text-ink truncate">{p.title}</h3>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${diffClass}`}>{diffLabel}</span>
              {p.tags?.slice(0, 3).map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-full bg-muted text-[10px] text-ink-soft">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {canSolve && !locked ? (
          <Link
            to={solveHref}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              status === 'ended'
                ? 'bg-bg-soft text-ink hover:bg-muted'
                : 'bg-accent text-white hover:bg-accent-hover shadow-soft'
            }`}
          >
            <span>{ctaIcon}</span> {ctaLabel}
          </Link>
        ) : (
          <span
            title={status === 'upcoming' ? 'Unlocks when the contest starts' : 'Join the contest to unlock'}
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-bg-soft text-ink-soft/70 cursor-not-allowed"
          >
            🔒 {status === 'upcoming' ? 'Locked' : 'Join to solve'}
          </span>
        )}
      </div>
    </div>
  )
}
export default function ContestDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const refBy = searchParams.get('ref')
  const user = useSelector((s) => s.auth.user)
  const [modalOpen, setModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [remoteContests, setRemoteContests] = useState([])
  const [participants, setParticipants] = useState([])
  const [rank, setRank] = useState([])
  const [remoteProblems, setRemoteProblems] = useState([])
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState('')
  const [now, setNow] = useState(Date.now())
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([])
  const [likeState, setLikeState] = useState({
    count: 0,
    liked: false,
  })
  const [ratingSummary, setRatingSummary] = useState({
    count: 0,
    average: 0,
  })
  const [myRating, setMyRating] = useState(0)
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackList, setFeedbackList] = useState([])
  useEffect(() => {
    fetchContestsRemoteFirst().then((res) => setRemoteContests(res.contests))
  }, [])
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const allContests = useMemo(() => {
    const local = getAllContests(mockContests)
    const remoteIds = new Set(remoteContests.map((c) => c.id))
    return [...remoteContests, ...local.filter((c) => !remoteIds.has(c.id))]
  }, [remoteContests])
  const contest = allContests.find((c) => c.id === id) || allContests[0]
  useEffect(() => {
    if (!contest?.remote) return
    fetchContestParticipantsRemote(contest.id).then((res) => setParticipants(res.participants))
    fetchContestRankRemote(contest.id).then((res) => setRank(res.rank))
    fetchContestProblemsRemote(contest.id).then((res) => setRemoteProblems(res.problems))
  }, [contest?.id, contest?.remote])
  const alreadyRegistered = user ? isRegistered(contest.id, user.username) || registered : false
  const isOwner = user && contest.createdBy === user.username
  const { startMs, endMs } = useMemo(() => getContestTimes(contest), [contest])
  const status = now < startMs ? 'upcoming' : now < endMs ? 'live' : 'ended'
  // Owners can always preview their own problems; everyone else must join first,
  // and problems stay locked until the contest actually starts.
  const canSolve = alreadyRegistered || isOwner
  const problemsLocked = status === 'upcoming' && !isOwner
  useEffect(() => {
    if (contest.remote) {
      fetchContestCommentsRemote(contest.id).then((res) =>
        setComments(res.comments.map((c) => normalizeRemoteComment(c, user?.username)))
      )
    } else {
      setComments(getComments('contest', contest.id))
    }
    setLikeState({
      count: getLikeCount('contest', contest.id),
      liked: user ? hasLiked('contest', contest.id, user.username) : false,
    })
    setRatingSummary(getRatingSummary('contest', contest.id))
    setMyRating(user ? getUserRating('contest', contest.id, user.username)?.stars || 0 : 0)
    setFeedbackList(getFeedback('contest', contest.id))
  }, [contest.id, contest.remote, user])
  const handleAddComment = async () => {
    if (!user) {
      setModalOpen(true)
      return
    }
    if (contest.remote) {
      const res = await postCommentRemote(contest.id, commentText)
      if (res.error) {
        setActionError(res.error)
        return
      }
      setCommentText('')
      setActionError('')
      setComments((cs) => [normalizeRemoteComment(res.comment, user.username), ...cs])
      return
    }
    const res = addComment('contest', contest.id, user.username, commentText)
    if (res.error) {
      setActionError(res.error)
      return
    }
    setCommentText('')
    setActionError('')
    setComments(getComments('contest', contest.id))
  }
  const handleToggleCommentLike = async (id) => {
    if (!user) {
      setModalOpen(true)
      return
    }
    const target = comments.find((c) => c.id === id)
    if (target?.remote) {
      const res = await toggleCommentLikeRemote(id)
      if (res.error) return
      setComments((cs) =>
        cs.map((c) => {
          if (c.id !== id) return c
          const mine = user.username.toLowerCase()
          const likes = res.isLiked
            ? [...new Set([...(c.likes || []), mine])]
            : (c.likes || []).filter((u) => u !== mine)
          return {
            ...c,
            likes,
          }
        })
      )
      return
    }
    const res = toggleCommentLike(id, user.username)
    if (!res.error) setComments(getComments('contest', contest.id))
  }
  const handleDeleteComment = async (id) => {
    if (!user) return
    const target = comments.find((c) => c.id === id)
    if (target?.remote) {
      const res = await deleteCommentRemote(id)
      if (!res.error) setComments((cs) => cs.filter((c) => c.id !== id))
      return
    }
    const res = deleteComment(id, user.username)
    if (!res.error) setComments(getComments('contest', contest.id))
  }
  const handleToggleLike = async () => {
    if (!user) {
      setModalOpen(true)
      return
    }
    if (contest.remote) {
      const res = await toggleContestLikeRemote(contest.id)
      if (!res.error)
        setLikeState((s) => ({
          count: s.count + (res.isLiked ? 1 : -1),
          liked: res.isLiked,
        }))
      return
    }
    const res = toggleLike('contest', contest.id, user.username)
    if (!res.error)
      setLikeState({
        count: res.count,
        liked: res.liked,
      })
  }
  const handleRate = (stars) => {
    if (!user) {
      setModalOpen(true)
      return
    }
    const res = submitRating('contest', contest.id, user.username, stars)
    if (!res.error) {
      setMyRating(stars)
      setRatingSummary(res.summary)
    }
  }
  const handleSubmitFeedback = () => {
    if (!user) {
      setModalOpen(true)
      return
    }
    const res = submitFeedback('contest', contest.id, user.username, feedbackText)
    if (res.error) {
      setActionError(res.error)
      return
    }
    setFeedbackText('')
    setActionError('')
    setFeedbackList(getFeedback('contest', contest.id))
  }
  const handleRegister = async () => {
    if (!user) {
      setModalOpen(true)
      return
    }
    setBusy(true)
    setActionError('')
    if (contest.remote) {
      const res = await joinContestRemoteFirst(contest.id)
      if (res.error) {
        setActionError(res.error)
        setBusy(false)
        return
      }
    }
    const result = registerForContest(contest.id, user.username, refBy)
    setBusy(false)
    if (!result.error) setRegistered(true)
  }
  const handleLeave = async () => {
    if (!user) return
    setBusy(true)
    setActionError('')
    if (contest.remote) {
      const res = await leaveContestRemoteFirst(contest.id)
      if (res.error) {
        setActionError(res.error)
        setBusy(false)
        return
      }
    }
    setRegistered(false)
    setBusy(false)
  }
  const handleInvite = async () => {
    const link = `${window.location.origin}/contests/${contest.id}?ref=${user?.username || ''}`
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      window.prompt('Copy your invite link:', link)
    }
  }
  const handleDelete = async () => {
    if (!user || !window.confirm('Delete this contest permanently?')) return
    if (contest.remote) {
      const res = await deleteContestRemoteFirst(contest.id)
      if (res.error) {
        setActionError(res.error)
        return
      }
      navigate('/contests')
      return
    }
    const result = deleteLocalContest(contest.id, user.username)
    if (!result.error) navigate('/contests')
  }
  const handleCancel = async () => {
    if (!user || !window.confirm('Cancel this contest? Participants will see it as cancelled.')) return
    const res = await cancelContestRemoteFirst(contest.id)
    if (res.error) setActionError(res.error)
  }
  const handleEditDetails = async () => {
    const title = window.prompt('Contest title', contest.name)
    if (title === null) return
    const description = window.prompt('Contest description', contest.tagline)
    if (description === null) return
    const res = await updateContestDetailsRemoteFirst(contest.id, {
      title,
      description,
    })
    if (res.error) setActionError(res.error)
    else setRemoteContests((cs) => cs.map((c) => (c.id === contest.id ? res.contest : c)))
  }
  const handleReschedule = async () => {
    const startingFrom = window.prompt('New start time (ISO, e.g. 2026-08-05T10:00:00)', contest.startingFrom)
    if (startingFrom === null) return
    const endingAt = window.prompt('New end time (ISO, e.g. 2026-08-05T18:00:00)', contest.endingAt)
    if (endingAt === null) return
    const res = await updateContestTimeRemoteFirst(contest.id, startingFrom, endingAt)
    if (res.error) setActionError(res.error)
    else setRemoteContests((cs) => cs.map((c) => (c.id === contest.id ? res.contest : c)))
  }
  const handleChangeContestPassword = async () => {
    const password = window.prompt('New contest password')
    if (!password) return
    const res = await changeContestPasswordRemoteFirst(contest.id, password)
    if (res.error) setActionError(res.error)
  }
  return (
    <div className="max-w-5xl mx-auto px-5 py-14">
      <button onClick={() => navigate(-1)} className="text-sm text-ink-soft hover:text-accent mb-6">
        ← Back
      </button>

      <div className={`h-40 md:h-56 rounded-2xl bg-gradient-to-br ${contest.banner} flex items-end p-6 mb-4`}>
        <h1 className="font-display font-extrabold text-2xl md:text-4xl text-white drop-shadow">{contest.name}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 mb-8">
        <span
          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${status === 'live' ? 'bg-success/15 text-success' : status === 'upcoming' ? 'bg-accent/15 text-accent' : 'bg-muted text-ink-soft'}`}
        >
          {status === 'live' && `🔴 Live now · ends in ${formatCountdown(endMs - now)}`}
          {status === 'upcoming' && `🕒 Starts in ${formatCountdown(startMs - now)}`}
          {status === 'ended' && '✅ Contest ended'}
        </span>
        <span
          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${alreadyRegistered ? 'bg-success/15 text-success' : 'bg-bg-soft text-ink-soft'}`}
        >
          {alreadyRegistered ? "✓ You're registered" : 'Not registered yet'}
        </span>
      </div>

      {refBy && !alreadyRegistered && (
        <div className="mb-6 px-4 py-2.5 rounded-2xl bg-success/10 border border-success/30 text-sm text-success">
          🎉 Invited by <strong>@{refBy}</strong> — register and you'll both earn bonus points.
        </div>
      )}

      {alreadyRegistered && status === 'live' && (contest.remote ? remoteProblems.length > 0 : contest.problems?.length > 0) && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 rounded-2xl bg-gradient-to-br from-ink to-ink-soft text-white">
          <div>
            <p className="font-display font-bold text-base">You're in — the compiler's ready. 🚀</p>
            <p className="text-xs text-white/70 mt-0.5">
              Pick a problem below and hit Solve to jump straight into the editor.
            </p>
          </div>
          <a
            href="#problems"
            className="shrink-0 px-4 py-2 rounded-xl bg-white text-ink text-sm font-semibold hover:bg-white/90 text-center"
          >
            Jump to problems ↓
          </a>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="font-display font-bold text-xl text-ink mb-3">Description</h2>
            <p className="text-ink-soft text-sm leading-relaxed">
              {contest.tagline} Solve a curated set of problems, submit within the time window, and climb the live
              leaderboard. Partial scoring is awarded per test case passed.
            </p>
            {contest.isCustom && <p className="text-xs text-ink-soft/70 mt-2">Hosted by @{contest.createdBy}</p>}
          </section>

          {contest.remote && remoteProblems.length > 0 && (
            <section id="problems" className="scroll-mt-20">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display font-bold text-xl text-ink">Problems</h2>
                <span className="text-xs text-ink-soft">{remoteProblems.length} problem{remoteProblems.length > 1 ? 's' : ''}</span>
              </div>

              {!canSolve && (
                <div className="mb-3 px-4 py-2.5 rounded-2xl bg-accent/10 border border-accent/20 text-sm text-accent">
                  🔒 Join the contest to unlock problems and start solving.
                </div>
              )}
              {canSolve && problemsLocked && (
                <div className="mb-3 px-4 py-2.5 rounded-2xl bg-bg-soft border border-border text-sm text-ink-soft">
                  You're registered — problems unlock automatically when the contest goes live in{' '}
                  <strong className="text-ink">{formatCountdown(startMs - now)}</strong>.
                </div>
              )}

              <div className="space-y-3">
                {remoteProblems.map((p, i) => (
                  <ProblemCard
                    key={p.id}
                    problem={p}
                    index={i}
                    contestId={contest.id}
                    canSolve={canSolve}
                    locked={problemsLocked}
                    status={status}
                  />
                ))}
              </div>
            </section>
          )}

          {!contest.remote && contest.isCustom && contest.problems?.length > 0 && (
            <section id="problems" className="scroll-mt-20">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display font-bold text-xl text-ink">Problems</h2>
                <span className="text-xs text-ink-soft">
                  {contest.problems.length} problem{contest.problems.length > 1 ? 's' : ''}
                </span>
              </div>

              {!canSolve && (
                <div className="mb-3 px-4 py-2.5 rounded-2xl bg-accent/10 border border-accent/20 text-sm text-accent">
                  🔒 Join the contest to unlock the full problem set.
                </div>
              )}

              <div className="space-y-3">
                {contest.problems.map((p, i) => (
                  <div
                    key={i}
                    className={`border border-border rounded-2xl p-4 transition-all ${canSolve ? 'bg-white' : 'bg-bg-soft/60'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm text-ink flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-bg-soft text-ink-soft text-xs font-semibold grid place-items-center">
                          {i + 1}
                        </span>
                        {p.title}
                      </h3>
                      {!canSolve && <span className="text-xs text-ink-soft/70">🔒 Locked</span>}
                    </div>
                    {canSolve ? (
                      <>
                        {p.statement && <p className="text-sm text-ink-soft mt-2 mb-2">{p.statement}</p>}
                        {(p.sampleInput || p.sampleOutput) && (
                          <div className="font-mono text-xs bg-muted rounded-xl p-3">
                            {p.sampleInput && <div>Input: {p.sampleInput}</div>}
                            {p.sampleOutput && <div>Output: {p.sampleOutput}</div>}
                          </div>
                        )}
                        <p className="text-[11px] text-ink-soft/70 mt-2">
                          Guided compiler support for custom problems is on the way — for now, work through it in
                          your own editor and share your approach in the discussion below.
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-ink-soft/70 mt-1">Register to view the full statement.</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="font-display font-bold text-xl text-ink mb-3">Rules</h2>
            <ul className="text-sm text-ink-soft space-y-2 list-disc pl-5">
              <li>Plagiarism of any kind results in disqualification.</li>
              <li>Multiple submissions are allowed; only the best scoring submission counts.</li>
              <li>Use of AI assistants during the contest is not permitted unless stated otherwise.</li>
              <li>Ties are broken by earliest submission time.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-ink mb-3">Timeline</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-ink-soft">Registration closes</span>
                <span className="font-medium text-ink">2 hrs before start</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-ink-soft">Contest duration</span>
                <span className="font-medium text-ink">{contest.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Results announced</span>
                <span className="font-medium text-ink">Within 24 hrs</span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-ink mb-3">Comments ({comments.length})</h2>
            <div className="flex gap-2 mb-4">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddComment()
                }}
                placeholder={user ? 'Add a comment…' : 'Log in to comment'}
                className="flex-1 px-4 py-2.5 rounded-2xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent-soft"
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2.5 rounded-2xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover"
              >
                Post
              </button>
            </div>
            <div className="space-y-4">
              {comments.length === 0 && (
                <p className="text-sm text-ink-soft">No comments yet — start the discussion.</p>
              )}
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <span className="w-8 h-8 rounded-full bg-accent-soft grid place-items-center text-sm shrink-0">
                    {getAvatarEmoji()}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-ink-soft">
                      <span className="font-semibold text-ink">@{c.username}</span>
                      <span>{new Date(c.at).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-ink mt-0.5">{c.text}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-ink-soft">
                      <button onClick={() => handleToggleCommentLike(c.id)} className="hover:text-accent">
                        {(c.likes || []).includes(user?.username?.toLowerCase()) ? '❤️' : '🤍'} {(c.likes || []).length}
                      </button>
                      {user && c.username === user.username.toLowerCase() && (
                        <button onClick={() => handleDeleteComment(c.id)} className="hover:text-danger">
                          Delete
                        </button>
                      )}
                    </div>
                    {c.remote && <CommentReplies commentId={c.id} user={user} />}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display font-bold text-xl text-ink mb-3">Feedback</h2>
            <p className="text-xs text-ink-soft mb-2">Tell the organizer what worked and what didn't.</p>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={3}
              placeholder={user ? 'Share your feedback…' : 'Log in to leave feedback'}
              className="w-full px-4 py-2.5 rounded-2xl border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent-soft mb-2"
            />
            <button
              onClick={handleSubmitFeedback}
              className="px-4 py-2 rounded-2xl bg-ink text-white text-sm font-semibold hover:opacity-90 mb-4"
            >
              Submit feedback
            </button>
            <div className="space-y-3">
              {feedbackList.slice(0, 5).map((f) => (
                <div key={f.id} className="border border-border rounded-2xl p-3 text-sm">
                  <div className="flex items-center justify-between text-xs text-ink-soft mb-1">
                    <span className="font-semibold text-ink">@{f.username}</span>
                    <span>{new Date(f.at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-ink-soft">{f.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <CommunityFeed showHeading />
          </section>
        </div>

        <aside className="space-y-4">
          <div className="border border-border rounded-2xl p-5 bg-bg-soft space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-soft">Difficulty</span>
              <span className="font-semibold text-ink">{contest.difficulty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Prize Pool</span>
              <span className="font-semibold text-accent">{contest.prizePool}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Entry Fee</span>
              <span className="font-semibold text-ink">{contest.entryFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-soft">Participants</span>
              <span className="font-semibold text-ink">{contest.participants.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-ink-soft block mb-1">Languages Allowed</span>
              <div className="flex flex-wrap gap-1.5">
                {contest.languages.map((l) => (
                  <span key={l} className="px-2 py-1 rounded-full bg-white border border-border text-xs">
                    {l}
                  </span>
                ))}
              </div>
            </div>

            {actionError && <div className="px-3 py-2 rounded-xl bg-danger/10 text-danger text-xs">{actionError}</div>}

            {alreadyRegistered ? (
              <>
                <button
                  disabled
                  className="w-full py-2.5 rounded-2xl bg-success/10 text-success font-semibold mt-2 cursor-default"
                >
                  ✅ Registered
                </button>
                {(contest.remote ? remoteProblems.length > 0 : contest.problems?.length > 0) && (
                  <a
                    href="#problems"
                    className="w-full block text-center py-2.5 rounded-2xl bg-accent text-white font-semibold hover:bg-accent-hover"
                  >
                    {status === 'ended' ? '↻ Practice problems' : '▶ Start solving'}
                  </a>
                )}
                {contest.remote && (
                  <button
                    onClick={handleLeave}
                    disabled={busy}
                    className="w-full py-2 rounded-2xl border border-border text-xs font-semibold text-ink-soft hover:bg-white disabled:opacity-60"
                  >
                    Leave contest
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={handleRegister}
                disabled={busy}
                className="w-full py-2.5 rounded-2xl bg-accent text-white font-semibold hover:bg-accent-hover mt-2 disabled:opacity-60"
              >
                {busy ? 'Joining…' : 'Register Now'}
              </button>
            )}

            <button
              onClick={handleInvite}
              className="w-full py-2.5 rounded-2xl border border-border font-semibold text-ink hover:bg-white"
            >
              {copied ? '✅ Link copied!' : '🔗 Invite Friends'}
            </button>

            <button
              onClick={handleToggleLike}
              className={`w-full py-2.5 rounded-2xl border font-semibold ${likeState.liked ? 'bg-danger/10 border-danger/30 text-danger' : 'border-border text-ink hover:bg-white'}`}
            >
              {likeState.liked ? '❤️ Liked' : '🤍 Like'} · {likeState.count}
            </button>

            {isOwner && (
              <div className="space-y-2">
                {contest.remote && (
                  <div className="flex gap-2 text-xs">
                    <button
                      onClick={handleEditDetails}
                      className="flex-1 py-2 rounded-2xl border border-border text-ink-soft hover:bg-white"
                    >
                      Edit details
                    </button>
                    <button
                      onClick={handleReschedule}
                      className="flex-1 py-2 rounded-2xl border border-border text-ink-soft hover:bg-white"
                    >
                      Reschedule
                    </button>
                    {contest.isProtected && (
                      <button
                        onClick={handleChangeContestPassword}
                        className="flex-1 py-2 rounded-2xl border border-border text-ink-soft hover:bg-white"
                      >
                        Change password
                      </button>
                    )}
                  </div>
                )}
                <div className="flex gap-2">
                  {contest.remote && !contest.isCancelled && (
                    <button
                      onClick={handleCancel}
                      className="flex-1 py-2 rounded-2xl text-xs text-warning hover:underline"
                    >
                      Cancel contest
                    </button>
                  )}
                  <button
                    onClick={handleDelete}
                    className="flex-1 py-2 rounded-2xl text-xs text-danger hover:underline"
                  >
                    Delete this contest
                  </button>
                </div>
              </div>
            )}
          </div>

          {contest.remote && (
            <div className="border border-border rounded-2xl p-5 text-sm">
              <h3 className="font-display font-semibold text-ink mb-3">Participants ({participants.length})</h3>
              {participants.length === 0 ? (
                <p className="text-ink-soft text-xs">No one has joined yet — be the first.</p>
              ) : (
                <ul className="space-y-2">
                  {participants.slice(0, 8).map((p) => (
                    <li key={p.id} className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-accent-soft grid place-items-center text-sm">
                        {getAvatarEmoji(p.avatar)}
                      </span>
                      <span className="text-ink-soft">@{p.username}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {contest.remote && rank.length > 0 && (
            <div className="border border-border rounded-2xl p-5 text-sm">
              <h3 className="font-display font-semibold text-ink mb-3">Leaderboard</h3>
              <ul className="space-y-2">
                {rank.slice(0, 10).map((r, i) => (
                  <li key={r.id || i} className="flex items-center justify-between">
                    <span className="text-ink-soft">
                      #{i + 1} @{r.username}
                    </span>
                    <span className="font-semibold text-ink">{r.score ?? r.points ?? 0}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border border-border rounded-2xl p-5 text-sm">
            <h3 className="font-display font-semibold text-ink mb-2">Rating</h3>
            <div className="flex items-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => handleRate(s)}
                  title={`${s} star${s > 1 ? 's' : ''}`}
                  className="text-2xl leading-none text-accent"
                >
                  {s <= myRating ? '★' : '☆'}
                </button>
              ))}
            </div>
            <p className="text-xs text-ink-soft">
              {ratingSummary.count
                ? `${ratingSummary.average} ★ average from ${ratingSummary.count} rating${ratingSummary.count > 1 ? 's' : ''}`
                : 'No ratings yet — be the first.'}
            </p>
          </div>

          <div className="border border-border rounded-2xl p-5 text-sm">
            <h3 className="font-display font-semibold text-ink mb-2">Related Contests</h3>
            <ul className="space-y-2">
              {allContests
                .filter((c) => c.id !== contest.id)
                .slice(0, 3)
                .map((c) => (
                  <li key={c.id}>
                    <Link to={`/contests/${c.id}`} className="text-ink-soft hover:text-accent">
                      {c.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </aside>
      </div>

      <LoginRequiredModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}