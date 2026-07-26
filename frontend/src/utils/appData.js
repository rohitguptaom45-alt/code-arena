import { getCurrentUser, updateStoredUser } from './auth.js'

const CONTESTS_KEY = 'codearena_custom_contests'
const REG_KEY = 'codearena_registrations'
const PAYMENTS_KEY = 'codearena_payments'
const USERS_KEY = 'codearena_users'

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}
function normalize(username) {
  return (username || '').trim().toLowerCase()
}

// ---------------- Contests (user-created) ----------------
export function getCustomContests() {
  return read(CONTESTS_KEY, [])
}

export function createContest(data, creatorUsername) {
  const contests = getCustomContests()
  const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  const contest = {
    id,
    isCustom: true,
    name: data.name,
    tagline: data.tagline,
    type: data.type,
    difficulty: data.difficulty,
    duration: data.duration,
    startTime: data.startTime,
    startsInSeconds: Math.max(0, Math.round((new Date(data.startTime).getTime() - Date.now()) / 1000)),
    entryFee: data.entryFee,
    prizePool: data.prizePool || 'Bragging rights',
    languages: data.languages && data.languages.length ? data.languages : ['Any'],
    problems: data.problems || [],
    participants: 0,
    banner: data.banner || 'from-accent to-accent-soft',
    createdBy: normalize(creatorUsername),
    createdAt: new Date().toISOString(),
  }
  contests.push(contest)
  write(CONTESTS_KEY, contests)
  return contest
}

export function deleteContest(id, username) {
  const contests = getCustomContests()
  const target = contests.find((c) => c.id === id)
  if (!target) return { error: 'Contest not found.' }
  if (target.createdBy !== normalize(username)) return { error: 'Only the creator can delete this contest.' }
  write(CONTESTS_KEY, contests.filter((c) => c.id !== id))
  return { success: true }
}

export function getAllContests(mockContests = []) {
  return [...mockContests, ...getCustomContests()]
}

// ---------------- Registrations ----------------
export function getRegistrations() {
  return read(REG_KEY, [])
}

export function isRegistered(contestId, username) {
  const key = normalize(username)
  return getRegistrations().some((r) => r.contestId === contestId && r.username === key)
}

export function getUserRegistrations(username) {
  const key = normalize(username)
  return getRegistrations().filter((r) => r.username === key)
}

export function registerForContest(contestId, username, referredBy) {
  const key = normalize(username)
  const regs = getRegistrations()
  if (regs.some((r) => r.contestId === contestId && r.username === key)) {
    return { error: 'You are already registered for this contest.' }
  }
  regs.push({ contestId, username: key, registeredAt: new Date().toISOString(), referredBy: referredBy || null })
  write(REG_KEY, regs)

  const contests = getCustomContests()
  const idx = contests.findIndex((c) => c.id === contestId)
  if (idx >= 0) {
    contests[idx].participants = (contests[idx].participants || 0) + 1
    write(CONTESTS_KEY, contests)
  }

  const users = read(USERS_KEY, {})
  const user = users[key]
  if (user) {
    const participated = new Set(user.contestsParticipated || [])
    participated.add(contestId)
    updateStoredUser(key, { contestsParticipated: Array.from(participated) })
    addPoints(key, 20, 'Registered for a contest')
    logActivity(key)
    addNotification(key, { type: 'contest', text: 'You are registered for the contest. Good luck!', link: `/contests/${contestId}` })
  }

  const refKey = normalize(referredBy)
  if (refKey && refKey !== key && users[refKey]) {
    addPoints(refKey, 30, `Referral bonus — ${key} joined a contest via your link`)
  }

  return { success: true }
}

export function recordContestWin(contestId, username, prizePoints = 100) {
  const key = normalize(username)
  const users = read(USERS_KEY, {})
  const user = users[key]
  if (!user) return
  updateStoredUser(key, { contestsWon: (user.contestsWon || 0) + 1 })
  addPoints(key, prizePoints, `Won contest ${contestId}`)
}

// ---------------- Points / Wallet ----------------
export const POINTS_PER_RUPEE = 10

export function addPoints(username, amount, reason) {
  const key = normalize(username)
  const users = read(USERS_KEY, {})
  if (!users[key]) return
  const currentPoints = users[key].points || 0
  const history = users[key].pointsHistory || []
  history.unshift({ amount, reason, at: new Date().toISOString() })
  updateStoredUser(key, { points: currentPoints + amount, pointsHistory: history.slice(0, 60) })
}

