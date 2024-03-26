### Date Formatter

```html,javascript
<template>
  <div>
    <h5>{{ $moment().format("MMMM Do YYYY, h:mm:ss a") }}</h5>
    <h5>{{ currentLong }}</h5>
    <h5>{{ currentShort }}</h5>
  </div>
</template>
<script setup>
import { dateLong, dateShort } from "@/utils/formatter"

const currentLong = dateLong(new Date())
const currentShort = dateShort(new Date())

</script>
```

### Blood Type Picker

```html,javascript
<template>
  <div>
    <BloodType v-model="bloodType" />
  </div>
</template>
<script setup>
import BloodType from "@/components/BloodType"

const bloodType = ref("")

</script>

```

### Gender Picker

```html,javascript
<template>
  <div>
    <Gender v-model="gender" />
  </div>
</template>
<script setup>
import Gender from "@/components/Gender"

const gender = ref("")

</script>
```

### NRC Picker

```html,javascript
<template>
  <div>
    <NRC v-model="nrc" />
  </div>
</template>
<script setup>
import NRC from "@/components/NRC"

const nrc = ref("6/HTAWANA(N)000000")

</script>
```

### Phone Number

```html,javascript
<template>
  <div>
    <PhoneNumber
      id="nrc"
      v-model:countryCode="countryCode"
      v-model:phoneNumber="phoneNumber"
    >
    </PhoneNumber>
  </div>
</template>
<script setup>
import PhoneNumber from "@/components/PhoneNumber.vue"

const countryCode = ref("+95")
const phoneNumber = ref("092423239")

</script>
```

## SASS Variables

In case you'd like to customize the layout variables, open **\_variables.scss** file under src/assets/styles folder. The list is pretty short as majority of the variables are derived from the PrimeVue theme being used.

**src/assets/styles/\_variables.scss**

```css
$fontSize: 1rem;
$borderRadius: 12px;
$transitionDuration: 0.2s;
```
