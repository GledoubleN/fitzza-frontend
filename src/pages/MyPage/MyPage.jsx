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

            <MySnap />
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