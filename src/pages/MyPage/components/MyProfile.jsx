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
            <Box
                width="80px"
                height="80px"
                border="1px solid"
                borderColor="#e5e5e5"
                borderRadius="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="38px"
                bg="#f7f7f7"
            >
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