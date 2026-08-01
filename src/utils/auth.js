import { api, setTokens, clearTokens } from './api.js'

const USERS_KEY = 'codearena_users'
const SESSION_KEY = 'codearena_session'

// Each avatar gets a stable numeric id (1-12) — this is what gets sent to /users/register
// and /users/change-avatar (the API docs show avatar stored as a number, e.g. "5"), while
// the emoji stays purely a display concern on the frontend.
const AVATAR_OPTIONS = [
  { id: 1, emoji: '🧑‍💻' },
  { id: 2, emoji: '👩‍💻' },
  { id: 3, emoji: '🧑‍🚀' },
  { id: 4, emoji: '🦊' },
  { id: 5, emoji: '🐱' },
  { id: 6, emoji: '🐼' },
  { id: 7, emoji: '🦁' },
  { id: 8, emoji: '🐯' },
  { id: 9, emoji: '🐧' },
  { id: 10, emoji: '🤖' },
  { id: 11, emoji: '🐙' },
  { id: 12, emoji: '🦄' },
]

export function getAvatarOptions() {
  return AVATAR_OPTIONS
}

// Resolves an avatar value to its emoji for display. Accepts the new numeric id
// (1-12, number or numeric string) and also falls back to matching a raw emoji
// directly, so any account created before this change keeps rendering correctly.
export function getAvatarEmoji(avatarValue) {
  if (avatarValue === undefined || avatarValue === null || avatarValue === '') {
    return AVATAR_OPTIONS[0].emoji
  }
  const byId = AVATAR_OPTIONS.find((a) => String(a.id) === String(avatarValue))
  if (byId) return byId.emoji
  const byEmoji = AVATAR_OPTIONS.find((a) => a.emoji === avatarValue)
  if (byEmoji) return byEmoji.emoji
  return AVATAR_OPTIONS[0].emoji
}

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function defaultStats() {
  return {
    // Real, non-mock stats — everything starts at zero and grows through actual activity
    points: 0,
    pointsHistory: [],
    problemsSolved: 0,
    contestsParticipated: [],
    contestsWon: 0,
    streakCurrent: 0,
    streakLongest: 0,
    lastActiveDate: null,
    referredBy: null,
    referralCount: 0,
    subscription: { plan: 'Free', active: false, expiresAt: null },
  }
}

// Ensures a local record with app-specific fields (points/streak/etc.) exists for this
// username, seeded from the backend's user object where available, without clobbering
// any local progress already recorded on this device.
function upsertLocalFromRemote(remoteUser) {
  const users = readUsers()
  const key = (remoteUser.username || '').trim().toLowerCase()
  const existing = users[key]
  users[key] = {
    ...defaultStats(),
    ...existing,
    username: key,
    fullName: remoteUser.fullName || existing?.fullName || key,
    avatar: remoteUser.avatar || existing?.avatar || AVATAR_OPTIONS[0].id,
    bio: remoteUser.bio || existing?.bio || '',
    type: remoteUser.type || existing?.type || 'Student',
    github: remoteUser.git || existing?.github || '',
    email: remoteUser.email || existing?.email,
    phone: remoteUser.phone || existing?.phone,
    remoteId: remoteUser.id || existing?.remoteId,
    createdAt: remoteUser.createdAt || existing?.createdAt || new Date().toISOString(),
  }
  writeUsers(users)
  localStorage.setItem(SESSION_KEY, key)
  return users[key]
}

