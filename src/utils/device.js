import { onMounted, ref } from 'vue'

export const useDevice = () => {
  const isMobile = ref(window.innerWidth <= 767)

  onMounted(() => {
    window.addEventListener('resize', () => {
      isMobile.value = window.innerWidth <= 767
    })
  })

  return {
    isMobile
  }
}
