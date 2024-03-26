<template>
  <Dropdown v-model="countryPhoneCode" :options="optionsCountryPhoneCode" optionLabel="name" :filter="true" placeholder="Select Country Code" class="w-full">
    <template #value="slotProps">
      <div class="country-item flex relative" v-if="slotProps.value">
        <img :class="'flag flag-' + slotProps.value.iso2" />
        <div>({{ slotProps.value.code }})</div>
      </div>
      <span v-else>
        {{ slotProps.placeholder }}
      </span>
    </template>
    <template #option="slotProps">
      <div class="country-item flex relative">
        <img :class="'flag flag-' + slotProps.option.iso2" />
        <div>{{ slotProps.option.name }}</div>
      </div>
    </template>
  </Dropdown>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import countryCode from '@/assets/data/contryPhoneCode'
import Dropdown from 'primevue/dropdown'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  defaultCountryCode: String
})

const countryPhoneCode = ref({})
const optionsCountryPhoneCode = ref([])

onMounted(() => {
  optionsCountryPhoneCode.value = countryCode
  fetchDefaultCountryCode()
})

const fetchDefaultCountryCode = () => {
  if (props.defaultCountryCode) {
    optionsCountryPhoneCode.value.forEach((country) => {
      if (country.code === props.defaultCountryCode) {
        countryPhoneCode.value = country
      }
    })
  }
}

watch([countryPhoneCode], () => {
  emit('update:modelValue', countryPhoneCode.value)
})

watch(
  () => props.defaultCountryCode,
  () => {
    fetchDefaultCountryCode()
  }
)
</script>
<style lang="scss" scoped>
.p-dropdown-panel .p-dropdown-items {
  max-height: 200px !important;
}
.country-item {
  img {
    margin-right: 0.5rem;
  }
}
</style>
