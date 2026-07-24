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
