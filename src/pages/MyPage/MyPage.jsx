import { Box, Flex, Heading, Button, Text } from '@chakra-ui/react';
import './MyPage.css';

export default function MyPage() {
    return (
        <Box className="my-page">

            <Flex
                className="my-header"
                align="center"
                justify="space-between"
                px="20px"
                height="60px"
                borderBottom="1px solid"
                borderColor="gray.100"
            >
                <Heading
                    size="md"
                    fontWeight="700"
                >
                    마이페이지
                </Heading>

                <Button
                    variant="ghost"
                    size="sm"
                >
                    고객센터
                </Button>
            </Flex>

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
            </Box>
        </Box>
    );
}