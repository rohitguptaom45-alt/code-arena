import { createSlice } from '@reduxjs/toolkit'
import { getCurrentUser, logoutUser } from '../utils/auth.js'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getCurrentUser(),
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload }
    },
    clearUser(state) {
      logoutUser()
      state.user = null
    },
  },
})

export const { setUser, updateUser, clearUser } = authSlice.actions
export default authSlice.reducer
