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

            <MyProfile />

            <MySummary />

            <MyMenu />

            <FollowInfo />
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