export default defineEventHandler(async (event) => {
  try {
    const response = await $fetch('https://dummyjson.com/products?limit=0')
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch products'
    })
  }
})
