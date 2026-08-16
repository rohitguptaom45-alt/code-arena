import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice.js'
import chatSlice from './chatSlice.js'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [chatSlice.name]:chatSlice.reducer,
  },
})
