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

      return HttpResponse.json(product)
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