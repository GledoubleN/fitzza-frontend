import { useState } from 'react'
import { Badge, Button, HStack, Input, Stack, Text } from '@chakra-ui/react'
import { formatRelativeTime } from './communityFormat.js'

const COMMENT_MAX_LENGTH = 500

export const CommunityArticleCommentItem = ({
  comment,
  isReply = false,
  postAuthorNickname,
  myNickname,
  voteOptions,
  onLike,
  onReply,
  onUpdate,
  onDelete,
}) => {
  const { commentId, author, content, createdAt, likeCount, liked, isDeleted, supportedOptionId, replies = [] } = comment
  const [replying, setReplying] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(content)

  const isMine = myNickname !== null && author?.nickname === myNickname
  const supportedOption = voteOptions?.find((option) => option.voteOptionId === supportedOptionId)

  const submitReply = async (event) => {
    event.preventDefault()
    if (await onReply(replyText, commentId)) {
      setReplyText('')
      setReplying(false)
    }
  }

  const submitEdit = async (event) => {
    event.preventDefault()
    if (await onUpdate(commentId, editText)) {
      setEditing(false)
    }
  }

  const actionProps = { size: 'xs', variant: 'plain', color: 'fg.muted', paddingX: '0', minWidth: '0' }

  return (
    <Stack direction="column" gap="4" paddingLeft={ isReply ? '8' : '0' }>
      { isDeleted ? (
        <Text fontSize="sm" color="fg.muted">삭제된 댓글입니다</Text>
      ) : (
        <Stack direction="column" gap="0">
          <HStack gap="4" fontSize="sm" wrap="wrap">
            <Text fontWeight="bold">{ author?.nickname }</Text>
            { author?.nickname === postAuthorNickname && <Badge size="sm">작성자</Badge> }
            { supportedOption && <Badge size="sm">{ supportedOption.label } 추천</Badge> }
            <Text color="fg.muted" fontSize="xs">· { formatRelativeTime(createdAt) }</Text>
          </HStack>

          { editing ? (
            <form onSubmit={ submitEdit }>
              <HStack gap="4">
                <Input
                  size="sm"
                  maxLength={ COMMENT_MAX_LENGTH }
                  aria-label="댓글 수정"
                  value={ editText }
                  onChange={ (e) => setEditText(e.target.value) }
                />
                <Button type="submit" size="sm" flexShrink="0" disabled={ !editText.trim() }>
                  저장
                </Button>
                <Button size="sm" variant="ghost" flexShrink="0" onClick={ () => setEditing(false) }>
                  취소
                </Button>
              </HStack>
            </form>
          ) : (
            <Text fontSize="sm" whiteSpace="pre-wrap">{ content }</Text>
          ) }

          <HStack gap="4">
            <Button
              { ...actionProps }
              color={ liked ? 'primary.fg' : 'fg.muted' }
              aria-pressed={ liked }
              onClick={ () => onLike(comment) }
            >
              좋아요 { likeCount }
            </Button>
            { !isReply && (
              <Button { ...actionProps } fontWeight="bold" onClick={ () => setReplying((value) => !value) }>답글</Button>
            ) }
            { isMine && !editing && (
              <>
                <Button { ...actionProps } onClick={ () => {
                  setEditText(content)
                  setEditing(true)
                } }>수정</Button>
                <Button { ...actionProps } onClick={ () => onDelete(commentId) }>삭제</Button>
              </>
            ) }
          </HStack>
        </Stack>
      ) }

      { replying && (
        <form onSubmit={ submitReply }>
          <HStack gap="4" paddingLeft="8">
            <Input
              size="sm"
              maxLength={ COMMENT_MAX_LENGTH }
              placeholder="답글을 입력하세요"
              aria-label="답글 입력"
              value={ replyText }
              onChange={ (e) => setReplyText(e.target.value) }
            />
            <Button type="submit" size="sm" flexShrink="0" disabled={ !replyText.trim() }>
              등록
            </Button>
          </HStack>
        </form>
      ) }

      { replies.map((reply) => (
        <CommunityArticleCommentItem
          key={ reply.commentId }
          comment={ reply }
          isReply
          postAuthorNickname={ postAuthorNickname }
          myNickname={ myNickname }
          voteOptions={ voteOptions }
          onLike={ onLike }
          onReply={ onReply }
          onUpdate={ onUpdate }
          onDelete={ onDelete }
        />
      )) }
    </Stack>
  )
}
