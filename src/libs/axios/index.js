import axios from 'axios'
import EventBus from '@/libs/AppEventBus'
import JsonParseBigInt from 'json-parse-bigint'
import { useAuthStore } from '@/modules/auth/authStore'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

api.interceptors.request.use((config) => {
  const store = useAuthStore()
  const access_token = store.getToken
  if (access_token) {
    config.headers['Authorization'] = `Bearer ${access_token}`
  }
  config.transformResponse = (data) => data
  return config
})

api.interceptors.response.use(
  (res) => {
    res.data = JsonParseBigInt(res.data)
    return res
  },
  (err) => {
    err.response.data = JSON.parse(err.response.data)
    if (err.response) {
      if (err.response.status === 401) {
        const store = useAuthStore()
        store.logout()
        router.push({ name: 'login' })
      } else if (err.response.status === 403) {
        router.push({ name: 'not-authorized' })
      } else if (err.response.status === 422) {
        return Promise.reject(err.response)
      }
      showToast(err.message)
    } else if (err.request) {
      showToast(err.message)
    } else {
      showToast(err.message)
    }
  }
)

const showToast = (message) => {
  EventBus.emit('show-toast', {
    severity: 'error',
    summary: '',
    detail: message,
    life: 3000
  })
}

export default api
