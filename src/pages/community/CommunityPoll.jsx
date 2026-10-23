import { useEffect, useState } from 'react'
import { Badge, Box, Button, Dialog, Flex, Grid, Image, Portal, Stack, Text } from '@chakra-ui/react'
import { LuCheck } from 'react-icons/lu'
import { api } from '../../api/axios.js'
import { toaster } from '../../components/ui/toaster.jsx'
import { SOURCE_LABELS, errorMessage, formatRemaining } from './communityFormat.js'

export const CommunityPoll = ({ postId, voteOptions, isAuthor, isSignedIn, onRequireSignIn }) => {
  const [poll, setPoll] = useState(null)
  const [submittingId, setSubmittingId] = useState(null)
  const [closeDialogOpen, setCloseDialogOpen] = useState(false)
  const [closing, setClosing] = useState(false)

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
  const myLabel = voteOptions.find((option) => option.voteOptionId === poll.myVoteOptionId)?.label

  const vote = async (voteOptionId) => {
    if (!isSignedIn) {
      onRequireSignIn()
      return
    }

    setSubmittingId(voteOptionId)
    try {
      await api.post(`/community/posts/${ postId }/poll/votes`, { voteOptionId })
      await loadPoll()
    } catch (error) {
      if (error.response?.status === 401) {
        onRequireSignIn()
        return
      }
      toaster.create({ type: 'error', title: errorMessage(error, '투표하지 못했어요.') })
      if (error.response?.status === 409) {
        await loadPoll()
      }
    } finally {
      setSubmittingId(null)
    }
  }

  const closePoll = async () => {
    setClosing(true)
    try {
      await api.patch(`/community/posts/${ postId }/poll`, { closed: true })
      await loadPoll()
      setCloseDialogOpen(false)
    } catch (error) {
      toaster.create({ type: 'error', title: errorMessage(error, '투표를 종료하지 못했어요.') })
    } finally {
      setClosing(false)
    }
  }

  return (
    <Stack gap="4">
      <Stack gap="0">
        <Text fontWeight="bold">투표</Text>
        <Text fontSize="xs" color="fg.muted">총 투표수 { poll.total }</Text>
      </Stack>

      <Grid templateColumns="repeat(2, 1fr)" gap="4">
        { voteOptions.map((option) => {
          const result = resultOf(option.voteOptionId)
          const mine = poll.myVoteOptionId === option.voteOptionId
          const percent = Math.round((result?.ratio ?? 0) * 100)

          return (
            <Stack key={ option.voteOptionId } gap="4">
              <Box position="relative">
                <Image
                  src={ option.imageUrl }
                  alt={ option.name ?? `선택지 ${ option.label }` }
                  aspectRatio="4/3"
                  width="full"
                  objectFit="cover"
                  rounded="md"
                  bg="bg.muted"
                />
                { SOURCE_LABELS[option.source] && (
                  <Badge
                    size="sm"
                    variant="solid"
                    position="absolute"
                    top="2"
                    left="2"
                  >
                    { SOURCE_LABELS[option.source] }
                  </Badge>
                ) }
              </Box>
              { option.name && (
                <Text fontSize="xs" color="fg.muted" lineClamp="1">
                  { option.name }
                  { option.price !== null && option.price !== undefined && ` · ${ option.price.toLocaleString() }원` }
                </Text>
              ) }
              <Button
                size="sm"
                variant={ mine ? 'solid' : 'outline' }
                fontWeight="bold"
                disabled={ showResult || (submittingId !== null && submittingId !== option.voteOptionId) }
                _disabled={ { opacity: '1', cursor: 'default' } }
                loading={ submittingId === option.voteOptionId }
                aria-pressed={ mine }
                onClick={ () => vote(option.voteOptionId) }
              >
                { option.label }
                { showResult && ` ${ percent }% · ${ result?.count ?? 0 }표` }
                { mine && <LuCheck/> }
              </Button>
              { result?.supportCommentCount > 0 && (
                <Text fontSize="xs" color="fg.muted">추천 댓글 { result.supportCommentCount }개</Text>
              ) }
            </Stack>
          )
        }) }
      </Grid>

      <Flex justify="space-between" align="center" gap="4">
        <Text fontSize="sm" color="fg.muted">
          { poll.closed
            ? `투표 종료 · 총 ${ poll.total }명 참여`
            : `투표중${ poll.voteEndAt ? ` ${ formatRemaining(poll.voteEndAt) }` : '' }` }
          { myLabel && ` · 내 선택 ${ myLabel }` }
        </Text>
        { isAuthor && !poll.closed && (
          <Button size="xs" variant="outline" onClick={ () => setCloseDialogOpen(true) }>투표 종료하기</Button>
        ) }
      </Flex>

      <Dialog.Root
        open={ closeDialogOpen }
        placement="center"
        size="xs"
        onOpenChange={ (e) => !e.open && setCloseDialogOpen(false) }
      >
        <Portal>
          <Dialog.Backdrop/>
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>투표를 종료할까요?</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text color="fg.muted">종료한 투표는 다시 열 수 없어요.</Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" flex="1" onClick={ () => setCloseDialogOpen(false) }>취소</Button>
                <Button flex="1" loading={ closing } onClick={ closePoll }>종료하기</Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Stack>
  )
}
