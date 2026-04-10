export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log('Отримано дані для підписки:', body)

  return {
    success: true,
    message: 'Subscription successfully created!',
    data: body
  }
})
