import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  authModalOpen: boolean
  authModalTab: 'login' | 'signup'
  sidebarOpen: boolean
}

const initialState: UIState = {
  authModalOpen: false,
  authModalTab: 'login',
  sidebarOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openAuthModal(state, action: PayloadAction<'login' | 'signup' | undefined>) {
      state.authModalOpen = true
      state.authModalTab = action.payload ?? 'login'
    },
    closeAuthModal(state) {
      state.authModalOpen = false
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    closeSidebar(state) {
      state.sidebarOpen = false
    },
  },
})

export const { openAuthModal, closeAuthModal, toggleSidebar, closeSidebar } = uiSlice.actions
export default uiSlice.reducer
