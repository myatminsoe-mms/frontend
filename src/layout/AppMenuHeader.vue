<template>
  <div class="layout-collapse-menu-header">
    <div class="flex align-items-center justify-content-between">
      <router-link :to="{ name: 'dashboard' }" class="w-full">
        <div class="flex justify-content-start align-items-center">
          <img class="menu-collapse-logo" alt="Logo" :src="topbarImage()" />
          <span class="menu-collapse-label ml-3 text-2xl text-bold text-primary">Onenex </span>
        </div>
      </router-link>
      <button v-if="!mobileMenuActive" class="p-link layout-collapse-menu-button layout-collapse-topbar-button ml-0 menu-toggle" @click="onMenuToggle">
        <i class="pi" :class="menuActive ? 'pi-ellipsis-v' : 'pi-ellipsis-h'" style="font-size: 1.5rem; color: var(--text-color)" />
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({ menuActive: Boolean, mobileMenuActive: Boolean })

const emit = defineEmits(['menu-toggle'])

const onMenuToggle = (event) => {
  emit('menu-toggle', event)
}

const topbarImage = () => {
  return `/layout/images/logo.png`
}
</script>
