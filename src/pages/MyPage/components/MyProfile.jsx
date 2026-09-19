import { Box, Flex, Heading, Text } from '@chakra-ui/react';

export default function MyProfile() {
    return (
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
    );
}