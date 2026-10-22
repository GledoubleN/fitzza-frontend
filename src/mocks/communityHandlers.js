import { http, HttpResponse } from 'msw/http'
import postsData from '../data/posts.json'
import commentsData from '../data/comments.json'

const BASE_URL = 'http://localhost:8080/api/v1'
const ME = { userId: 1, nickname: '핏짜' }
const VOTE_DURATION_MS = 7 * 24 * 60 * 60 * 1000
const COMMENT_MAX_LENGTH = 500
const DELETED_COMMENT = '삭제된 댓글입니다'

const posts = structuredClone(postsData)
const comments = structuredClone(commentsData)
const postLikes = new Map(posts.map((post) => [post.postId, post.liked]))
const commentLikes = new Map(comments.map((comment) => [comment.commentId, comment.liked]))

const error = (status, code, message) => HttpResponse.json({ status, code, message }, { status })

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

const toDetail = (post) => ({
  postId: post.postId,
  title: post.title,
  content: post.content,
  category: post.category,
  postType: post.postType,
  author: post.author,
  shared: post.shared,
  likeCount: post.likeCount,
  liked: postLikes.get(post.postId) ?? false,
  commentCount: countComments(post.postId),
  viewCount: post.viewCount,
  createdAt: post.createdAt,
  updatedAt: post.updatedAt,
  voteEndAt: post.voteEndAt,
  voteClosed: post.postType === 'VOTE' && isVoteClosed(post),
  voteOptions: post.voteOptions.map(({ count, ...option }) => option),
})

const toPoll = (post) => {
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
    myVoteOptionId: post.myVoteOptionId ?? null,
  }
}

const toCommentTree = (postId, supportedOptionId) => {
  const toResponse = ({ postId, parentCommentId, ...comment }) => ({
    ...comment,
    liked: commentLikes.get(comment.commentId) ?? false,
    replies: [],
  })
  const roots = comments
    .filter((comment) => comment.postId === postId && comment.parentCommentId === null)
    .filter((comment) => !supportedOptionId || comment.supportedOptionId === supportedOptionId)
    .map(toResponse)

  roots.forEach((root) => {
    root.replies = comments
      .filter((comment) => comment.parentCommentId === root.commentId)
      .map(toResponse)
  })

  return roots
}

const validateComment = (content) => {
  if (!content?.trim()) {
    return error(400, 'INVALID_INPUT', '댓글 내용을 입력해주세요.')
  }
  if (content.length > COMMENT_MAX_LENGTH) {
    return error(400, 'INVALID_INPUT', '댓글은 500자 이하로 입력해주세요.')
  }
  return null
}

const toVoteOptions = (options, startId) => options.map((option, index) => ({
  voteOptionId: startId + index,
  label: 'ABCD'[index],
  source: option.source,
  itemType: option.itemType,
  itemId: option.itemId ?? null,
  imageUrl: option.imageUrl,
  name: option.name ?? null,
  price: option.price ?? null,
  count: 0,
}))

