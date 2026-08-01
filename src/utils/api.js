// Client for the real CodeArena backend described in the API docs
// (register, login, logout, refresh-token, current-user, change-avatar, passchange).
// If the backend at API_BASE isn't reachable (e.g. you haven't started it locally),
// every function throws and callers fall back to the local demo auth in utils/auth.js.

const API_BASE = 'http://localhost:8000/api/v1'
const ACCESS_TOKEN_KEY = 'codearena_access_token'
const REFRESH_TOKEN_KEY = 'codearena_refresh_token'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}
export function setTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}
export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

async function request(path, { method = 'GET', body, auth = true, retry = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getAccessToken()
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    throw new Error(`Can't reach the CodeArena backend at ${API_BASE} — is it running? (${err.message})`)
  }

  // Access token expired — try the refresh endpoint once, then retry the original call.
  if (res.status === 401 && auth && retry) {
    try {
      const refreshed = await api.refreshToken()
      if (refreshed?.data?.accessToken) {
        setTokens({ accessToken: refreshed.data.accessToken, refreshToken: refreshed.data.refreshToken })
        return request(path, { method, body, auth, retry: false })
      }
    } catch {
      clearTokens()
    }
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const err = new Error(data?.message || `Request failed (${res.status})`)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const api = {
  register: (payload) => request('/users/register', { method: 'POST', body: payload, auth: false }),
  login: (payload) => request('/users/login', { method: 'POST', body: payload, auth: false }),
  logout: () => request('/users/logout', { method: 'POST' }),
  refreshToken: () =>
    request('/users/refresh-token', {
      method: 'POST',
      body: { refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) },
      auth: false,
      retry: false,
    }),
  currentUser: () => request('/users/current-user'),
  updateCurrentUser: (payload) => request('/users/current-user', { method: 'PUT', body: payload }),
  changeAvatar: (payload) => request('/users/change-avatar', { method: 'POST', body: payload }),
  changePassword: (payload) => request('/users/passchange', { method: 'PATCH', body: payload }),
}

export { API_BASE }
