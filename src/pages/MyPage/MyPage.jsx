import { Box, Flex, Heading, Button, Text } from '@chakra-ui/react';
import {
    Package,
    PartyPopper,
    Users,
    Settings,
    Menu,
    Camera,
    House,
    Heart,
    User
} from 'lucide-react';
import './MyPage.css';

export default function MyPage() {
    return (
        <Box className="my-page">

            <MyHeader />

            <Flex
                className="profile-section"
                direction="column"
                align="center"
                pt="24px"
                pb="20px"
            >
                <Box className="profile-image">
                    👤
                </Box>

                <Heading
                    size="md"
                    mt="10px"
                    fontWeight="600"
                >
                    사용자
                </Heading>

                <Text
                    mt="2px"
                    fontSize="14px"
                    color="gray.500"
                >
                    @fit_user
                </Text>
            </Flex>
            <Box
                className="summary-section"
                mx="16px"
                px="10px"
                py="18px"
                border="1px solid"
                borderColor="gray.100"
                borderRadius="16px"
            >
                <Flex align="center">

                    <Box flex="1" px="12px">
                        <Text
                            fontSize="13px"
                            color="gray.500"
                            mb="4px"
                        >
                            적립금
                        </Text>

                        <Text
                            fontSize="17px"
                            fontWeight="600"
                        >
                            7,777원
                        </Text>
                    </Box>

                    <Box
                        width="1px"
                        height="35px"
                        bg="gray.100"
                    />

                    <Box flex="1" px="12px">
                        <Text
                            fontSize="13px"
                            color="gray.500"
                            mb="4px"
                        >
                            쿠폰
                        </Text>

                        <Text
                            fontSize="17px"
                            fontWeight="600"
                        >
                            11장
                        </Text>
                    </Box>

                </Flex>
                <Flex
                    className="menu-section"
                    justify="space-around"
                    mt="22px"
                    px="10px"
                >
                    <Button
                        variant="ghost"
                        className="menu-item"
                    >
                        <Flex direction="column" align="center" gap="6px">
                            <Package size={22} strokeWidth={1.7} />
                            <Text fontSize="13px">
                                주문
                            </Text>
                        </Flex>
                    </Button>

                    <Button
                        variant="ghost"
                        className="menu-item"
                    >
                        <Flex direction="column" align="center" gap="6px">
                            <PartyPopper size={22} strokeWidth={1.7} />
                            <Text fontSize="13px">
                                이벤트
                            </Text>
                        </Flex>
                    </Button>

                    <Button
                        variant="ghost"
                        className="menu-item"
                    >
                        <Flex direction="column" align="center" gap="6px">
                            <Users size={22} strokeWidth={1.7} />
                            <Text fontSize="13px">
                                커뮤니티
                            </Text>
                        </Flex>
                    </Button>

                    <Button
                        variant="ghost"
                        className="menu-item"
                    >
                        <Flex direction="column" align="center" gap="6px">
                            <Settings size={22} strokeWidth={1.7} />
                            <Text fontSize="13px">
                                설정
                            </Text>
                        </Flex>
                    </Button>
                </Flex>
                <Flex
                    className="follow-section"
                    justify="center"
                    align="center"
                    py="16px"
                >
                    <Flex
                        flex="1"
                        direction="column"
                        align="center"
                    >
                        <Text
                            fontSize="13px"
                            color="gray.500"
                        >
                            팔로잉
                        </Text>

                        <Text
                            fontSize="16px"
                            fontWeight="600"
                            mt="3px"
                        >
                            36
                        </Text>
                    </Flex>

                    <Box
                        width="1px"
                        height="28px"
                        bg="gray.100"
                    />

                    <Flex
                        flex="1"
                        direction="column"
                        align="center"
                    >
                        <Text
                            fontSize="13px"
                            color="gray.500"
                        >
                            팔로워
                        </Text>

                        <Text
                            fontSize="16px"
                            fontWeight="600"
                            mt="3px"
                        >
                            128
                        </Text>
                    </Flex>
                </Flex>
                <Box
                    className="snap-section"
                    px="16px"
                    pt="20px"
                >
                    <Flex
                        justify="space-between"
                        align="center"
                        mb="12px"
                    >
                        <Heading
                            size="sm"
                            fontWeight="700"
                        >
                            나의 스냅
                        </Heading>

                        <Button
                            variant="ghost"
                            size="sm"
                            color="gray.500"
                        >
                            전체보기 &gt;
                        </Button>
                    </Flex>

                    <Box className="snap-grid">

                        <Box className="snap-item">
                            <img src="/images/snap1.jpg" alt="나의 스냅 1" />
                        </Box>

                        <Box className="snap-item">
                            <img src="/images/snap2.jpg" alt="나의 스냅 2" />
                        </Box>

                        <Box className="snap-item">
                            <img src="/images/snap3.jpg" alt="나의 스냅 3" />
                        </Box>

                        <Box className="snap-item">
                            <img src="/images/snap4.jpg" alt="나의 스냅 4" />
                        </Box>

                    </Box>
                </Box>
                <Box
                    className="bottom-navigation"
                    position="fixed"
                    bottom="0"
                    left="50%"
                    transform="translateX(-50%)"
                    width="100%"
                    maxWidth="390px"
                    bg="white"
                    borderTop="1px solid"
                    borderColor="gray.100"
                    zIndex="10"
                >
                    <Flex
                        justify="space-around"
                        align="center"
                        py="8px"
                    >
                        <Button variant="ghost" className="bottom-item">
                            <Flex direction="column" align="center" gap="2px">
                                <Menu size={20} />
                                <Text fontSize="10px">카테고리</Text>
                            </Flex>
                        </Button>

                        <Button variant="ghost" className="bottom-item">
                            <Flex direction="column" align="center" gap="2px">
                                <Camera size={20} />
                                <Text fontSize="10px">스냅</Text>
                            </Flex>
                        </Button>

                        <Button variant="ghost" className="bottom-item">
                            <Flex direction="column" align="center" gap="2px">
                                <House size={20} />
                                <Text fontSize="10px">홈</Text>
                            </Flex>
                        </Button>

                        <Button variant="ghost" className="bottom-item">
                            <Flex direction="column" align="center" gap="2px">
                                <Heart size={20} />
                                <Text fontSize="10px">좋아요</Text>
                            </Flex>
                        </Button>

                        <Button variant="ghost" className="bottom-item">
                            <Flex direction="column" align="center" gap="2px">
                                <User size={20} />
                                <Text fontSize="10px">프로필</Text>
                            </Flex>
                        </Button>
                    </Flex>
                </Box>
            </Box>
        </Box>
    );
}