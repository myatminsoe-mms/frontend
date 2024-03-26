<template>
  <div class="layout-collapse-topbar">
    <button class="p-link layout-collapse-menu-button layout-collapse-topbar-button ml-0 lg:hidden" @click="onMenuToggle">
      <i class="pi pi-bars" />
    </button>

    <AppBreadcrumb />

    <ul class="layout-collapse-topbar-menu flex origin-top">
      <li>
        <AppThemeToggle />
      </li>
      <li>
        <AppLocale />
      </li>
      <li>
        <AppUserProfile />
      </li>
    </ul>
  </div>
</template>

<script setup>
import AppLocale from './AppLocale.vue'
import AppThemeToggle from './AppThemeToggle.vue'
import AppUserProfile from './AppUserProfile.vue'
import AppBreadcrumb from './AppBreadcrumb.vue'

const emit = defineEmits(['menu-toggle'])

const onMenuToggle = (event) => {
  emit('menu-toggle', event)
}
</script>
