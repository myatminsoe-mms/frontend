<template>
  <div>
    <div class="card mb-4">
      <div class="grid">
        <div class="field col-12 md:col-6 lg:col-3">
          <label class="label-sm"><i class="pi pi-filter"></i>&nbsp;{{ $t('Status') }} </label>
          <Dropdown v-model="selectedStatus" :options="statuses" optionLabel="name" optionValue="code"
            placeholder="Select status" class="w-full" showClear />
        </div>
      </div>
    </div>
    <div class="card">
      <DataTable ref="dt" dataKey="id" :lazy="true" :paginator="true" :value="eventList" @page="onPage($event)"
        @sort="onSort($event)" sortMode="multiple" :multiSortMeta="lazyParams.multiSortMeta" :totalRecords="totalRecords"
        :rows="5" :rowsPerPageOptions="[5, 10, 20, 50, 100]" :scrollable="true" :first="lazyParams.first"
        scrollHeight="60vh"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries" :loading="isLoading"
        responsiveLayout="scroll">
        <template #header>
          <div class="flex flex-wrap flex-row-reverse align-items-center">
            <router-link :to="{ name: 'newEvent' }">
              <Button label="Create New Event" icon="pi pi-plus" severity="primary" />
            </router-link>
          </div>
        </template>
        <template #empty> No records found. </template>
        <template #loading> Loading records data. Please wait. </template>

        <Column v-for="column in selectedColumns" :key="column.field" :field="column.field" :header="column.header"
          :sortable="column.sortable" :frozen="!isMobile && column.frozen" :alignFrozen="column.alignFrozen"
          :style="column.style">
          <template v-if="column.field === 'actions'" #body="{ data }">
            <div class="flex my-2">
              <!-- <router-link v-if="$can('update', 'Event')" :to="{ name: 'editEvent', params: { id: data.id } }">
                <Button type="button" icon="pi pi-eye" label="dashboard" class="mr-2 btn p-button-success p-1" />
              </router-link> -->
              <router-link v-if="$can('update', 'Event')" :to="{ name: 'editEvent', params: { id: data.id } }">
                <Button type="button" icon="pi pi-pencil" class="mr-2" text rounded />
              </router-link>
              <Button v-if="$can('deactivate', 'Event')" type="button" icon="pi pi-trash" class="p-button-danger" text
                rounded @click="showConfirmDialog(data.id)" />
            </div>
          </template>
        </Column>
      </DataTable>
      <ConfirmDialog :showHeader="false">
        <template #message="slotProps">
          <div class="text-center w-full">
            <Button type="button" :icon="slotProps.message.icon"
              class="p-button-lg p-button-danger p-button-rounded p-button-outlined mt-4" />
            <h4>{{ slotProps.message.message }}</h4>
          </div>
        </template>
      </ConfirmDialog>

      <Dialog v-model:visible="deleteSelectedDataDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
        <div class="confirmation-content">
          <i class="ri-error-warning-line ri-sm mr-3" style="font-size: 2rem" />
          <span>Are you sure you want to delete the selected events?</span>
        </div>
        <template #footer>
          <Button label="No" icon="ri-close-line ri-sm" class="p-button-danger p-button-text"
            @click="deleteSelectedDataDialog = false" />
          <Button label="Yes, Delete Selected" icon="ri-check-line ri-sm" class="p-button-danger"
            @click="deleteSelectedData" />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button'
import Column from 'primevue/column'

import DataTable from 'primevue/datatable'
import ConfirmDialog from 'primevue/confirmdialog'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'

import useList from './useList'
import { useDevice } from '@/utils/device'

const { dt, lazyParams, totalRecords, eventList, isLoading, onPage, onSort, deleteSelectedDataDialog, deleteSelectedData, selectedColumns, showConfirmDialog, statuses, selectedStatus } = useList()

const { isMobile } = useDevice()
</script>

<style lang="scss" scoped>
@import '@/assets/style/custom-table.scss';

.x {
  padding-top: 4px;
  font-size: 10px !important;
}
</style>
