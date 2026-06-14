<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Пости</h1>

    <div class="flex items-center gap-3 mb-4">
      <UInput
        v-model="search"
        placeholder="Пошук за заголовком або категорією..."
        icon="i-heroicons-magnifying-glass"
        class="w-80"
        @input="onSearchInput"
      />

      <select
        v-model="perPage"
        class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        @change="onPerPageChange"
      >
        <option :value="10">10</option>
        <option :value="25">25</option>
        <option :value="50">50</option>
        <option :value="75">75</option>
        <option :value="100">100</option>
      </select>

      <span class="text-sm text-gray-400">Записів на сторінці</span>

      <span class="ml-auto text-sm text-gray-500">
        Знайдено: <strong>{{ total }}</strong>
      </span>
    </div>

    <div class="border border-gray-200 rounded-xl overflow-hidden">
      <UTable
        :data="posts"
        :columns="columns"
        :loading="loading"
      />
    </div>

    <div class="flex justify-center mt-4">
      <UPagination
        v-model:page="currentPage"
        :total="total"
        :items-per-page="perPage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
const config = useRuntimeConfig()

const currentPage = ref(1)
const perPage = ref(25)
const total = ref(0)
const loading = ref(false)
const search = ref('')
const posts = ref<any[]>([])

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const columns = [
  { accessorKey: 'id', header: '#' },
  { accessorKey: 'author_name', header: 'Автор' },
  { accessorKey: 'category_title', header: 'Категорія' },
  {
    accessorKey: 'title',
    header: 'Заголовок',
    cell: ({ row }: any) => h(
      resolveComponent('NuxtLink'),
      {
        to: `/admin/blog/posts/${row.original.id}`,
        class: 'text-primary-600 hover:underline font-medium',
      },
      () => row.original.title
    ),
  },
  { accessorKey: 'date_published', header: 'Дата публікації' },
]

const getPosts = async () => {
  loading.value = true
  const response: any = await $fetch(
    config.public.apiBase + '/api/admin/blog/posts',
    {
      params: {
        page: currentPage.value,
        per_page: perPage.value,
        search: search.value || undefined,
      },
    }
  )

  posts.value = response.data.map((post: any) => ({
    ...post,
    author_name: post.author_name ?? '—',
    category_title: post.category_title ?? '—',
    date_published: post.date_published ?? '—',
  }))
  total.value = response.meta.total
  loading.value = false
}

const onSearchInput = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    getPosts()
  }, 400)
}

const onPerPageChange = () => {
  currentPage.value = 1
  getPosts()
}

watch(currentPage, getPosts)

getPosts()
</script>
