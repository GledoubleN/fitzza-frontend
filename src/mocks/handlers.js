import { http, HttpResponse } from 'msw/http'
import users from '../data/users.json'
import categories from '../data/categories.json'
import products from '../data/products.json'
import likes from '../data/wishlist.json'
import articles from '../data/articles.json'
import comments from '../data/comments.json'

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
        product => product.id === Number(params.id),
      )

      if (!product) {
        return new HttpResponse(null, { status: 404 })
      }

      const measurements = {
        M: { 총장: 70, 가슴단면: 55, 소매길이: 60, 소매단면: 11 },
        L: { 총장: 72, 가슴단면: 58, 소매길이: 62, 소매단면: 12 },
        XL: { 총장: 75, 가슴단면: 63, 소매길이: 63, 소매단면: 12 },
      }
      const options = ['블랙', '베이지'].flatMap((color, colorIndex) => (
        Object.keys(measurements).map((size, sizeIndex) => ({
          optionId: product.id * 100 + colorIndex * 10 + sizeIndex,
          color,
          size,
          measurement: measurements[size],
          available: !(color === '베이지' && size === 'XL'),
        }))
      ))

      return HttpResponse.json({
        productId: product.id,
        productName: product.name,
        brandName: product.brand,
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

  http.post(
    'http://localhost:8000/api/v1/carts',
    async ({ request }) => {
      const { optionId, quantity } = await request.json()

      return HttpResponse.json({ cartId: optionId, optionId, quantity }, { status: 201 })
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
]