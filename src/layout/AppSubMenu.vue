<template>
  <ul v-if="items">
    <template v-for="(item, i) of items">
      <li
        v-if="visible(item) && !item.separator"
        :key="item.label || i"
        :class="[
          {
            'layout-menuitem-category': root,
            'active-menuitem': activeIndex === i && !item.to && !item.disabled
          }
        ]"
        role="none"
      >
        <template v-if="root">
          <div v-if="item.label" class="layout-menuitem-root-text white-space-nowrap overflow-hidden text-overflow-ellipsis" :aria-label="item.label">
            {{ $t(`${item.label}`) }}
          </div>
          <AppSubMenu :items="visible(item) && item.items" @menuitem-click="$emit('menuitem-click', $event)" />
        </template>
        <template v-else>
          <router-link
            v-if="item.to"
            v-ripple
            :to="item.to"
            :class="[item.class, 'p-ripple', { 'p-disabled': item.disabled }]"
            :style="item.style"
            :target="item.target"
            :aria-label="item.label"
            exact
            role="menuitem"
            @click="onMenuItemClick($event, item, i)"
          >
            <i :class="item.icon" />
            <span class="white-space-nowrap overflow-hidden text-overflow-ellipsis">{{ $t(`${item.label}`) }}</span>
            <i v-if="item.items" :class="activeIndex === i ? 'pi pi-chevron-up menuitem-toggle-icon' : 'pi pi-chevron-down menuitem-toggle-icon'" />
            <Badge v-if="item.badge" :value="item.badge" />
          </router-link>
          <a
            v-if="!item.to"
            v-ripple
            :href="item.url || '#'"
            :style="item.style"
            :class="[item.class, 'p-ripple', { 'p-disabled': item.disabled }]"
            :target="item.target"
            :aria-label="item.label"
            role="menuitem"
            @click="onMenuItemClick($event, item, i)"
          >
            <i :class="item.icon" />
            <span class="white-space-nowrap overflow-hidden text-overflow-ellipsis">{{ $t(`${item.label}`) }}</span>
            <i v-if="item.items" :class="activeIndex === i ? 'pi pi-chevron-up menuitem-toggle-icon' : 'pi pi-chevron-down menuitem-toggle-icon'" />
            <Badge v-if="item.badge" :value="item.badge" />
          </a>
          <transition name="layout-submenu-wrapper">
            <AppSubMenu v-show="activeIndex === i" :items="visible(item) && item.items" @menuitem-click="$emit('menuitem-click', $event)" />
          </transition>
        </template>
      </li>
      <li v-if="visible(item) && item.separator" :key="'separator' + i" class="p-menu-separator" :style="item.style" role="separator" />
    </template>
  </ul>
</template>
<script setup>
import Badge from 'primevue/badge'
import ability from '@/libs/acl/ability'
import { ref } from 'vue'

const activeIndex = ref(null)

defineProps({
  items: {
    type: Array
  },
  root: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['menuitem-click'])

const onMenuItemClick = (event, item, index) => {
  if (item.disabled) {
    event.preventDefault()
    return
  }

  if (!item.to && !item.url) {
    event.preventDefault()
  }

  if (item.command) {
    item.command({ originalEvent: event, item: item })
  }

  activeIndex.value = index === activeIndex.value ? null : index

  emit('menuitem-click', {
    originalEvent: event,
    item: item
  })
}

const visible = (item) => {
  if (item.subject) {
    return ability.can(item.action || 'read', item.subject)
  }
  return true
}
</script>
