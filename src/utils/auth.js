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

export function updateStoredUser(username, updates) {
  const users = readUsers()
  const key = username.trim().toLowerCase()
  if (!users[key]) return { error: 'User not found.' }

  users[key] = { ...users[key], ...updates, username: key }
  writeUsers(users)
  return { user: users[key] }
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
