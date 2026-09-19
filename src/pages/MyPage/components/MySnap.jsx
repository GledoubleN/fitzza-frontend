import {
    Box,
    Flex,
    Grid,
    Heading,
    Button,
    Image
} from '@chakra-ui/react';

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

            <Grid
                templateColumns="repeat(2, 1fr)"
                gap="4px"
            >

                <Box
                    width="100%"
                    aspectRatio="1 / 1"
                    overflow="hidden"
                >
                    <Image
                        src="/images/snap1.jpg"
                        alt="나의 스냅 1"
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        display="block"
                    />
                </Box>

                <Box
                    width="100%"
                    aspectRatio="1 / 1"
                    overflow="hidden"
                >
                    <Image
                        src="/images/snap2.jpg"
                        alt="나의 스냅 2"
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        display="block"
                    />
                </Box>

                <Box
                    width="100%"
                    aspectRatio="1 / 1"
                    overflow="hidden"
                >
                    <Image
                        src="/images/snap3.jpg"
                        alt="나의 스냅 3"
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        display="block"
                    />
                </Box>

                <Box
                    width="100%"
                    aspectRatio="1 / 1"
                    overflow="hidden"
                >
                    <Image
                        src="/images/snap4.jpg"
                        alt="나의 스냅 4"
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        display="block"
                    />
                </Box>

            </Grid>
        </Box>
    );
}