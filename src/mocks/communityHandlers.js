import { api } from '../api/axios.js'
import { http, HttpResponse } from 'msw/http'
import postsData from '../data/posts.json'
import commentsData from '../data/comments.json'
import products from '../data/products.json'
import recommendations from '../data/recommendations.json'
import worldcupHistories from '../data/worldcup-history.json'

const BASE_URL = api.defaults.baseURL
const ME = { userId: 1, nickname: '핏짜' }
const VOTE_DURATION_MS = 6 * 60 * 60 * 1000
const COMMENT_MAX_LENGTH = 500
const DELETED_COMMENT = '삭제된 댓글입니다'

const posts = structuredClone(postsData)
const comments = structuredClone(commentsData)
const postLikes = new Map(posts.map((post) => [post.postId, post.liked]))
const commentLikes = new Map(comments.map((comment) => [comment.commentId, comment.liked]))

const error = (status, code, message) => HttpResponse.json({ status, code, message }, { status })

const UNAUTHENTICATED = () => error(401, 'UNAUTHENTICATED', '로그인이 필요합니다.')
const NOT_AUTHOR = () => error(403, 'NOT_AUTHOR', '작성자만 할 수 있습니다.')
const isSignedOut = (request) => !request.headers.get('Authorization')

const findProduct = (productId) => products.find((product) => product.productId === Number(productId))
const findCombo = (comboId) => recommendations.combos.find((combo) => String(combo.comboId) === String(comboId))

const toProductSnapshot = (product) => ({
  productId: product.productId,
  brandName: product.brandName,
  productName: product.productName,
  price: product.price,
  imageUrl: product.thumbnailUrl,
  summary: null,
})

const toSharedItem = ({ productId, productName, price, imageUrl }) => ({ productId, productName, price, imageUrl })

const toShared = (sharedType, sharedId) => {
  if (sharedType === 'COMBO') {
    const combo = findCombo(sharedId)
    return {
      type: sharedType,
      id: sharedId,
      snapshot: {
        productId: null,
        brandName: null,
        productName: null,
        price: combo?.totalPrice ?? null,
        imageUrl: combo?.items[0]?.imageUrl ?? null,
        summary: combo?.feedbackSummary ?? null,
      },
      items: (combo?.items ?? []).map(toSharedItem),
    }
  }
  if (sharedType === 'FITTING') {
    return {
      type: sharedType,
      id: sharedId,
      snapshot: {
        productId: null,
        brandName: null,
        productName: null,
        price: null,
        imageUrl: '/product-image.png',
        summary: null,
      },
      items: [],
    }
  }

  if (sharedType === 'WORLDCUP') {
    const winner = worldcupHistories.find((history) => history.worldcupHistoryId === Number(sharedId))?.winnerProduct
    return {
      type: sharedType,
      id: sharedId,
      snapshot: winner
        ? {
          productId: winner.productId,
          brandName: winner.brandName,
          productName: winner.productName,
          price: winner.price,
          imageUrl: winner.imageUrl,
          summary: null,
        }
        : null,
      items: [],
    }
  }

  const product = findProduct(sharedId)
  return { type: sharedType, id: sharedId, snapshot: product ? toProductSnapshot(product) : null, items: [] }
}

const findPost = (postId) => posts.find((post) => post.postId === Number(postId) && !post.deleted)
const findComment = (commentId) => comments.find((comment) => comment.commentId === Number(commentId))
const nextId = (items, key) => Math.max(0, ...items.map((item) => item[key])) + 1
const isVoteClosed = (post) => post.voteClosed || Date.parse(post.voteEndAt) <= Date.now()
const countComments = (postId) => comments.filter((comment) => comment.postId === postId && !comment.isDeleted).length

const toSummary = (post) => ({
  postId: post.postId,
  title: post.title,
  category: post.category,
  postType: post.postType,
  nickname: post.author.nickname,
  createdAt: post.createdAt,
  thumbnailUrl: post.imageUrl ?? post.voteOptions[0]?.imageUrl ?? post.shared?.items?.[0]?.imageUrl ?? null,
  likeCount: post.likeCount,
  commentCount: countComments(post.postId),
})

