<template>
  <div class="layout-collapse-menu-container">
    <AppSubMenu :items="model" class="layout-collapse-menu" :root="true" @menuitem-click="onMenuItemClick" @keydown="onKeyDown" />
  </div>
</template>

<script setup>
import AppSubMenu from '@/layout/AppSubMenu.vue'

defineProps({
  model: {
    type: Array
  }
})

const emit = defineEmits(['menuitem-click'])

const onMenuItemClick = (event) => {
  emit('menuitem-click', event)
}

const onKeyDown = (event) => {
  const nodeElement = event.target
  if (event.code === 'Enter' || event.code === 'Space') {
    nodeElement.click()
    event.preventDefault()
  }
}
</script>
