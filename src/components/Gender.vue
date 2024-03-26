<template>
  <Dropdown inputId="gender" :modelValue="modelValue" :options="optionsGenderType" @change="$emit('update:modelValue', $event.value)" class="w-full" />
</template>

<script setup>
import { ref } from 'vue'

import Dropdown from 'primevue/dropdown'

defineProps({
  modelValue: {
    type: String,
    default: '',
    required: true
  }
})

const optionsGenderType = ref(['MALE', 'FEMALE', 'PREFER NOT TO SAY'])
</script>
<style scope></style>
