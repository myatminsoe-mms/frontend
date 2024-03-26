<template>
  <div :class="containerClass" @click="onWrapperClick">
    <div class="layout-collapse-sidebar" @click="onSidebarClick">
      <AppMenuHeader @menu-toggle="onMenuToggle" :menuActive="staticMenuInactive" :mobileMenuActive="mobileMenuActive" />
      <AppMenu :model="menu" @menuitem-click="onMenuItemClick" />
    </div>
    <AppTopBar @menu-toggle="onMenuToggle" />
    <div class="layout-collapse-main-container">
      <div class="layout-collapse-main">
        <router-view />
      </div>
      <!-- <AppFooter /> -->
    </div>

    <transition name="layout-mask">
      <div v-if="mobileMenuActive" class="layout-mask p-component-overlay" />
    </transition>
  </div>
</template>

<script setup>
import AppTopBar from './AppTopbar.vue'
import AppMenu from './AppMenu.vue'
import AppMenuHeader from './AppMenuHeader.vue'
// import AppFooter from './AppFooter.vue'
import menuList from '@/menu'
import { useLayout } from '@/layout/composables/layout'
import { useMenuStore } from '../store/menuStore'
import { onBeforeUnmount } from 'vue'

import { computed, ref } from 'vue'

const { layoutConfig } = useLayout()
const menuStore = useMenuStore()

const layoutMode = ref('static')
const staticMenuInactive = ref(menuStore.getStaticMenuInactive)
const overlayMenuActive = ref(false)
const mobileMenuActive = ref(false)
const menu = ref(menuList)
const menuClick = ref(false)

onBeforeUnmount(() => {
  menuStore.$dispose()
})

const containerClass = computed(() => {
  return [
    'layout-wrapper',
    {
      'layout-overlay': layoutMode.value === 'overlay',
      'layout-static': layoutMode.value === 'static',
      'layout-static-sidebar-inactive': staticMenuInactive.value && layoutMode.value === 'static',
      'layout-overlay-sidebar-active': overlayMenuActive.value && layoutMode.value === 'overlay',
      'layout-mobile-sidebar-active': mobileMenuActive.value,
      'p-input-filled': layoutConfig.inputStyle.value === 'filled',
      'p-ripple-disabled': !layoutConfig.ripple.value
    }
  ]
})

const onWrapperClick = () => {
  if (!menuClick.value) {
    overlayMenuActive.value = false
    mobileMenuActive.value = false
  }

  menuClick.value = false
}
const onMenuToggle = (event) => {
  menuClick.value = true

  if (isDesktop()) {
    if (layoutMode.value === 'overlay') {
      if (mobileMenuActive.value === true) {
        overlayMenuActive.value = true
      }

      overlayMenuActive.value = !overlayMenuActive.value
      mobileMenuActive.value = false
    } else if (layoutMode.value === 'static') {
      menuStore.setStaticMenuInactive(!staticMenuInactive.value)
      staticMenuInactive.value = !staticMenuInactive.value
    }
  } else {
    mobileMenuActive.value = !mobileMenuActive.value
  }

  event.preventDefault()
}
const onSidebarClick = () => {
  menuClick.value = true
}
const onMenuItemClick = (event) => {
  if (event.item && !event.item.items) {
    overlayMenuActive.value = false
    mobileMenuActive.value = false
  }
}

const isDesktop = () => {
  return window.innerWidth >= 992
}
</script>

<style lang="scss">
@import './app.scss';
</style>
