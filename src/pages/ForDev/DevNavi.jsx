import { Button, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { PageLayout } from '../../components/PageLayout.jsx'
import { useNavigate } from "react-router-dom";

// 개발용 페이지 네비게이션. 모든 라우트를 버튼으로 이동. 실제 배포엔 포함하지 말것...
const ROUTES = [
  { path: "/", label: "메인" },
  { path: "/shopping-cart", label: "장바구니" },
  { path: "/signin", label: "로그인" },
  { path: "/signup", label: "회원가입" },
  { path: "/try-on", label: "가상피팅" },
  { path: "/search", label: "검색 결과" },
  { path: "/products/1", label: "상품 상세 (id:1)" },
  { path: "/checkout", label: "결제" },
  { path: "/communitymain", label: "커뮤니티 메인" },
  { path: "/communityarticle/1", label: "커뮤니티 글 상세 (id:1)" },
  { path: "/communitywrite", label: "커뮤니티 글쓰기" },
  { path: "/prompt", label: "프롬프트" },
  { path: "/mypage", label: "마이페이지" },
  { path: "/worldcup", label: "상품 월드컵" },
  { path: "/likes", label: "찜 목록" },
  { path: "/category", label: "카테고리" },
];

export const DevNavi = () => {
  const moveUrl = useNavigate();

  return (
    <PageLayout paddingY="6">
      <Stack direction="column" gap="4">
        <Heading size="lg">🛠 Dev Navigation</Heading>
        <Text color="fg.muted" fontSize="sm">
          개발용 페이지 이동 화면입니다.
        </Text>

        <SimpleGrid columns={{ base: 2, md: 3 }} gap="3">
          {ROUTES.map((route) => (
            <Button
              key={route.path}
              variant="outline"
              justifyContent="flex-start"
              onClick={() => moveUrl(route.path)}
            >
              {route.label}
            </Button>
          ))}
        </SimpleGrid>
      </Stack>
    </PageLayout>
  );
};
