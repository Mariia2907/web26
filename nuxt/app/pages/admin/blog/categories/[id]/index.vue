<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">

    <div class="mb-6">
      <UButton
        icon="i-heroicons-arrow-left"
        variant="ghost"
        color="neutral"
        to="/admin/blog/categories"
      >
        Назад до списку
      </UButton>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-4xl text-primary-500" />
    </div>

    <div v-else-if="error" class="text-center py-20 text-red-500">
      <UIcon name="i-heroicons-exclamation-circle" class="text-5xl mb-4" />
      <p class="text-lg">Категорію не знайдено</p>
    </div>

    <div v-else-if="category" class="bg-white border border-gray-200 rounded-xl overflow-hidden">

      <div class="px-6 py-5 border-b border-gray-100">
        <h1 class="text-xl font-semibold text-gray-900">{{ category.title }}</h1>
      </div>

      <div class="grid grid-cols-[1fr_200px]">

        <div class="px-6 py-5 border-r border-gray-100">
          <p class="text-xs font-medium tracking-widest text-gray-400 uppercase mb-2">Опис</p>
          <p v-if="category.description" class="text-sm text-gray-700 leading-relaxed">
            {{ category.description }}
          </p>
          <p v-else class="text-sm text-gray-400 italic">Опис відсутній</p>
        </div>

        <div class="px-5 py-5 bg-gray-50 flex flex-col gap-4">
          <div>
            <p class="text-xs font-medium tracking-widest text-gray-400 uppercase mb-1">Батьківська</p>
            <p class="text-sm text-gray-700">{{ category.parent_title ?? '—' }}</p>
          </div>

          <hr class="border-gray-200" />

          <div>
            <p class="text-xs font-medium tracking-widest text-gray-400 uppercase mb-1">ID</p>
            <p class="text-sm text-gray-500">{{ category.id }}</p>
          </div>

          <div>
            <p class="text-xs font-medium tracking-widest text-gray-400 uppercase mb-1">Slug</p>
            <p class="text-xs text-gray-400 break-all font-mono">{{ category.slug }}</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const route = useRoute()

const category = ref<any>(null)
const loading = ref(true)
const error = ref(false)

const getCategory = async () => {
  loading.value = true
  error.value = false
  try {
    const res: any = await $fetch(
      config.public.apiBase + '/api/admin/blog/categories/' + route.params.id
    )
    category.value = res.data
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

getCategory()
</script>
