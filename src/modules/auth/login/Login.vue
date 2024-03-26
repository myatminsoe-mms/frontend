<template>
  <div class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
    <div class="grid justify-content-center p-2 lg:p-0" style="min-width: 80%">
      <div class="col-12 xl:col-6">
        <div class="h-full w-full m-0 py-7 px-4" style="border-radius: 20px; background-color: #ffffff">
          <div class="text-center mb-5">
            <div class="text-900 text-3xl font-medium mb-3">Welcome!</div>
            <span class="text-600 font-medium">Sign in to continue</span>
          </div>

          <form @submit.prevent="handleSubmit(!v$.$invalid)">
            <div class="w-full md:w-10 mx-auto">
              <label for="identifier" class="block text-900 text-xl font-medium mb-2" :class="{ 'p-error': v$.identifier.$invalid && submitted }">Username</label>
              <InputText id="identifier" v-model="v$.identifier.$model" :class="{ 'p-invalid': v$.identifier.$invalid && submitted }" type="text" class="w-full" placeholder="Username" style="padding: 1rem" />

              <span v-if="v$.identifier.$error && submitted">
                <span v-for="(error, index) of v$.identifier.$errors" id="email-error" :key="index">
                  <small class="p-error">{{ error.$message }}</small>
                </span>
              </span>
              <small v-else-if="(v$.identifier.$invalid && submitted) || v$.identifier.$pending.$response" class="p-error">{{ v$.identifier.required.$message.replace('Value', 'Identifier') }}</small>

              <label for="password" class="block text-900 font-medium text-xl mb-2 mt-3" :class="{ 'p-error': v$.password.$invalid && submitted }">Password</label>
              <Password id="password" v-model="v$.password.$model" placeholder="Password" class="w-full" input-class="w-full" input-style="padding:1rem" :class="{ 'p-invalid': v$.password.$invalid && submitted }" :feedback="false" />

              <small v-if="(v$.password.$invalid && submitted) || v$.password.$pending.$response" class="p-error">{{ v$.password.required.$message.replace('Value', 'Password') }}</small>

              <!-- <div class="flex align-items-center justify-content-between mb-5 mt-3">
                                <div class="flex align-items-center">
                                    <Checkbox id="rememberme1" v-model="checked" :binary="true" class="mr-2" />
                                    <label for="rememberme1">Remember me</label>
                                </div>
                                <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
                            </div> -->

              <Button type="submit" label="Sign In" class="w-full p-3 text-xl mt-5" />
            </div>
          </form>
        </div>
      </div>
    </div>
    <Loading v-if="isLoading" />
  </div>
</template>

<script setup>
import Button from 'primevue/button'
import Password from 'primevue/password'
import InputText from 'primevue/inputtext'
import Loading from '@/components/Loading.vue'

import { useLogin } from './useLogin'

const { v$, handleSubmit, submitted, isLoading } = useLogin()
</script>

<style scoped>
.surface-0 {
  background-color: #eff3f8 !important;
}
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>
