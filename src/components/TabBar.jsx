import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { NavLink } from "react-router-dom";
import { LuLayoutGrid, LuUsers, LuHouse, LuHeart, LuUser } from "react-icons/lu";

// 마운트 시 1회 재생되는 팝(살짝 오버슈트). 바가 페이지마다 새로 마운트되므로
// 탭 전환마다 활성 아이콘이 톡 튀어오름.
const pop = keyframes`
  0%   { transform: scale(0.6); opacity: 0.3; }
  60%  { transform: scale(1.22); }
  100% { transform: scale(1.12); opacity: 1; }
`;

// 순서: 카테고리, 커뮤니티, 홈, 찜, 프로필. 활성 시 strokeWidth로 볼드 강조.
const items = [
  { to: "/category", label: "카테고리", icon: LuLayoutGrid },
  { to: "/communitymain", label: "커뮤니티", icon: LuUsers },
  { to: "/", label: "홈", icon: LuHouse, end: true },
  { to: "/likes", label: "찜", icon: LuHeart },
  { to: "/mypage", label: "프로필", icon: LuUser },
];

export const TabBar = () => {
  return (
    <Box
      as="nav"
      position="fixed"
      bottom="calc(env(safe-area-inset-bottom, 0px) + 12px)"
      left={4}
      right={4}
      mx="auto"
      maxW="480px"
      zIndex="docked"
      bg="bg.panel/10"
      backdropFilter="blur(6px) saturate(150%)"
      borderWidth="1px"
      borderColor="border.subtle"
      borderRadius="full"
      boxShadow="0 8px 32px rgba(0,0,0,0.12)"
    >
      <Flex align="stretch" justify="space-around" px={2} py={1}>
        {items.map(({ to, label, icon, end }) => (
          <NavLink key={to} to={to} end={end} style={{ flex: 1 }}>
            {({ isActive }) => (
              <Flex
                direction="column"
                align="center"
                gap={1}
                px={2}
                py={1}
                borderRadius="full"
                color={isActive ? "fg" : "fg.muted"}
                bg={isActive ? "gray.900/3" : "transparent"}
                borderWidth="1px"
                borderColor={isActive ? "border.subtle" : "transparent"}
                backdropFilter={isActive ? "blur(1px)" : undefined}
                transition="background-color 0.25s ease, border-color 0.25s ease, color 0.2s ease, transform 0.12s ease"
                _active={{ transform: "scale(0.9)" }}
              >
                <Icon
                  as={icon}
                  boxSize={6}
                  strokeWidth={isActive ? 2.5 : 2}
                  transform={isActive ? "scale(1.05)" : "scale(1)"}
                  animation={isActive ? `${pop} 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)` : undefined}
                />
                <Text fontSize="xs" whiteSpace="nowrap" fontWeight={isActive ? "semibold" : "medium"}>
                  {label}
                </Text>
              </Flex>
            )}
          </NavLink>
        ))}
      </Flex>
    </Box>
  );
};
