<script setup>
useHead({
  title: 'Список продуктів'
})

const { data: productsData } = await useFetch('/api/products')
</script>

<template>
  <div class="max-w-[1100px] mx-auto">
    <div class="flex flex-col md:flex-row justify-between items-center mb-10">
      <h1 class="text-[28px] font-bold text-gray-800">Start Your 3 Day Free Trial</h1>
      <div class="flex items-center gap-3 mt-4 md:mt-0">
        <span class="relative text-[13px] text-[#4ade80] font-medium pr-5">
          Save up to 20%
          <svg class="absolute -top-1 -right-1 w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 15C3 15 6 9 12 9C18 9 21 15 21 15M21 15V11M21 15H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <div class="flex border border-gray-200 rounded-md overflow-hidden bg-white">
          <button class="px-4 py-1.5 bg-white text-gray-800 text-[14px] font-medium border-r border-gray-200 shadow-sm">Annual</button>
          <button class="px-4 py-1.5 text-gray-500 hover:text-gray-700 text-[14px] font-medium">Monthly</button>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap justify-center gap-6">
      <div v-for="product in productsData" :key="product.id" class="bg-white rounded-[10px] shadow-sm border border-gray-200 hover:border-gray-400 transition-colors duration-300 w-full max-w-[340px] relative overflow-hidden flex flex-col">
        <div class="h-[5px] w-full bg-gradient-to-r from-[#4ade80] to-[#06b6d4]"></div>
        <div class="p-6 flex-1 flex flex-col">
          <h2 class="text-[18px] font-bold text-gray-800 mb-4">{{ product.name }}</h2>
          <span class="inline-block bg-[#F3F4F6] text-gray-500 text-[11px] font-semibold px-2 py-0.5 rounded mb-3 w-max">{{ product.trial }}</span>
          <div class="flex items-baseline mb-2">
            <span class="text-[42px] font-extrabold text-gray-900 tracking-tight">{{ product.price }}</span>
            <span class="text-[14px] text-gray-500 font-medium ml-1">/month</span>
          </div>
          <p class="text-[13px] text-gray-500 mb-3">
            billed yearly at <del class="text-gray-400">{{ product.oldYearlyPrice }}</del> <span class="font-semibold text-gray-700">{{ product.newYearlyPrice }}</span>
          </p>

          <div class="bg-[#f1f5f9] text-[#15803d] text-[13px] font-bold px-3 py-1 rounded w-max mb-6">
            {{ product.savings }}
          </div>

          <div class="relative group mt-auto mb-6 flex justify-center">
            <div class="absolute bottom-full mb-3 w-[240px] p-2.5 bg-[#333333] text-white rounded-md shadow-lg text-[12px] font-normal leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 text-left">
              {{ product.tooltip }}
              <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#333333]"></div>
            </div>
            <NuxtLink
              :to="`/checkout/${product.id}`"
              class="w-full block text-center bg-gradient-to-r from-[#fcd34d] to-[#f97316] text-gray-900 font-bold text-[15px] py-2.5 rounded border border-transparent hover:border-gray-800 hover:opacity-90 transition-all duration-200"
            >
              {{ product.buttonText }}
            </NuxtLink>
          </div>
          <hr class="border-gray-100 mb-6">
          <ul class="space-y-4 flex-1">
            <li v-for="(feature, index) in product.features" :key="index" class="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-[16px] h-[16px] text-[#7DE282] flex-shrink-0 mt-0.5" viewBox="0 0 16 16"><path fill="currentColor" d="M7.53 1.282a.5.5 0 0 1 .94 0l.478 1.306a7.5 7.5 0 0 0 4.464 4.464l1.305.478a.5.5 0 0 1 0 .94l-1.305.478a7.5 7.5 0 0 0-4.464 4.464l-.478 1.305a.5.5 0 0 1-.94 0l-.478-1.305a7.5 7.5 0 0 0-4.464-4.464L1.282 8.47a.5.5 0 0 1 0-.94l1.306-.478a7.5 7.5 0 0 0 4.464-4.464Z"/></svg>
              <div class="text-[13px] leading-snug">
                <span v-html="feature.main"></span>
                <div v-if="feature.sub" class="text-[13px] text-gray-500 font-normal mt-0.5">{{ feature.sub }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
