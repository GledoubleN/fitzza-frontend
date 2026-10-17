import { useEffect, useState } from 'react'
import { Badge, Box, Button, Card, Flex, Grid, Image, Progress, Stack, Text } from '@chakra-ui/react'
import { api } from '../../api/axios.js'
import { toaster } from '../../components/ui/toaster.jsx'
import { errorMessage } from './communityFormat.js'

const VOTE_END_FORMAT = { month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' }

export const CommunityPoll = ({ postId, voteOptions, isAuthor, isSignedIn, onRequireSignIn }) => {
  const [poll, setPoll] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const loadPoll = () => api.get(`/community/posts/${ postId }/poll`)
    .then((response) => setPoll(response.data))
    .catch((error) => toaster.create({ type: 'error', title: errorMessage(error, '투표 결과를 불러오지 못했어요.') }))

  useEffect(() => {
    loadPoll()
  }, [postId])

  if (!poll) {
    return null
  }

  const voted = poll.myVoteOptionId !== null && poll.myVoteOptionId !== undefined
  const showResult = voted || poll.closed
  const resultOf = (voteOptionId) => poll.options.find((option) => option.voteOptionId === voteOptionId)

  const vote = async () => {
    if (!isSignedIn) {
      onRequireSignIn()
      return
    }

    setSubmitting(true)
    try {
      await api.post(`/community/posts/${ postId }/poll/votes`, { voteOptionId: selectedId })
      await loadPoll()
    } catch (error) {
      toaster.create({ type: 'error', title: errorMessage(error, '투표하지 못했어요.') })
      if (error.response?.status === 409) {
        await loadPoll()
      }
    } finally {
      setSubmitting(false)
    }
  }

  const closePoll = async () => {
    if (!window.confirm('투표를 종료할까요? 종료한 투표는 다시 열 수 없어요.')) {
      return
    }

    try {
      await api.patch(`/community/posts/${ postId }/poll`, { closed: true })
      await loadPoll()
    } catch (error) {
      toaster.create({ type: 'error', title: errorMessage(error, '투표를 종료하지 못했어요.') })
    }
  }

  return (
    <Card.Root variant="outline">
      <Card.Body gap="4">
        <Flex justify="space-between" align="center" gap="4" wrap="wrap">
          <Text fontWeight="semibold">
            { poll.closed ? '투표가 마감됐어요' : '투표에 참여해 주세요' }
          </Text>
          <Text color="fg.muted" fontSize="sm">
            { poll.total }명 참여
            { !poll.closed && poll.voteEndAt && ` · ${ new Date(poll.voteEndAt).toLocaleString('ko-KR', VOTE_END_FORMAT) } 마감` }
          </Text>
        </Flex>

        <Grid templateColumns={ { base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' } } gap="4">
          { voteOptions.map((option) => {
            const result = resultOf(option.voteOptionId)
            const selected = showResult
              ? poll.myVoteOptionId === option.voteOptionId
              : selectedId === option.voteOptionId

            return (
              <Card.Root
                key={ option.voteOptionId }
                as={ showResult ? 'div' : 'button' }
                size="sm"
                overflow="hidden"
                textAlign="start"
                borderColor={ selected ? 'primary.solid' : 'border' }
                borderWidth={ selected ? 'md' : 'sm' }
                cursor={ showResult ? 'default' : 'pointer' }
                aria-pressed={ showResult ? undefined : selected }
                onClick={ showResult ? undefined : () => setSelectedId(option.voteOptionId) }
              >
                <Box position="relative">
                  <Image src={ option.imageUrl } alt={ option.name ?? `선택지 ${ option.label }` } aspectRatio="square" width="full" objectFit="cover" bg="bg.muted"/>
                  <Badge position="absolute" top="2" left="2" colorPalette={ selected ? 'primary' : 'gray' } variant="solid">
                    { option.label }
                  </Badge>
                </Box>
                <Card.Body gap="4">
                  { option.name && <Text fontSize="sm" lineClamp="1">{ option.name }</Text> }
                  { option.price !== null && option.price !== undefined && (
                    <Text fontSize="sm" fontWeight="semibold">{ option.price.toLocaleString() }원</Text>
                  ) }
                  { showResult && result && (
                    <Stack gap="0">
                      <Progress.Root value={ Math.round(result.ratio * 100) } size="sm" colorPalette={ selected ? 'primary' : 'gray' }>
                        <Progress.Track>
                          <Progress.Range/>
                        </Progress.Track>
                      </Progress.Root>
                      <Text fontSize="xs" color="fg.muted">
                        { Math.round(result.ratio * 100) }% · { result.count }표
                      </Text>
                    </Stack>
                  ) }
                  { result?.supportCommentCount > 0 && (
                    <Text fontSize="xs" color="fg.muted">추천 댓글 { result.supportCommentCount }개</Text>
                  ) }
                </Card.Body>
              </Card.Root>
            )
          }) }
        </Grid>

        { !showResult && (
          <Button colorPalette="primary" disabled={ !selectedId } loading={ submitting } onClick={ vote }>
            투표하기
          </Button>
        ) }
        { isAuthor && !poll.closed && (
          <Button variant="outline" onClick={ closePoll }>투표 종료하기</Button>
        ) }
      </Card.Body>
    </Card.Root>
  )
}
