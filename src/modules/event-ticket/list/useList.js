import { reactive, ref, onMounted, watch, onBeforeUnmount, computed } from 'vue'
import { useStore } from '../store'
import { useConfirm } from 'primevue/useconfirm'
import EventBus from '@/libs/AppEventBus'
import { multisortConvert } from '@/utils/multisort'
import { dateLong, utcToLocal, dateformat } from '@/utils/formatter'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/modules/auth/authStore'

export default function useList() {
  const isLoading = ref(true)
  const store = useStore()
  const confirm = useConfirm()
  const i18n = useI18n()

  const dt = ref() //dt data table
  const lazyParams = ref({})
  const eventList = ref()
  const totalRecords = ref(0)
  const search = ref('')
  const menu = ref()
  const dateBetween = ref('')
  const deleteSelectedDataDialog = ref(false)
  const selectedData = ref()
  const roles = ref([])

  const authStore = useAuthStore()
  const event = authStore.getEventData

  const statuses = ref([
    { name: 'Active', code: 'Active' },
    { name: 'Inactive', code: 'Inactive' }
  ])

  const selectedStatus = ref('Active')
  const state = reactive({
    date_from: '',
    date_to: ''
  })
  const actionItems = ref([
    {
      label: 'Export',
      icon: 'pi pi-download',
      command: () => {
        dt.value.exportCSV()
      }
    }
  ])
  const columnMenu = ref()

  const columns = ref([
    {
      field: 'title',
      header: 'Name',
      sortable: false,
      selected: true,
      style: 'min-width: 13rem'
    },
    {
      field: 'organizer_name',
      header: 'Organizer',
      sortable: false,
      selected: true,
      style: 'min-width: 13rem'
    },
    {
      field: 'location_types',
      header: 'Location',
      sortable: false,
      selected: true,
      style: 'min-width: 12rem'
    },
    {
      field: 'event_status',
      header: 'Status',
      sortable: false,
      selected: true,
      style: 'min-width: 12rem'
    },
    {
      field: 'actions',
      header: 'Action',
      sortable: false,
      selected: true,
      style: 'min-width: 15rem; max-width: 15rem',
      frozen: true,
      alignFrozen: 'right'
    }
  ])

  onMounted(() => {
    resetPagination()
    fetchEventList()
  })

  onBeforeUnmount(() => {
    store.$dispose()
  })

  const fetchEventList = async () => {
    isLoading.value = true

    const dateBetweenformat = []

    if (dateBetween.value) {
      if (dateBetween.value[0]) state.date_from = dateformat(utcToLocal(dateBetween.value[0]))
      if (dateBetween.value[1]) {
        state.date_to = dateformat(utcToLocal(dateBetween.value[1]))
      } else {
        state.date_to = state.date_from
      }

      dateBetweenformat[0] = state.date_from
      dateBetweenformat[1] = state.date_to
    }

    //fetch API
    await store.fetchAll({
      current_page: (lazyParams.value.page += 1), //default page is 0
      per_page: lazyParams.value.rows,
      order: multisortConvert(lazyParams.value.multiSortMeta),
      search: search.value,
      event_status: selectedStatus.value,
    })

    //get response
    const response = store.getAllResponse
    //assign value
    if (response) {
      eventList.value = response.data
      totalRecords.value = response.meta.total
    }
    isLoading.value = false
  }

  const resetPagination = () => {
    lazyParams.value = {
      page: 0,
      rows: dt.value.rows,
      multiSortMeta: [],
      first: 0
    }
  }

  //Pagination
  const onPage = (event) => {
    lazyParams.value = event
    lazyParams.value.multiSortMeta = []
    fetchEventList()
  }

  //Sorting
  const onSort = (event) => {
    lazyParams.value = event
    lazyParams.value.page = 0 // when sorting, page doesn't exist
    fetchEventList()
  }

  const showConfirmDialog = (id) => {
    confirm.require({
      message: 'Are you sure?',
      icon: 'ri-error-warning-line ri-sm',
      acceptLabel: i18n.t('delete'),
      rejectLabel: i18n.t('cancel'),
      acceptClass: 'p-button-danger',
      rejectClass: 'p-button-secondary p-button-text',
      accept: () => {
        deleteEvent(id)
      },
      reject: () => {
        //callback to execute when event rejects the action
      },
      onHide: () => {
        //Callback to execute when dialog is hidden
      }
    })
  }

  const deleteEvent = async (id) => {
    isLoading.value = true

    await store.deactivate({ id: id })
    const response = store.getDeleteResponse

    if (response) {
      EventBus.emit('show-toast', {
        severity: 'success',
        summary: '',
        detail: response.message
      })
      lazyParams.value.page = 0
      fetchEventList()
    }
  }

  const toggleMenu = (event) => {
    menu.value.toggle(event)
  }

  const filterSearch = () => {
    lazyParams.value.page = 0
    fetchEventList()
  }

  const resetSearch = () => {
    resetPagination()
    dateBetween.value = ''
    search.value = ''
    selectedStatus.value = null
  }

  const confirmDeleteSelected = () => {
    deleteSelectedDataDialog.value = true
  }

  const deleteSelectedData = async () => {
    isLoading.value = true

    await store.selectedDelete({ selectedData: selectedData.value })
    const response = store.getSelectedDeleteResponse

    if (response) {
      EventBus.emit('show-toast', {
        severity: 'success',
        summary: '',
        detail: response.message
      })
      lazyParams.value.page = 0
      fetchEventList()
    }

    deleteSelectedDataDialog.value = false
    selectedData.value = null
  }
  const toggleColumnMenu = (event) => {
    columnMenu.value.toggle(event)
  }
  const selectedColumns = computed(() => {
    return columns.value.filter((col) => col.selected)
  })

  watch([selectedStatus], () => {
    resetPagination()
    fetchEventList()
  })

  return {
    dt,
    lazyParams,
    totalRecords,
    eventList,
    isLoading,
    store,
    search,
    actionItems,
    menu,
    toggleMenu,
    deleteEvent,
    showConfirmDialog,
    onPage,
    onSort,
    dateBetween,
    dateLong,
    filterSearch,
    resetSearch,
    deleteSelectedDataDialog,
    selectedData,
    confirmDeleteSelected,
    deleteSelectedData,
    roles,
    statuses,
    selectedStatus,
    columns,
    selectedColumns,
    toggleColumnMenu,
    columnMenu,
    event
  }
}
