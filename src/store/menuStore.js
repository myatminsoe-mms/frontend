import { defineStore } from 'pinia'

export const useMenuStore = defineStore({
  id: 'useMenuStore',
  state: () => ({
    staticMenuInactive: localStorage.getItem('staticMenuInactive') ? JSON.parse(localStorage.getItem('staticMenuInactive')) : false
  }),

  getters: {
    getStaticMenuInactive(state) {
      return state.staticMenuInactive
    }
  },

  actions: {
    setStaticMenuInactive(menuStatus) {
      this.staticMenuInactive = menuStatus
      localStorage.setItem('staticMenuInactive', menuStatus)
    }
  }
})