export function registerUser({ username, email, password, fullName, avatar, bio, type, github }) {
  const users = readUsers()
  const key = (username || '').trim().toLowerCase()
  const emailKey = (email || '').trim().toLowerCase()

  if (!key || !password) {
    return { error: 'Username and password are required.' }
  }
  if (!emailKey) {
    return { error: 'Email is required.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailKey)) {
    return { error: 'Enter a valid email address.' }
  }
  if (users[key]) {
    return { error: 'That username is already taken. Try logging in instead.' }
  }
  if (Object.values(users).some((u) => (u.email || '').toLowerCase() === emailKey)) {
    return { error: 'An account with that email already exists. Try logging in instead.' }
  }

  const user = {
    username: key,
    email: emailKey,
    password,
    fullName: (fullName || '').trim() || key,
    avatar: avatar || AVATAR_OPTIONS[0].id,
    bio: (bio || '').trim(),
    type: type || 'Student',
    github: (github || '').trim(),
    createdAt: new Date().toISOString(),
    ...defaultStats(),
  }

  users[key] = user
  writeUsers(users)
  localStorage.setItem(SESSION_KEY, key)
  return { user }
}

// Logging in is done by email + password (not username) — finds the matching
// local account by email, guarding every input so a missing/undefined value
// never throws instead of showing a friendly error.
export function loginUser(email, password) {
  const users = readUsers()
  const emailKey = (email || '').trim().toLowerCase()

  if (!emailKey) {
    return { error: 'Enter your email.' }
  }

  const user = Object.values(users).find((u) => (u.email || '').toLowerCase() === emailKey)

  if (!user) {
    return { error: 'No account found with that email.' }
  }
  if (user.password !== password) {
    return { error: 'Incorrect password.' }
  }

  localStorage.setItem(SESSION_KEY, user.username)
  return { user }
}

// ---- Real-backend-first versions, used by Signup/Login/Settings. ----
// Tries the CodeArena API (see docs) first; if it's unreachable (backend not
// running locally) it transparently falls back to the local demo auth above,
// so the app keeps working either way.
export async function registerUserRemoteFirst(form) {
  try {
    const res = await api.register({
      username: (form.username || '').trim().toLowerCase(),
      password: form.password,
      email: (form.email || '').trim().toLowerCase(),
      fullName: form.fullName,
      avatar: form.avatar,
      bio: form.bio,
      type: form.type,
      git: form.github,
      phone: form.phone || '',
    })
    const loginRes = await api.login({ email: (form.email || '').trim().toLowerCase(), password: form.password })
    if (loginRes?.data?.accessToken) {
      setTokens({ accessToken: loginRes.data.accessToken, refreshToken: loginRes.data.refreshToken })
    }
    const remoteUser = loginRes?.data?.user || res?.data
    const user = upsertLocalFromRemote(remoteUser)
    return { user, source: 'remote' }
  } catch (err) {
    const local = registerUser(form)
    if (local.error) return local
    return { ...local, source: 'local', remoteError: err.message }
  }
}

// Login uses email + password (not username).
export async function loginUserRemoteFirst(email, password) {
  try {
    const res = await api.login({ email: (email || '').trim().toLowerCase(), password })
    if (res?.data?.accessToken) {
      setTokens({ accessToken: res.data.accessToken, refreshToken: res.data.refreshToken })
    }
    const user = upsertLocalFromRemote(res?.data?.user || {})
    return { user, source: 'remote' }
  } catch (err) {
    const local = loginUser(email, password)
    if (local.error) return local
    return { ...local, source: 'local', remoteError: err.message }
  }
}

export async function logoutUserRemoteFirst() {
  try {
    await api.logout()
  } catch {
    // backend not reachable — that's fine, still clear local session below
  }
  clearTokens()
  logoutUser()
}

export function updateStoredUser(username, updates) {
  const users = readUsers()
  const key = (username || '').trim().toLowerCase()
  if (!users[key]) return { error: 'User not found.' }

  users[key] = { ...users[key], ...updates, username: key }
  writeUsers(users)
  return { user: users[key] }
}

// Saves a profile edit locally, and mirrors it to the real backend when reachable.
export async function updateProfileRemoteFirst(username, updates) {
  const local = updateStoredUser(username, updates)
  try {
    await api.updateCurrentUser({
      username: updates.username,
      fullName: updates.fullName,
      type: updates.type,
      bio: updates.bio,
      git: updates.github,
      phone: updates.phone,
    })
  } catch {
    // fine — profile still saved locally
  }
  return local
}

export async function changePasswordRemoteFirst(oldPassword, newPassword) {
  try {
    await api.changePassword({ oldPassword, newPassword })
    return { success: true, source: 'remote' }
  } catch (err) {
    return { error: err.message || "Couldn't reach the backend to change your password." }
  }
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY)
}

export function userExists(username) {
  const users = readUsers()
  return !!users[(username || '').trim().toLowerCase()]
}

export function userExistsByEmail(email) {
  const users = readUsers()
  const emailKey = (email || '').trim().toLowerCase()
  if (!emailKey) return false
  return Object.values(users).some((u) => (u.email || '').toLowerCase() === emailKey)
}

// Local-only password reset for the "Forgot password?" flow, looked up by email
// (matching the email + password login flow) rather than username. There's no
// email/SMS verification step here (that needs a real backend endpoint) — this
// simply confirms the email exists on this device and lets the person set a new
// password directly, then confirms it twice.
export function resetPasswordLocal(email, newPassword) {
  const users = readUsers()
  const emailKey = (email || '').trim().toLowerCase()
  const key = Object.keys(users).find((k) => (users[k].email || '').toLowerCase() === emailKey)
  if (!key) return { error: 'No account found with that email on this device.' }
  users[key] = { ...users[key], password: newPassword }
  writeUsers(users)
  return { success: true }
}

export function getCurrentUser() {
  const key = localStorage.getItem(SESSION_KEY)
  if (!key) return null
  const users = readUsers()
  return users[key] || null
}
