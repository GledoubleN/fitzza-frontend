import { delay } from 'msw'
import { http, HttpResponse } from 'msw/http'
import users from '../data/users.json'
import categories from '../data/categories.json'
import products from '../data/products.json'
import likes from '../data/wishlist.json'
import articles from '../data/articles.json'
import comments from '../data/comments.json'
import carts from '../data/carts.json'
import recommendations from '../data/recommendations.json'
import recommendationHistory from '../data/recommendation-history.json'
import recommendationMessages from '../data/recommendation-messages.json'
import fittingResultImage from '../assets/hero.png'

// [개발용] 추천 요청의 응답이 오기까지 걸리는 시간을 흉내 냅니다.
// 추천 결과는 요청(POST)의 응답에 담겨 오므로, 이 시간 동안 화면의 로딩 말풍선을 확인할 수 있습니다.
// 실제 백엔드가 붙으면 필요 없습니다.
const RECOMMENDATION_PROCESSING_MS = 3000

// TODO API 필요: 가상 피팅 결과 조회·최신 피팅 조회 API가 명세에 없어 목에서만 저장한다.
// 새로고침하면 비워진다.
const fittings = []
const FITTING_DURATION = 3000

// 요청 후 일정 시간이 지나면 완료된 것으로 응답한다.
const toFittingResponse = (fitting) => {
  if (!fitting) {
    return new HttpResponse(null, { status: 404 })
  }

  const isDone = Date.now() - fitting.createdAt >= FITTING_DURATION

  return HttpResponse.json({
    fittingId: fitting.fittingId,
    status: isDone ? 'DONE' : 'PROCESSING',
    resultImageUrl: isDone ? '/src/assets/hero.png' : null,
  })
}

const measurements = {
  M: { 총장: 70, 가슴단면: 55, 소매길이: 60, 소매단면: 11 },
  L: { 총장: 72, 가슴단면: 58, 소매길이: 62, 소매단면: 12 },
  XL: { 총장: 75, 가슴단면: 63, 소매길이: 63, 소매단면: 12 },
}

const getProductOptions = (product) => ['블랙', '베이지'].flatMap((color, colorIndex) => (
  Object.keys(measurements).map((size, sizeIndex) => ({
    optionId: product.productId * 100 + colorIndex * 10 + sizeIndex,
    color,
    size,
    measurement: measurements[size],
    additionalPrice: size === 'XL' ? 5000 : 0,
    price: product.price + (size === 'XL' ? 5000 : 0),
    available: !(color === '베이지' && size === 'XL'),
  }))
))

const findOption = (optionId) => {
  const product = products.find((product) => product.productId === Math.floor(optionId / 100))
  const option = product && getProductOptions(product).find((option) => option.optionId === optionId)

  return option && { product, option }
}

const toCartItem = (cart) => {
  const { product, option } = findOption(cart.optionId)

  return {
    ...cart,
    available: option.available,
    productId: product.productId,
    brandName: product.brandName,
    productName: product.productName,
    color: option.color,
    size: option.size,
    imageUrl: product.thumbnailUrl,
    unitPrice: option.available ? option.price : null,
    linePrice: option.available ? option.price * cart.quantity : 0,
  }
}

const cartError = (status, code, message) => HttpResponse.json({ code, message }, { status })

const validateCartRequest = ({ optionId, quantity }) => {
  if (!Number.isInteger(quantity) || quantity < 1) {
    return cartError(400, 'INVALID_REQUEST', '수량은 1개 이상이어야 해요.')
  }

  const found = findOption(optionId)
  if (!found) {
    return cartError(400, 'OPTION_NOT_FOUND', '존재하지 않는 옵션이에요.')
  }
  if (!found.option.available) {
    return cartError(400, 'OPTION_NOT_AVAILABLE', '품절된 옵션이에요.')
  }
}

