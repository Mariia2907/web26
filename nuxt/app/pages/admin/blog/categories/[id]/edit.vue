<template>
  <div class="container mx-auto px-4 py-8 max-w-2xl">
    <div class="flex items-center gap-3 mb-6">
      <UButton
        icon="i-heroicons-arrow-left"
        variant="ghost"
        color="neutral"
        to="/admin/blog/categories"
      />
      <h1 class="text-2xl font-bold">Редагувати категорію</h1>
    </div>

    <div v-if="loadingCategory" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-4xl text-primary-500" />
    </div>

    <div v-else class="bg-white border border-gray-200 rounded-xl p-6">
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">

        <UFormField label="Назва" name="title" required>
          <UInput
            v-model="state.title"
            placeholder="Введіть назву категорії"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Slug" name="slug">
          <UInput
            v-model="state.slug"
            placeholder="Залиш порожнім — згенерується з назви"
            class="w-full"
          />
          <template #hint>
            <span class="text-xs text-gray-400">Очисти щоб згенерувати новий з назви</span>
          </template>
        </UFormField>

        <UFormField label="Батьківська категорія" name="parent_id" required>
          <USelect
            :model-value="state.parent_id"
            :items="categoryOptions"
            value-key="value"
            label-key="label"
            placeholder="Оберіть категорію"
            class="w-full"
            @update:model-value="state.parent_id = Number($event)"
          />
        </UFormField>

        <UFormField label="Опис" name="description">
          <UTextarea
            v-model="state.description"
            placeholder="Короткий опис категорії (необов'язково)"
            :rows="4"
            class="w-full"
          />
        </UFormField>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <UButton variant="outline" color="neutral" to="/admin/blog/categories">
            Скасувати
          </UButton>
          <UButton type="submit" :loading="loading" icon="i-heroicons-check">
            Зберегти
          </UButton>
        </div>

      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const loading = ref(false)
const loadingCategory = ref(true)

const schema = z.object({
  title:z.string().min(5, 'Мінімум 5 символів').max(200, 'Максимум 200 символів'),
  slug:z.string().max(200, 'Максимум 200 символів').optional(),
  parent_id:z.number().optional(),
  description: z.string().max(500, 'Максимум 500 символів').optional().or(z.literal('')),
}).superRefine((data, ctx) => {
  if (!data.parent_id || data.parent_id < 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Оберіть батьківську категорію',
      path: ['parent_id'],
    })
  }
})

type Schema = z.output<typeof schema>

const state = reactive({
  title: '',
  slug: '',
  parent_id: undefined as number | undefined,
  description: '',
})

const categoryOptions = ref<{ label: string; value: number }[]>([])

const getCategories = async () => {
  try {
    const res: any = await $fetch(config.public.apiBase + '/api/admin/blog/categories', {
      params: { all: 1 }
    })
    categoryOptions.value = res.data.map((cat: any) => ({
      label: cat.title,
      value: Number(cat.id),
    }))
  } catch {
    toast.add({ title: 'Помилка', description: 'Не вдалось завантажити категорії', color: 'error' })
  }
}

const getCategory = async () => {
  loadingCategory.value = true
  try {
    const res: any = await $fetch(
      config.public.apiBase + '/api/admin/blog/categories/' + route.params.id
    )
    const cat = res.data
    state.title = cat.title ?? ''
    state.slug = cat.slug ?? ''
    state.parent_id = cat.parent_id ?? undefined
    state.description = cat.description ?? ''
  } catch {
    toast.add({ title: 'Помилка', description: 'Не вдалось завантажити категорію', color: 'error' })
    router.push('/admin/blog/categories')
  } finally {
    loadingCategory.value = false
  }
}

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  loading.value = true
  try {
    const res: any = await $fetch(
      config.public.apiBase + '/api/admin/blog/categories/' + route.params.id,
      {
        method: 'PUT',
        body: event.data,
      }
    )
    toast.add({ title: 'Успішно', description: res.message ?? 'Категорію оновлено', color: 'success' })
    router.push('/admin/blog/categories')
  } catch (err: any) {
    const errors = err?.data?.errors
    if (errors) {
      const firstError = Object.values(errors).flat()[0] as string
      toast.add({ title: 'Помилка валідації', description: firstError, color: 'error' })
    } else {
      toast.add({ title: 'Помилка', description: err?.data?.message ?? 'Помилка збереження', color: 'error' })
    }
  } finally {
    loading.value = false
  }
}

await Promise.all([getCategory(), getCategories()])
</script>
