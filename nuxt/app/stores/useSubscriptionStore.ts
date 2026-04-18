import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSubscriptionStore = defineStore('subscription', () => {
  const selectedSubscription = ref<any>(null)

  function setSubscription(product: any) {
    selectedSubscription.value = product
  }

  function clearSubscription() {
    selectedSubscription.value = null
  }

  return {
    selectedSubscription,
    setSubscription,
    clearSubscription
  }
})
