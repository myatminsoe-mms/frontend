<template>
  <div class="grid m-0 p-0">
    <div class="p-inputgroup nrc-group">
      <Dropdown inputId="prefix" v-model="prefix" :options="optionsPrefix" class="w-full nrc border-none w-2" />

      <Dropdown inputId="town" v-model="town" :options="optionsTown" optionLabel="name" optionValue="name" :filter="true" class="w-full town border-none w-4" />

      <Dropdown inputId="type" v-model="type" :options="optionsType" class="w-full type border-none w-3" />

      <InputText v-model="number" placeholder="000000" class="w-full border-none w-3" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'

import nrcData from '@/assets/data/nrcData'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const prefix = ref('')
const town = ref('')
const type = ref('')
const number = ref('')
const optionsPrefix = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])
const optionsTown = ref([])
const optionsType = ref(['N', 'P', 'E', 'C'])
const nrcNumber = ref('')

const nrcRegExp = new RegExp(/^([0-9]{1,2})\/([A-Z]{5,8})\(([N,P,E,C])\)([0-9]{6})$/)

onMounted(() => {
  getNRCData()
})

const getNRCData = () => {
  if (props.modelValue) {
    const result = props.modelValue.split(nrcRegExp).filter(Boolean) //to remove empty string from array
    if (result && result.length === 4) {
      prefix.value = parseInt(result[0])
      town.value = result[1]
      type.value = result[2]
      number.value = parseInt(result[3])
    }
  }
}

watch(prefix, () => {
  optionsTown.value = []
  for (const pre in nrcData) {
    if (pre == prefix.value) {
      optionsTown.value = nrcData[pre]
    }
  }
})

watch([prefix, town, type, number], () => {
  nrcNumber.value = `${prefix.value}/${town.value}(${type.value})${number.value}`
  emit('update:modelValue', nrcNumber.value)
})

watch(
  () => props.modelValue,
  () => {
    getNRCData()
  }
)
</script>
<style lang="scss" scope>
.nrc-group {
  border: 1px solid #ced4da;
  transition:
    background-color 0.2s,
    color 0.2s,
    border-color 0.2s,
    box-shadow 0.2s;
  border-radius: 6px;
}
.nrc-group:focus,
.nrc-group:hover {
  outline: 0 none;
  outline-offset: 0;
  border-color: var(--primary-color);
}
.town .p-dropdown-trigger {
  width: auto !important;
}
.type .p-dropdown-trigger {
  width: auto !important;
}
.nrc .p-dropdown-trigger {
  width: auto !important;
}
</style>
