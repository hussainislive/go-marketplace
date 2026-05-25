import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AuthUser {
  id: string
  email: string
  name: string
  avatar: string | null
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  isVerified: boolean
  city: string | null
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload
      state.isAuthenticated = true
      state.isLoading = false
    },
    logout(state) {
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
  },
})

export const { setUser, logout, setLoading } = authSlice.actions
export default authSlice.reducer
