import { Flex, Button, Text } from '@chakra-ui/react';
import {
    Package,
    PartyPopper,
    Users,
    Settings
} from 'lucide-react';

export default function MyMenu() {
    return (
        <Flex
            className="menu-section"
            justify="space-around"
            mt="22px"
            px="10px"
            pb="20px"
            borderBottom="1px solid"
            borderColor="gray.100"
        >
            <Button
                variant="ghost"
                className="menu-item"
            >
                <Flex direction="column" align="center" gap="6px">
                    <Package size={22} strokeWidth={1.7} />
                    <Text fontSize="13px">
                        주문
                    </Text>
                </Flex>
            </Button>

            <Button
                variant="ghost"
                className="menu-item"
            >
                <Flex direction="column" align="center" gap="6px">
                    <PartyPopper size={22} strokeWidth={1.7} />
                    <Text fontSize="13px">
                        이벤트
                    </Text>
                </Flex>
            </Button>

            <Button
                variant="ghost"
                className="menu-item"
            >
                <Flex direction="column" align="center" gap="6px">
                    <Users size={22} strokeWidth={1.7} />
                    <Text fontSize="13px">
                        커뮤니티
                    </Text>
                </Flex>
            </Button>

            <Button
                variant="ghost"
                className="menu-item"
            >
                <Flex direction="column" align="center" gap="6px">
                    <Settings size={22} strokeWidth={1.7} />
                    <Text fontSize="13px">
                        설정
                    </Text>
                </Flex>
            </Button>
        </Flex>
    );
}