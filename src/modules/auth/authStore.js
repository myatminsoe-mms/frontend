import { defineStore } from 'pinia'
import { authService } from './authService'
import ability from '@/libs/acl/ability'

export const useAuthStore = defineStore({
  id: 'useAuthStore',
  state: () => ({
    access_token: localStorage.getItem('accessToken') || null,
    userData: localStorage.getItem('userData') || null,
    loginResponse: null
  }),

  getters: {
    getToken(state) {
      return state.access_token
    },
    getUserData(state) {
      return state.userData ? JSON.parse(state.userData) : null
    },
    getLoginResponse(state) {
      return state.loginResponse
    },
    isAuth(state) {
      return state.access_token ? true : false
    }
  },

  actions: {
    async login(params) {
      const response = await authService.login(params)
      this.loginResponse = response
      if (response) {
        this.userData = JSON.stringify(response.data.user_data)
        this.access_token = response.data.access_token
        //update abality after successfully login
        ability.update(response.data.abilities)

        localStorage.setItem('accessToken', response.data.access_token)
        localStorage.setItem('userData', JSON.stringify(response.data.user_data))
        localStorage.setItem('userAbility', JSON.stringify(response.data.abilities))
      }
    },
    logout() {
      this.access_token = null
      this.userData = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userData')
      localStorage.removeItem('userAbility')
    },
    async fetchProfile() {
      const response = await authService.getProfile()
      this.userData = JSON.stringify(response.data)
      localStorage.setItem('userData', this.userData)
    },
    async update(params) {
      const response = await authService.updateProfile(params)
      this.userData = JSON.stringify(response.data)
    }
  }
})
