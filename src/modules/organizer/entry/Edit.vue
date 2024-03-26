<template>
  <div class="card">
    <h5 class="text-start"></h5>
    <form class="p-fluid" @submit.prevent="handleSubmit(!v$.$invalid)">
      <div class="grid">
        <!-- Organizer Profile -->
        <div class="field col-12 flex align-items-center">
          <div class="flex align-items-center">
            <img :src="avatarPreview" class="mr-4 avatar" />
            <div>
              <FileUpload mode="basic" customUpload="true" name="avatar" accept="image/*" class="p-button-outlined p-button-plain" chooseLabel="Browse" @clear="onFileRemove" @select="onFileChange"></FileUpload>
              <span class="p-error opacity-70 mt-3">* Image file should not exceed 2mb.</span>
            </div>
          </div>
        </div>

        <!-- Name -->
        <div class="field col-12 md:col-6 lg:col-6">
          <label for="name" :class="{ 'p-error': v$.name.$invalid && submitted }">Name<span class="p-error">*</span></label>
          <InputText id="name" v-model="v$.name.$model" :class="{ 'p-invalid': v$.name.$invalid && submitted }" :style="{ borderColor: (errors.has('name') ? 'red' : '') }"/>

          <small v-if="(v$.name.$invalid && submitted) || v$.name.$pending.$response" class="p-error">{{ v$.name.required.$message.replace('Value', 'Name') }}</small>
          <!-- Server Validation -->
          <small v-if="errors.has('name')" class="p-error">
            <div v-for="error in errors.get('name')" :key="error">
              {{ error }}
            </div>
          </small>
          <!-- Server Validation -->
        </div>

        <!-- Email -->
        <div class="field col-12 md:col-6 lg:col-6">
          <label for="email" :class="{ 'p-error': v$.email.$invalid && submitted }">Email<span class="p-error">*</span></label>
          <InputText id="email" v-model="v$.email.$model" :class="{ 'p-invalid': v$.email.$invalid && submitted }" aria-describedby="email-error" :style="{ borderColor: (errors.has('email') ? 'red' : '') }"/>

          <!--<small v-if="(v$.email.$invalid && submitted) || v$.email.$pending.$response" class="p-error">{{ v$.email.required.$message.replace('Value', 'Email') }}</small>-->
          <span v-if="v$.email.$error && submitted">
            <span v-for="(error, index) of v$.email.$errors" id="email-error" :key="index">
              <small class="p-error">{{ error.$message.replace('Value', 'Email') }}</small>
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

        <!-- Company Legal Name -->
        <div class="field col-12 md:col-6 lg:col-6">
          <label for="company_legal_name" :class="{ 'p-error': v$.company_legal_name.$invalid && submitted }">Company Legal Name<span class="p-error">*</span></label>
          <InputText id="company_legal_name" v-model="v$.company_legal_name.$model" :class="{ 'p-invalid': v$.company_legal_name.$invalid && submitted }" />

          <small v-if="(v$.company_legal_name.$invalid && submitted) || v$.company_legal_name.$pending.$response" class="p-error">{{ v$.company_legal_name.required.$message.replace('Value', 'Company Legal Name') }}</small>
          <!-- Server Validation -->
          <small v-if="errors.has('company_legal_name')" class="p-error">
            <div v-for="error in errors.get('company_legal_name')" :key="error">
              {{ error }}
            </div>
          </small>
          <!-- Server Validation -->
        </div>

        <!-- Position -->
        <div class="field col-12 md:col-6 lg:col-6">
          <label for="position" :class="{ 'p-error': v$.position.$invalid && submitted }">Position<span class="p-error">*</span></label>
          <InputText id="position" v-model="v$.position.$model" :class="{ 'p-invalid': v$.position.$invalid && submitted }" />

          <small v-if="(v$.position.$invalid && submitted) || v$.position.$pending.$response" class="p-error">{{ v$.position.required.$message.replace('Value', 'Position') }}</small>
          <!-- Server Validation -->
          <small v-if="errors.has('position')" class="p-error">
            <div v-for="error in errors.get('position')" :key="error">
              {{ error }}
            </div>
          </small>
          <!-- Server Validation -->
        </div>

        <!-- Company Phone -->
        <div class="field col-12 md:col-6 lg:col-6">
          <label for="company_phone" :class="{ 'p-error': v$.company_phone.$invalid && submitted }">Company Phone<span class="p-error">*</span></label>
          <InputText id="company_phone" v-model="v$.company_phone.$model" :class="{ 'p-invalid': v$.company_phone.$invalid && submitted }" />

          <!--<small v-if="(v$.company_phone.$invalid && submitted) || v$.company_phone.$pending.$response" class="p-error">{{ v$.company_phone.required.$message.replace('Value', 'Company Phone') }}</small>-->
          <span v-if="v$.company_phone.$error && submitted">
            <span v-for="(error, index) of v$.company_phone.$errors" id="company-phone-error" :key="index">
              <small class="p-error">{{ error.$message.replace('Value', 'Company Phone') }}</small><br/>
            </span>
          </span>
          <!-- Server Validation -->
        </div>

        <!-- Tax Payer No -->
        <div class="field col-12 md:col-6 lg:col-6">
          <label for="tax_payer_no" :class="{ 'p-error': v$.tax_payer_no.$invalid && submitted }">Tax Payer No<span class="p-error">*</span></label>
          <InputText id="tax_payer_no" v-model="v$.tax_payer_no.$model" :class="{ 'p-invalid': v$.tax_payer_no.$invalid && submitted }" />

          <!--<small v-if="(v$.tax_payer_no.$invalid && submitted) || v$.tax_payer_no.$pending.$response" class="p-error">{{ v$.tax_payer_no.required.$message.replace('Value', 'Tax Payer No') }}</small>-->
          <span v-if="v$.tax_payer_no.$error && submitted">
            <span v-for="(error, index) of v$.tax_payer_no.$errors" id="tax-payer-no-error" :key="index">
              <small class="p-error">{{ error.$message.replace('Value', 'Tax Payer No') }}</small><br/>
            </span>
          </span>
          <!-- Server Validation -->
        </div>

        <!-- Website -->
        <div class="field col-12 md:col-6 lg:col-6">
          <label for="website" :class="{ 'p-error': v$.website.$invalid && submitted }">Website<span class="p-error">*</span></label>
          <InputText id="website" v-model="v$.website.$model" :class="{ 'p-invalid': v$.website.$invalid && submitted }" />

          <span v-if="v$.website.$error && submitted">
            <span v-for="(error, index) of v$.website.$errors" id="website-error" :key="index">
              <small class="p-error">{{ error.$message.replace('Value', 'Website') }}</small>
            </span>
          </span>
          <!-- Server Validation -->
        </div>

        <!-- Description -->
        <div class="field col-12 md:col-6 lg:col-6">
          <label for="description" :class="{ 'p-error': v$.description.$invalid && submitted }">Description<span class="p-error">*</span></label>
          <TextArea id="description" v-model="v$.description.$model" :class="{ 'p-invalid': v$.description.$invalid && submitted }" />

          <small v-if="(v$.description.$invalid && submitted) || v$.description.$pending.$response" class="p-error">{{ v$.description.required.$message.replace('Value', 'Description') }}</small>
          <!-- Server Validation -->
          <small v-if="errors.has('description')" class="p-error">
            <div v-for="error in errors.get('description')" :key="error">
              {{ error }}
            </div>
          </small>
          <!-- Server Validation -->
        </div>
      </div>

      <div class="flex justify-content-end">
        <router-link v-if="$can('index', 'Organizer')" :to="{ name: 'organizerList' }">
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
//import Dropdown from 'primevue/dropdown'
import FileUpload from 'primevue/fileupload'
import InputText from 'primevue/inputtext'
import TextArea from 'primevue/textarea'
//import Password from 'primevue/password'
//import RadioButton from 'primevue/radiobutton'
import Loading from '@/components/Loading.vue'

import { useEdit } from './useEdit'

const { isLoading, v$, onFileChange, onFileRemove, avatarPreview, handleSubmit, submitted, errors } = useEdit()
</script>

<style lang="scss" scoped>
.avatar {
  width: 128px;
  height: 128px;
  object-fit: cover;
}
</style>
