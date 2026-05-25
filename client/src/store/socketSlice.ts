import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface SocketState {
  connected: boolean
  onlineUsers: string[]
}

const initialState: SocketState = {
  connected: false,
  onlineUsers: [],
}

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setConnected(state, action: PayloadAction<boolean>) {
      state.connected = action.payload
    },
    userOnline(state, action: PayloadAction<string>) {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload)
      }
    },
    userOffline(state, action: PayloadAction<string>) {
      state.onlineUsers = state.onlineUsers.filter(id => id !== action.payload)
    },
  },
})

export const { setConnected, userOnline, userOffline } = socketSlice.actions
export default socketSlice.reducer
