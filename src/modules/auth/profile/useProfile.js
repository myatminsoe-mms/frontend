import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import { required, email, minLength, maxLength, numeric, helpers } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { useAuthStore } from '../authStore'
import { useRoute, useRouter } from 'vue-router'
import { Errors } from '@/utils/serverValidation'
import placeholderImage from '@/assets/images/placeholder.png'

export const useProfile = () => {
  const store = useAuthStore()
  const route = useRoute()
  const router = useRouter()

  const isLoading = ref(true)
  const errors = new Errors()

  const state = reactive({
    username: '',
    full_name: '',
    password: null,
    email: '',
    mobile_number: '',
    avatar: null,
    avatar_updated: false
  })

  const avatarPreview = ref(placeholderImage)
  const roles = ref([])

  const rules = {
    username: { required },
    full_name: { required },
    password: {
      minLength: helpers.withMessage('Value should be at least 8 characters', minLength(8))
    },
    email: { email },
    mobile_number: {
      numeric,
      minLength: helpers.withMessage('Value should be at least 6 characters', minLength(6)),
      maxLength: maxLength(12)
    }
  }

  const submitted = ref(false)

  const v$ = useVuelidate(rules, state)

  onMounted(() => {
    fetchProfile()
  })

  onBeforeUnmount(() => {
    store.$dispose()
  })

  const fetchProfile = async () => {
    isLoading.value = true
    errors.clear()

    await store.fetchProfile()

    const response = store.getUserData
    if (response) {
      state.username = response.username
      state.full_name = response.full_name
      state.email = response.email
      state.mobile_number = response.mobile_number
      state.avatar = response.avatar
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
        full_name: state.full_name,
        password: state.password,
        email: state.email,
        mobile_number: state.mobile_number,
        avatar: state.avatar instanceof File ? state.avatar : null,
        avatar_updated: state.avatar_updated
      })

      const response = store.userData

      if (response) {
        // router.back()
      }

      isLoading.value = false
    } catch (error) {
      console.log(error)
      isLoading.value = false
      if (error.status === 422) {
        const err = error.data.data
        errors.record(err)
      }
    }
  }

  const goBack = () => {
    router.back()
  }

  return {
    isLoading,
    state,
    roles,
    onFileChange,
    onFileRemove,
    avatarPreview,
    v$,
    handleSubmit,
    submitted,
    errors,
    goBack
  }
}
