// Simple localStorage-backed auth for demo purposes.
// Users are stored as an OBJECT keyed by username, e.g. { "aarav_codes": {...} }
// so registering/logging in with the same username never creates a duplicate
// entry — it always reads/writes the single existing object for that user.

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

function notifyAuthChange() {
  window.dispatchEvent(new Event('codearena-auth-change'))
}

/**
 * Create a new user. Fails if the username is already taken, so repeated
 * sign-ups / logins never append a second object for the same person.
 */
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
    password, // demo-only: plaintext storage is NOT secure, fine for a mock app
    fullName: fullName?.trim() || key,
    avatar: avatar || AVATAR_OPTIONS[0],
    bio: bio?.trim() || '',
    type: type || 'Student',
    github: github?.trim() || '',
    createdAt: new Date().toISOString(),
  }

  users[key] = user
  writeUsers(users)
  localStorage.setItem(SESSION_KEY, key)
  notifyAuthChange()
  return { user }
}

/**
 * Authenticate against the single stored object for this username.
 * Never creates or duplicates a user record — only reads and checks it.
 */
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
  notifyAuthChange()
  return { user }
}

/** Update fields on the currently stored user object (e.g. from Settings). */
export function updateUser(username, updates) {
  const users = readUsers()
  const key = username.trim().toLowerCase()
  if (!users[key]) return { error: 'User not found.' }

  users[key] = { ...users[key], ...updates, username: key }
  writeUsers(users)
  notifyAuthChange()
  return { user: users[key] }
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY)
  notifyAuthChange()
}

export function getCurrentUser() {
  const key = localStorage.getItem(SESSION_KEY)
  if (!key) return null
  const users = readUsers()
  return users[key] || null
}
