import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import { required, email, minLength, maxLength, numeric, helpers, url } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { useStore } from '../store'
import { useRoute, useRouter } from 'vue-router'
import { Errors } from '@/utils/serverValidation'
import placeholderImage from '@/assets/images/placeholder.png'

export const useEdit = () => {
  const store = useStore()
  const route = useRoute()
  const router = useRouter()

  const isLoading = ref(true)
  const errors = new Errors()

  const state = reactive({
    name: '',
    email: '',
    company_legal_name: '',
    position: '',
    company_phone: '',
    tax_payer_no: '',
    website: '',
    avatar: null,
    description: '',
    avatar_updated: false
  })

  const avatarPreview = ref(placeholderImage)

  const rules = {
    name: { required },
    email: { required, email },
    company_legal_name: { required },
    position: { required },
    company_phone: {
      required,
      numeric,
      minLength: minLength(6),
      maxLength: maxLength(12)
    },
    tax_payer_no: {
      numeric,
      required,
      minLength: helpers.withMessage('Tax Payer Number should be at least 6 characters. ', minLength(6)),
      maxLength: maxLength(12)
    },
    website: { required, url: helpers.withMessage('Website should be valid url', url) },
    description: { required }
  }

  const submitted = ref(false)

  const v$ = useVuelidate(rules, state)
  onMounted(() => {
    fetchOrganizer()
  })

  onBeforeUnmount(() => {
    store.$dispose()
  })

  const fetchOrganizer = async () => {
    isLoading.value = true
    errors.clear()

    await store.fetchOne({
      id: route.params.id
    })

    const response = store.getOneResponse
    if (response) {
      state.name = response.data.name
      state.email = response.data.email
      state.company_legal_name = response.data.company_legal_name
      state.position = response.data.position
      state.company_phone = response.data.company_phone
      state.tax_payer_no = response.data.tax_payer_no
      state.website = response.data.website
      //state.avatar = response.data.avatar
      state.avatar = response.data.avatar ? decodeURIComponent(response.data.avatar) : null;
      state.description = response.data.description
      if (state.avatar != null) {
        avatarPreview.value = state.avatar
      }
    }

    isLoading.value = false
  }

  const onFileChange = (event) => {
    const file = event.files[0] // Assuming event.target is the input element

    if (file) {
      state.avatar_updated = true
      state.avatar = file
      const reader = new FileReader()
      reader.onload = (e) => {
        avatarPreview.value = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  const onFileRemove = () => {
    state.avatar = null
    avatarPreview.value = placeholderImage
  }

  const handleSubmit = (isFormValid) => {
    submitted.value = true

    if (!isFormValid) {
      return
    }

    if (!isLoading.value) {
      updateRecord()
    }
  }

  const updateRecord = async () => {
    errors.clear()
    isLoading.value = true

    try {
      await store.update({
        id: route.params.id,
        name: state.name,
        email: state.email,
        company_legal_name: state.company_legal_name,
        position: state.position,
        company_phone: state.company_phone,
        tax_payer_no: state.tax_payer_no,
        website: state.website,
        description: state.description,
        avatar: state.avatar instanceof File ? state.avatar : null,
        avatar_updated: state.avatar_updated,
        _method: 'PUT'
      })

      const response = store.getUpdateResponse

      if (response) {
        router.push({ name: 'organizerList' })
      }

      isLoading.value = false
    } catch (error) {
      isLoading.value = false
      if (error.status === 422) {
        const err = error.data.errors
        errors.record(err)
      }
    }
  }

  return {
    isLoading,
    state,
    onFileChange,
    onFileRemove,
    avatarPreview,
    v$,
    handleSubmit,
    submitted,
    errors
  }
}
