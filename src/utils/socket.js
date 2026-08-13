import { io } from 'socket.io-client'
import { getAccessToken } from './api.js'
const SOCKET_URL = 'http://localhost:8000'
let socket = null
export function getSocket() {
  if (socket) return socket
  socket = io(SOCKET_URL, {
    autoConnect: false,
    reconnectionAttempts: 3,
    reconnectionDelay: 1500,
    timeout: 4000,
    auth: {
      token: getAccessToken() || undefined,
    },
  })
  return socket
}
export function connectSocket() {
  const s = getSocket()
  if (!s.connected) s.connect()
  return s
}
export function disconnectSocket() {
  if (socket && socket.connected) socket.disconnect()
}
export const SOCKET_EVENTS = {
  MESSAGE: 'chat:message',
  TYPING: 'chat:typing',
  JOIN_ROOM: 'chat:join',
}
