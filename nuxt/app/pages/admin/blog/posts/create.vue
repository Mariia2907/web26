<template>
  <div class="container mx-auto px-4 py-8 max-w-2xl">
    <div class="flex items-center gap-3 mb-6">
      <UButton
        icon="i-heroicons-arrow-left"
        variant="ghost"
        color="neutral"
        to="/admin/blog/posts"
      />
      <h1 class="text-2xl font-bold">Створити пост</h1>
    </div>

    <div class="bg-white border border-gray-200 rounded-xl p-6">
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">

        <UFormField label="Заголовок" name="title" required>
          <UInput
            v-model="state.title"
            placeholder="Введіть заголовок статті"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Категорія" name="category_id" required>
          <USelect
            :model-value="state.category_id"
            :items="categoryOptions"
            value-key="value"
            label-key="label"
            placeholder="Оберіть категорію"
            class="w-full"
            @update:model-value="state.category_id = Number($event)"
          />
        </UFormField>

        <UFormField label="Уривок" name="excerpt">
          <UTextarea
            v-model="state.excerpt"
            placeholder="Короткий опис статті (необов'язково)"
            :rows="3"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Зміст статті" name="content_raw" required>
          <UTextarea
            v-model="state.content_raw"
            placeholder="Введіть текст статті"
            :rows="12"
            class="w-full"
          />
        </UFormField>

        <UFormField name="is_published">
          <UCheckbox
            v-model="state.is_published"
            label="Опублікувати"
          />
        </UFormField>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <UButton variant="outline" color="neutral" to="/admin/blog/posts">
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
const router = useRouter()
const toast = useToast()
const loading = ref(false)

const schema = z.object({
  title:z.string().min(5, 'Мінімум 5 символів').max(200, 'Максимум 200 символів'),
  category_id:z.number().optional(),
  excerpt:z.string().max(500, 'Максимум 500 символів').optional(),
  content_raw:z.string().min(5, 'Мінімум 5 символів').max(10000, 'Максимум 10000 символів'),
  is_published:z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (!data.category_id || data.category_id < 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Оберіть категорію',
      path: ['category_id'],
    })
  }
})

type Schema = z.output<typeof schema>

const state = reactive({
  title:        '',
  category_id:  undefined as number | undefined,
  excerpt:      '',
  content_raw:  '',
  is_published: false,
})

const categoryOptions = ref<{ label: string; value: number }[]>([])

const getCategories = async () => {
  try {
    const res: any = await $fetch(config.public.apiBase + '/api/admin/blog/categories', {
      params: { all: 1 }
    })
    categoryOptions.value = res.data.map((cat: any) => ({
      label: cat.title,
      value: cat.id,
    }))
  } catch {
    toast.add({
      title: 'Помилка',
      description: 'Не вдалось завантажити категорії',
      color: 'error',
    })
  }
}

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  loading.value = true
  try {
    const res: any = await $fetch(config.public.apiBase + '/api/admin/blog/posts', {
      method: 'POST',
      body: event.data,
    })
    toast.add({
      title: 'Успішно',
      description: res.message ?? 'Пост створено',
      color: 'success',
    })
    router.push('/admin/blog/posts')
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

getCategories()
</script>
