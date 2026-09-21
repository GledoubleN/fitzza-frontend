import { Stack, Text } from "@chakra-ui/react";
import { CommunityArticleCommentItem } from "./CommunityArticleCommentItem.jsx";

export const CommunityArticleCommentList = ({ comments, articleAuthor, onLike, onReply }) => {
  const roots = comments.filter((c) => !c.parentId); // 최상위 댓글

  return (
    <Stack direction="column" gap="4">
      <Text fontWeight="semibold">댓글 {comments.length}</Text>
      {roots.length === 0 && (
        <Text color="fg.muted" fontSize="sm">
          첫 댓글을 남겨보세요.
        </Text>
      )}
      {roots.map((comment) => (
        <CommunityArticleCommentItem
          key={comment.id}
          comment={comment}
          comments={comments}
          articleAuthor={articleAuthor}
          onLike={onLike}
          onReply={onReply}
          depth={0}
        />
      ))}
    </Stack>
  );
};
