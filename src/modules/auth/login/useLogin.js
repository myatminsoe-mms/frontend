import { reactive, ref, onBeforeUnmount } from 'vue'
import { useAuthStore } from '../authStore'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { useRouter } from 'vue-router'

export const useLogin = () => {
  const store = useAuthStore()
  const router = useRouter()

  // const checked = ref(false)
  const submitted = ref(false)
  const isLoading = ref(false)

  onBeforeUnmount(() => {
    store.$dispose()
  })

  const state = reactive({
    identifier: '',
    password: ''
  })

  const rules = {
    identifier: { required },
    password: { required }
  }

  const v$ = useVuelidate(rules, state)

  const handleSubmit = (isFormValid) => {
    submitted.value = true

    if (!isFormValid) {
      return
    }

    if (!isLoading.value) {
      loginUser()
    }
  }

  const loginUser = async () => {
    isLoading.value = true

    await store.login({
      identifier: state.identifier.trim(),
      password: state.password.trim()
    })

    const response = store.getLoginResponse

    if (response) {
      isLoading.value = false
      router.push({ name: 'dashboard' })
    } else {
      isLoading.value = false
    }
  }

  return {
    state,
    v$,
    handleSubmit,
    submitted,
    isLoading
  }
}
