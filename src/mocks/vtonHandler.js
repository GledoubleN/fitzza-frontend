import { api } from '../api/axios.js'
import { http, HttpResponse } from 'msw/http'
import products from '../data/products.json'
import fittingResultImage from '../assets/hero.png'

const fittingResultImageUrl = new URL(fittingResultImage, location.origin).href
const fittings = Array.from({ length: 30 }, (_, index) => ({
  fittingId: index + 1,
  userImageUrl: null,
  productIds: [products[index % products.length].productId],
  createdAt: Date.parse('2026-10-01T10:00:00Z') + index * 12 * 60 * 60 * 1000,
  isFailed: index % 7 === 3,
}))

const toVtonProduct = (productId) => {
  const product = products.find((product) => product.productId === productId)

  return {
    productId,
    productName: product?.productName ?? `상품 ${ productId }`,
    price: product?.price ?? 0,
    imageUrl: product?.thumbnailUrl ?? '/product-image.png',
    categoryName: '상의',
  }
}

const vtonError = (status, code, message) => HttpResponse.json({ status, code, message }, { status })

const toVtonDetail = (fitting) => {
  const status = fitting.isFailed ? 'FAILED' : 'COMPLETED'
  const timestamp = new Date(fitting.createdAt).toISOString()

  return {
    fittingId: fitting.fittingId,
    userId: 1,
    userImageUrl: fitting.userImageUrl,
    status,
    resultImageUrl: status === 'COMPLETED' ? fittingResultImageUrl : null,
    errorMessage: fitting.isFailed ? '이미지 합성에 실패했습니다.' : null,
    products: fitting.productIds.map(toVtonProduct),
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

const toVtonSummary = (fitting) => {
  const { fittingId, userId, status, resultImageUrl, userImageUrl, products, createdAt } = toVtonDetail(fitting)

  return { fittingId, userId, status, resultImageUrl, userImageUrl, productCount: products.length, products, createdAt }
}

const parseProductIds = (value) => {
  try {
    const parsed = value.trim().startsWith('[') ? JSON.parse(value) : value.split(',')
    return parsed.map(Number)
  } catch {
    return []
  }
}

const findFitting = (fittingId) => fittings.find((fitting) => fitting.fittingId === Number(fittingId))

export const vtonHandlers = [
  http.post(
    `${ api.defaults.baseURL }/vton`,
    async ({ request }) => {
      const isMultipart = request.headers.get('content-type')?.includes('multipart/form-data')
      let productIds
      let userImage = null

      if (isMultipart) {
        const form = await request.formData()
        productIds = form.getAll('productIds').flatMap(parseProductIds)
        userImage = form.get('userImage')
      } else {
        productIds = (await request.json()).productIds ?? []
      }

      const uniqueProductIds = [...new Set(productIds)]
      if (!uniqueProductIds.length || uniqueProductIds.length > 5 || uniqueProductIds.some(Number.isNaN)) {
        return vtonError(400, 'BAD_REQUEST', 'productIds는 1개 이상 5개 이하의 유효한 정수 배열이어야 합니다.')
      }
      if (userImage?.size > 15 * 1024 * 1024) {
        return vtonError(400, 'BAD_REQUEST', '사용자 사진 파일 크기는 최대 15MB까지 가능합니다.')
      }

      const fitting = {
        fittingId: fittings.length + 1,
        userImageUrl: userImage?.size ? URL.createObjectURL(userImage) : null,
        productIds: uniqueProductIds,
        createdAt: Date.now(),
      }
      fittings.push(fitting)

      return HttpResponse.json({ fittingId: fitting.fittingId, status: 'PENDING' }, { status: 202 })
    },
  ),

  http.get(
    `${ api.defaults.baseURL }/vton`,
    ({ request }) => {
      const searchParams = new URL(request.url).searchParams
      const limit = Number(searchParams.get('limit') ?? 20)
      const offset = Number(searchParams.get('offset') ?? 0)
      if (!(limit >= 1 && limit <= 100) || !(offset >= 0)) {
        return vtonError(400, 'INVALID_REQUEST', '요청 값이 올바르지 않습니다.')
      }
      const visibleFittings = fittings.filter((fitting) => !fitting.isDeleted).reverse()

      return HttpResponse.json({
        items: visibleFittings.slice(offset, offset + limit).map(toVtonSummary),
        totalCount: visibleFittings.length,
      })
    },
  ),

  http.get(
    `${ api.defaults.baseURL }/vton/:fittingId`,
    ({ params }) => {
      const fitting = findFitting(params.fittingId)

      if (!fitting || fitting.isDeleted) {
        return vtonError(404, 'NOT_FOUND', '존재하지 않는 가상 피팅입니다.')
      }

      return HttpResponse.json(toVtonDetail(fitting))
    },
  ),

  http.delete(
    `${ api.defaults.baseURL }/vton/:fittingId`,
    ({ params }) => {
      const fitting = findFitting(params.fittingId)

      if (!fitting || fitting.isDeleted) {
        return vtonError(404, 'NOT_FOUND', '존재하지 않거나 이미 삭제된 가상 피팅입니다.')
      }

      fitting.isDeleted = true

      return new HttpResponse(null, { status: 204 })
    },
  ),
]