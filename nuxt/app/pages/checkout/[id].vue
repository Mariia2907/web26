<script setup>
const route = useRoute()
const subscriptionStore = useSubscriptionStore()
const { data: product, pending } = await useAsyncData(
  `product-${route.params.id}`,
  async () => {
    if (subscriptionStore.selectedSubscription && subscriptionStore.selectedSubscription.id === Number(route.params.id)) {
      console.log('Дані взяті з Pinia')
      return subscriptionStore.selectedSubscription
    }
    console.log('Стор порожній, завантажуємо з API...')
    const data = await $fetch(`/api/products/${route.params.id}`)
    subscriptionStore.setSubscription(data)
    return data
  }
)

useHead({
  title: computed(() => product.value ? `Checkout - ${product.value.name}` : 'Checkout')
})

const form = reactive({
  fullName: 'dev4 dev4',
  address: '',
  cardNumber: '',
  expDate: '',
  cvc: '',
  agreed: false
})

const futureDate = new Date()
futureDate.setDate(futureDate.getDate() + 3)
const formattedConversionDate = futureDate.toLocaleDateString('en-US', {
  month: '2-digit', day: '2-digit', year: 'numeric'
})

const formatCardNumber = (e) => {
  let value = e.target.value.replace(/\D/g, '')
  if (value.length > 16) value = value.slice(0, 16)
  form.cardNumber = value.replace(/(\d{4})(?=\d)/g, '$1 ')
}

const formatExpDate = (e) => {
  let value = e.target.value.replace(/\D/g, '')
  if (value.length > 4) value = value.slice(0, 4)
  if (value.length > 2) {
    form.expDate = value.slice(0, 2) + ' / ' + value.slice(2)
  } else {
    form.expDate = value
  }
}

const formatCVC = (e) => {
  let value = e.target.value.replace(/\D/g, '')
  if (value.length > 3) value = value.slice(0, 3)
  form.cvc = value
}

const submitCheckout = async () => {
  if (!form.agreed) return

  if (form.cardNumber.length < 19 || form.expDate.length < 7 || form.cvc.length < 3) {
    alert('Please fill out card details correctly.')
    return
  }

  try {
    const response = await $fetch('/api/subscription/create', {
      method: 'POST',
      body: {
        productId: product.value.id,
        ...form
      }
    })
    console.log('Відповідь від сервера на клієнті:', response)
    alert('Success! Дані успішно відправлені.')
    await navigateTo('/')
  } catch (error) {
    console.error('Помилка при відправці:', error)
    alert('Ой, сталася помилка при відправці даних.')
  }
}
</script>

