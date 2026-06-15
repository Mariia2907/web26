<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Категорії</h1>
      <p class="text-sm text-gray-400 mt-1">Управління категоріями блогу</p>
    </div>

    <div class="flex items-center gap-3 mb-4 bg-white border border-gray-200 rounded-xl px-4 py-3">
      <UInput
        v-model="search"
        placeholder="Пошук за назвою..."
        icon="i-heroicons-magnifying-glass"
        class="w-80"
        @input="onSearchInput"
      />
      <select
        v-model="perPage"
        class="border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
        @change="onPerPageChange"
      >
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="25">25</option>
        <option :value="50">50</option>
        <option :value="75">75</option>
        <option :value="100">100</option>
      </select>
      <span class="text-sm text-gray-400">на сторінці</span>
      <span class="text-sm text-gray-400 ml-auto">
        Знайдено: <strong class="text-gray-700">{{ total }}</strong>
      </span>
      <div class="w-px h-5 bg-gray-200" />
      <UButton
        icon="i-heroicons-plus"
        color="primary"
        size="sm"
        to="/admin/blog/categories/create"
      >
        Створити категорію
      </UButton>
    </div>

    <div class="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <UTable :data="categories" :columns="columns" :loading="loading" :ui="{ tr: 'hover:bg-gray-50 transition-colors cursor-pointer' }">
        <template #actions-cell="{ row }">
          <UDropdownMenu :items="getRowActions(row.original)">
            <UButton
              icon="i-heroicons-ellipsis-horizontal"
              color="neutral"
              variant="soft"
              size="sm"
            />
          </UDropdownMenu>
        </template>
      </UTable>
    </div>

    <div class="flex justify-center mt-4">
      <UPagination
        v-model:page="currentPage"
        :total="total"
        :items-per-page="perPage"
      />
    </div>

    <UModal v-model:open="deleteModal.open">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-2">Видалити категорію?</h3>
          <p class="text-sm text-gray-500 mb-6">
            Ви впевнені що хочете видалити <strong>{{ deleteModal.title }}</strong>? Цю дію не можна скасувати.
          </p>
          <div class="flex justify-end gap-3">
            <UButton color="neutral" variant="outline" @click="deleteModal.open = false">
              Скасувати
            </UButton>
            <UButton color="error" :loading="deleteModal.loading" @click="confirmDelete">
              Видалити
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const router = useRouter()
const toast = useToast()

const currentPage = ref(1)
const perPage = ref(25)
const total = ref(0)
const loading = ref(false)
const search = ref('')
const categories = ref<any[]>([])

const deleteModal = ref({
  open: false,
  id: null as number | null,
  title: '',
  loading: false,
})

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const getRowActions = (category: any) => [
  [
    {
      label: 'Редагувати',
      icon: 'i-heroicons-pencil-square',
      onSelect: () => router.push(`/admin/blog/categories/${category.id}/edit`),
    },
  ],
  [
    {
      label: 'Видалити',
      icon: 'i-heroicons-trash',
      color: 'error' as const,
      onSelect: () => {
        deleteModal.value = { open: true, id: category.id, title: category.title, loading: false }
      },
    },
  ],
]

import { h, resolveComponent } from 'vue'

const columns = [
  { accessorKey: 'id', header: '#' },
  {
    accessorKey: 'title',
    header: 'Назва',
    cell: ({ row }: any) => h(
      resolveComponent('NuxtLink'),
      {
        to: `/admin/blog/categories/${row.original.id}`,
        class: 'text-primary-600 hover:underline font-medium',
      },
      () => row.original.title
    ),
  },
  { accessorKey: 'slug', header: 'Slug' },
  { accessorKey: 'description', header: 'Опис' },
  { accessorKey: 'parent_title', header: 'Батьківська категорія' },
  {
    id: 'actions',
    header: 'Дії',
    cell: () => null,
  },
]

const getCategories = async () => {
  loading.value = true
  try {
    const response: any = await $fetch(
      config.public.apiBase + '/api/admin/blog/categories',
      {
        params: {
          page: currentPage.value,
          per_page: perPage.value,
          search: search.value || undefined,
        },
      }
    )
    categories.value = response.data.map((cat: any) => ({
      ...cat,
      description: cat.description ?? '—',
      parent_title: cat.parent_title ?? '—',
    }))
    total.value = response.meta.total
  } finally {
    loading.value = false
  }
}

const confirmDelete = async () => {
  if (!deleteModal.value.id) return
  deleteModal.value.loading = true
  try {
    const res: any = await $fetch(
      config.public.apiBase + '/api/admin/blog/categories/' + deleteModal.value.id,
      { method: 'DELETE' }
    )
    deleteModal.value.open = false
    toast.add({ title: 'Успішно', description: res.message ?? 'Категорію видалено', color: 'success' })
    getCategories()
  } catch {
    toast.add({ title: 'Помилка', description: 'Не вдалось видалити категорію', color: 'error' })
  } finally {
    deleteModal.value.loading = false
  }
}

const onSearchInput = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    getCategories()
  }, 400)
}

const onPerPageChange = () => {
  currentPage.value = 1
  getCategories()
}

watch(currentPage, getCategories)
getCategories()
</script>
