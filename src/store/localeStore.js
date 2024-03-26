import { defineStore } from 'pinia'

export const useLocaleStore = defineStore({
  id: 'useLocaleStore',
  state: () => ({
    locale: localStorage.getItem('locale') || 'en'
  }),

  getters: {
    getLocale(state) {
      return state.locale
    }
  },

  actions: {
    setLocale(locale) {
      this.locale = locale
      localStorage.setItem('locale', locale)
    }
  }
})
