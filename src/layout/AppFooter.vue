<template>
  <div class="layout-footer">
    <img alt="Logo" :src="footerImage" height="20" class="mr-2" />
    <span class="font-medium ml-2">Onenex © {{ new Date().getFullYear() }}</span>
  </div>
</template>

<script setup>
import { useLayout } from '@/layout/composables/layout'
import { computed } from 'vue'

const { layoutConfig } = useLayout()

const footerImage = computed(() => {
  return `/layout/images/${layoutConfig.darkTheme.value == 'dark' ? 'logo-white' : 'logo-dark'}.svg`
})
</script>
