<template>
  <Button v-if="isDarkTheme == 'dark'" icon="pi pi-sun" class="p-button-rounded p-button-text" @click="changeTheme('lara-light-indigo', 'light')" />
  <Button v-else icon="pi pi-moon" class="p-button-rounded p-button-text" @click="changeTheme('lara-dark-indigo', 'dark')" />
</template>

<script setup>
import EventBus from '@/libs/AppEventBus'
import { useThemeStore } from '@/store/themeStore'
import { computed } from 'vue'

import Button from 'primevue/button'

const themeStore = useThemeStore()

const isDarkTheme = computed(() => {
  return themeStore.getMode
})

const changeTheme = (theme, mode) => {
  themeStore.setTheme(theme)
  themeStore.setMode(mode)
  EventBus.emit('theme-change', { theme: theme, mode: mode })
}
</script>