const toDetail = (post, signedIn) => ({
  postId: post.postId,
  title: post.title,
  content: post.content,
  category: post.category,
  postType: post.postType,
  author: post.author,
  shared: post.shared,
  likeCount: post.likeCount,
  liked: signedIn && (postLikes.get(post.postId) ?? false),
  commentCount: countComments(post.postId),
  viewCount: post.viewCount,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
  voteEndAt: post.voteEndAt,
  voteClosed: post.postType === 'VOTE' && isVoteClosed(post),
  voteOptions: post.voteOptions.map(({ count, ...option }) => option),
})

const toPoll = (post, signedIn) => {
  const total = post.voteOptions.reduce((sum, option) => sum + option.count, 0)

  return {
    options: post.voteOptions.map((option) => ({
      voteOptionId: option.voteOptionId,
      label: option.label,
      count: option.count,
      ratio: total === 0 ? 0 : option.count / total,
      supportCommentCount: comments.filter((comment) =>
        comment.supportedOptionId === option.voteOptionId && !comment.isDeleted).length,
    })),
    total,
    voteEndAt: post.voteEndAt,
    closed: isVoteClosed(post),
    myVoteOptionId: signedIn ? post.myVoteOptionId ?? null : null,
  }
}

const toCommentTree = (postId, supportedOptionId, signedIn) => {
  const toResponse = ({ postId, parentCommentId, ...comment }) => ({
    ...comment,
    liked: signedIn && (commentLikes.get(comment.commentId) ?? false),
    replies: [],
  })
  if (supportedOptionId) {
    return comments
      .filter((comment) => comment.postId === postId && !comment.isDeleted)
      .filter((comment) => comment.supportedOptionId === supportedOptionId)
      .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
      .map(toResponse)
  }

  const toDeletedResponse = (comment, replies) => ({
    commentId: comment.commentId,
    content: DELETED_COMMENT,
    author: null,
    likeCount: 0,
    liked: false,
    isDeleted: true,
    supportedOptionId: null,
    createdAt: comment.createdAt,
    replies,
  })
  const activeReplies = (rootId) => comments
    .filter((comment) => comment.parentCommentId === rootId && !comment.isDeleted)
    .map(toResponse)

  return comments
    .filter((comment) => comment.postId === postId && comment.parentCommentId === null)
    .map((root) => ({ root, replies: activeReplies(root.commentId) }))
    .filter(({ root, replies }) => !root.isDeleted || replies.length > 0)
    .map(({ root, replies }) => root.isDeleted ? toDeletedResponse(root, replies) : { ...toResponse(root), replies })
}

const validateComment = (content) => {
  if (!content?.trim()) {
    return error(400, 'INVALID_REQUEST', '댓글 내용을 입력해주세요.')
  }
  if (content.length > COMMENT_MAX_LENGTH) {
    return error(400, 'INVALID_REQUEST', '댓글은 500자 이하로 입력해주세요.')
  }
  return null
}

const toVoteOptions = (options, startId) => options.map((option, index) => {
  const product = option.itemType === 'PRODUCT' ? findProduct(option.itemId) : null
  const combo = option.itemType === 'COMBO' ? findCombo(option.itemId) : null

  return {
    voteOptionId: startId + index,
    label: 'ABCD'[index],
    source: option.source,
    itemType: option.itemType,
    itemId: option.itemId ?? null,
    imageUrl: product?.thumbnailUrl || combo?.items[0]?.imageUrl || option.imageUrl,
    name: product?.productName ?? null,
    price: product?.price ?? combo?.totalPrice ?? null,
    count: 0,
  }
})

const isValidVoteOptions = (options) => Array.isArray(options)
  && options.length >= 2
  && options.length <= 4
  && options.every((option) => option?.source && option.itemType && option.itemId > 0 && option.imageUrl?.trim())

const nextVoteOptionId = () => Math.max(
  0,
  ...posts.flatMap((post) => post.voteOptions.map((option) => option.voteOptionId)),
) + 1

