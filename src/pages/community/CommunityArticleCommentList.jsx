import { Stack, Text } from '@chakra-ui/react'
import { CommunityArticleCommentItem } from './CommunityArticleCommentItem.jsx'

export const CommunityArticleCommentList = ({ comments, failed, ...itemProps }) => {
  const count = comments.reduce(
    (sum, comment) => sum + [comment, ...comment.replies].filter((item) => !item.isDeleted).length,
    0,
  )

  return (
    <Stack direction="column" gap="4">
      <Text fontWeight="semibold">댓글 { !failed && count }</Text>
      { failed && (
        <Text color="fg.error" fontSize="sm">댓글을 불러오지 못했어요.</Text>
      ) }
      { !failed && comments.length === 0 && (
        <Text color="fg.muted" fontSize="sm">첫 댓글을 남겨보세요.</Text>
      ) }
      { comments.map((comment) => (
        <CommunityArticleCommentItem key={ comment.commentId } comment={ comment } { ...itemProps }/>
      )) }
    </Stack>
  )
}
