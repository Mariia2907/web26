<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { getPaginationRowModel } from '@tanstack/vue-table'
import type { TableColumn } from '@nuxt/ui'

useHead({
  title: 'Таблиця продуктів'
})
const table = useTemplateRef('table')

type Product = {
  id: number
  title: string
  description: string
  price: number
  rating: number
  brand: string
  category: string
  thumbnail: string
}

const { data, status } = await useFetch<{ products: Product[] }>('/api/products-table')
const products = computed<Product[]>(() => data.value?.products || [])
const globalFilter = ref('')
const pagination = ref({ pageIndex: 0, pageSize: 5 })
const sorting = ref([])
const rowSelection = ref({})

const tableUi = {
  root: 'border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white',
  thead: 'bg-gray-50 border-b border-gray-200',
  th: 'p-4 text-xs font-medium text-gray-500 uppercase tracking-wider',
  td: 'p-4 align-middle whitespace-normal text-sm text-gray-700 border-b border-gray-100',
  tr: 'hover:bg-gray-100 transition-colors duration-150'
}

const paginationUi = {
  root: 'flex items-center gap-1',
  base: 'shadow-none'
}

const columns: TableColumn<Product>[] = [
  { id: 'select' },
  { accessorKey: 'title', header: 'Product Details' },
  { accessorKey: 'price', header: 'Price' },
  { accessorKey: 'rating', header: 'Rating' },
  { accessorKey: 'category', header: 'Category' },
  { accessorKey: 'thumbnail', header: 'Preview' }
]
</script>

<template>
  <div class="max-w-[1300px] mx-auto p-6 flex flex-col gap-3 bg-white antialiased">

    <div class="px-2 text-sm text-gray-600 font-medium">
      <UInput
        v-model="globalFilter"
        placeholder="Search products..."
        icon="i-lucide-search"
        class="max-w-sm"
      />
    </div>

    <UTable
      ref="table"
      v-model:row-selection="rowSelection"
      :data="products"
      :columns="columns"
      :loading="status === 'pending'"
      v-model:pagination="pagination"
      v-model:global-filter="globalFilter"
      v-model:sorting="sorting"
      :ui="tableUi"
      :pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
    >
      <template #select-header="{ table: tableApi }">
        <UCheckbox
          :model-value="tableApi.getIsSomePageRowsSelected() ? 'indeterminate' : tableApi.getIsAllPageRowsSelected()"
          @update:model-value="(value: any) => tableApi.toggleAllPageRowsSelected(!!value)"
        />
      </template>

      <template v-for="col in ['title', 'price', 'rating']" :key="col" #[`${col}-header`]="{ column }">
        <UDropdownMenu
          :content="{ align: 'start' }"
          :items="[
            { label: 'Asc', icon: 'i-lucide-arrow-up', onSelect: () => column.toggleSorting(false) },
            { label: 'Desc', icon: 'i-lucide-arrow-down', onSelect: () => column.toggleSorting(true) }
          ]"
        >
          <UButton
            color="neutral"
            variant="ghost"
            :label="(column.columnDef.header as string)"
            class="text-gray-500 font-medium hover:text-gray-900 uppercase text-xs tracking-wider p-0"
            :trailing-icon="column.getIsSorted() ? (column.getIsSorted() === 'asc' ? 'i-lucide-arrow-up' : 'i-lucide-arrow-down') : 'i-lucide-chevrons-up-down'"
          />
        </UDropdownMenu>
      </template>

      <template #select-cell="{ row }">
        <UCheckbox
          :model-value="row.getIsSelected()"
          @update:model-value="(value: any) => row.toggleSelected(!!value)"
        />
      </template>

      <template #title-cell="{ row }">
        <div class="flex flex-col gap-1 min-w-[300px]">
          <a href="#" class="font-semibold text-gray-700 underline decoration-gray-400 underline-offset-2 hover:text-blue-600">
            {{ row.getValue('title') }}
          </a>
          <span class="text-[13px] text-gray-500 whitespace-normal">
            {{ (row.original as any).description }}
          </span>
        </div>
      </template>

      <template #price-cell="{ row }">
        <span class="font-medium">${{ row.getValue('price') }}</span>
      </template>

      <template #rating-cell="{ row }">
        <span :class="(row.getValue('rating') as number) < 4.5 ? 'text-red-500 font-bold' : 'text-green-600 font-bold'">
          {{ row.getValue('rating') }}
        </span>
      </template>

      <template #category-cell="{ row }">
        <span class="text-gray-600 capitalize">{{ (row.getValue('category') as string) }}</span>
      </template>

      <template #thumbnail-cell="{ row }">
        <img
          :src="(row.getValue('thumbnail') as string)"
          class="w-[100px] h-[100px] object-cover rounded border border-gray-200"
        />
      </template>
    </UTable>

    <div class="flex justify-between items-center px-2 mt-1">
      <div class="text-sm text-gray-500 font-medium">
        {{ Object.keys(rowSelection).length }} of {{ products.length }} row(s) selected.
      </div>

      <UPagination
        :page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
        :items-per-page="table?.tableApi?.getState().pagination.pageSize || 5"
        :total="table?.tableApi?.getFilteredRowModel().rows.length || 0"
        @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
        :ui="paginationUi"
      />
    </div>
  </div>
</template>
