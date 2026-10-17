import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  Badge,
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
import { LuChevronLeft, LuEllipsisVertical, LuMessageCircle, LuThumbsUp } from 'react-icons/lu'
import { Header } from '../../components/Header.jsx'
import { ScrollToTopButton } from '../../components/ScrollToTopButton.jsx'
import { Toaster, toaster } from '../../components/ui/toaster.jsx'
import { useAuth } from '../../contexts/AuthContext.js'
import { api } from '../../api/axios.js'
import { CommunityArticleCommentList } from './CommunityArticleCommentList.jsx'
import { CommunityPoll } from './CommunityPoll.jsx'
import { CATEGORY_LABELS, errorMessage, formatRelativeTime } from './communityFormat.js'

const COMMENT_MAX_LENGTH = 500

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

  const loadComments = () => api.get(`/community/posts/${ id }/comments`)
    .then((response) => setComments(response.data))

  useEffect(() => {
    setLoading(true)
    setError('')
    Promise.all([api.get(`/community/posts/${ id }`), loadComments()])
      .then(([postResponse]) => setPost(postResponse.data))
      .catch((error) => setError(error.response?.status === 404
        ? '삭제되었거나 없는 게시글이에요.'
        : errorMessage(error, '게시글을 불러오지 못했어요.')))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!isSignedIn) {
      setMyNickname(null)
      return
    }

    api.get('/users/me')
      .then((response) => setMyNickname(response.data.nickname))
      .catch(() => setMyNickname(null))
  }, [isSignedIn])

  const requireSignIn = () => navigate('/signin')

  const notifyError = (error, fallback) => toaster.create({ type: 'error', title: errorMessage(error, fallback) })

  const togglePostLike = async () => {
    if (!isSignedIn) {
      requireSignIn()
      return
    }

    try {
      const response = post.liked
        ? await api.delete(`/community/posts/${ id }/likes`)
        : await api.post(`/community/posts/${ id }/likes`)
      setPost((prev) => ({ ...prev, liked: !prev.liked, likeCount: response.data.likeCount }))
    } catch (error) {
      notifyError(error, '좋아요를 반영하지 못했어요.')
    }
  }

  const deletePost = async () => {
    if (!window.confirm('게시글을 삭제할까요?')) {
      return
    }

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
    if (!trimmed) {
      return false
    }

    try {
      await api.post(`/community/posts/${ id }/comments`, { content: trimmed, parentCommentId })
      await loadComments()
      setPost((prev) => ({ ...prev, commentCount: prev.commentCount + 1 }))
      return true
    } catch (error) {
      notifyError(error, '댓글을 등록하지 못했어요.')
      return false
    }
  }

  const submitCommentInput = async (event) => {
    event.preventDefault()
    if (await submitComment(comment, null)) {
      setComment('')
    }
  }

  const updateComment = async (commentId, content) => {
    try {
      await api.patch(`/comments/${ commentId }`, { content: content.trim() })
      await loadComments()
      return true
    } catch (error) {
      notifyError(error, '댓글을 수정하지 못했어요.')
      return false
    }
  }

  const deleteComment = async (commentId) => {
    if (!window.confirm('댓글을 삭제할까요?')) {
      return
    }

    try {
      await api.delete(`/comments/${ commentId }`)
      await loadComments()
      setPost((prev) => ({ ...prev, commentCount: prev.commentCount - 1 }))
    } catch (error) {
      notifyError(error, '댓글을 삭제하지 못했어요.')
    }
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

  const backButton = (
    <IconButton rounded="full" variant="ghost" size="sm" aria-label="뒤로" onClick={ () => navigate(-1) }>
      <LuChevronLeft/>
    </IconButton>
  )

  if (loading || error) {
    return (
      <Stack direction="column" gap="4" minHeight="100vh" paddingY="4">
        <Header/>
        <Container maxWidth="3xl">
          <Flex align="center" gap="4">
            { backButton }
            <Text color={ error ? 'fg.error' : 'fg.muted' }>{ error || '불러오는 중...' }</Text>
          </Flex>
        </Container>
      </Stack>
    )
  }

  const isAuthor = myNickname !== null && myNickname === post.author?.nickname
  const sharedItems = post.shared?.items ?? []

  return (
    <Stack direction="column" gap="4" minHeight="100vh" paddingY="4">
      <Header/>

      <Container maxWidth="3xl" paddingBottom="8">
        <Stack direction="column" gap="4">
          <Flex align="center" justify="space-between">
            { backButton }
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
                      <Menu.Item value="delete" color="fg.error" onClick={ deletePost }>
                        삭제
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Portal>
              </Menu.Root>
            ) }
          </Flex>

          <HStack gap="4">
            { post.postType === 'VOTE' && <Badge colorPalette="primary">투표</Badge> }
            <Badge colorPalette="gray">{ CATEGORY_LABELS[post.category] ?? post.category }</Badge>
          </HStack>
          <Text fontSize={ { base: 'xl', md: '2xl' } } fontWeight="bold">{ post.title }</Text>
          <Text color="fg.muted" fontSize="sm">
            { post.author?.nickname } · { formatRelativeTime(post.createdAt) } · 조회 { post.viewCount }
          </Text>

          { post.imageUrl && (
            <Image src={ post.imageUrl } alt="" maxHeight="md" width="fit-content" objectFit="contain" rounded="md" bg="bg.muted"/>
          ) }

          <Text whiteSpace="pre-wrap">{ post.content }</Text>

          { sharedItems.length > 0 && (
            <Card.Root variant="subtle" size="sm">
              <Card.Body gap="4">
                <Text fontWeight="semibold" fontSize="sm">
                  { post.shared.type === 'FITTING' ? '공유한 가상 피팅' : '공유한 코디' }
                </Text>
                { sharedItems.map((item) => (
                  <Flex
                    key={ item.productId }
                    as="button"
                    gap="4"
                    align="center"
                    textAlign="start"
                    onClick={ () => navigate(`/products/${ item.productId }`) }
                  >
                    <Image src={ item.imageUrl } alt="" boxSize="12" objectFit="cover" rounded="sm" bg="bg.muted"/>
                    <Text flex="1" fontSize="sm" lineClamp="1">{ item.productName }</Text>
                    <Text fontSize="sm">{ item.price?.toLocaleString() }원</Text>
                  </Flex>
                )) }
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
              variant="outline"
              size="sm"
              rounded="full"
              colorPalette={ post.liked ? 'primary' : 'gray' }
              aria-pressed={ post.liked }
              onClick={ togglePostLike }
            >
              <LuThumbsUp/> { post.likeCount }
            </Button>
            <Badge variant="plain" color="fg.muted" size="md">
              <LuMessageCircle/> { post.commentCount }
            </Badge>
          </HStack>

          <Separator/>

          <CommunityArticleCommentList
            comments={ comments }
            postAuthorNickname={ post.author?.nickname }
            myNickname={ myNickname }
            voteOptions={ post.voteOptions }
            onLike={ toggleCommentLike }
            onReply={ submitComment }
            onUpdate={ updateComment }
            onDelete={ deleteComment }
          />

          <form onSubmit={ submitCommentInput }>
            <HStack gap="4">
              <Input
                maxLength={ COMMENT_MAX_LENGTH }
                placeholder={ isSignedIn ? '댓글을 입력하세요' : '로그인하고 댓글을 남겨보세요' }
                aria-label="댓글 입력"
                value={ comment }
                onChange={ (e) => setComment(e.target.value) }
              />
              <Button type="submit" colorPalette="primary" flexShrink="0" disabled={ !comment.trim() }>
                등록
              </Button>
            </HStack>
          </form>
        </Stack>
      </Container>

      <ScrollToTopButton/>
      <Toaster/>
    </Stack>
  )
}
