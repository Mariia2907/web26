export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const products: any = await $fetch('/api/products')
  const product = products.find((p: any) => p.id === Number(id))

  if (!product) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Продукт не знайдено',
    })
  }
  return product
})
