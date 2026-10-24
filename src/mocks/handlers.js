import { api } from '../api/axios.js'
import { http, HttpResponse } from 'msw/http'
import users from '../data/users.json'
import categories from '../data/categories.json'
import products from '../data/products.json'
import likes from '../data/wishlist.json'
import carts from '../data/carts.json'
import orders from '../data/orders.json'
import surveys from '../data/surveys.json'
import userProfile from '../data/user-profile.json'
import recommendations from '../data/recommendations.json'
import recommendationHistory from '../data/recommendation-history.json'
import recommendationMessages from '../data/recommendation-messages.json'
import notifications from '../data/notifications.json'
import fittingResultImage from '../assets/hero.png'
import { communityHandlers } from './communityHandlers.js'

let worldcupHistories = []

let lastRecommendationId = 0

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

const getTotalPrice = (order) => order.items.reduce((sum, item) => sum + item.unitPrice * item.orderQty, 0)

const toOrderItem = ({ orderItemId, productId, productName, color, size, orderQty, unitPrice }) => (
  { orderItemId, productId, productName, color, size, orderQty, unitPrice }
)

const getRequestUserId = (request) => (
  request.headers.get('Authorization') === 'Bearer fitzza-access-token' ? 1 : null
)

const unauthorized = () => cartError(401, 'INVALID_TOKEN', '로그인이 필요해요.')

const SIZE_FEEDBACKS = ['SMALL', 'FIT', 'BIG']

const toSurveyResponse = ({ surveyId, orderItemId, sizeFeedback }) => ({ surveyId, orderItemId, sizeFeedback })

const validateOrderRequest = ({ cartIds, recipientName, recipientPhone, shippingAddress }) => {
  if (!Array.isArray(cartIds) || cartIds.length === 0) {
    return cartError(400, 'INVALID_REQUEST', '주문할 상품을 선택해 주세요.')
  }
  if (!recipientName?.trim() || !shippingAddress?.trim()) {
    return cartError(400, 'INVALID_REQUEST', '배송 정보를 입력해 주세요.')
  }
  if (!/^[0-9+-]{9,20}$/.test(recipientPhone ?? '')) {
    return cartError(400, 'INVALID_REQUEST', '연락처는 숫자, \'+\', \'-\'만 사용해 9~20자로 입력해야 합니다.')
  }
}

const createOrderNum = () => {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '')
  const suffix = Math.random().toString(16).slice(2, 12).toUpperCase().padEnd(10, '0')
  return `ORD-${ date }-${ suffix }`
}