export const handlers = [
  http.post(
    'http://localhost:8000/api/v1/auth/signin',
    ({ params }) => {
      return HttpResponse.json({
        accessToken:  "fitzza-access-token",
        refreshToken: "fitzza-refresh-token",
        userId: 1,
        nickname: "CoffeeSlayer",
      })
    }
  ),

  http.post(
    'http://localhost:8000/api/v1/auth/signup',
    ({ params }) => {
      return HttpResponse.json({
        userId: 1
      })
    }
  ),

  http.post(
    'http://localhost:8000/api/v1/auth/signout',
    ({ params }) => {
      return HttpResponse.json({

      })
    }
  ),

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
    ({ request }) => {
      // 🧪 [조회 실패 테스트용 주석]
      // return new HttpResponse(null, { status: 500 })

      const url = new URL(request.url)
      const page = Number(url.searchParams.get('page') || 0)
      const size = Number(url.searchParams.get('size') || 10)

      const start = page * size
      const end = start + size
      const paginatedContent = products.slice(start, end)
      const hasNext = end < products.length

      return HttpResponse.json({
        content: paginatedContent,
        page: page,
        size: size,
        totalElements: products.length,
        totalPages: Math.ceil(products.length / size),
        hasNext: hasNext,
        sort: url.searchParams.get('sort') || 'LATEST'
      })
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
        product => product.productId === Number(params.id),
      )

      if (!product) {
        return new HttpResponse(null, { status: 404 })
      }

      const options = getProductOptions(product)

      return HttpResponse.json({
        productId: product.productId,
        productName: product.productName,
        brandName: product.brandName,
        price: product.price,
        normalPrice: Math.round(product.price / 0.8 / 100) * 100,
        discountRate: 20,
        material: '폴리에스터 95%, 스판 5%',
        fitType: '오버핏',
        description: '부드러운 촉감과 여유로운 실루엣으로 매일 입기 좋은 상품입니다.',
        thumbnailUrl: '/src/assets/hero.png',
        images: ['/src/assets/hero.png'],
        options,
        status: 'ON_SALE',
        wished: false,
      })
    },
  ),

  http.get(
    'http://localhost:8000/api/v1/reviews',
    ({ request }) => {
      const query = new URL(request.url).searchParams
      const page = Number(query.get('page') ?? 0)
      const size = Number(query.get('size') ?? 10)
      const sort = query.get('sort')
      const TOTAL = 13
      const contents = {
        5: '이름 그대로 널널한 박시핏이 너무 예뻐요. 두께도 적당해서 지금 입기 좋아요.',
        4: '그냥저냥 입을 만하네요.',
        3: '별로입니다. 사지 마세요.',
      }
      const content = Array.from({ length: TOTAL }, (_, index) => ({
        reviewId: index + 1,
        productId: Number(query.get('productId')),
        userId: index + 1,
        rating: 5 - (index % 3),
        content: contents[5 - (index % 3)],
        imageUrl: index % 2 === 0 ? '/src/assets/hero.png' : null,
        createdAt: new Date(2026, 8, 30 - index).toISOString(),
      }))
        .sort((a, b) => (
          sort === 'RATING_DESC' ? b.rating - a.rating : sort === 'RATING_ASC' ? a.rating - b.rating : 0
        ))
        .slice(page * size, (page + 1) * size)

      return HttpResponse.json({ content, page, totalPages: Math.ceil(TOTAL / size) })
    },
  ),

  http.get(
    'http://localhost:8000/api/v1/carts',
    () => HttpResponse.json([...carts].reverse().map(toCartItem)),
  ),

  http.post(
    'http://localhost:8000/api/v1/carts',
    async ({ request }) => {
      const body = await request.json()
      const error = validateCartRequest(body)
      if (error) {
        return error
      }

      const existing = carts.find((cart) => cart.optionId === body.optionId)
      if (existing) {
        existing.quantity += body.quantity
        return HttpResponse.json(toCartItem(existing), { status: 201 })
      }

      const cart = { cartId: Math.max(0, ...carts.map((cart) => cart.cartId)) + 1, ...body }
      carts.push(cart)
      return HttpResponse.json(toCartItem(cart), { status: 201 })
    },
  ),

  http.patch(
    'http://localhost:8000/api/v1/carts/:cartId',
    async ({ params, request }) => {
      const cart = carts.find((cart) => cart.cartId === Number(params.cartId))
      if (!cart) {
        return cartError(404, 'CART_NOT_FOUND', '장바구니 항목을 찾을 수 없어요.')
      }

      const body = await request.json()
      const error = validateCartRequest(body)
      if (error) {
        return error
      }

      const sameOption = carts.find((other) => other !== cart && other.optionId === body.optionId)
      if (sameOption) {
        sameOption.quantity += body.quantity
        carts.splice(carts.indexOf(cart), 1)
        return HttpResponse.json(toCartItem(sameOption))
      }

      Object.assign(cart, body)
      return HttpResponse.json(toCartItem(cart))
    },
  ),

  http.delete(
    'http://localhost:8000/api/v1/carts/:cartId',
    ({ params }) => {
      const index = carts.findIndex((cart) => cart.cartId === Number(params.cartId))
      if (index === -1) {
        return cartError(404, 'CART_NOT_FOUND', '장바구니 항목을 찾을 수 없어요.')
      }

      carts.splice(index, 1)
      return new HttpResponse(null, { status: 204 })
    },
  ),

  http.get(
    'http://localhost:8000/api/v1/wishlists',
    async ({ request }) => {
      return HttpResponse.json({
        content: products,
        page: 1,
        size: products.length,
        totalElements: 1,
        totalPages: 1,
        hasNext: 1
      })
    },
  ),

  http.post(
    'http://localhost:8000/api/v1/wishlists',
    async ({ request }) => {
      const { itemId } = await request.json()

      return HttpResponse.json({ wishlistId: itemId })
    },
  ),

  http.delete(
    'http://localhost:8000/api/v1/wishlists',
    () => new HttpResponse(null, { status: 204 }),
  ),

  // TODO API 필요: photoId(프로필 전신 사진 ID)는 명세의 /users/me 응답에 없는 가정 필드다.
  http.get(
    'http://localhost:8000/api/v1/users/me',
    () => HttpResponse.json({ email: 'user@fitzza.com', nickname: '핏짜', photoId: 1 }),
  ),

  http.post(
    'http://localhost:8000/api/v1/vton',
    async ({ request }) => {
      const { productIds, color, size } = await request.json()
      const fitting = {
        fittingId: fittings.length + 1,
        productId: productIds[0],
        color,
        size,
        createdAt: Date.now(),
      }
      fittings.push(fitting)

      return HttpResponse.json({ fittingId: fitting.fittingId, status: 'PENDING' }, { status: 202 })
    },
  ),

  http.get(
    'http://localhost:8000/api/v1/vton/latest',
    ({ request }) => toFittingResponse(fittings.findLast(
      fitting => fitting.productId === Number(new URL(request.url).searchParams.get('productId')),
    )),
  ),

  http.get(
    'http://localhost:8000/api/v1/vton/:fittingId',
    ({ params }) => toFittingResponse(fittings.find(
      fitting => fitting.fittingId === Number(params.fittingId),
    )),
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

  // AI 추천 요청. 추천이 끝나면 결과를 응답에 담아 돌려줍니다.
  http.post(
    'http://localhost:8000/api/v1/recommendations',
    async ({ request }) => {
      const { query } = await request.json()

      if (!query?.trim()) {
        return new HttpResponse(null, { status: 400 })
      }

      // [개발용] 추천에 걸리는 시간만큼 응답을 늦춥니다.
      await delay(RECOMMENDATION_PROCESSING_MS)

      return HttpResponse.json({ requestId: 'sample', ...recommendations })
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

  // 지난 추천 결과 조회. 목업에서는 어떤 requestId든 같은 결과를 돌려줍니다.
  http.get(
    'http://localhost:8000/api/v1/recommendations/:requestId',
    ({ params }) => {
      return HttpResponse.json({ requestId: params.requestId, ...recommendations })
    },
  ),

  http.get(
    'http://localhost:8000/api/v1/recommendations/:requestId/messages',
    () => {
      return HttpResponse.json(recommendationMessages)
    },
  ),

  // 가상 피팅. 생성이 끝나면 결과를 응답에 담아 돌려줍니다. 목업에서는 어떤 요청이든 같은 이미지를 돌려줍니다.
  http.post(
    'http://localhost:8000/api/v1/fittings',
    async ({ request }) => {
      const { photoId, productIds } = await request.json()

      if (!photoId || !productIds?.length) {
        return new HttpResponse(null, { status: 400 })
      }

      // [개발용] 이미지 생성에 걸리는 시간만큼 응답을 늦춥니다.
      await delay(RECOMMENDATION_PROCESSING_MS)

      return HttpResponse.json({
        fittingId: 'sample-fitting',
        status: 'COMPLETED',
        resultImageUrl: fittingResultImage,
        failReason: null,
        retryable: false,
        products: products.filter((product) => productIds.includes(product.productId)),
        createdAt: new Date().toISOString(),
      })
    },
  ),
]