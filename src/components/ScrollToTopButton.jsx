import { useEffect, useState } from "react";
import { Box, Container, IconButton } from "@chakra-ui/react";
import { LuArrowUp } from "react-icons/lu";
import { PAGE_MAX_WIDTH, PAGE_PADDING_X } from "./PageLayout.jsx";

/**
 * 일정 거리 이상 스크롤하면 나타나는 맨 위로 이동 버튼.
 *
 * @param {Object} props
 * @param {number} [props.threshold=300] - 버튼 표시 기준 스크롤 거리(px).
 * @param {string} [props.bottom="28"] - 화면 아래 여백. Chakra 토큰 또는 단위값.
 * @param {"flex-end" | "flex-start"} [props.align="flex-end"] - 버튼 정렬 방향.
 */
export const ScrollToTopButton = ({
  threshold = 300,
  bottom = "28",
  align = "flex-end",
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll); // 스크롤 될 때마다 onScroll 실행
    onScroll(); // 스크롤 시 초기 위치 반영
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  if (!visible) return null;

  return (
    // 글쓰기 버튼과 동일하게 Container로 감싸 컬럼 안쪽(오른쪽 아래)에 정렬
    <Box position="fixed" bottom={bottom} left="0" right="0" pointerEvents="none">
      <Container maxWidth={PAGE_MAX_WIDTH} paddingX={PAGE_PADDING_X} display="flex" justifyContent={align}>
        <IconButton
          rounded="full"
          bg="fg"
          color="bg"
          aria-label="맨 위로"
          pointerEvents="auto"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <LuArrowUp />
        </IconButton>
      </Container>
    </Box>
  );
};
