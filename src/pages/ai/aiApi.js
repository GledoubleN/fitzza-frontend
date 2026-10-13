import { api } from '../../api/axios.js'

// 추천 질의 최대 글자 수 입니다. 약식으로 정해진 거라 실제 값은 확정이 필요해보입니다.
export const MAX_QUERY_LENGTH = 500

// 응답이 오지 않는 요청은 10초 뒤 실패로 처리해 화면이 재시도 안내까지 갈 수 있게 합니다.
const TIMEOUT = { timeout: 10000 }

export const postRecommendation = async (query) =>
  (await api.post('/recommendations', { query }, TIMEOUT)).data

export const getRecommendation = async (requestId) =>
  (await api.get(`/recommendations/${ encodeURIComponent(requestId) }`, TIMEOUT)).data

export const getRecommendationHistory = async (page) =>
  (await api.get('/recommendations', { params: { page, size: 20 }, ...TIMEOUT })).data

export const getRecommendationMessages = async (requestId) =>
  (await api.get(`/recommendations/${ encodeURIComponent(requestId) }/messages`, TIMEOUT)).data

export const getProductOptions = async (productId) =>
  (await api.get(`/products/${ productId }`, TIMEOUT)).data.options ?? []

export const addToCart = async (optionId, quantity = 1) =>
  (await api.post('/carts', { optionId, quantity }, TIMEOUT)).data
