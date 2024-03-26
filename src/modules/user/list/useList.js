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
    { name: 'Active', code: 'Active' },
    { name: 'Inactive', code: 'Inactive' }
  ])

  const columns = ref([
    { field: 'id', header: 'ID', sortable: true, selected: true, style: 'min-width: 5rem', frozen: true },
    { field: 'username', header: 'Username', sortable: true, selected: false, style: 'min-width: 5rem' },
    { field: 'full_name', header: 'Full Name', sortable: true, selected: true, style: 'min-width: 15rem' },
    { field: 'mobile_number', header: 'Phone Number', sortable: true, selected: true, style: 'min-width: 15rem' },
    { field: 'email', header: 'Email', sortable: false, selected: false, style: 'min-width: 15rem' },
    { field: 'actions', header: 'Actions', sortable: false, selected: true, style: 'min-width: 10rem', frozen: true, alignFrozen: 'right' }
  ])

  const selectedRole = ref(null)
  const selectedStatus = ref(null)
  const selectedDateBetween = ref('')
  const dateBetweenformat = []

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
    fetchRoles()
    resetPagination()
    fetchUserList()
  })

  onBeforeUnmount(() => {
    store.$dispose()
  })

  const fetchRoles = async () => {
    isLoading.value = true
    //fetch API
    await store.fetchAllRole()
    //get response
    const response = store.getAllRoleResponse
    //assign value
    if (response) {
      const options = response.data
      for (let i = 0; i < options.length; i += 1) {
        roles.value.push({ name: options[i].name, code: options[i].id })
      }
    }
  }

  const fetchUserList = async () => {
    isLoading.value = true
    if (selectedDateBetween.value) {
      for (let i = 0; i < selectedDateBetween.value.length; i += 1) {
        if (selectedDateBetween.value[i] !== null) dateBetweenformat[i] = new Date(Date.UTC(selectedDateBetween.value[i].getFullYear(), selectedDateBetween.value[i].getMonth(), selectedDateBetween.value[i].getDate()))
      }
    }
    //fetch API
    await store.fetchAll({
      current_page: (lazyParams.value.page += 1), //default page is 0
      per_page: lazyParams.value.rows,
      order: multisortConvert(lazyParams.value.multiSortMeta),
      search: search.value,
      role_id: selectedRole.value,
      status: selectedStatus.value,
      date_between: selectedDateBetween.value
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
    fetchUserList()
  }

  //Sorting
  const onSort = (event) => {
    lazyParams.value = event
    lazyParams.value.page = 0 // when sorting, page doesn't exist
    lazyParams.value.first = 0
    fetchUserList()
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
        deleteUser(id)
      },
      reject: () => {
        //callback to execute when user rejects the action
      },
      onHide: () => {
        //Callback to execute when dialog is hidden
      }
    })
  }

  const deleteUser = async (id) => {
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
      fetchUserList()
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
      fetchUserList()
    }, 500)
  )

  watch([selectedRole, selectedStatus, selectedDateBetween], () => {
    resetPagination()
    fetchUserList()
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
  }
}
