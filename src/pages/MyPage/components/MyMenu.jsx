import { Flex, Button, Text } from '@chakra-ui/react';
import {
    LuPackage,
    LuPartyPopper,
    LuUsers,
    LuSettings
} from 'react-icons/lu';

export default function MyMenu() {
    return (
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
                    <Text fontSize="13px">
                        주문
                    </Text>
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
                    <Text fontSize="13px">
                        이벤트
                    </Text>
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
                    <Text fontSize="13px">
                        커뮤니티
                    </Text>
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
                    <Text fontSize="13px">
                        설정
                    </Text>
                </Flex>
            </Button>
        </Flex>
    );
}