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

        </Box>
    );
}