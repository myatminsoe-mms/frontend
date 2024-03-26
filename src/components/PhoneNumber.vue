<template>
  <div class="p-inputgroup nrc-group">
    <Dropdown
      :options="optionsCountryPhoneCode"
      optionValue="code"
      optionLabel="name"
      :filter="true"
      placeholder="Select Country Code"
      class="country-code border-none w-6"
      :modelValue="countryCode"
      @change="$emit('update:countryCode', $event.value)"
    >
      <template #value="slotProps">
        <div class="country-item flex relative" v-if="slotProps.value">
          <img :class="'flag flag-' + flag" />
          <div>({{ slotProps.value }})</div>
        </div>
        <span v-else>
          {{ slotProps.placeholder }}
        </span>
      </template>
      <template #option="slotProps">
        <div class="country-item flex relative">
          <img :class="'flag flag-' + slotProps.option.iso2" />
          <div>{{ slotProps.option.name }} {{ slotProps.option.code }}</div>
        </div>
      </template>
    </Dropdown>

    <InputPhone mask="9999999999" placeholder="" slotChar="" class="w-full border-none w-6" :value="phoneNumber" @input="$emit('update:phoneNumber', $event.target.value)" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import optionsCountryCode from '@/assets/data/contryPhoneCode'
import Dropdown from 'primevue/dropdown'
import InputPhone from '@/components/InputPhone.vue'

const props = defineProps({
  phoneNumber: {
    type: String,
    default: '',
    required: true
  },
  countryCode: {
    type: String,
    default: '',
    required: true
  }
})

const flag = ref()
const optionsCountryPhoneCode = ref([])

onMounted(() => {
  optionsCountryPhoneCode.value = optionsCountryCode
  getFlag()
})

const getFlag = () => {
  optionsCountryPhoneCode.value.forEach((country) => {
    if (country.code === props.countryCode) {
      flag.value = country.iso2
    }
  })
}

watch(
  () => props.countryCode,
  () => {
    getFlag()
  }
)
</script>
<style lang="scss" scoped>
.country-code .p-dropdown-trigger {
  /* display: none; */
  width: auto !important;
}
.country-code .p-dropdown-panel .p-dropdown-items {
  max-height: 200px !important;
}
.country-item {
  img {
    margin-right: 0.5rem;
  }
}
</style>
