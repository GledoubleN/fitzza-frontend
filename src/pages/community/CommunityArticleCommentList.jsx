import { Stack, Text } from "@chakra-ui/react";
import { CommunityArticleCommentItem } from "./CommunityArticleCommentItem.jsx";

export const CommunityArticleCommentList = ({ comments }) => {
  return (
    <Stack direction="column" gap="3">
      <Text fontWeight="semibold">댓글 {comments.length}</Text>
      {comments.length === 0 && (
        <Text color="fg.muted" fontSize="sm">
          첫 댓글을 남겨보세요.
        </Text>
      )}
      {comments.map((comment) => (
        <CommunityArticleCommentItem key={comment.id} comment={comment} />
      ))}
    </Stack>
  );
};
