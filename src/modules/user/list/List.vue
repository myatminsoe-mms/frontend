<template>
  <div>
    <div class="card mb-4">
      <div class="grid">
        <div class="field col-12 md:col-6 lg:col-3">
          <label class="label-sm"><i class="pi pi-filter"></i>&nbsp; {{ $t('Role') }} </label>
          <Dropdown v-model="selectedRole" :options="roles" optionLabel="name" optionValue="code" placeholder="Select role" class="w-full" showClear />
        </div>

        <div class="field col-12 md:col-6 lg:col-3">
          <label class="label-sm"><i class="pi pi-filter"></i>&nbsp;{{ $t('Status') }} </label>
          <Dropdown v-model="selectedStatus" :options="statuses" optionLabel="name" optionValue="code" placeholder="Select status" class="w-full" showClear />
        </div>

        <div class="field col-12 md:col-6 lg:col-3">
          <label class="label-sm"><i class="pi pi-filter"></i>&nbsp;{{ $t('Date') }}</label>
          <Calendar :placeholder="$t('Date Range')" inputId="selectedDateBetween" v-model="selectedDateBetween" selectionMode="range" :manualInput="false" dateFormat="dd/mm/yy" class="w-full" showIcon :showButtonBar="true" />
        </div>
      </div>
    </div>
    <div class="card">
      <DataTable
        ref="dt"
        dataKey="id"
        :lazy="true"
        :paginator="true"
        :value="records"
        @page="onPage($event)"
        @sort="onSort($event)"
        sortMode="multiple"
        :multiSortMeta="lazyParams.multiSortMeta"
        :totalRecords="totalRecords"
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50, 100]"
        :scrollable="true"
        :first="lazyParams.first"
        scrollHeight="60vh"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        :loading="isLoading"
        responsiveLayout="scroll"
      >
        <template #header>
          <div class="flex flex-wrap justify-content-between align-items-center">
            <h5 class="m-0"></h5>
            <span class="p-input-icon-left">
              <div class="mt-3 md:mt-0">
                <span class="p-input-icon-left w-full md:w-auto">
                  <i class="pi pi-search" />
                  <InputText v-model="search" placeholder="Keyword Search" class="w-full md:w-auto" />
                </span>
                <router-link v-if="$can('create', 'User')" :to="{ name: 'newUser' }">
                  <Button label="New" class="ml-0 md:ml-2 mt-2 md:mt-0" severity="success" />
                </router-link>

                <Menu ref="actionMenu" :model="actionItems" :popup="true" />
                <Button icon="pi pi-cog" @click="toggleActionMenu" class="p-button-info p-button-outlined ml-2 mt-2 md:mt-0" />

                <OverlayPanel ref="columnMenu" appendTo="body" id="columnPanel" style="width: 250px">
                  <div v-for="column in columns" :key="column.field" class="field-checkbox">
                    <Checkbox :inputId="column.field" name="column" :modelValue="column.selected" :binary="true" @change="column.selected = !column.selected" :disabled="column.frozen" />
                    <label :for="column.field">{{ column.header }}</label>
                  </div>
                </OverlayPanel>
                <Button icon="pi pi-sliders-h" @click="toggleColumnMenu" class="p-button-secondary p-button-outlined ml-2 mt-2 md:mt-0" />
              </div>
            </span>
          </div>
        </template>
        <template #empty> No records found. </template>
        <template #loading> Loading records data. Please wait. </template>

        <Column v-for="column in selectedColumns" :key="column.field" :field="column.field" :header="column.header" :sortable="column.sortable" :frozen="!isMobile && column.frozen" :alignFrozen="column.alignFrozen" :style="column.style">
          <template v-if="column.field === 'actions'" #body="{ data }">
            <div class="flex">
              <router-link v-if="$can('update', 'User')" :to="{ name: 'editUser', params: { id: data.id } }">
                <Button type="button" icon="pi pi-pencil" class="mr-2" text rounded />
              </router-link>
              <Button v-if="$can('delete', 'User')" type="button" icon="pi pi-trash" class="p-button-danger" text rounded @click="showConfirmDialog(data.id)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
  <ConfirmDialog>
    <template #message="slotProps">
      <div class="text-center w-full">
        <i :class="slotProps.message.icon" class="mt-2 text-red-500 text-5xl"></i>
        <div class="mt-2">{{ slotProps.message.message }}</div>
      </div>
    </template>
  </ConfirmDialog>
</template>

<script setup>
import Button from 'primevue/button'
import Column from 'primevue/column'
import Checkbox from 'primevue/checkbox'
import Calendar from 'primevue/calendar'
import DataTable from 'primevue/datatable'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Menu from 'primevue/menu'
import OverlayPanel from 'primevue/overlaypanel'
import ConfirmDialog from 'primevue/confirmdialog'

import { useList } from './useList'
import { useDevice } from '@/utils/device'

const {
  dt,
  lazyParams,
  totalRecords,
  records,
  isLoading,
  search,
  actionItems,
  roles,
  statuses,
  selectedRole,
  selectedStatus,
  selectedDateBetween,
  actionMenu,
  toggleActionMenu,
  showConfirmDialog,
  onPage,
  onSort,
  toggleColumnMenu,
  selectedColumns,
  columns,
  columnMenu
} = useList()
const { isMobile } = useDevice()
</script>

<style lang="scss" scoped>
@import '@/assets/style/custom-table.scss';
</style>
