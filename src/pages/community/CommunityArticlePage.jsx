import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
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
        const [articleRes, commentsRes] = await Promise.all([
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
          // const found 부터는 목업에 없는 id 번호로 들어왔을 때를 방지하는 코드입니다. 그냥 여기 아래 블럭들은 싹다 목업용이니 개발 완료되면 수정 필요
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

  // 댓글 등록. TO-DO-NEXT: apiEndPoint 확정되면 수정 필요
  const changeHandler = async () => {
    const text = comment.trim();
    if (!text) return;
    try {
      const res = await api.post(`/communityarticle/${id}/comments`, {
        content: text,
      });
      setComments((prev) => [...prev, res.data]);
    } catch (err) {
      // 개발용 코드, 수정필요 TO-DO-NEXT
      console.log("댓글 등록 실패, 로컬 추가(개발용)", err);
      setComments((prev) => [
        ...prev,
        { id: Date.now(), articleId: Number(id), author: "나", time: "방금", content: text },
      ]);
    }
    setComment("");
  };

  if (loading) {
    return (
      <Container maxWidth="xl" paddingY="4">
        <Text color="fg.muted">불러오는 중...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" paddingY="4">
        <Text color="red.500">{"Error 잠시 후 다시 시도해주세요"}</Text>
        <Text color="red.500">{"지금 페이지는 없는 페이지 id입니다(개발용 문구)"}</Text>
      </Container>
    );
  }

  const images = article.images ?? [];

  return (
    <Container maxWidth="xl" minHeight="100vh" paddingY="4">
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
            <HStack gap="1">
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
        <CommunityArticleCommentList comments={comments} />

        {/* 댓글 입력 */}
        <HStack gap="2" paddingBottom="4">
          <Input
            placeholder="댓글을 입력하세요"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") changeHandler();
            }}
          />
          <Button colorPalette="orange" flexShrink="0" onClick={changeHandler}>
            등록
          </Button>
        </HStack>
      </Stack>
    </Container>
  );
};
