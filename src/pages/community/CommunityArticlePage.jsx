import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { LuChevronLeft, LuMessageCircle, LuThumbsUp } from "react-icons/lu";
import { AppBar } from "../../components/AppBar.jsx";
import { PageLayout } from "../../components/PageLayout.jsx";
import { ScrollToTopButton } from "../../components/ScrollToTopButton.jsx";
import { CommunityArticleCommentList } from "./CommunityArticleCommentList.jsx";
import { api } from "../../api/axios.js";
import { ARTICLES } from "/src/data/articles.js";
import { COMMENTS } from "/src/data/comments.js";

export const CommunityArticlePage = () => {
  const { id } = useParams();
  console.log(">>> Debug: CommunityArticlePage Mounted", id);
  const moveUrl = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  // 글 + 댓글 조회. TO-DO-NEXT & Inquiry to BE : apiEndPoint 확정되면 수정 필요.
  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const [articleRes, commentsRes]
          = await Promise.all([
          api.get(`/communityarticle/${id}`),
          api.get(`/communityarticle/${id}/comments`),
        ]);
        setArticle(articleRes.data);
        setComments(commentsRes.data);
      } catch (err) {
        if (err.response?.status !== 401) {
          // 개발용 목업 폴백 — 완성되면 setError로 교체
          console.log("글 조회 실패, 더미 사용(개발용)", err);
          const found = ARTICLES.find((a) => a.id === Number(id));
          // const found 부터는 목업에 없는 id 번호로 들어왔을 때를 방지하는 코드입니다.
          // 그냥 여기 아래 블럭은 싹다 목업용이니 개발 완료되면 수정 필요
          // TO-DO-NEXT : 실제로 통신되면 수정하기
          if (found) {
            setArticle(found);
            setComments(COMMENTS.filter((c) => c.articleId === Number(id)));
          } else {
            setError("글을 찾을 수 없습니다.");
          }
        } else {
          setError("로그인이 필요합니다.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  // 댓글 및 답글 등록. parentId null이면 최상위 댓글, 값 있으면 대댓글. TO-DO-NEXT: apiEndPoint 확정되면 수정 필요
  const submitComment = async (text, parentId = null) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (trimmed.length > 500) {
      alert("댓글의 길이는 최대 500자입니다")
      return;
    }

    try {
      const res = await api.post(`/communityarticle/${id}/comments`, {
        content: trimmed,
        parentId,
      });
      setComments((prev) => [...prev, res.data]);
    } catch (err) {
      // 개발용 코드, 수정필요 TO-DO-NEXT
      console.log("댓글 등록 실패, 로컬 추가(개발용)", err);
      setComments((prev) => [
        ...prev,
        {
          id: Date.now(),
          articleId: Number(id),
          parentId,
          author: "나",
          time: "방금",
          content: trimmed,
          likes: 0,
          liked: false,
        },
      ]);
    }
  };

  // 댓글 등록 (하단 입력창)
  const submitCommentHandler = async () => {
    await submitComment(comment);
    setComment("");
  };

  // 대댓글 등록
  const replyHandler = (parentId, text) => submitComment(text, parentId);

  // 게시글 좋아요 토글. TO-DO-NEXT: 실제 API 계약 시 수정 필요
  const articleLikeHandler = async () => {
    const nextLiked = !article.liked;
    // 좋아요는 낙관적 업데이트를 진행합니다.
    setArticle((prev) => ({
      ...prev,
      liked: nextLiked,
      likes: prev.likes + (nextLiked ? 1 : -1),
    }));
    try {
      if (nextLiked) {
        await api.post(`/communityarticle/${id}/like`);
      } else {
        await api.delete(`/communityarticle/${id}/like`);
      }
    } catch (err) {
      // BE 미구성으로 실패시 로컬 유지(개발용).
      console.log("게시글 좋아요 실패, 로컬 유지(개발용)", err);
    }
  };

  // 댓글 좋아요. TO-DO-NEXT: endpoint 확정되면 수정
  const likeHandler = async (commentId) => {
    const target = comments.find((c) => c.id === commentId);
    if (!target) return;
    const nextLiked = !target.liked;

    // 낙관적 업데이트: 응답 기다리지 않고 화면 먼저 반영
    const applyLike = (liked) =>
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, liked, likes: c.likes + (liked ? 1 : -1) }
            : c
        )
      );
    applyLike(nextLiked);

    try {
      // 좋아요=POST, 취소=DELETE 가정, TO-DO-NEXT : apiEndpoint 확정시 변경 필요
      if (nextLiked) {
        await api.post(`/communityarticle/${id}/comments/${commentId}/like`);
      } else {
        await api.delete(`/communityarticle/${id}/comments/${commentId}/like`);
      }
    } catch (err) {
      // BE 미구성/실패 시 롤백 없이 로컬 유지(개발용).
      //TO-DO-NEXT : 실제 통신 시 댓글별 좋아요 요청 중 중복 클릭 방지에 대한 부분 구성 필요합니다.
      console.log("좋아요 처리 실패, 로컬 유지(개발용)", err);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <Text color="fg.muted">불러오는 중...</Text>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <Text color="red.500">{"Error 잠시 후 다시 시도해주세요"}</Text>
        <Text color="red.500">{"지금 페이지는 없는 페이지 id입니다(개발용 문구)"}</Text>
      </PageLayout>
    );
  }

  const images = article.images ?? [];

  return (
    <PageLayout>
      <Stack direction="column" gap="4">
        <AppBar />

        {/* 헤더 */}
        <Flex align="center" gap="2">
          <IconButton
            rounded="full"
            variant="ghost"
            size="sm"
            aria-label="뒤로"
            onClick={() => moveUrl(-1)}
          >
            <LuChevronLeft />
          </IconButton>
          <Text fontSize="lg" fontWeight="semibold">
            커뮤니티
          </Text>
        </Flex>

        {/* 글 본문 */}
        <Stack direction="column" gap="3">
          <Badge width="fit-content" colorPalette="gray">
            {article.category}
          </Badge>
          <Text fontSize="xl" fontWeight="bold">
            {article.title}
          </Text>
          <HStack gap="2" color="black" fontSize="sm">
            <Box boxSize="6" rounded="full" bg="bg.muted" flexShrink="0" />
            <Text>{article.author}</Text>
            <Text>·</Text>
            <Text>{article.time}</Text>
          </HStack>

          {images.length > 0 && (
            <HStack gap="2" overflowX="auto">
              {images.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  maxHeight="240px"
                  objectFit="cover"
                  rounded="md"
                  bg="bg.muted"
                />
              ))}
            </HStack>
          )}

          <Text whiteSpace="pre-wrap">{article.content}</Text>

          <HStack gap="4" color="fg.muted" fontSize="sm">
            <HStack
              gap="1"
              cursor="pointer"
              color={article.liked ? "orange.500" : "fg.muted"}
              onClick={articleLikeHandler}
            >
              <LuThumbsUp />
              <Text>{article.likes}</Text>
            </HStack>
            <HStack gap="1">
              <LuMessageCircle />
              <Text>{comments.length}</Text>
            </HStack>
          </HStack>
        </Stack>

        <Box borderBottomWidth="1px" />

        {/* 댓글 목록 */}
        <CommunityArticleCommentList
          comments={comments}
          articleAuthor={article.author}
          onLike={likeHandler}
          onReply={replyHandler}
        />

        {/* 댓글 입력 / 길이는 임의값 합의 필요*/}
        <HStack gap="2" paddingBottom="4">
          <Input
            maxLength={500}
            placeholder="댓글을 입력하세요"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitCommentHandler();
            }}
          />
          <Button colorPalette="orange" flexShrink="0" onClick={submitCommentHandler}>
            등록
          </Button>
        </HStack>
      </Stack>

      <ScrollToTopButton />
    </PageLayout>
  );
};