const nextVoteOptionId = () => Math.max(0, ...posts.flatMap((post) => post.voteOptions.map((option) => option.voteOptionId))) + 1

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
    const body = await request.json()

    if (!body.title?.trim() || !body.content?.trim() || !body.category) {
      return error(400, 'INVALID_INPUT', '제목, 내용, 분류를 확인해주세요.')
    }

    const isVote = body.postType === 'VOTE'
    if (isVote && !(body.options?.length >= 2 && body.options.length <= 4)) {
      return error(400, 'INVALID_INPUT', '투표 선택지는 2~4개여야 합니다.')
    }

    const now = new Date()
    const post = {
      postId: nextId(posts, 'postId'),
      title: body.title,
      content: body.content,
      category: body.category,
      postType: isVote ? 'VOTE' : 'NORMAL',
      author: ME,
      imageUrl: body.imageUrl ?? null,
      shared: body.sharedType ? { type: body.sharedType, id: body.sharedId, snapshot: null, items: [] } : null,
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

  http.get(`${ BASE_URL }/community/posts/:postId`, ({ params }) => {
    const post = findPost(params.postId)
    if (!post) {
      return error(404, 'POST_NOT_FOUND', '게시글을 찾을 수 없습니다.')
    }

    post.viewCount += 1

    return HttpResponse.json(toDetail(post))
  }),

  http.patch(`${ BASE_URL }/community/posts/:postId`, async ({ params, request }) => {
    const post = findPost(params.postId)
    if (!post) {
      return error(404, 'POST_NOT_FOUND', '게시글을 찾을 수 없습니다.')
    }
    if (post.author.userId !== ME.userId) {
      return error(403, 'FORBIDDEN', '작성자만 수정할 수 있습니다.')
    }

    const { options, ...fields } = await request.json()
    if (options) {
      if (post.voteOptions.some((option) => option.count > 0)) {
        return error(409, 'VOTE_ALREADY_STARTED', '투표 참여가 있어 선택지를 수정할 수 없습니다.')
      }
      post.voteOptions = toVoteOptions(options, nextVoteOptionId())
    }
    Object.assign(post, fields, { updatedAt: new Date().toISOString() })

    return new HttpResponse(null, { status: 200 })
  }),

  http.delete(`${ BASE_URL }/community/posts/:postId`, ({ params }) => {
    const post = findPost(params.postId)
    if (!post) {
      return error(404, 'POST_NOT_FOUND', '게시글을 찾을 수 없습니다.')
    }
    if (post.author.userId !== ME.userId) {
      return error(403, 'FORBIDDEN', '작성자만 삭제할 수 있습니다.')
    }

    post.deleted = true

    return new HttpResponse(null, { status: 204 })
  }),

  http.post(`${ BASE_URL }/community/posts/:postId/likes`, ({ params }) => {
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

  http.delete(`${ BASE_URL }/community/posts/:postId/likes`, ({ params }) => {
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

  http.get(`${ BASE_URL }/community/posts/:postId/poll`, ({ params }) => {
    const post = findPost(params.postId)
    if (!post) {
      return error(404, 'POST_NOT_FOUND', '게시글을 찾을 수 없습니다.')
    }
    if (post.postType !== 'VOTE') {
      return error(400, 'NOT_VOTE_POST', '투표 게시글이 아닙니다.')
    }

    return HttpResponse.json(toPoll(post))
  }),

  http.post(`${ BASE_URL }/community/posts/:postId/poll/votes`, async ({ params, request }) => {
    const post = findPost(params.postId)
    if (!post) {
      return error(404, 'POST_NOT_FOUND', '게시글을 찾을 수 없습니다.')
    }
    if (post.postType !== 'VOTE') {
      return error(400, 'NOT_VOTE_POST', '투표 게시글이 아닙니다.')
    }
    if (isVoteClosed(post)) {
      return error(409, 'VOTE_CLOSED', '마감된 투표입니다.')
    }
    if (post.myVoteOptionId) {
      return HttpResponse.json({ voteOptionId: post.myVoteOptionId })
    }

    const { voteOptionId } = await request.json()
    const option = post.voteOptions.find((option) => option.voteOptionId === voteOptionId)
    if (!option) {
      return error(400, 'INVALID_INPUT', '투표 선택지를 확인해주세요.')
    }

    option.count += 1
    post.myVoteOptionId = voteOptionId

    return HttpResponse.json({ voteOptionId })
  }),

  http.patch(`${ BASE_URL }/community/posts/:postId/poll`, ({ params }) => {
    const post = findPost(params.postId)
    if (!post) {
      return error(404, 'POST_NOT_FOUND', '게시글을 찾을 수 없습니다.')
    }
    if (post.author.userId !== ME.userId) {
      return error(403, 'FORBIDDEN', '작성자만 투표를 종료할 수 있습니다.')
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

    return HttpResponse.json(toCommentTree(post.postId, supportedOptionId))
  }),

  http.post(`${ BASE_URL }/community/posts/:postId/comments`, async ({ params, request }) => {
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
      return error(400, 'INVALID_INPUT', '답글은 1단계까지만 작성할 수 있습니다.')
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
    const comment = findComment(params.commentId)
    if (!comment || comment.isDeleted) {
      return error(404, 'COMMENT_NOT_FOUND', '댓글을 찾을 수 없습니다.')
    }
    if (comment.author.userId !== ME.userId) {
      return error(403, 'FORBIDDEN', '작성자만 수정할 수 있습니다.')
    }

    const { content } = await request.json()
    const invalid = validateComment(content)
    if (invalid) {
      return invalid
    }

    comment.content = content.trim()

    return new HttpResponse(null, { status: 200 })
  }),

  http.delete(`${ BASE_URL }/comments/:commentId`, ({ params }) => {
    const comment = findComment(params.commentId)
    if (!comment || comment.isDeleted) {
      return error(404, 'COMMENT_NOT_FOUND', '댓글을 찾을 수 없습니다.')
    }
    if (comment.author.userId !== ME.userId) {
      return error(403, 'FORBIDDEN', '작성자만 삭제할 수 있습니다.')
    }

    comment.isDeleted = true
    comment.content = DELETED_COMMENT

    return new HttpResponse(null, { status: 204 })
  }),

  http.post(`${ BASE_URL }/comments/:commentId/likes`, ({ params }) => {
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

  http.delete(`${ BASE_URL }/comments/:commentId/likes`, ({ params }) => {
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
