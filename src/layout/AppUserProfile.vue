<template>
  <Menu ref="userMenu" :model="profileMenuItems" :popup="true" />
  <div class="flex justify-content-center align-items-center cursor-pointer ml-3" @click="togglePanel">
    <Avatar :image="user != null && user.avatar != null ? user.avatar : '/layout/images/user.png'" size="large" shape="circle" />
    <div class="user-menu ml-4 hidden lg:block">
      <div class="font-bold">{{ user != null ? user.full_name : 'User Name' }}</div>
      <div class="text-sm mt-1">{{ user != null ? user.role.name : 'Role' }}</div>
    </div>
    <i class="pi pi-angle-down ml-2 hidden lg:block" style="color: var(--primary-color)"></i>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

import { useAuthStore } from '@/modules/auth/authStore'
import { useRouter } from 'vue-router'

import Avatar from 'primevue/avatar'
import Menu from 'primevue/menu'
import { authService } from '@/modules/auth/authService'
import { computed } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const userMenu = ref()

const profileMenuItems = ref([
  {
    label: 'Profile',
    icon: 'pi pi-user-edit',
    command: () => {
      linkTo('profile')
    }
  },
  {
    separator: true
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: () => {
      userLogout()
    }
  }
])

// const user = authStore.getUserData
const user = computed(() => authStore.getUserData)

const togglePanel = (event) => {
  userMenu.value.toggle(event)
}

const handleScroll = () => {
  if (userMenu.value) {
    userMenu.value.hide()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.addEventListener('scroll', handleScroll)
})

const userLogout = () => {
  const access_token = localStorage.getItem('accessToken')
  authService.logout(access_token)
  authStore.logout()
  router.push({ name: 'login' })
}

const linkTo = (routeName) => {
  router.push({ name: routeName })
}
</script>
<style lang="scss" scoped>
.user-menu {
  min-width: 100px;
}
</style>
