import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { LuLayoutGrid, LuUsers, LuHouse, LuHeart, LuUser } from "react-icons/lu";

// 순서: 카테고리, 커뮤니티, 홈, 찜, 프로필. 활성 시 strokeWidth로 볼드 강조.
const items = [
  { to: "/category", label: "카테고리", icon: LuLayoutGrid },
  { to: "/communitymain", label: "커뮤니티", icon: LuUsers },
  { to: "/", label: "홈", icon: LuHouse, end: true },
  { to: "/likes", label: "찜", icon: LuHeart },
  { to: "/mypage", label: "프로필", icon: LuUser },
];

export const BottomNavigationBar = () => {
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
      bg="bg.panel/70"
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
              >
                <Icon as={icon} boxSize={6} strokeWidth={isActive ? 2.75 : 2} />
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
