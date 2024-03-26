import { defineStore } from 'pinia'

export const useThemeStore = defineStore({
  id: 'useThemeStore',
  state: () => ({
    currentTheme: localStorage.getItem('theme') || 'lara-light-indigo',
    mode: localStorage.getItem('mode') || 'light'
  }),

  getters: {
    getCurrentTheme(state) {
      return state.currentTheme
    },
    getMode(state) {
      return state.mode
    }
  },

  actions: {
    setTheme(theme) {
      this.currentTheme = theme
      localStorage.setItem('theme', theme)
    },
    setMode(mode) {
      this.mode = mode
      localStorage.setItem('mode', mode)
    }
  }
})
