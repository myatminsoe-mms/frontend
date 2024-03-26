<template>
  <input
    @keydown="isNumber($event)"
    @keypress="isNumber($event)"
    id="mobile_number"
    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
    maxlength="12"
    placeholder="912345678"
    :class="['p-inputtext p-component', { 'p-filled': filled }]"
    :value="modelValue"
    @input="onInput"
  />
</template>

<script setup>
import { computed } from 'vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: null
})

const onInput = (event) => {
  emit('update:modelValue', event.target.value)
}

const isNumber = (evt) => {
  let keyCode = evt.keyCode ? evt.keyCode : evt.which
  if ((keyCode < 48 || keyCode > 57) && keyCode !== 46 && keyCode !== 8) {
    // 46 is delete
    // 8 is backspace
    evt.preventDefault()
  }
}

const filled = computed(() => {
  return props.modelValue != null && props.modelValue.toString().length > 0
})
</script>