<template>
  <div class="min-h-screen bg-white pb-20 font-sans">
    <div class="bg-[#333333] py-4 w-full flex justify-center shadow-md">
      <h1 class="text-white font-bold text-[17px]">Checkout</h1>
    </div>

    <div v-if="!pending && product" class="max-w-[960px] mx-auto px-4 pt-8">

      <NuxtLink to="/" class="text-gray-500 hover:text-gray-800 text-[13px] font-medium mb-6 inline-block transition-colors">
        &lt;&lt; back
      </NuxtLink>

      <h2 class="text-[22px] font-bold text-gray-800 mb-2">You're Almost In - Start Your 3-Day Free Trial Now!</h2>
      <p class="text-[14px] text-gray-600 mb-8">Set up your account to gain instant access! You won't be charged if you decide to cancel within 3 days.</p>

      <div class="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-8 items-start">

        <div class="bg-white rounded-[8px] shadow-[0_2px_15px_rgba(0,0,0,0.06)] border border-gray-100 w-full relative overflow-hidden flex flex-col">
          <div class="h-[4px] w-full bg-gradient-to-r from-[#4ade80] to-[#06b6d4]"></div>
          <div class="p-7 flex-1 flex flex-col">
            <h3 class="text-[18px] font-bold text-gray-800 mb-4">{{ product.name }}</h3>
            <span class="inline-block bg-[#F3F4F6] text-gray-500 text-[11px] font-semibold px-2 py-0.5 rounded mb-3 w-max">{{ product.trial }}</span>
            <div class="flex items-baseline mb-2">
              <span class="text-[38px] font-extrabold text-gray-900 tracking-tight">{{ product.price }}</span>
              <span class="text-[14px] text-gray-500 font-medium ml-1">/month</span>
            </div>
            <p class="text-[13px] text-gray-500 mb-3">
              billed yearly at <del class="text-gray-400">{{ product.oldYearlyPrice }}</del> <span class="font-bold text-gray-700">{{ product.newYearlyPrice }}</span>
            </p>

            <div class="bg-[#f1f5f9] text-[#15803d] text-[13px] font-bold px-3 py-1 rounded w-max mb-6">
              {{ product.savings }}
            </div>

            <hr class="border-gray-100 mb-6">
            <ul class="space-y-4 flex-1">
              <li v-for="(feature, index) in product.features" :key="index" class="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-[15px] h-[15px] text-[#7DE282] flex-shrink-0 mt-0.5" viewBox="0 0 16 16"><path fill="currentColor" d="M7.53 1.282a.5.5 0 0 1 .94 0l.478 1.306a7.5 7.5 0 0 0 4.464 4.464l1.305.478a.5.5 0 0 1 0 .94l-1.305.478a7.5 7.5 0 0 0-4.464 4.464l-.478 1.305a.5.5 0 0 1-.94 0l-.478-1.305a7.5 7.5 0 0 0-4.464 4.464L1.282 8.47a.5.5 0 0 1 0-.94l1.306-.478a7.5 7.5 0 0 0 4.464-4.464Z"/></svg>
                <div class="text-[13px] leading-snug">
                  <span v-html="feature.main"></span>
                  <div v-if="feature.sub" class="text-[12px] text-gray-400 font-normal mt-0.5">{{ feature.sub }}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.04)] rounded-[8px] p-7">
          <form @submit.prevent="submitCheckout">
            <h3 class="text-[15px] font-bold text-gray-800 mb-5">Order Summary</h3>
            <div class="space-y-3 mb-5 text-[13px]">
              <div class="flex justify-between text-gray-600 font-medium">
                <span>Annual Plan</span>
                <span>{{ product.newYearlyPrice }}.00</span>
              </div>
              <hr class="border-gray-200">
              <div class="flex justify-between text-gray-600 font-medium items-center">
                <span>Total Due <span class="text-[11px] text-gray-400 font-normal ml-0.5">(*not including sales tax where applicable)</span></span>
                <span>{{ product.newYearlyPrice }}.00</span>
              </div>

              <div class="flex justify-between font-bold text-gray-900 mt-4 text-[14px]">
                <span>Due Today</span>
                <span>$0.00</span>
              </div>
            </div>

            <div class="bg-[#f4f5f7] text-gray-500 text-[13px] font-medium text-center py-2.5 rounded-[4px] mb-8">
              Includes 3-Day Free Trial
            </div>

            <div class="flex items-center gap-1.5 mb-5">
              <h3 class="text-[15px] font-bold text-gray-800">Billing Information</h3>
              <svg class="w-[14px] h-[14px] text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>

            <div class="mb-5">
              <label class="block text-[13px] font-medium text-[#6b7280] mb-1.5">Card Details</label>
              <div class="flex items-center border border-[#d1d5db] rounded-[4px] bg-white px-3 py-2.5 focus-within:border-gray-400 transition-colors">
                <svg class="w-5 h-5 text-[#9ca3af] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="5" width="18" height="14" rx="2" stroke-width="2"/><path d="M3 10h18" stroke-width="2"/></svg>

                <input
                  v-model="form.cardNumber"
                  @input="formatCardNumber"
                  type="text"
                  placeholder="Number"
                  required
                  minlength="19"
                  maxlength="19"
                  class="flex-1 ml-2 text-[14px] outline-none text-gray-800 placeholder-[#9ca3af]"
                >

                <input
                  v-model="form.expDate"
                  @input="formatExpDate"
                  type="text"
                  placeholder="MM / YY"
                  required
                  minlength="7"
                  maxlength="7"
                  class="w-[70px] text-[14px] outline-none text-gray-800 text-center placeholder-[#9ca3af]"
                >

                <input
                  v-model="form.cvc"
                  @input="formatCVC"
                  type="text"
                  placeholder="CVC"
                  required
                  minlength="3"
                  maxlength="3"
                  class="w-[50px] text-[14px] outline-none text-gray-800 text-right placeholder-[#9ca3af]"
                >
              </div>
            </div>

            <div class="mb-6">
              <label class="block text-[13px] font-medium text-[#6b7280] mb-1.5">Address</label>
              <div class="border border-[#d1d5db] rounded-[4px] p-4 bg-[#fcfcfc] flex flex-col gap-3.5">

                <div>
                  <label class="block text-[12px] text-[#6b7280] mb-1.5">Full name</label>
                  <input
                    v-model="form.fullName"
                    type="text"
                    required
                    class="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[14px] outline-none text-gray-800 bg-white focus:border-gray-400 transition-colors"
                  >
                </div>

                <div>
                  <label class="block text-[12px] text-[#6b7280] mb-1.5">Address</label>
                  <input
                    v-model="form.address"
                    type="text"
                    required
                    class="w-full border border-[#d1d5db] rounded-[4px] px-3 py-2 text-[14px] outline-none text-gray-800 bg-white focus:border-gray-400 transition-colors"
                  >
                </div>

              </div>
            </div>

            <div class="flex items-start gap-2.5 mb-6">
              <input v-model="form.agreed" type="checkbox" id="terms" required class="mt-[3px] w-3.5 h-3.5 text-gray-600 bg-white border-gray-300 rounded cursor-pointer focus:ring-0">
              <label for="terms" class="text-[11px] text-gray-500 leading-relaxed cursor-pointer">
                I consent to <a href="#" class="font-bold underline text-gray-600 hover:text-gray-800">Terms of Use</a> and understand my 3-day free trial will automatically convert to ${{ product.newYearlyPrice }}.00 per year starting on
                <span class="font-bold">{{ formattedConversionDate }}</span>. The yearly fee will be automatically charged each year going forward unless I cancel my account at least one (1) business day before the end of the current billing period, which can be done by calling (888) 463-3163.
              </label>
            </div>

            <button
              type="submit"
              class="font-medium text-[13px] py-2 px-6 rounded-[4px] transition-all duration-200"
              :class="form.agreed ? 'bg-[#333333] text-white hover:bg-black shadow-md' : 'bg-[#e5e7eb] text-gray-400 cursor-not-allowed'"
              :disabled="!form.agreed"
            >
              Try It Free
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