export const handlers = [
  http.get(`${ api.defaults.baseURL }/users/me`, () => {
    return HttpResponse.json(userProfile)
  }),

  http.patch(`${ api.defaults.baseURL }/users/me`, async ({ request }) => {
    const body = await request.json()

    Object.assign(userProfile, body)

    return HttpResponse.json(userProfile, { status: 200 })
  }),

  http.post(
    `${ api.defaults.baseURL }/auth/signin`,
    () => {
      return HttpResponse.json({
        accessToken: "fitzza-access-token",
        userId: 1,
        nickname: "CoffeeSlayer",
      }, {
        headers: {
          'Set-Cookie': 'refreshToken=fitzza-refresh-token; Path=/; SameSite=Lax',
        },
      })
    }
  ),

  http.post(
    `${ api.defaults.baseURL }/auth/refresh`,
    ({ cookies }) => {
      if (cookies.refreshToken !== 'fitzza-refresh-token') {
        return new HttpResponse(null, { status: 401 })
      }

      return HttpResponse.json({
        accessToken: 'fitzza-access-token',
      })
    },
  ),

  http.post(
    `${ api.defaults.baseURL }/auth/signup`,
    () => {
      return HttpResponse.json({
        userId: 1
      })
    }
  ),

  http.post(
    `${ api.defaults.baseURL }/auth/signout`,
    () => {
      return HttpResponse.json({}, {
        headers: {
          'Set-Cookie': 'refreshToken=; Path=/; SameSite=Lax; Max-Age=0',
        },
      })
    }
  ),

  http.get(
    `${ api.defaults.baseURL }/uers/:id`,
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
    `${ api.defaults.baseURL }/categories`,
    () => {
      return HttpResponse.json(categories)
    },
  ),

  http.get(
    `${ api.defaults.baseURL }/products`,
    ({ request }) => {
      const url = new URL(request.url)
      const page = Number(url.searchParams.get('page') || 0)
      const size = Number(url.searchParams.get('size') || 10)
      const sort = url.searchParams.get('sort') || ''

      let sortedProducts = [...products]

      if (sort === 'NAME') {
        sortedProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      } else if (sort === 'PRICE_ASC') {
        sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0))
      } else if (sort === 'PRICE_DESC') {
        sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0))
      }

      const start = page * size
      const end = start + size

      const userId = getRequestUserId(request)

      const paginatedContent = sortedProducts.slice(start, end).map(product => {
        if (!userId) {
          const { wished, ...rest } = product
          return rest
        }

        return {
          ...product,
          wished: product.wished ?? false,
        }
      })

      const hasNext = end < sortedProducts.length

      return HttpResponse.json({
        content: paginatedContent,
        page: page,
        size: size,
        totalElements: products.length,
        totalPages: Math.ceil(products.length / size),
        hasNext: hasNext,
        sort: sort
      })
    },
  ),

  http.get(
    `${ api.defaults.baseURL }/products`,
    () => {
      return HttpResponse.json({
        content: products,
        page: 1,
        size: 1,
        totalElements: 1,
        totalPages: 1,
        hasNext: true,
        sort: "PRICE_ASC"
      })
    },
  ),

  http.get(
    `${ api.defaults.baseURL }/products/:id`,
    ({ params, request }) => {
      const product = products.find(
        product => product.productId === Number(params.id),
      )

      if (!product) {
        return new HttpResponse(null, { status: 404 })
      }

      const options = getProductOptions(product)
      const userId = getRequestUserId(request)

      const productDetail = {
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
      }

      if (userId) {
        productDetail.wished = product.wished ?? false
      }

      return HttpResponse.json(productDetail)
    },
  ),

  http.get(
    `${ api.defaults.baseURL }/reviews`,
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
      const content = Array.from({ length: TOTAL }, (_, index) => {
        const rating = 5 - (index % 3)
        return {
          reviewId: index + 1,
          productId: Number(query.get('productId')),
          userId: index + 1,
          rating: rating,
          content: contents[rating] || '좋아요!',
          imageUrl: index % 2 === 0 ? '/src/assets/hero.png' : null,
          createdAt: new Date(2026, 8, 30 + index).toISOString(),
        }
      })
      .sort((a, b) => (
        sort === 'RATING_DESC' ? b.rating - a.rating : sort === 'RATING_ASC' ? a.rating - b.rating : 0
      ))
      .slice(page * size, (page + 1) * size)

      return HttpResponse.json({ content, page, totalPages: Math.ceil(TOTAL / size) })
    },
  ),

  http.get(
    `${ api.defaults.baseURL }/carts`,
    () => HttpResponse.json([...carts].reverse().map(toCartItem)),
  ),

  http.post(
    `${ api.defaults.baseURL }/carts`,
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
    `${ api.defaults.baseURL }/carts/:cartId`,
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
    `${ api.defaults.baseURL }/carts/:cartId`,
    ({ params }) => {
      const index = carts.findIndex((cart) => cart.cartId === Number(params.cartId))
      if (index === -1) {
        return cartError(404, 'CART_NOT_FOUND', '장바구니 항목을 찾을 수 없어요.')
      }

      carts.splice(index, 1)
      return new HttpResponse(null, { status: 204 })
    },
  ),

  http.post(
    `${ api.defaults.baseURL }/orders`,
    async ({ request }) => {
      const userId = getRequestUserId(request)
      if (!userId) {
        return unauthorized()
      }

      const body = await request.json()
      const error = validateOrderRequest(body)
      if (error) {
        return error
      }

      const cartIds = [...new Set(body.cartIds)]
      const orderedCarts = cartIds.map((cartId) => carts.find((cart) => cart.cartId === cartId))
      if (orderedCarts.includes(undefined)) {
        return cartError(404, 'CART_NOT_FOUND', '장바구니 항목을 찾을 수 없습니다.')
      }
      const unavailable = orderedCarts.find((cart) => !findOption(cart.optionId)?.option.available)
      if (unavailable) {
        return cartError(400, 'OPTION_NOT_AVAILABLE', '주문할 수 없는 상품 옵션이 포함되어 있습니다.')
      }

      const lastItemId = Math.max(0, ...orders.flatMap((order) => order.items.map((item) => item.orderItemId)))
      const order = {
        orderId: Math.max(0, ...orders.map((order) => order.orderId)) + 1,
        userId,
        orderNum: createOrderNum(),
        orderStatus: 'COMPLETED',
        recipientName: body.recipientName,
        recipientPhone: body.recipientPhone,
        shippingAddress: body.shippingAddress,
        createdAt: new Date().toISOString(),
        items: orderedCarts.map((cart, index) => {
          const { product, option } = findOption(cart.optionId)
          return {
            orderItemId: lastItemId + index + 1,
            optionId: cart.optionId,
            productId: product.productId,
            productName: product.productName,
            color: option.color,
            size: option.size,
            thumbnailUrl: product.thumbnailUrl,
            orderQty: cart.quantity,
            unitPrice: option.price,
          }
        }),
      }
      orders.push(order)
      orderedCarts.forEach((cart) => carts.splice(carts.indexOf(cart), 1))

      const { orderId, orderNum, orderStatus } = order
      return HttpResponse.json({ orderId, orderNum, totalPrice: getTotalPrice(order), orderStatus }, { status: 201 })
    },
  ),

  http.get(
    `${ api.defaults.baseURL }/orders`,
    ({ request }) => {
      const userId = getRequestUserId(request)
      if (!userId) {
        return unauthorized()
      }

      const query = new URL(request.url).searchParams
      const page = Number(query.get('page') ?? 0)
      const size = Number(query.get('size') ?? 10)
      const myOrders = orders.filter((order) => order.userId === userId)
      const content = myOrders
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.orderId - a.orderId)
      .slice(page * size, (page + 1) * size)
      .map((order) => ({
        orderId: order.orderId,
        orderNum: order.orderNum,
        totalPrice: getTotalPrice(order),
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
        itemCount: order.items.length,
        thumbnailUrl: order.items[0]?.thumbnailUrl ?? null,
      }))

      return HttpResponse.json({ content, page, totalPages: Math.ceil(myOrders.length / size) })
    },
  ),

  http.get(
    `${ api.defaults.baseURL }/orders/:orderId`,
    ({ params, request }) => {
      const userId = getRequestUserId(request)
      if (!userId) {
        return unauthorized()
      }

      const order = orders.find((order) => order.orderId === Number(params.orderId))
      if (!order) {
        return cartError(404, 'ORDER_NOT_FOUND', '주문을 찾을 수 없습니다.')
      }
      if (order.userId !== userId) {
        return cartError(403, 'ORDER_FORBIDDEN', '본인의 주문만 조회할 수 있습니다.')
      }

      return HttpResponse.json({
        orderId: order.orderId,
        orderNum: order.orderNum,
        orderStatus: order.orderStatus,
        recipient: { name: order.recipientName, phone: order.recipientPhone },
        shippingAddress: order.shippingAddress,
        items: order.items.map(toOrderItem),
        totalPrice: getTotalPrice(order),
      })
    },
  ),

  http.get(
    `${ api.defaults.baseURL }/surveys/me`,
    ({ request }) => {
      const userId = getRequestUserId(request)
      if (!userId) {
        return unauthorized()
      }

      const orderItemIds = (new URL(request.url).searchParams.get('orderItemIds') ?? '')
      .split(',')
      .filter(Boolean)
      .map(Number)
      if (orderItemIds.length === 0 || orderItemIds.length > 100) {
        return cartError(400, 'INVALID_REQUEST', '입력값을 확인해주세요.')
      }

      return HttpResponse.json(surveys
      .filter((survey) => survey.userId === userId && orderItemIds.includes(survey.orderItemId))
      .sort((a, b) => a.orderItemId - b.orderItemId)
      .map(toSurveyResponse))
    },
  ),

  http.post(
    `${ api.defaults.baseURL }/surveys`,
    async ({ request }) => {
      const userId = getRequestUserId(request)
      if (!userId) {
        return unauthorized()
      }

      const { orderItemId, sizeFeedback } = await request.json()
      if (!Number.isInteger(orderItemId) || orderItemId < 1 || !SIZE_FEEDBACKS.includes(sizeFeedback)) {
        return cartError(400, 'INVALID_REQUEST', '입력값을 확인해주세요.')
      }
      if (surveys.some((survey) => survey.userId === userId && survey.orderItemId === orderItemId)) {
        return cartError(409, 'DUPLICATE_SURVEY', '이미 설문을 작성한 주문 상품입니다.')
      }

      const order = orders.find((order) => order.items.some((item) => item.orderItemId === orderItemId))
      if (!order) {
        return cartError(404, 'ORDER_ITEM_NOT_FOUND', '주문 항목을 찾을 수 없습니다.')
      }
      if (order.userId !== userId) {
        return cartError(403, 'NOT_ORDER_OWNER', '내 주문만 리뷰·설문할 수 있습니다.')
      }
      if (order.orderStatus !== 'COMPLETED') {
        return cartError(409, 'ORDER_NOT_COMPLETED', '구매가 완료된 주문만 리뷰·설문할 수 있습니다.')
      }

      const surveyId = Math.max(0, ...surveys.map((survey) => survey.surveyId)) + 1
      surveys.push({ surveyId, userId, orderItemId, sizeFeedback })
      return HttpResponse.json({ surveyId }, { status: 201 })
    },
  ),

  http.get(
    `${ api.defaults.baseURL }/wishlists`,
    async ({ request }) => {
      const userId = getRequestUserId(request)
      if (!userId) {
        return unauthorized()
      }

      const url = new URL(request.url)
      const page = Number(url.searchParams.get('page') || 0)
      const size = Number(url.searchParams.get('size') || 20)

      const allWishedProducts = products.filter(product => product.wished)
      const start = page * size
      const end = start + size

      const content = allWishedProducts.slice(start, end).map((product, index) => ({
        wishlistId: product.productId,
        itemId: product.productId,
        brandName: product.brandName || '',
        name: product.productName || product.name || '',
        price: product.price,
        imageUrl: product.thumbnailUrl || '/src/assets/hero.png',
        categoryL1: product.categoryL1 || '001',
        createdAt: new Date(2026, 9, 1 + index).toISOString(),
      }))

      const hasNext = end < allWishedProducts.length

      return HttpResponse.json({
        content,
        page,
        size,
        totalElements: allWishedProducts.length,
        totalPages: Math.ceil(allWishedProducts.length / size),
        hasNext,
      })
    },
  ),

  http.post(
    `${ api.defaults.baseURL }/wishlists`,
    async ({ request }) => {
      const userId = getRequestUserId(request)
      if (!userId) {
        return unauthorized()
      }

      const { itemId } = await request.json()
      const target = products.find(p => p.productId === itemId)
      if (target) target.wished = true

      return HttpResponse.json({ wishlistId: itemId })
    },
  ),

  http.delete(
    `${ api.defaults.baseURL }/wishlists`,
    async ({ request }) => {
      const userId = getRequestUserId(request)
      if (!userId) {
        return unauthorized()
      }

      const url = new URL(request.url)
      const itemIdParam = url.searchParams.get('itemId')
      const itemId = itemIdParam ? Number(itemIdParam) : null

      if (itemId) {
        const target = products.find(p => p.productId === itemId)
        if (target) target.wished = false
      }

      return new HttpResponse(null, { status: 204 })
    },
  ),

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

  http.get(
    `${ api.defaults.baseURL }/likes`,
    () => {
      return HttpResponse.json(likes)
    },
  ),

  ...communityHandlers,

  http.post(
    `${ api.defaults.baseURL }/recommendations`,
    async ({ request }) => {
      const { query } = await request.json()

      if (!query?.trim()) {
        return new HttpResponse(null, { status: 400 })
      }

      return HttpResponse.json({ requestId: ++lastRecommendationId, status: 'PROCESSING' }, { status: 202 })
    },
  ),

  http.get(
    `${ api.defaults.baseURL }/recommendations`,
    ({ request }) => {
      const page = Number(new URL(request.url).searchParams.get('page') ?? 0)

      return HttpResponse.json({
        content: page === 0 ? recommendationHistory : [],
        page,
        totalPages: 1,
      })
    },
  ),

  http.get(
    `${ api.defaults.baseURL }/recommendations/:requestId`,
    ({ params }) => {
      return HttpResponse.json({ requestId: params.requestId, ...recommendations })
    },
  ),

  http.delete(
    `${ api.defaults.baseURL }/recommendation/:requestId`,
    ({ params }) => {
      const index = recommendationHistory.findIndex((item) => item.requestId === params.requestId)

      if (index === -1) {
        return HttpResponse.json({ message: '대화 내역을 찾을 수 없습니다.' }, { status: 404 })
      }

      recommendationHistory.splice(index, 1)

      return new HttpResponse(null, { status: 204 })
    },
  ),

  http.get(
    `${ api.defaults.baseURL }/notifications`,
    ({ request }) => {
      const size = Number(new URL(request.url).searchParams.get('size') ?? 20)
      return HttpResponse.json({ content: notifications.slice(0, size), page: 0, totalPages: Math.ceil(notifications.length / size) })
    },
  ),

  http.patch(
    `${ api.defaults.baseURL }/notifications/:notificationId`,
    ({ params }) => {
      const notification = notifications.find((notification) => notification.notificationId === Number(params.notificationId))
      if (!notification) return new HttpResponse(null, { status: 404 })
      notification.isRead = true
      return new HttpResponse(null, { status: 200 })
    },
  ),

  http.get(
    `${ api.defaults.baseURL }/recommendations/:requestId/messages`,
    () => {
      return HttpResponse.json(recommendationMessages)
    },
  ),

  http.post(
    `${ api.defaults.baseURL }/worldcups`,
    async ({ request }) => {
      const userId = getRequestUserId(request)
      if (!userId) {
        return unauthorized()
      }

      const body = await request.json()
      const { winnerProductId } = body

      const targetProduct = products.find(p => p.productId === winnerProductId) || {
        productId: winnerProductId,
        brandName: '',
        productName: '상품',
        price: 0,
        thumbnailUrl: '/src/assets/hero.png',
      }

      const newHistory = {
        worldcupHistoryId: Date.now(),
        winnerProduct: {
          productId: targetProduct.productId,
          brandName: targetProduct.brandName || '',
          productName: targetProduct.productName || targetProduct.name || '',
          price: targetProduct.price || 0,
          imageUrl: targetProduct.thumbnailUrl || targetProduct.imageUrl || '/src/assets/hero.png',
          status: 'ON_SALE',
        },
        completedAt: new Date().toISOString(),
      }

      worldcupHistories.unshift(newHistory)

      return HttpResponse.json(newHistory, { status: 201 })
    },
  ),

  http.get(
    `${ api.defaults.baseURL }/worldcups/history`,
    ({ request }) => {
      const userId = getRequestUserId(request)
      if (!userId) {
        return unauthorized()
      }

      const url = new URL(request.url)
      const page = Number(url.searchParams.get('page') || 0)
      const size = Number(url.searchParams.get('size') || 20)

      return HttpResponse.json({
        content: worldcupHistories,
        page: page,
        size: size,
        totalElements: worldcupHistories.length,
        totalPages: Math.ceil(worldcupHistories.length / size) || 1,
        hasNext: false,
      })
    },
  ),

  http.get(
    `${ api.defaults.baseURL }/worldcups/:historyId`,
    ({ params }) => {
      const history = worldcupHistories.find(
        h => h.worldcupHistoryId === Number(params.historyId)
      )

      if (!history) {
        return new HttpResponse(null, { status: 404 })
      }

      return HttpResponse.json(history)
    },
  ),
]