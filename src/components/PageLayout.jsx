import { Container } from '@chakra-ui/react'

// 페이지 반응형 최대 폭/좌우 패딩
// 플로팅 버튼 정렬용 내부 Container도 이 두 값을 그대로 써야 콘텐츠 열과 어긋나지 않음.
export const PAGE_MAX_WIDTH = { base: '100%', md: '5xl', xl: '7xl' }
export const PAGE_PADDING_X = { base: '3', md: '4' }

// 페이지 공용 레이아웃. maxWidth 미지정 시 반응형 폭, 좁은 폼 페이지는 maxWidth="md" 등으로 덮어씀.
export const PageLayout = ({ children, maxWidth = PAGE_MAX_WIDTH, ...props }) => (
  <Container
    maxWidth={ maxWidth }
    minHeight="100vh"
    paddingX={ PAGE_PADDING_X }
    paddingY="4"
    { ...props }
  >
    { children }
  </Container>
)
