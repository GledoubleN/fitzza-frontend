import { useState } from "react";
import { Badge, Box, Button, HStack, Input, Stack, Text } from "@chakra-ui/react";
import { LuThumbsUp } from "react-icons/lu";

const INDENT_STEP = "6"; // 한 단계 들여쓰기 폭
const MAX_INDENT_DEPTH = 3; // 대댓글 3개 부터는 더 들여쓰지 않음
const CONTINUE_DEPTH = 3; // 대댓글 3개 이상의 답글은 "계속 보기"로 접음

export const CommunityArticleCommentItem = ({
  comment,
  comments,
  articleAuthor,
  onLike,
  onReply,
  depth = 0,
}) => {
  const { id, author, time, content, likes, liked } = comment;
  const replies = comments.filter((c) => c.parentId === id); // 댓글 직속 답글
  const isAuthor = author === articleAuthor; // 글 작성자가 댓글 작성자인지 확인
  // To-Do-Next: isAuthor는 id를 받지 않는 구조로 같은 닉네임을 허용한다면 수정 필요합니다.
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [expanded, setExpanded] = useState(false); // "계속보기" 펼침여부

  const submitReply = () => {
    if (!replyText.trim()) return;
    onReply(id, replyText);
    setReplyText("");
    setShowReply(false);
  };

  // 대댓글 3개 이상은 더 들여쓰지 않음
  const padLeft = depth === 0 || depth > MAX_INDENT_DEPTH ? "0" : INDENT_STEP;
  // 대댓글 3개 넘어가면 답글을 바로 안 펼치고 "계속 보기"로
  const collapsed = depth >= CONTINUE_DEPTH && replies.length > 0 && !expanded;

  return (
    <Stack direction="column" gap="2" paddingLeft={padLeft}>
      {/* 댓글 본문 */}
      <Stack direction="column" gap="1">
        <HStack gap="2" fontSize="sm">
          <Box boxSize="6" rounded="full" bg="bg.muted" flexShrink="0" />
          <Text>{author}</Text>
          {isAuthor && (
            <Badge colorPalette="orange" size="sm">작성자</Badge>
          )}
          <Text color="fg.muted">·</Text>
          <Text color="fg.muted">{time}</Text>
        </HStack>
        <Text fontSize="sm" paddingLeft="8">
          {content}
        </Text>

        {/* 좋아요 / 답글 */}
        <HStack gap="4" paddingLeft="8" fontSize="sm">
          <HStack
            gap="1"
            cursor="pointer"
            color={liked ? "orange.500" : "fg.muted"}
            onClick={() => onLike(id)}
          >
            <LuThumbsUp />
            <Text>{likes}</Text>
          </HStack>
          <Text
            cursor="pointer"
            color="fg.muted"
            onClick={() => setShowReply((v) => !v)}
          >
            답글
          </Text>
        </HStack>
      </Stack>

      {/* 답글 입력 */}
      {showReply && (
        <HStack gap="2" paddingLeft="8">
          <Input
            size="sm"
            maxLength = {500}
            placeholder="답글을 입력하세요"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitReply();
            }}
          />
          <Button size="sm" colorPalette="orange" flexShrink="0" onClick={submitReply}>
            등록
          </Button>
        </HStack>
      )}

      {/* 대댓글: 너무 깊으면 "계속 보기"로 접음 */}
      {collapsed ? (
        <Text
          paddingLeft="8"
          fontSize="sm"
          color="blue.500"
          cursor="pointer"
          onClick={() => setExpanded(true)}
        >
          답글 {replies.length}개 계속 보기
        </Text>
      ) : (
        replies.map((reply) => (
          <CommunityArticleCommentItem
            key={reply.id}
            comment={reply}
            comments={comments}
            articleAuthor={articleAuthor}
            onLike={onLike}
            onReply={onReply}
            depth={depth + 1}
          />
        ))
      )}
    </Stack>
  );
};
