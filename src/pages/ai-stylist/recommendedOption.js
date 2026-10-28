import { api } from '../../api/axios.js'

const TIMEOUT = { timeout: 10000 }

const isAvailable = (option) => option.available !== false

export const toRecommendedOptionLabel = (item) => [item.color, item.recommendedSize].filter(Boolean).join('/')

export const addRecommendedOptionToCart = async (item) => {
  const { data } = await api.get(`/products/${ encodeURIComponent(item.productId) }`, TIMEOUT)
  const options = data.options ?? []
  const colored = options.some((option) => option.color)
  const recommendedOption = options.find((option) =>
    (!colored || option.color === item.color) && option.size === item.recommendedSize && isAvailable(option))

  if (!recommendedOption) return false

  await api.post('/carts', { optionId: recommendedOption.optionId, quantity: 1 }, TIMEOUT)
  return true
}