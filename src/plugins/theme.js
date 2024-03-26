import { app } from './main-app'
import { reactive } from 'vue'
import { useLocaleStore } from '@/store/localeStore'

const localeStore = useLocaleStore()

app.config.globalProperties.$appState = reactive({
  theme: localeStore.getCurrentTheme,
  darkTheme: localeStore.getCurrentTheme === 'lara-dark-indigo' ? true : false
})
