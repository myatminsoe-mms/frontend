import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import { required, email, minLength, maxLength, numeric, helpers, url } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { useStore } from '../store'
import { useRouter } from 'vue-router'
import { Errors } from '@/utils/serverValidation'
import placeholderImage from '@/assets/images/placeholder.png'

export const useNew = () => {
  const store = useStore()
  const router = useRouter()
  const isLoading = ref(false)
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
    description: ''
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
      minLength: helpers.withMessage('Phone Number should be at least 6 characters', minLength(6)),
      maxLength: maxLength(12)
    },
    tax_payer_no: {
      required,
      numeric,
      minLength: minLength(6),
      maxLength: maxLength(12)
    },
    website: { required, url },
    description: { required }
  }

  const submitted = ref(false)

  const v$ = useVuelidate(rules, state)

  onMounted(() => {
    //fetchRoles()
  })

  onBeforeUnmount(() => {
    store.$dispose()
  })

  const onFileChange = (event) => {
    const file = event.files[0] // Assuming event.target is the input element

    if (file) {
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
      addOrganizer()
    }
  }

  const addOrganizer = async () => {
    errors.clear()
    isLoading.value = true

    try {
      await store.add({
        name: state.name,
        email: state.email,
        company_legal_name: state.company_legal_name,
        position: state.position,
        company_phone: state.company_phone,
        tax_payer_no: state.tax_payer_no,
        website: state.website,
        avatar: state.avatar,
        description: state.description
      })

      const response = store.getAddResponse

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
