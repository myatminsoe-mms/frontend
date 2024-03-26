<template>
  <div class="card">
    <h5 class="text-start"></h5>
    <form class="p-fluid" @submit.prevent="handleSubmit(!v$.$invalid)">
      <div class="grid">
        <!-- User Profile -->
        <div class="field col-12 flex align-items-center">
          <div class="flex align-items-center">
            <img :src="avatarPreview" class="mr-4 avatar" />
            <FileUpload mode="basic" customUpload="true" name="avatar" accept="image/*" class="p-button-outlined p-button-plain" chooseLabel="Browse" @clear="onFileRemove" @select="onFileChange"></FileUpload>
          </div>
        </div>

        <!-- Username -->
        <div class="field col-12 md:col-6 lg:col-6">
          <label for="username" :class="{ 'p-error': v$.username.$invalid && submitted }">Username<span class="p-error">*</span></label>
          <InputText id="username" v-model="v$.username.$model" :class="{ 'p-invalid': v$.username.$invalid && submitted }" readonly="true" />

          <small v-if="(v$.username.$invalid && submitted) || v$.username.$pending.$response" class="p-error">{{ v$.username.required.$message.replace('Value', 'Username') }}</small>
          <!-- Server Validation -->
          <small v-if="errors.has('username')" class="p-error">
            <div v-for="error in errors.get('username')" :key="error">
              {{ error }}
            </div>
          </small>
          <!-- Server Validation -->
        </div>

        <!-- Full Name -->
        <div class="field col-12 md:col-6 lg:col-6">
          <label for="full_name" :class="{ 'p-error': v$.full_name.$invalid && submitted }">{{ $t('Full Name') }}<span class="p-error">*</span></label>
          <InputText id="full_name" v-model="v$.full_name.$model" :class="{ 'p-invalid': v$.full_name.$invalid && submitted }" />

          <small v-if="(v$.full_name.$invalid && submitted) || v$.full_name.$pending.$response" class="p-error">{{ v$.full_name.required.$message.replace('Value', 'Full Name') }}</small>
          <!-- Server Validation -->
          <small v-if="errors.has('full_name')" class="p-error">
            <div v-for="error in errors.get('full_name')" :key="error">
              {{ error }}
            </div>
          </small>
          <!-- Server Validation -->
        </div>

        <!-- Password -->
        <div class="field col-12 md:col-6 lg:col-6">
          <label for="password" :class="{ 'p-error': v$.password.$invalid && submitted }">{{ $t('Password') }}<span class="p-error">*</span></label>
          <Password id="password" v-model="v$.password.$model" autocomplete="new-password" placeholder="Password" :class="{ 'p-invalid': v$.password.$invalid && submitted }" :feedback="false" toggleMask />

          <small v-if="(v$.password.$invalid && submitted) || v$.password.$pending.$response" class="p-error">
            <span v-if="v$.password.required.$invalid">
              {{ v$.password.required.$message.replace('Value', 'User password') }}
            </span>
            <span v-if="v$.password.minLength.$invalid">
              {{ v$.password.minLength.$message.replace('Value', 'User password') }}
            </span>
          </small>
        </div>

        <!-- Email -->
        <div class="field col-12 md:col-6 lg:col-6">
          <label for="email" :class="{ 'p-error': v$.email.$invalid && submitted }">{{ $t('Email') }}</label>
          <InputText id="email" v-model="v$.email.$model" :class="{ 'p-invalid': v$.email.$invalid && submitted }" aria-describedby="email-error" />

          <span v-if="v$.email.$error && submitted">
            <span v-for="(error, index) of v$.email.$errors" id="email-error" :key="index">
              <small class="p-error">{{ error.$message }}</small>
            </span>
          </span>

          <!-- Server Validation -->
          <small v-if="errors.has('email')" class="p-error">
            <div v-for="error in errors.get('email')" :key="error">
              {{ error }}
            </div>
          </small>
          <!-- Server Validation -->
        </div>

        <!-- Mobile Number -->
        <div class="field col-12 md:col-6 lg:col-6">
          <label for="mobile_number" :class="{ 'p-error': v$.mobile_number.$invalid && submitted }">{{ $t('Mobile Number') }}</label>
          <InputText id="mobile_number" v-model="v$.mobile_number.$model" :class="{ 'p-invalid': v$.mobile_number.$invalid && submitted }" />

          <small v-if="(v$.mobile_number.$invalid && submitted) || v$.mobile_number.$pending.$response" class="p-error">{{ v$.mobile_number.required.$message.replace('Value', 'PhoneNumber') }}</small>
          <!-- Server Validation -->
          <small v-if="errors.has('phone_number')" class="p-error">
            <div v-for="error in errors.get('phone_number')" :key="error">
              {{ error }}
            </div>
          </small>
          <!-- Server Validation -->
        </div>

        <!-- Role -->
        <div class="field col-12 md:col-6 lg:col-6">
          <label for="role" :class="{ 'p-error': v$.role_id.$invalid && submitted }">{{ $t('Role') }}<span class="p-error">*</span></label>
          <Dropdown v-model="v$.role_id.$model" :options="roles" optionLabel="name" optionValue="code" placeholder="Select role" class="w-full" showClear />
          <small v-if="(v$.role_id.$invalid && submitted) || v$.role_id.$pending.$response" class="p-error">
            {{ v$.role_id.required.$message.replace('Value', 'User role') }}
          </small>
        </div>

        <!-- Status -->
        <div class="field col-12 md:col-6 lg:col-6">
          <label for="status" :class="{ 'p-error': v$.status.$invalid && submitted }">{{ $t('Status') }}<span class="p-error">*</span></label>
          <div class="flex flex-wrap gap-3 mt-2">
            <div v-for="status in statuses" :key="status.code" class="flex align-items-center">
              <RadioButton v-model="v$.status.$model" :inputId="status.code" name="status" :value="status.name" />
              <label :for="status.code" class="ml-2">{{ status.name }}</label>
            </div>
          </div>
          <small v-if="(v$.status.$invalid && submitted) || v$.status.$pending.$response" class="p-error">
            {{ v$.status.required.$message.replace('Value', 'User status') }}
          </small>
        </div>
      </div>

      <div class="flex justify-content-end">
        <router-link v-if="$can('index', 'User')" :to="{ name: 'userList' }">
          <div class="m-2">
            <Button label="Cancel" severity="secondary" text class="shadow-1" />
          </div>
        </router-link>
        <div class="m-2">
          <Button type="submit" label="Save" severity="primary" />
        </div>
      </div>
    </form>
    <Loading v-if="isLoading" />
  </div>
</template>

<script setup>
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import FileUpload from 'primevue/fileupload'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import RadioButton from 'primevue/radiobutton'
import Loading from '@/components/Loading.vue'

import { useEdit } from './useEdit'

const { isLoading, v$, statuses, roles, onFileChange, onFileRemove, avatarPreview, handleSubmit, submitted, errors } = useEdit()
</script>

<style lang="scss" scoped>
.avatar {
  width: 128px;
  height: 128px;
  object-fit: cover;
}
</style>
