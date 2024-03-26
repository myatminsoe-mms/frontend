<template>
  <div class="align-items-center hidden lg:flex">
    <div class="text-2xl font-bold">
      {{ $route.meta.title || 'Dashboard' }}
    </div>
    <!-- <Divider v-if="breadcumbs.length > 0" layout="vertical" class="mr-0" /> -->

    <!-- <Breadcrumb v-if="breadcumbs.length > 0" :home="home" :model="breadcumbs">
            <template #item="{ item }">
                <router-link :to="{ name: item.routeName }" custom v-slot="{ href, navigate, isActive, isExactActive }">
                    <a
                        :href="href"
                        @click="navigate"
                        class="cursor-auto text-primary mx-2"
                        :class="{
                            'cursor-pointer text-breadcrumb ': !isActive || !isExactActive
                        }"
                        >{{ item.title }}</a
                    >
                </router-link>
            </template>
        </Breadcrumb> -->
  </div>
</template>

<script setup>
// import { ref, computed } from 'vue'
// import { useRoute } from 'vue-router'

// import Breadcrumb from 'primevue/breadcrumb'
// import Divider from 'primevue/divider'

// const route = useRoute()
// const home = ref({
//     routeName: 'dashboard',
//     to: '/',
//     title: 'Home'
// })

// const breadcumbs = computed(() => {
//     return route.meta.breadcrumbs || []
// })
</script>
<style scoped>
.p-breadcrumb {
  border: none !important;
  background-color: transparent !important;
}

.text-breadcrumb {
  color: var(--text-color);
}
.text-breadcrumb:hover {
  color: var(--primary-color) !important;
}
</style>
