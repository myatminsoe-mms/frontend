import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue'
import { useStore } from '../store'
import { useConfirm } from 'primevue/useconfirm'
import { useDebounceFn } from '@/utils/debounce'
import { multisortConvert } from '@/utils/multisort'
import EventBus from '@/libs/AppEventBus'

export const useList = () => {
  const isLoading = ref(true)
  const store = useStore()
  const confirm = useConfirm()
  const actionMenu = ref()
  const columnMenu = ref()

  const dt = ref() //dt data table
  const lazyParams = ref({})
  const records = ref()
  const totalRecords = ref(0)
  const search = ref('')

  const roles = ref([])

  const statuses = ref([
    { name: 'ACTIVE', code: 'ACTIVE' },
    { name: 'INACTIVE', code: 'INACTIVE' }
  ])

  const columns = ref([
    { field: 'id', header: 'ID', sortable: true, selected: true, style: 'min-width: 5rem', frozen: true },
    { field: 'name', header: 'Name', sortable: true, selected: false, style: 'min-width: 5rem' },
    { field: 'email', header: 'Email', sortable: true, selected: true, style: 'min-width: 15rem' },
    { field: 'company_legal_name', header: 'Company Name', sortable: true, selected: true, style: 'min-width: 15rem' },
    { field: 'company_phone', header: 'Company Phone', sortable: true, selected: true, style: 'min-width: 15rem' },
    { field: 'position', header: 'Position', sortable: true, selected: true, style: 'min-width: 15rem' },
    { field: 'tax_payer_no', header: 'Tax Payer No', sortable: true, selected: true, style: 'min-width: 15rem' },
    { field: 'website', header: 'Website', sortable: true, selected: true, style: 'min-width: 15rem' },
    { field: 'description', header: 'Description', sortable: true, selected: true, style: 'min-width: 15rem' },
    { field: 'actions', header: 'Actions', sortable: false, selected: true, style: 'min-width: 10rem', frozen: true, alignFrozen: 'right' }
  ])

  const selectedStatus = ref("ACTIVE")

  const actionItems = ref([
    {
      label: 'Import',
      icon: 'pi pi-download',
      command: () => {}
    },
    {
      label: 'Export',
      icon: 'pi pi-upload',
      command: () => {}
    }
  ])

  onMounted(() => {
    resetPagination()
    fetchOrganizerList()
  })

  onBeforeUnmount(() => {
    store.$dispose()
  })

  const fetchOrganizerList = async () => {
    isLoading.value = true
    //fetch API
    await store.fetchAll({
      current_page: (lazyParams.value.page += 1), //default page is 0
      per_page: lazyParams.value.rows,
      order: multisortConvert(lazyParams.value.multiSortMeta),
      search: search.value,
      organizer_status: selectedStatus.value,
    })

    //get response
    const response = store.getAllResponse

    //assign value
    if (response) {
      records.value = response.data
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
    fetchOrganizerList()
  }

  //Sorting
  const onSort = (event) => {
    lazyParams.value = event
    lazyParams.value.page = 0 // when sorting, page doesn't exist
    lazyParams.value.first = 0
    fetchOrganizerList()
  }

  const showConfirmDialog = (id) => {
    confirm.require({
      header: 'Confirmation',
      message: 'Are you sure want to delete?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes, delete it',
      rejectLabel: 'Cancel',
      acceptClass: 'p-button-danger',
      rejectClass: 'p-button-secondary p-button-text',
      accept: () => {
        deleteOrganizer(id)
      },
      reject: () => {
        //callback to execute when organizer rejects the action
      },
      onHide: () => {
        //Callback to execute when dialog is hidden
      }
    })
  }

  const deleteOrganizer = async (id) => {
    isLoading.value = true

    await store.delete({ id: id })
    const response = store.getDeleteResponse

    if (response) {
      EventBus.emit('show-toast', {
        severity: 'success',
        summary: '',
        detail: 'Delete Successfully'
      })
      resetPagination()
      fetchOrganizerList()
    }

    isLoading.value = false
  }

  const toggleActionMenu = (event) => {
    actionMenu.value.toggle(event)
  }

  const toggleColumnMenu = (event) => {
    columnMenu.value.toggle(event)
  }

  const selectedColumns = computed(() => {
    return columns.value.filter((col) => col.selected)
  })

  watch(
    [search],
    useDebounceFn(() => {
      resetPagination()
      fetchOrganizerList()
    }, 500)
  )

  watch([selectedStatus], () => {
    resetPagination()
    fetchOrganizerList()
  })

  return {
    dt,
    lazyParams,
    totalRecords,
    records,
    isLoading,
    search,
    actionItems,
    roles,
    statuses,
    actionMenu,
    toggleActionMenu,
    showConfirmDialog,
    onPage,
    onSort,
    toggleColumnMenu,
    selectedColumns,
    columns,
    columnMenu,
    selectedStatus
  }
}
