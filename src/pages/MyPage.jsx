import {
    Container,
    Box,
    Flex,
    Heading,
    Button,
    Text,
    Grid,
    Image
} from '@chakra-ui/react';
import {
    LuPackage,
    LuPartyPopper,
    LuUsers,
    LuSettings
} from 'react-icons/lu';
import { TabBar } from '../components/TabBar.jsx';

export default function MyPage() {
    return (
        <>
        <Container
            width="100%"
            maxWidth="390px"
            minHeight="100vh"
            mx="auto"
            pb="96px"
            bg="white"
        >
            {/* MyHeader */}
            <Flex
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

            {/* MyProfile */}
            <Flex
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

            {/* MySummary */}
            <Box
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

            {/* MyMenu */}
            <Flex
                justify="space-around"
                mt="22px"
                px="10px"
                pb="20px"
                borderBottom="1px solid"
                borderColor="gray.100"
            >
                <Button
                    variant="ghost"
                    minWidth="70px"
                    height="auto"
                    p="6px"
                >
                    <Flex direction="column" align="center" gap="6px">
                        <LuPackage size={22} />
                        <Text fontSize="13px">주문</Text>
                    </Flex>
                </Button>

                <Button
                    variant="ghost"
                    minWidth="70px"
                    height="auto"
                    p="6px"
                >
                    <Flex direction="column" align="center" gap="6px">
                        <LuPartyPopper size={22} />
                        <Text fontSize="13px">이벤트</Text>
                    </Flex>
                </Button>

                <Button
                    variant="ghost"
                    minWidth="70px"
                    height="auto"
                    p="6px"
                >
                    <Flex direction="column" align="center" gap="6px">
                        <LuUsers size={22} />
                        <Text fontSize="13px">커뮤니티</Text>
                    </Flex>
                </Button>

                <Button
                    variant="ghost"
                    minWidth="70px"
                    height="auto"
                    p="6px"
                >
                    <Flex direction="column" align="center" gap="6px">
                        <LuSettings size={22} />
                        <Text fontSize="13px">설정</Text>
                    </Flex>
                </Button>
            </Flex>

            {/* FollowInfo */}
            <Flex
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
                    <Text fontSize="13px" color="gray.500">
                        팔로잉
                    </Text>
                    <Text fontSize="16px" fontWeight="600" mt="3px">
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
                    <Text fontSize="13px" color="gray.500">
                        팔로워
                    </Text>
                    <Text fontSize="16px" fontWeight="600" mt="3px">
                        128
                    </Text>
                </Flex>
            </Flex>

            {/* MySnap */}
            <Box
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

        </Container>
        <TabBar />
        </>
    );
}