export const communityHandlers = [
  http.get(`${ BASE_URL }/community/posts`, ({ request }) => {
    const params = new URL(request.url).searchParams
    const category = params.get('category')
    const postType = params.get('postType')
    const keyword = params.get('keyword')?.trim()
    const page = Number(params.get('page') ?? 0)
    const size = Number(params.get('size') ?? 20)

    const filtered = posts
      .filter((post) => !post.deleted)
      .filter((post) => !category || post.category === category)
      .filter((post) => !postType || post.postType === postType)
      .filter((post) => !keyword || post.title.includes(keyword) || post.content.includes(keyword))
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
    const totalPages = Math.ceil(filtered.length / size)

    return HttpResponse.json({
      content: filtered.slice(page * size, (page + 1) * size).map(toSummary),
      page,
      size,
      totalElements: filtered.length,
      totalPages,
      hasNext: page + 1 < totalPages,
    })
  }),

  http.post(`${ BASE_URL }/community/posts`, async ({ request }) => {
    if (isSignedOut(request)) {
      return UNAUTHENTICATED()
    }

    const body = await request.json()

    if (!body.title?.trim() || !body.content?.trim() || !body.category) {
      return error(400, 'INVALID_REQUEST', '입력값을 확인해주세요.')
    }

    const isVote = body.postType === 'VOTE'
    if (isVote ? !isValidVoteOptions(body.options) : body.options) {
      return error(400, 'INVALID_VOTE_OPTIONS', '투표 선택지를 확인해주세요.')
    }
    if (isVote && body.sharedType) {
      return error(400, 'INVALID_REQUEST', '투표 글은 공유 글로 쓸 수 없습니다.')
    }

    const now = new Date()
    const post = {
      postId: nextId(posts, 'postId'),
      title: body.title,
      content: body.content,
      category: body.category,
      postType: isVote ? 'VOTE' : 'NORMAL',
      author: ME,
      imageUrl: null,
      shared: body.sharedType ? toShared(body.sharedType, body.sharedId) : null,
      likeCount: 0,
      viewCount: 0,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      voteEndAt: isVote ? new Date(now.getTime() + VOTE_DURATION_MS).toISOString() : null,
      voteClosed: false,
      voteOptions: isVote ? toVoteOptions(body.options, nextVoteOptionId()) : [],
      myVoteOptionId: null,
    }
    posts.push(post)

    return HttpResponse.json({ postId: post.postId }, { status: 201 })
  }),

  http.get(`${ BASE_URL }/community/posts/:postId`, ({ params, request }) => {
    const post = findPost(params.postId)
    if (!post) {
      return error(404, 'POST_NOT_FOUND', '게시글을 찾을 수 없습니다.')
    }

    post.viewCount += 1

    return HttpResponse.json(toDetail(post, !isSignedOut(request)))
  }),

  http.patch(`${ BASE_URL }/community/posts/:postId`, async ({ params, request }) => {
    if (isSignedOut(request)) {
      return UNAUTHENTICATED()
    }

    const post = findPost(params.postId)
    if (!post) {
      return error(404, 'POST_NOT_FOUND', '게시글을 찾을 수 없습니다.')
    }
    if (post.author.userId !== ME.userId) {
      return NOT_AUTHOR()
    }

    const { title, content, category, options } = await request.json()
    if (options !== undefined && (post.postType !== 'VOTE' || !isValidVoteOptions(options))) {
      return error(400, 'INVALID_VOTE_OPTIONS', '투표 선택지를 확인해주세요.')
    }
    if (options) {
      if (post.voteOptions.some((option) => option.count > 0)) {
        return error(409, 'VOTE_OPTIONS_LOCKED', '투표가 시작된 글은 선택지를 바꿀 수 없습니다.')
      }
      post.voteOptions = toVoteOptions(options, nextVoteOptionId())
    }
    Object.assign(post, {
      title: title ?? post.title,
      content: content ?? post.content,
      category: category ?? post.category,
      updatedAt: new Date().toISOString(),
    })

    return new HttpResponse(null, { status: 200 })
  }),

  http.delete(`${ BASE_URL }/community/posts/:postId`, ({ params, request }) => {
    if (isSignedOut(request)) {
      return UNAUTHENTICATED()
    }

    const post = findPost(params.postId)
    if (!post) {
      return error(404, 'POST_NOT_FOUND', '게시글을 찾을 수 없습니다.')
    }
    if (post.author.userId !== ME.userId) {
      return NOT_AUTHOR()
    }

    post.deleted = true

    return new HttpResponse(null, { status: 204 })
  }),

  http.post(`${ BASE_URL }/community/posts/:postId/likes`, ({ params, request }) => {
    if (isSignedOut(request)) {
      return UNAUTHENTICATED()
    }

    const post = findPost(params.postId)
    if (!post) {
      return error(404, 'POST_NOT_FOUND', '게시글을 찾을 수 없습니다.')
    }
    if (!postLikes.get(post.postId)) {
      postLikes.set(post.postId, true)
      post.likeCount += 1
    }

    return HttpResponse.json({ likeCount: post.likeCount })
  }),

  http.delete(`${ BASE_URL }/community/posts/:postId/likes`, ({ params, request }) => {
    if (isSignedOut(request)) {
      return UNAUTHENTICATED()
    }

    const post = findPost(params.postId)
    if (!post) {
      return error(404, 'POST_NOT_FOUND', '게시글을 찾을 수 없습니다.')
    }
    if (postLikes.get(post.postId)) {
      postLikes.set(post.postId, false)
      post.likeCount -= 1
    }

    return HttpResponse.json({ likeCount: post.likeCount })
  }),

  http.get(`${ BASE_URL }/community/posts/:postId/poll`, ({ params, request }) => {
    const post = findPost(params.postId)
    if (!post) {
      return error(404, 'POST_NOT_FOUND', '게시글을 찾을 수 없습니다.')
    }
    if (post.postType !== 'VOTE') {
      return error(400, 'NOT_VOTE_POST', '투표 게시글이 아닙니다.')
    }

    return HttpResponse.json(toPoll(post, !isSignedOut(request)))
  }),

  http.post(`${ BASE_URL }/community/posts/:postId/poll/votes`, async ({ params, request }) => {
    if (isSignedOut(request)) {
      return UNAUTHENTICATED()
    }

    const post = findPost(params.postId)
    if (!post) {
      return error(404, 'POST_NOT_FOUND', '게시글을 찾을 수 없습니다.')
    }
    if (post.postType !== 'VOTE') {
      return error(400, 'NOT_VOTE_POST', '투표 게시글이 아닙니다.')
    }
    if (post.myVoteOptionId) {
      return HttpResponse.json({ voteOptionId: post.myVoteOptionId })
    }
    if (isVoteClosed(post)) {
      return error(409, 'VOTE_CLOSED', '마감된 투표입니다.')
    }

    const { voteOptionId } = await request.json()
    const option = post.voteOptions.find((option) => option.voteOptionId === voteOptionId)
    if (!option) {
      return error(400, 'INVALID_VOTE_OPTION', '이 게시글의 선택지가 아닙니다.')
    }

    option.count += 1
    post.myVoteOptionId = voteOptionId

    return HttpResponse.json({ voteOptionId })
  }),

  http.patch(`${ BASE_URL }/community/posts/:postId/poll`, async ({ params, request }) => {
    if (isSignedOut(request)) {
      return UNAUTHENTICATED()
    }

    const post = findPost(params.postId)
    if (!post) {
      return error(404, 'POST_NOT_FOUND', '게시글을 찾을 수 없습니다.')
    }
    if (post.postType !== 'VOTE') {
      return error(400, 'NOT_VOTE_POST', '투표 게시글이 아닙니다.')
    }
    if (post.author.userId !== ME.userId) {
      return NOT_AUTHOR()
    }
    if ((await request.json()).closed !== true) {
      return error(400, 'INVALID_REQUEST', '종료된 투표는 다시 열 수 없어요.')
    }

    post.voteClosed = true

    return HttpResponse.json({ closed: true })
  }),

  http.get(`${ BASE_URL }/community/posts/:postId/comments`, ({ params, request }) => {
    const post = findPost(params.postId)
    if (!post) {
      return error(404, 'POST_NOT_FOUND', '게시글을 찾을 수 없습니다.')
    }

    const supportedOptionId = Number(new URL(request.url).searchParams.get('supportedOptionId')) || null

    return HttpResponse.json(toCommentTree(post.postId, supportedOptionId, !isSignedOut(request)))
  }),

  http.post(`${ BASE_URL }/community/posts/:postId/comments`, async ({ params, request }) => {
    if (isSignedOut(request)) {
      return UNAUTHENTICATED()
    }

    const post = findPost(params.postId)
    if (!post) {
      return error(404, 'POST_NOT_FOUND', '게시글을 찾을 수 없습니다.')
    }

    const { content, parentCommentId = null } = await request.json()
    const invalid = validateComment(content)
    if (invalid) {
      return invalid
    }

    const parent = parentCommentId && findComment(parentCommentId)
    if (parentCommentId && (!parent || parent.parentCommentId !== null)) {
      return error(400, 'INVALID_PARENT_COMMENT', '답글을 달 수 없는 댓글입니다.')
    }

    const comment = {
      commentId: nextId(comments, 'commentId'),
      postId: post.postId,
      parentCommentId,
      content: content.trim(),
      author: ME,
      likeCount: 0,
      liked: false,
      isDeleted: false,
      supportedOptionId: null,
      createdAt: new Date().toISOString(),
    }
    comments.push(comment)

    return HttpResponse.json({ commentId: comment.commentId }, { status: 201 })
  }),

  http.patch(`${ BASE_URL }/comments/:commentId`, async ({ params, request }) => {
    if (isSignedOut(request)) {
      return UNAUTHENTICATED()
    }

    const comment = findComment(params.commentId)
    if (!comment || comment.isDeleted) {
      return error(404, 'COMMENT_NOT_FOUND', '댓글을 찾을 수 없습니다.')
    }
    if (comment.author.userId !== ME.userId) {
      return NOT_AUTHOR()
    }

    const { content } = await request.json()
    const invalid = validateComment(content)
    if (invalid) {
      return invalid
    }

    comment.content = content.trim()

    return new HttpResponse(null, { status: 200 })
  }),

  http.delete(`${ BASE_URL }/comments/:commentId`, ({ params, request }) => {
    if (isSignedOut(request)) {
      return UNAUTHENTICATED()
    }

    const comment = findComment(params.commentId)
    if (!comment || comment.isDeleted) {
      return error(404, 'COMMENT_NOT_FOUND', '댓글을 찾을 수 없습니다.')
    }
    if (comment.author.userId !== ME.userId) {
      return NOT_AUTHOR()
    }

    comment.isDeleted = true
    comment.content = DELETED_COMMENT

    return new HttpResponse(null, { status: 204 })
  }),

  http.post(`${ BASE_URL }/comments/:commentId/likes`, ({ params, request }) => {
    if (isSignedOut(request)) {
      return UNAUTHENTICATED()
    }

    const comment = findComment(params.commentId)
    if (!comment) {
      return error(404, 'COMMENT_NOT_FOUND', '댓글을 찾을 수 없습니다.')
    }
    if (!commentLikes.get(comment.commentId)) {
      commentLikes.set(comment.commentId, true)
      comment.likeCount += 1
    }

    return HttpResponse.json({ likeCount: comment.likeCount })
  }),

  http.delete(`${ BASE_URL }/comments/:commentId/likes`, ({ params, request }) => {
    if (isSignedOut(request)) {
      return UNAUTHENTICATED()
    }

    const comment = findComment(params.commentId)
    if (!comment) {
      return error(404, 'COMMENT_NOT_FOUND', '댓글을 찾을 수 없습니다.')
    }
    if (commentLikes.get(comment.commentId)) {
      commentLikes.set(comment.commentId, false)
      comment.likeCount -= 1
    }

    return HttpResponse.json({ likeCount: comment.likeCount })
  }),
]