export function redeemPointsForDiscount(username, pointsToRedeem) {
  const key = normalize(username)
  const users = read(USERS_KEY, {})
  const user = users[key]
  if (!user) return { error: 'User not found.' }
  if ((user.points || 0) < pointsToRedeem || pointsToRedeem <= 0) {
    return { error: 'Not enough points.' }
  }
  addPoints(key, -pointsToRedeem, 'Redeemed points for a subscription discount')
  return { success: true, discountRupees: Math.floor(pointsToRedeem / POINTS_PER_RUPEE) }
}

// ---------------- Streak & activity ----------------
function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function logActivity(username) {
  const key = normalize(username)
  const users = read(USERS_KEY, {})
  const user = users[key]
  if (!user) return
  const today = todayStr()
  if (user.lastActiveDate === today) return

  let streak = user.streakCurrent || 0
  if (user.lastActiveDate) {
    const diffDays = Math.round((new Date(today) - new Date(user.lastActiveDate)) / 86400000)
    streak = diffDays === 1 ? streak + 1 : 1
  } else {
    streak = 1
  }
  const longest = Math.max(streak, user.streakLongest || 0)
  updateStoredUser(key, { lastActiveDate: today, streakCurrent: streak, streakLongest: longest })
}

// call this on app load / periodically to reset a broken streak (missed a day) even if user hasn't acted
export function refreshStreakIfBroken(username) {
  const key = normalize(username)
  const users = read(USERS_KEY, {})
  const user = users[key]
  if (!user || !user.lastActiveDate) return
  const diffDays = Math.round((new Date(todayStr()) - new Date(user.lastActiveDate)) / 86400000)
  if (diffDays > 1 && (user.streakCurrent || 0) !== 0) {
    updateStoredUser(key, { streakCurrent: 0 })
  }
}

export function recordProblemSolved(username) {
  const key = normalize(username)
  const users = read(USERS_KEY, {})
  const user = users[key]
  if (!user) return
  updateStoredUser(key, { problemsSolved: (user.problemsSolved || 0) + 1 })
  addPoints(key, 10, 'Solved a coding problem')
  logActivity(key)
}

// ---------------- Payments (manual UPI verification queue) ----------------
export function getPayments() {
  return read(PAYMENTS_KEY, [])
}

export function getUserPayments(username) {
  const key = normalize(username)
  return getPayments().filter((p) => p.username === key)
}

export function submitPayment({ username, plan, amount, utr, discountRupees = 0, vpa }) {
  const key = normalize(username)
  const payments = getPayments()
  const payment = {
    id: `pay-${Date.now()}`,
    username: key,
    plan,
    amount,
    discountRupees,
    utr,
    vpa,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  payments.unshift(payment)
  write(PAYMENTS_KEY, payments)
  return payment
}

export function approvePayment(id, months = 1) {
  const payments = getPayments()
  const idx = payments.findIndex((p) => p.id === id)
  if (idx < 0) return { error: 'Payment not found.' }
  payments[idx].status = 'approved'
  payments[idx].approvedAt = new Date().toISOString()
  write(PAYMENTS_KEY, payments)
  const p = payments[idx]
  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + months)
  updateStoredUser(p.username, { subscription: { plan: p.plan, active: true, expiresAt: expiresAt.toISOString() } })
  return { success: true }
}

export function rejectPayment(id) {
  const payments = getPayments()
  const idx = payments.findIndex((p) => p.id === id)
  if (idx < 0) return { error: 'Payment not found.' }
  payments[idx].status = 'rejected'
  write(PAYMENTS_KEY, payments)
  return { success: true }
}

// ---------------- Referrals ----------------
export function applySignupReferral(newUsername, refUsername) {
  const newKey = normalize(newUsername)
  const refKey = normalize(refUsername)
  if (!refKey || refKey === newKey) return
  const users = read(USERS_KEY, {})
  if (!users[refKey]) return
  updateStoredUser(newKey, { referredBy: refKey })
  addPoints(refKey, 50, `Referral bonus — ${newKey} signed up using your link`)
  updateStoredUser(refKey, { referralCount: (users[refKey].referralCount || 0) + 1 })
}

