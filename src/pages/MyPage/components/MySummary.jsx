import { Box, Flex, Text } from '@chakra-ui/react';

export default function MySummary() {
    return (
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
    );
}