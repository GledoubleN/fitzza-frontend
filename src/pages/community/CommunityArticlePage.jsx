import { useNavigate, useParams } from 'react-router-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  HStack,
  IconButton,
  Image,
  Input,
  Menu,
  Portal,
  Separator,
  Stack,
  Text,
} from '@chakra-ui/react'
import { LuEllipsisVertical, LuMessageCircle, LuThumbsUp } from 'react-icons/lu'
import { Header } from '../../components/Header.jsx'
import { ScrollToTopButton } from '../../components/ScrollToTopButton.jsx'
import { SignInRequiredDialog } from '../../components/SignInRequiredDialog.jsx'
import { toaster } from '../../components/ui/toaster.jsx'
import { useAuth } from '../../contexts/AuthContext.js'
import { api } from '../../api/axios.js'
import { CommunityArticleCommentList } from './CommunityArticleCommentList.jsx'
import { CommunityPoll } from './CommunityPoll.jsx'
import { ProductImage } from '../../components/ProductImage.jsx'
import { CATEGORY_LABELS, displayNickname, errorMessage, formatRelativeTime } from './communityFormat.js'
import { CommunityTitleBar } from './CommunityTitleBar.jsx'
import { CommunityConfirmDialog } from './CommunityConfirmDialog.jsx'
import { NOTIFICATION_RECEIVED_EVENT } from '../../hooks/useNotifications.js'

const COMMENT_MAX_LENGTH = 500

const DELETE_TITLES = {
  post: '게시글을 삭제할까요?',
  comment: '댓글을 삭제할까요?',
}

const SHARED_TITLES = {
  WORLDCUP: '월드컵 우승 상품',
  COMBO: '공유한 코디',
  FITTING: '공유한 가상 피팅',
  PRODUCT: '공유한 상품',
}