export function getReferralLink(username) {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}/signup?ref=${normalize(username)}`
}

// ---------------- Follow system ----------------
const FOLLOWS_KEY = 'codearena_follows' // array of { follower, following, at }

export function getFollows() {
  return read(FOLLOWS_KEY, [])
}

export function isFollowing(followerUsername, targetUsername) {
  const a = normalize(followerUsername), b = normalize(targetUsername)
  return getFollows().some((f) => f.follower === a && f.following === b)
}

export function followUser(followerUsername, targetUsername) {
  const a = normalize(followerUsername), b = normalize(targetUsername)
  if (!a || !b || a === b) return { error: "You can't follow yourself." }
  const follows = getFollows()
  if (follows.some((f) => f.follower === a && f.following === b)) return { error: 'Already following.' }
  follows.push({ follower: a, following: b, at: new Date().toISOString() })
  write(FOLLOWS_KEY, follows)
  addPoints(a, 2, `Followed @${b}`)
  addNotification(b, { type: 'follow', text: `@${a} started following you`, link: `/u/${a}` })
  return { success: true }
}

export function unfollowUser(followerUsername, targetUsername) {
  const a = normalize(followerUsername), b = normalize(targetUsername)
  const follows = getFollows()
  write(FOLLOWS_KEY, follows.filter((f) => !(f.follower === a && f.following === b)))
  return { success: true }
}

export function toggleFollow(followerUsername, targetUsername) {
  return isFollowing(followerUsername, targetUsername)
    ? unfollowUser(followerUsername, targetUsername)
    : followUser(followerUsername, targetUsername)
}

export function getFollowers(username) {
  const key = normalize(username)
  return getFollows().filter((f) => f.following === key).map((f) => f.follower)
}

export function getFollowing(username) {
  const key = normalize(username)
  return getFollows().filter((f) => f.follower === key).map((f) => f.following)
}

export function getFollowCounts(username) {
  return { followers: getFollowers(username).length, following: getFollowing(username).length }
}

// ---------------- People directory / search ----------------
const USERS_STORE_KEY = 'codearena_users'

// Every registered user, minus their password, keyed by username.
export function getAllUsers() {
  const users = read(USERS_STORE_KEY, {})
  return Object.values(users).map((u) => {
    const { password, ...safe } = u
    return safe
  })
}

export function getUserByUsername(username) {
  const key = normalize(username)
  const users = read(USERS_STORE_KEY, {})
  const user = users[key]
  if (!user) return null
  const { password, ...safe } = user
  return safe
}

// Searches both registered users and contests (mock + custom) by name/username.
export function searchAll(query, mockContests = []) {
  const q = (query || '').trim().toLowerCase()
  if (!q) return { users: [], contests: [] }

  const users = getAllUsers()
    .filter((u) => u.username.includes(q) || (u.fullName || '').toLowerCase().includes(q))
    .slice(0, 8)

  const contests = getAllContests(mockContests)
    .filter((c) => c.name.toLowerCase().includes(q) || (c.tagline || '').toLowerCase().includes(q))
    .slice(0, 8)

  return { users, contests }
}

// ---------------- Notifications ----------------
const NOTIFICATIONS_KEY = 'codearena_notifications' // array of { id, username, type, text, link, read, at }

export function getNotifications(username) {
  const key = normalize(username)
  return read(NOTIFICATIONS_KEY, []).filter((n) => n.username === key).sort((a, b) => new Date(b.at) - new Date(a.at))
}

export function getUnreadCount(username) {
  return getNotifications(username).filter((n) => !n.read).length
}

export function addNotification(username, { type = 'info', text, link = '' }) {
  const key = normalize(username)
  if (!key) return
  const all = read(NOTIFICATIONS_KEY, [])
  all.unshift({
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    username: key,
    type,
    text,
    link,
    read: false,
    at: new Date().toISOString(),
  })
  write(NOTIFICATIONS_KEY, all.slice(0, 300))
}

export function markNotificationRead(id) {
  const all = read(NOTIFICATIONS_KEY, [])
  const idx = all.findIndex((n) => n.id === id)
  if (idx >= 0) {
    all[idx].read = true
    write(NOTIFICATIONS_KEY, all)
  }
}

export function markAllNotificationsRead(username) {
  const key = normalize(username)
  const all = read(NOTIFICATIONS_KEY, [])
  const updated = all.map((n) => (n.username === key ? { ...n, read: true } : n))
  write(NOTIFICATIONS_KEY, updated)
}

export function clearNotifications(username) {
  const key = normalize(username)
  const all = read(NOTIFICATIONS_KEY, [])
  write(NOTIFICATIONS_KEY, all.filter((n) => n.username !== key))
}
