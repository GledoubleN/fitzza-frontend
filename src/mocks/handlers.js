import { http, HttpResponse } from 'msw/http'
import users from '../data/users.json'
import categories from '../data/categories.json'
import products from '../data/products.json'
import likes from '../data/likes.json'
import articles from '../data/articles.json'
import comments from '../data/comments.json'
import productOptions from '../data/productOptions.json'
import recommendations from '../data/recommendations.json'
import recommendationHistory from '../data/recommendationHistory.json'
import recommendationMessages from '../data/recommendationMessages.json'

// [개발용] 추천 요청 후 결과가 나오기까지 걸리는 시간을 흉내 냅니다.
// 요청한 뒤 이 시간 동안은 결과 조회가 '처리 중'을 돌려줘서, 화면의 로딩 말풍선과 반복 조회를 확인할 수 있습니다.
// 실제 백엔드가 붙으면 이 값과 아래 recommendationRequestedAt은 필요 없습니다.
const RECOMMENDATION_PROCESSING_MS = 3000
const recommendationRequestedAt = new Map()

export const handlers = [
  http.get(
    'http://localhost:8000/api/v1/uers/:id',
    ({ params }) => {
      const user = users.find(
        user => user.id === Number(params.id),
      )

      if (!user) {
        return new HttpResponse(null, { status: 404 })
      }

      return HttpResponse.json(user)
    },
  ),

  http.get(
    'http://localhost:8000/api/v1/categories',
    () => {
      return HttpResponse.json(categories)
    },
  ),

  http.get(
    'http://localhost:8000/api/v1/products',
    () => {
      return HttpResponse.json(products)
    },
  ),

  http.get(
    'http://localhost:8000/api/v1/products/recommended',
    () => {
      return HttpResponse.json(products)
    },
  ),

  http.get(
    'http://localhost:8000/api/v1/products/:id',
    ({ params }) => {
      const product = products.find(
        product => product.id === Number(params.id),
      )

      if (!product) {
        return new HttpResponse(null, { status: 404 })
      }

      // 상품 상세의 옵션(색상·사이즈). 목업에서는 모든 상품이 같은 옵션을 가집니다.
      return HttpResponse.json({ ...product, options: productOptions })
    },
  ),

  http.get(
    'http://localhost:8000/api/v1/shopping-cart',
    () => {
      return HttpResponse.json(products)
    },
  ),

  http.get(
    'http://localhost:8000/api/v1/checkout',
    () => {
      return HttpResponse.json(products)
    },
  ),

  http.get(
    'http://localhost:8000/api/v1/likes',
    () => {
      return HttpResponse.json(likes)
    },
  ),

  // TODO
  // 댓글 필터링을 CommunityArticlePage가 아니라 여기서 하도록 수정
  http.get(
    'http://localhost:8000/api/v1/community/articles/:id/comments',
    () => {
      return HttpResponse.json(comments)
    },
  ),

  http.get(
    'http://localhost:8000/api/v1/community/articles',
    () => {
      return HttpResponse.json(articles)
    },
  ),

  http.get(
    'http://localhost:8000/api/v1/community/articles/:id',
    ({ params }) => {
      const article = articles.find(
        product => product.id === Number(params.id),
      )

      if (!article) {
        return new HttpResponse(null, { status: 404 })
      }

      return HttpResponse.json(article)
    },
  ),

  // AI 추천 요청. 실제로는 비동기 처리라 접수 번호만 돌려줍니다.
  http.post(
    'http://localhost:8000/api/v1/recommendations',
    async ({ request }) => {
      const { query } = await request.json()

      if (!query?.trim()) {
        return new HttpResponse(null, { status: 400 })
      }

      // [개발용] 요청 시각을 기억해 두고, 결과 조회에서 처리 중 여부를 판단합니다.
      recommendationRequestedAt.set('sample', Date.now())

      return HttpResponse.json(
        { requestId: 'sample', status: 'PENDING' },
        { status: 202 },
      )
    },
  ),

  // 내 추천 대화 목록
  http.get(
    'http://localhost:8000/api/v1/recommendations',
    ({ request }) => {
      const page = Number(new URL(request.url).searchParams.get('page') ?? 0)

      return HttpResponse.json({
        content: page === 0 ? recommendationHistory : [],
        page,
        totalPages: 1,
      })
    },
  ),

  // 추천 결과 조회. 목업에서는 어떤 requestId든 같은 결과를 돌려줍니다.
  http.get(
    'http://localhost:8000/api/v1/recommendations/:requestId',
    ({ params }) => {
      // [개발용] 방금 요청한 추천은 잠시 동안 처리 중으로 응답합니다.
      // 요청한 적 없는 requestId(대화 내역, /ai/sample)는 이미 끝난 추천으로 보고 바로 결과를 돌려줍니다.
      const requestedAt = recommendationRequestedAt.get(params.requestId)

      if (requestedAt && Date.now() - requestedAt < RECOMMENDATION_PROCESSING_MS) {
        return HttpResponse.json({ status: 'PROCESSING' })
      }

      return HttpResponse.json(recommendations)
    },
  ),

  http.get(
    'http://localhost:8000/api/v1/recommendations/:requestId/messages',
    () => {
      return HttpResponse.json(recommendationMessages)
    },
  ),

  // 장바구니 담기
  http.post(
    'http://localhost:8000/api/v1/carts',
    async ({ request }) => {
      const { optionId, quantity } = await request.json()

      if (!optionId || quantity < 1) {
        return new HttpResponse(null, { status: 400 })
      }

      return HttpResponse.json({ cartId: optionId, quantity })
    },
  ),
]