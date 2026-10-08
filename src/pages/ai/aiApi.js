import { api } from '../../api/axios.js'
import { sampleHistory, sampleMessages, sampleProduct, sampleResult } from './sampleData.js'

// 한 번 샘플로 넘어가면 새로고침 전까지 다시 묻지 않는다.
let useSample = false

// 명세된 오류(400, 403)는 그대로 던지고, 그 외 통신 실패는 샘플 데이터로 넘어갈지 묻는다.
// To-Do-Next: 현재 api endPoint 미구성으로 둔 개발용 처리. 연동이 끝나면 지워야 함.
const withFallback = async (request, sample) => {
  if (!useSample) {
    try {
      return (await request()).data
    } catch (err) {
      if ([400, 403].includes(err.response?.status)) throw err
      if (!useSample && !window.confirm('서버 통신에 실패했습니다. 샘플 데이터로 넘어가기 (개발 중)')) throw err
      console.log('AI 추천 통신 실패, 샘플 사용(개발용)', err)
      useSample = true
    }
  }
  return sample
}

export const postRecommendation = (query) =>
  withFallback(() => api.post('/recommendations', { query }), { requestId: 'sample', status: 'PENDING' })

export const getRecommendation = (requestId) =>
  withFallback(() => api.get(`/recommendations/${ requestId }`), sampleResult)

export const getRecommendationHistory = (page) =>
  withFallback(() => api.get('/recommendations', { params: { page, size: 20 } }), sampleHistory)

// 말풍선 보조용이라 실패해도 샘플 전환을 묻지 않는다.
export const getRecommendationMessages = async (requestId) =>
  useSample ? sampleMessages : (await api.get(`/recommendations/${ requestId }/messages`)).data

export const getProductOptions = async (productId) =>
  (await withFallback(() => api.get(`/products/${ productId }`), sampleProduct)).options

export const addToCart = (optionId, quantity = 1) =>
  withFallback(() => api.post('/carts', { optionId, quantity }), { cartId: 0, quantity })

let loginChecked = null

// 추천 기록은 회원만 조회할 수 있어 로그인이 필요하다.
// 로그인 연동 전까지는 확인 창으로 넘어갈 수 있게 둔다. (개발 중)
export const ensureLogin = (navigate) => {
  if (localStorage.getItem('userId')) return true
  if (loginChecked === null) {
    loginChecked = window.confirm('로그인이 필요합니다. 로그인 없이 넘어가기 (개발 중)')
    if (!loginChecked) {
      // 같은 렌더에서 두 번 묻지 않도록 거절은 잠깐만 기억한다.
      setTimeout(() => { loginChecked = null })
      navigate('/signin')
    }
  }
  return loginChecked
}
