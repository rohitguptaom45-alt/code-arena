import { api, setTokens, clearTokens } from './api.js'

const USERS_KEY = 'codearena_users'
const SESSION_KEY = 'codearena_session'

const AVATAR_OPTIONS = ['🧑‍💻', '👩‍💻', '🧑‍🚀', '🦊', '🐱', '🐼', '🦁', '🐯', '🐧', '🤖', '🐙', '🦄']

export function getAvatarOptions() {
  return AVATAR_OPTIONS
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
    avatar: remoteUser.avatar || existing?.avatar || AVATAR_OPTIONS[0],
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

export function registerUser({ username, password, fullName, avatar, bio, type, github }) {
  const users = readUsers()
  const key = username.trim().toLowerCase()

  if (!key || !password) {
    return { error: 'Username and password are required.' }
  }
  if (users[key]) {
    return { error: 'That username is already taken. Try logging in instead.' }
  }

  const user = {
    username: key,
    password,
    fullName: fullName?.trim() || key,
    avatar: avatar || AVATAR_OPTIONS[0],
    bio: bio?.trim() || '',
    type: type || 'Student',
    github: github?.trim() || '',
    createdAt: new Date().toISOString(),
    ...defaultStats(),
  }

  users[key] = user
  writeUsers(users)
  localStorage.setItem(SESSION_KEY, key)
  return { user }
}

export function loginUser(username, password) {
  const users = readUsers()
  const key = username.trim().toLowerCase()
  const user = users[key]

  if (!user) {
    return { error: 'No account found with that username.' }
  }
  if (user.password !== password) {
    return { error: 'Incorrect password.' }
  }

  localStorage.setItem(SESSION_KEY, key)
  return { user }
}

// ---- Real-backend-first versions, used by Signup/Login/Settings. ----
// Tries the CodeArena API (see docs) first; if it's unreachable (backend not
// running locally) it transparently falls back to the local demo auth above,
// so the app keeps working either way.
export async function registerUserRemoteFirst(form) {
  try {
    const res = await api.register({
      username: form.username.trim().toLowerCase(),
      password: form.password,
      email: form.email || `${form.username.trim().toLowerCase()}@codearena.local`,
      fullName: form.fullName,
      avatar: form.avatar,
      bio: form.bio,
      type: form.type,
      git: form.github,
      phone: form.phone || '',
    })
    const loginRes = await api.login({ username: form.username.trim().toLowerCase(), password: form.password })
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

export async function loginUserRemoteFirst(username, password) {
  try {
    const res = await api.login({ username: username.trim().toLowerCase(), password })
    if (res?.data?.accessToken) {
      setTokens({ accessToken: res.data.accessToken, refreshToken: res.data.refreshToken })
    }
    const user = upsertLocalFromRemote(res?.data?.user || {})
    return { user, source: 'remote' }
  } catch (err) {
    const local = loginUser(username, password)
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
  const key = username.trim().toLowerCase()
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

export function getCurrentUser() {
  const key = localStorage.getItem(SESSION_KEY)
  if (!key) return null
  const users = readUsers()
  return users[key] || null
}
