import { http, HttpResponse } from 'msw/http'
import users from '../data/users.json'
import categories from '../data/categories.json'
import products from '../data/products.json'
import likes from '../data/wishlist.json'
import articles from '../data/articles.json'
import comments from '../data/comments.json'

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
    'http://localhost:8000/api/v1/products/:id/reviews',
    ({ params, request }) => {
      const page = Number(new URL(request.url).searchParams.get('page') ?? 0)
      const size = Number(new URL(request.url).searchParams.get('size') ?? 10)
      const TOTAL = 13
      const content = Array.from({ length: TOTAL }, (_, index) => ({
        reviewId: index + 1,
        productId: Number(params.id),
        userId: index + 1,
        rating: 5 - (index % 3) * 0.5,
        content: '이름 그대로 널널한 박시핏이 너무 예뻐요. 두께도 적당해서 지금 입기 좋아요.',
        imageUrl: index % 2 === 0 ? '/src/assets/hero.png' : null,
        createdAt: new Date(2026, 8, 30 - index).toISOString(),
      })).slice(page * size, (page + 1) * size)

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
]