export const CommunityArticlePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isSignedIn } = useAuth()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [myNickname, setMyNickname] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [comment, setComment] = useState('')
  const [commentsFailed, setCommentsFailed] = useState(false)
  const [signInOpen, setSignInOpen] = useState(false)
  const savingComment = useRef(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [supportFilter, setSupportFilter] = useState(null)
  const latestCommentsRequest = useRef(0)

  const loadComments = useCallback((supportedOptionId = supportFilter) => {
    const request = ++latestCommentsRequest.current
    const isLatest = () => request === latestCommentsRequest.current

    return api
      .get(`/community/posts/${ id }/comments`, { params: { supportedOptionId: supportedOptionId ?? undefined } })
      .then((response) => {
        if (!isLatest()) {
          return
        }
        setComments(response.data)
        setCommentsFailed(false)
      })
      .catch((error) => {
        if (isLatest()) {
          throw error
        }
      })
  }, [id, supportFilter])

  useEffect(() => {
    let ignore = false

    setLoading(true)
    setError('')
    api.get(`/community/posts/${ id }`)
      .then((response) => {
        if (!ignore) setPost(response.data)
      })
      .catch((error) => {
        if (ignore) return
        setError(error.response?.status === 404
          ? '삭제되었거나 없는 게시글이에요.'
          : errorMessage(error, '게시글을 불러오지 못했어요.'))
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    setComments([])
    setCommentsFailed(false)
    setSupportFilter(null)
    loadComments(null).catch(() => setCommentsFailed(true))

    return () => {
      ignore = true
    }
  }, [id])

  useEffect(() => {
    const handleNotification = (event) => {
      const { type, targetId } = event.detail ?? {}
      if (type !== 'COMMENT' || String(targetId) !== id) return

      loadComments().catch(() => setCommentsFailed(true))
    }

    window.addEventListener(NOTIFICATION_RECEIVED_EVENT, handleNotification)
    return () => window.removeEventListener(NOTIFICATION_RECEIVED_EVENT, handleNotification)
  }, [id, loadComments])

  const selectSupportFilter = (voteOptionId) => {
    setSupportFilter(voteOptionId)
    loadComments(voteOptionId).catch(() => setCommentsFailed(true))
  }

  useEffect(() => {
    if (!isSignedIn) {
      setMyNickname(null)
      return
    }

    api.get('/users/me')
      .then((response) => setMyNickname(response.data.nickname))
      .catch(() => setMyNickname(null))
  }, [isSignedIn])

  const requireSignIn = () => setSignInOpen(true)

  const notifyError = (error, fallback) => {
    if (error.response?.status === 401) {
      requireSignIn()
      return
    }
    toaster.create({ type: 'error', title: errorMessage(error, fallback) })
  }

  const togglePostLike = async () => {
    if (!isSignedIn) {
      requireSignIn()
      return
    }

    try {
      const response = post.liked
        ? await api.delete(`/community/posts/${ id }/likes`)
        : await api.post(`/community/posts/${ id }/likes`)
      setPost((prev) => ({ ...prev, liked: !post.liked, likeCount: response.data.likeCount }))
    } catch (error) {
      notifyError(error, '좋아요를 반영하지 못했어요.')
    }
  }

  const deletePost = async () => {
    try {
      await api.delete(`/community/posts/${ id }`)
      navigate('/community/main', { replace: true })
    } catch (error) {
      notifyError(error, '게시글을 삭제하지 못했어요.')
    }
  }

  const submitComment = async (content, parentCommentId) => {
    if (!isSignedIn) {
      requireSignIn()
      return false
    }

    const trimmed = content.trim()
    if (!trimmed || savingComment.current) {
      return false
    }

    savingComment.current = true
    try {
      await api.post(`/community/posts/${ id }/comments`, { content: trimmed, parentCommentId })
      setSupportFilter(null)
      await loadComments(null)
      setPost((prev) => ({ ...prev, commentCount: prev.commentCount + 1 }))
      return true
    } catch (error) {
      notifyError(error, '댓글을 등록하지 못했어요.')
      return false
    } finally {
      savingComment.current = false
    }
  }

  const submitCommentInput = async (event) => {
    event.preventDefault()
    if (await submitComment(comment, null)) {
      setComment('')
    }
  }

  const updateComment = async (commentId, content) => {
    if (savingComment.current) {
      return false
    }

    savingComment.current = true
    try {
      await api.patch(`/comments/${ commentId }`, { content: content.trim() })
      await loadComments()
      return true
    } catch (error) {
      notifyError(error, '댓글을 수정하지 못했어요.')
      return false
    } finally {
      savingComment.current = false
    }
  }

  const deleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${ commentId }`)
      await loadComments()
      setPost((prev) => ({ ...prev, commentCount: prev.commentCount - 1 }))
    } catch (error) {
      notifyError(error, '댓글을 삭제하지 못했어요.')
    }
  }

  const confirmDelete = async () => {
    setDeleting(true)
    if (deleteTarget.type === 'post') {
      await deletePost()
    } else {
      await deleteComment(deleteTarget.commentId)
    }
    setDeleting(false)
    setDeleteOpen(false)
  }

  const askDelete = (target) => {
    setDeleteTarget(target)
    setDeleteOpen(true)
  }

  const toggleCommentLike = async (target) => {
    if (!isSignedIn) {
      requireSignIn()
      return
    }

    try {
      const response = target.liked
        ? await api.delete(`/comments/${ target.commentId }/likes`)
        : await api.post(`/comments/${ target.commentId }/likes`)
      const applyLike = (item) => item.commentId === target.commentId
        ? { ...item, liked: !target.liked, likeCount: response.data.likeCount }
        : { ...item, replies: item.replies?.map(applyLike) }
      setComments((prev) => prev.map(applyLike))
    } catch (error) {
      notifyError(error, '좋아요를 반영하지 못했어요.')
    }
  }

  if (loading || error) {
    return (
      <Stack direction="column" gap="4" minHeight="100vh" paddingY="4">
        <Header/>
        <Container maxWidth="5xl" flex="1" display="flex" flexDirection="column" gap="4">
          <CommunityTitleBar/>
          <Stack flex="1" align="center" justify="center" gap="4">
            <Text color={ error ? 'fg.error' : 'fg.muted' } textAlign="center">{ error || '불러오는 중...' }</Text>
            { error && (
              <Button onClick={ () => navigate('/community/main', { replace: true }) }>
                커뮤니티로 가기
              </Button>
            ) }
          </Stack>
        </Container>
      </Stack>
    )
  }

  const isAuthor = myNickname !== null && myNickname === post.author?.nickname
  const shared = post.shared
  const sharedProduct = shared?.snapshot?.productName ? shared.snapshot : null
  const sharedItems = shared?.items ?? []

  return (
    <Stack direction="column" gap="4" minHeight="100vh" paddingTop="4">
      <Header/>

      <Container maxWidth="5xl" flex="1">
        <Stack direction="column" gap="4">
          <CommunityTitleBar>
            { isAuthor && (
              <Menu.Root>
                <Menu.Trigger asChild>
                  <IconButton rounded="full" variant="ghost" size="sm" aria-label="게시글 메뉴">
                    <LuEllipsisVertical/>
                  </IconButton>
                </Menu.Trigger>
                <Portal>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Menu.Item value="edit" onClick={ () => navigate('/community/write', { state: { post } }) }>
                        수정
                      </Menu.Item>
                      <Menu.Item value="delete" color="fg.error" onClick={ () => askDelete({ type: 'post' }) }>
                        삭제
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            ) }
          </CommunityTitleBar>

          <Stack gap="0">
            <HStack gap="4">
              { post.postType === 'VOTE'
                ? <Badge>투표</Badge>
                : <Badge>{ CATEGORY_LABELS[post.category] ?? post.category }</Badge> }
            </HStack>
            <Text fontSize={ { base: 'xl', md: '2xl' } } fontWeight="bold">{ post.title }</Text>
            <Text color="fg.muted" fontSize="sm">
              { displayNickname(post.author?.nickname) } · { formatRelativeTime(post.createdAt) }
              { ` · 조회 ${ post.viewCount }` }
            </Text>
          </Stack>

          <Text whiteSpace="pre-wrap">{ post.content }</Text>

          { shared && (
            <Card.Root variant="subtle" size="sm">
              <Card.Body gap="4">
                <Text fontWeight="semibold" fontSize="sm">{ SHARED_TITLES[shared.type] }</Text>
                { shared.type === 'FITTING' && shared.snapshot?.imageUrl && (
                  <Image
                    src={ shared.snapshot.imageUrl }
                    alt=""
                    maxHeight="sm"
                    width="fit-content"
                    rounded="md"
                    bg="bg.muted"
                  />
                ) }
                { sharedProduct && (
                  <Flex
                    as="button"
                    gap="4"
                    align="center"
                    textAlign="start"
                    onClick={ () => navigate(`/products/${ sharedProduct.productId }`) }
                  >
                    <ProductImage
                      src={ sharedProduct.imageUrl }
                      alt=""
                      boxSize="16"
                      objectFit="cover"
                      rounded="sm"
                      bg="bg.muted"
                    />
                    <Stack gap="0" flex="1" minWidth="0">
                      <Text fontSize="xs" color="fg.muted">{ sharedProduct.brandName }</Text>
                      <Text fontSize="sm" lineClamp="1">{ sharedProduct.productName }</Text>
                    </Stack>
                    <Text fontSize="sm">{ sharedProduct.price?.toLocaleString() }원</Text>
                  </Flex>
                ) }
                { shared.snapshot?.summary && (
                  <Text fontSize="sm" color="fg.muted">{ shared.snapshot.summary }</Text>
                ) }
                { sharedItems.map((item) => (
                  <Flex
                    key={ item.productId }
                    as="button"
                    gap="4"
                    align="center"
                    textAlign="start"
                    onClick={ () => navigate(`/products/${ item.productId }`) }
                  >
                    <ProductImage src={ item.imageUrl } alt="" boxSize="12" objectFit="cover" rounded="sm" bg="bg.muted"/>
                    <Text flex="1" fontSize="sm" lineClamp="1">{ item.productName }</Text>
                    <Text fontSize="sm">{ item.price?.toLocaleString() }원</Text>
                  </Flex>
                )) }
                { shared.type === 'COMBO' && shared.snapshot?.price && (
                  <Text fontSize="sm" fontWeight="bold" alignSelf="flex-end">
                    합계 { shared.snapshot.price.toLocaleString() }원
                  </Text>
                ) }
              </Card.Body>
            </Card.Root>
          ) }

          { post.postType === 'VOTE' && (
            <CommunityPoll
              postId={ post.postId }
              voteOptions={ post.voteOptions }
              isAuthor={ isAuthor }
              isSignedIn={ isSignedIn }
              onRequireSignIn={ requireSignIn }
            />
          ) }

          <HStack gap="4">
            <Button
              variant="plain"
              size="sm"
              paddingX="0"
              color={ post.liked ? 'primary.fg' : 'fg' }
              aria-pressed={ post.liked }
              onClick={ togglePostLike }
            >
              <LuThumbsUp/> { post.likeCount }
            </Button>
            <Badge variant="plain" size="md" paddingX="0">
              <LuMessageCircle/> { post.commentCount }
            </Badge>
          </HStack>

          <Separator/>

          { post.postType === 'VOTE' && (
            <HStack gap="2" overflowX="auto">
              { [{ voteOptionId: null, label: '전체' }, ...post.voteOptions].map((option) => (
                <Button
                  key={ option.voteOptionId ?? 'all' }
                  size="xs"
                  rounded="full"
                  flexShrink="0"
                  variant={ supportFilter === option.voteOptionId ? 'solid' : 'outline' }
                  aria-pressed={ supportFilter === option.voteOptionId }
                  onClick={ () => selectSupportFilter(option.voteOptionId) }
                >
                  { option.voteOptionId === null ? option.label : `${ option.label } 추천` }
                </Button>
              )) }
            </HStack>
          ) }

          <CommunityArticleCommentList
            comments={ comments }
            failed={ commentsFailed }
            emptyText={ supportFilter === null ? undefined : '이 선택지를 지지하는 댓글이 아직 없어요.' }
            postAuthorNickname={ post.author?.nickname }
            myNickname={ myNickname }
            voteOptions={ post.voteOptions }
            onLike={ toggleCommentLike }
            canReply={ supportFilter === null }
            onReply={ submitComment }
            onUpdate={ updateComment }
            onDelete={ (commentId) => askDelete({ type: 'comment', commentId }) }
          />
        </Stack>
      </Container>

      <Box position="sticky" bottom="0" bg="bg" paddingY="4" borderTopWidth="sm">
        <Container maxWidth="5xl">
          <form onSubmit={ submitCommentInput }>
            <HStack gap="4">
              <Input
                maxLength={ COMMENT_MAX_LENGTH }
                placeholder={ isSignedIn ? '댓글을 입력하세요' : '로그인하고 댓글을 남겨보세요' }
                aria-label="댓글 입력"
                value={ comment }
                onChange={ (e) => setComment(e.target.value) }
              />
              <Button type="submit" flexShrink="0" disabled={ !comment.trim() }>
                등록
              </Button>
            </HStack>
          </form>
        </Container>
      </Box>

      <ScrollToTopButton/>
      <SignInRequiredDialog open={ signInOpen } onClose={ () => setSignInOpen(false) }/>
      <CommunityConfirmDialog
        open={ deleteOpen }
        title={ DELETE_TITLES[deleteTarget?.type] }
        description="삭제한 뒤에는 되돌릴 수 없어요."
        confirmLabel="삭제하기"
        loading={ deleting }
        onConfirm={ confirmDelete }
        onClose={ () => setDeleteOpen(false) }
      />
    </Stack>
  )
}
