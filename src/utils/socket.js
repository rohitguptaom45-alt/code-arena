import { io } from 'socket.io-client'
import { getAccessToken } from './api.js'
const SOCKET_URL = `${import.meta.env.VITE_API_URL}`
let socket = null
export function getSocket() {
  if (socket) return socket
  socket = io(SOCKET_URL, {
    autoConnect: false,
    reconnectionAttempts: 3,
    reconnectionDelay: 1500,
    withCredentials: true,
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
  NEW_MESSAGE: 'NEW_MESSAGE',
  NEW_MESSAGE_ALERT: 'NEW_MESSAGE_ALERT',
  REFETCH_CHATS : "REFETCH_CHATS",
  NEW_REQUEST : "NEW_REQUEST",
  ALERT:"ALERT",
  START_TYPING:"START_TYPING",
  STOP_TYPING:"STOP_TYPING",
  CHAT_JOINED:"CHAT_JOINED",
  CHAT_LEAVED:"CHAT_LEAVED",
  ONLINE_USERS:"ONLINE_USERS"
}
