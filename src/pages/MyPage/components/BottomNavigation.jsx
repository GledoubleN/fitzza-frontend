import { Box, Flex, Button, Text } from '@chakra-ui/react';
import {
    LuMenu,
    LuCamera,
    LuHouse,
    LuHeart,
    LuUser
} from 'react-icons/lu';

export default function BottomNavigation() {
    return (
        <Box
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
                <Button
                    variant="ghost"
                    minWidth="55px"
                    height="auto"
                    p="4px"
                >
                    <Flex direction="column" align="center" gap="2px">
                        <LuMenu size={20} />
                        <Text fontSize="10px">
                            카테고리
                        </Text>
                    </Flex>
                </Button>

                <Button
                    variant="ghost"
                    minWidth="55px"
                    height="auto"
                    p="4px"
                >
                    <Flex direction="column" align="center" gap="2px">
                        <LuCamera size={20} />
                        <Text fontSize="10px">
                            스냅
                        </Text>
                    </Flex>
                </Button>

                <Button
                    variant="ghost"
                    minWidth="55px"
                    height="auto"
                    p="4px"
                >
                    <Flex direction="column" align="center" gap="2px">
                        <LuHouse size={20} />
                        <Text fontSize="10px">
                            홈
                        </Text>
                    </Flex>
                </Button>

                <Button
                    variant="ghost"
                    minWidth="55px"
                    height="auto"
                    p="4px"
                >
                    <Flex direction="column" align="center" gap="2px">
                        <LuHeart size={20} />
                        <Text fontSize="10px">
                            좋아요
                        </Text>
                    </Flex>
                </Button>

                <Button
                    variant="ghost"
                    minWidth="55px"
                    height="auto"
                    p="4px"
                >
                    <Flex direction="column" align="center" gap="2px">
                        <LuUser size={20} />
                        <Text fontSize="10px">
                            프로필
                        </Text>
                    </Flex>
                </Button>
            </Flex>
        </Box>
    );
}