import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface NotificationState {
  unreadCount: number
}

const initialState: NotificationState = {
  unreadCount: 0,
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setUnreadCount(state, action: PayloadAction<number>) {
      state.unreadCount = action.payload
    },
    incrementUnread(state) {
      state.unreadCount += 1
    },
    decrementUnread(state) {
      state.unreadCount = Math.max(0, state.unreadCount - 1)
    },
    clearUnread(state) {
      state.unreadCount = 0
    },
  },
})

export const { setUnreadCount, incrementUnread, decrementUnread, clearUnread } = notificationSlice.actions
export default notificationSlice.reducer
