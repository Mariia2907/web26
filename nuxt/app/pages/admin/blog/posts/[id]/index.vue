<template>
  <div class="container mx-auto px-4 py-8 max-w-5xl">

    <div class="mb-6">
      <UButton
        icon="i-heroicons-arrow-left"
        variant="ghost"
        color="neutral"
        to="/admin/blog/posts"
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

    <div v-else-if="post" class="grid grid-cols-[1fr_260px] gap-6">

      <div class="space-y-4">

        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <h1 class="text-2xl font-bold text-gray-900 leading-snug">
            {{ post.title }}
          </h1>
        </div>

        <div v-if="post.excerpt" class="bg-white border border-gray-200 rounded-xl p-6">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Уривок</p>
          <p class="text-gray-600 leading-relaxed italic">{{ post.excerpt }}</p>
        </div>

        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Зміст</p>
          <div
            v-if="post.content_html"
            class="text-gray-800 text-sm leading-relaxed prose max-w-none"
            v-html="post.content_html"
          />
          <p
            v-else-if="post.content_raw"
            class="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap"
          >{{ post.content_raw }}</p>
          <p v-else class="text-gray-400 italic text-sm">Контент відсутній</p>
        </div>

      </div>

      <div class="space-y-4">

        <div class="bg-white border border-gray-200 rounded-xl p-5">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Інформація</p>

          <div class="space-y-4">
            <div>
              <p class="text-xs text-gray-400 mb-1">Статус</p>
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="post.is_published
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700'"
              >
                {{ post.is_published ? 'Опубліковано' : 'Чернетка' }}
              </span>
            </div>

            <div>
              <p class="text-xs text-gray-400 mb-1">Категорія</p>
              <p class="text-sm text-gray-700 font-medium">{{ post.category_title ?? '—' }}</p>
            </div>

            <div>
              <p class="text-xs text-gray-400 mb-1">Автор</p>
              <p class="text-sm text-gray-700">{{ post.author_name ?? '—' }}</p>
            </div>

            <div>
              <p class="text-xs text-gray-400 mb-1">Дата публікації</p>
              <p class="text-sm text-gray-700">{{ post.date_published ?? '—' }}</p>
            </div>

            <hr class="border-gray-100" />

            <div>
              <p class="text-xs text-gray-400 mb-1">ID</p>
              <p class="text-sm text-gray-500">{{ post.id }}</p>
            </div>

            <div>
              <p class="text-xs text-gray-400 mb-1">Slug</p>
              <p class="text-xs text-gray-400 break-all font-mono">{{ post.slug }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
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
