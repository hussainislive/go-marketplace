import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import uiReducer from './uiSlice'
import socketReducer from './socketSlice'
import notificationReducer from './notificationSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    socket: socketReducer,
    notification: notificationReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
