import { Box, Flex, Heading, Button } from '@chakra-ui/react';

export default function MySnap() {
    return (
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
                    <img
                        src="/images/snap1.jpg"
                        alt="나의 스냅 1"
                    />
                </Box>

                <Box className="snap-item">
                    <img
                        src="/images/snap2.jpg"
                        alt="나의 스냅 2"
                    />
                </Box>

                <Box className="snap-item">
                    <img
                        src="/images/snap3.jpg"
                        alt="나의 스냅 3"
                    />
                </Box>

                <Box className="snap-item">
                    <img
                        src="/images/snap4.jpg"
                        alt="나의 스냅 4"
                    />
                </Box>

            </Box>
        </Box>
    );
}