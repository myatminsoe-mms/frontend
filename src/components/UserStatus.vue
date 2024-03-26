<template>
  <div class="grid grid-nogutter align-items-center">
    <div
      class="col h-3rem border-1 border-300 text-900 inline-flex justify-content-center align-items-center flex-shrink-0 border-round mr-3 cursor-pointer hover:surface-100 transition-duration-150 transition-colors"
      :class="{
        'border-yellow-500 border-2 text-yellow-500': modelValue === 'PENDING'
      }"
      @click="onChange('PENDING')"
    >
      PENDING
    </div>
    <div
      class="col h-3rem border-1 border-300 text-900 inline-flex justify-content-center align-items-center flex-shrink-0 border-round mr-3 cursor-pointer hover:surface-100 transition-duration-150 transition-colors"
      :class="{
        'border-green-500 border-2 text-green-500': modelValue === 'VERIFIED'
      }"
      @click="onChange('VERIFIED')"
    >
      VERIFIED
    </div>
    <div
      class="col h-3rem border-1 border-300 text-900 inline-flex justify-content-center align-items-center flex-shrink-0 border-round mr-3 cursor-pointer hover:surface-100 transition-duration-150 transition-colors"
      :class="{
        'border-red-600 border-2 text-red-600': modelValue === 'DISABLED'
      }"
      @click="onChange('DISABLED')"
    >
      DISABLED
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserStatus',
  emits: ['update:modelValue'],
  props: {
    modelValue: null
  },
  methods: {
    onChange(type) {
      this.$emit('update:modelValue', type)
    }
  },
  computed: {}
}
</script>
