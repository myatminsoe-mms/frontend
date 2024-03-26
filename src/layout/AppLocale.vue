<template>
  <Menu ref="languageMenu" :model="languageMenuItems" :popup="true">
    <template #item="{ item }">
      <div @click="changeLocale(item.code)" class="p-menuitem-link">
        <div class="cursor-pointer flex align-items-center">
          <img alt="flag" :src="item.image" style="width: 1.5rem" />
          <span class="ml-2 text-primary">{{ item.label }}</span>
        </div>
      </div>
    </template>
  </Menu>
  <Button type="button" class="p-button-text h-full" @click="toggleLanguageMenu">
    <img alt="logo" :src="getFlagUrl()" style="width: 1.5rem" />
    <span class="mx-2 p-button-label hidden lg:flex">{{ $t(`${localeStore.getLocale}`) }}</span>
    <i class="pi pi-angle-down hidden lg:flex"></i>
  </Button>
</template>
<script setup>
import { useLocaleStore } from '@/store/localeStore'
import { ref, onMounted, onUnmounted } from 'vue'
import Tr from '@/libs/i18n/translation'

import Button from 'primevue/button'
import Menu from 'primevue/menu'

const localeStore = useLocaleStore()
const languageMenu = ref()
const languageMenuItems = ref([
  {
    label: 'Myanmar',
    image: `/layout/images/mm.png`,
    code: 'mm'
  },
  {
    label: 'English',
    image: `/layout/images/en.png`,
    code: 'en'
  }
])

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.addEventListener('scroll', handleScroll)
})

const handleScroll = () => {
  if (languageMenu.value) {
    languageMenu.value.hide()
  }
}

const getFlagUrl = () => {
  return localeStore.getLocale === 'mm' ? `/layout/images/mm.png` : `/layout/images/en.png`
}

const changeLocale = async (locale) => {
  await Tr.switchLanguage(locale)
  localeStore.setLocale(locale)
  languageMenu.value.hide()
}

const toggleLanguageMenu = (event) => {
  languageMenu.value.toggle(event)
}
</script>
