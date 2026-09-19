import { Box, Flex, Text } from '@chakra-ui/react';

export default function FollowInfo() {
    return (
        <Flex
            className="follow-section"
            justify="center"
            align="center"
            py="16px"
            borderBottom="1px solid"
            borderColor="gray.100"
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
    );
}