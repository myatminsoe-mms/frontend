<template>
  <RouterProgressBar />
  <router-view />
  <Toast position="bottom-right" />
</template>

<script setup>
import Toast from 'primevue/toast'
import RouterProgressBar from '@/components/RouterProgressBar.vue'
import { onMounted, onBeforeUnmount } from 'vue'
import { useToast } from 'primevue/usetoast'
import EventBus from '@/libs/AppEventBus'
import { useLayout } from '@/layout/composables/layout'
import { useThemeStore } from './store/themeStore'

const toast = useToast()
const themeStore = useThemeStore()
const { changeThemeSettings, layoutConfig } = useLayout()

onMounted(() => {
  setupTheme()
  EventBus.on('theme-change', onChangeTheme)
  EventBus.on('show-toast', showToast)
})

onBeforeUnmount(() => {
  EventBus.off('theme-change', onChangeTheme)
  EventBus.off('show-toast', showToast)
})

const setupTheme = () => {
  const currentTheme = themeStore.getCurrentTheme
  const mode = themeStore.getMode
  onChangeTheme({ theme: currentTheme, mode: mode })
}

const onChangeTheme = ({ theme, mode }) => {
  const elementId = 'theme-css'
  const linkElement = document.getElementById(elementId)
  const cloneLinkElement = linkElement.cloneNode(true)
  const newThemeUrl = linkElement.getAttribute('href').replace(layoutConfig.theme.value, theme)
  cloneLinkElement.setAttribute('id', elementId + '-clone')
  cloneLinkElement.setAttribute('href', newThemeUrl)
  cloneLinkElement.addEventListener('load', () => {
    linkElement.remove()
    cloneLinkElement.setAttribute('id', elementId)
    changeThemeSettings(theme, mode)
  })
  linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling)
}

const showToast = (event) => {
  toast.add({
    severity: event.severity,
    summary: event.summary,
    detail: event.detail,
    life: event.life
  })
}
</script>

<style scoped></style>
