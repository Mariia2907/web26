<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Пости</h1>

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

const config = useRuntimeConfig()

const currentPage = ref(1)
const perPage = ref(25)
const total = ref(0)
const loading = ref(false)
const posts = ref<any[]>([])

const columns = [
  { accessorKey: 'id', header: '#' },
  { accessorKey: 'user_name', header: 'Автор' },
  { accessorKey: 'category_title', header: 'Категорія' },
  { accessorKey: 'title', header: 'Заголовок' },
  { accessorKey: 'published_at', header: 'Дата публікації' },
]

const getPosts = async () => {
  loading.value = true
  const response: any = await $fetch(
    config.public.apiBase + '/api/admin/blog/posts',
    { params: { page: currentPage.value } }
  )

  posts.value = response.data.map((post: any) => ({
    id: post.id,
    user_name: post.user?.name ?? '—',
    category_title: post.category?.title ?? '—',
    title: post.title,
    published_at: post.published_at ?? '—',
  }))
  total.value = response.total
  perPage.value = response.per_page
  loading.value = false
}

watch(currentPage, getPosts)

getPosts()
</script>
