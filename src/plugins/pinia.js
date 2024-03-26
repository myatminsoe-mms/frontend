import { createPinia } from 'pinia'
import { app } from './main-app'

const pinia = createPinia()
app.use(pinia)
