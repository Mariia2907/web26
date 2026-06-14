<template>
  <div class="container mx-auto px-4 py-10 max-w-4xl">
    <div class="mb-6">
      <UButton
        icon="i-heroicons-arrow-left"
        variant="ghost"
        color="neutral"
        @click="$router.back()"
      >
        Назад до списку
      </UButton>
    </div>

    <div v-if="loading" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-4xl text-primary-500" />
    </div>

    <div v-else-if="error" class="text-center py-20 text-red-500">
      <UIcon name="i-heroicons-exclamation-circle" class="text-5xl mb-4" />
      <p class="text-lg">Пост не знайдено</p>
    </div>

    <article v-else-if="post" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      <div class="bg-gradient-to-r from-primary-50 to-gray-50 px-8 py-10 border-b border-gray-100">
        <div class="flex items-center gap-2 mb-4">
          <UBadge
            :color="post.is_published ? 'success' : 'warning'"
            variant="subtle"
          >
            {{ post.is_published ? 'Опубліковано' : 'Чернетка' }}
          </UBadge>
          <UBadge color="neutral" variant="outline">
            {{ post.category_title ?? 'Без категорії' }}
          </UBadge>
        </div>

        <h1 class="text-3xl font-bold text-gray-900 mb-4 leading-tight">
          {{ post.title }}
        </h1>

        <div class="flex items-center gap-6 text-sm text-gray-500">
          <span class="flex items-center gap-1.5">
            <UIcon name="i-heroicons-user" />
            {{ post.author_name ?? '—' }}
          </span>
          <span class="flex items-center gap-1.5">
            <UIcon name="i-heroicons-calendar" />
            {{ post.date_published ?? 'Дата не вказана' }}
          </span>
        </div>
      </div>

      <div class="px-8 py-8 space-y-6">
        <div v-if="post.excerpt" class="bg-gray-50 border-l-4 border-primary-400 rounded-r-xl px-5 py-4">
          <p class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Уривок</p>
          <p class="text-gray-700 leading-relaxed">{{ post.excerpt }}</p>
        </div>

        <div>
          <p class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Зміст</p>
          <div
            v-if="post.content_raw"
            class="text-gray-800 leading-relaxed whitespace-pre-wrap"
          >{{ post.content_raw }}</div>
          <p v-else class="text-gray-400 italic">Контент відсутній</p>
        </div>

      </div>

      <div class="px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
        <span>ID: {{ post.id }}</span>
        <span>Slug: {{ post.slug }}</span>
      </div>

    </article>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const route = useRoute()

const post = ref<any>(null)
const loading = ref(true)
const error = ref(false)

const getPost = async () => {
  loading.value = true
  error.value = false
  try {
    const response: any = await $fetch(
      config.public.apiBase + '/api/admin/blog/posts/' + route.params.id
    )
    post.value = response.data
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

getPost()
</script>
