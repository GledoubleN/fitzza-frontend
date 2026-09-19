import { Flex, Heading, Button } from '@chakra-ui/react';

export default function MyHeader() {
    return (
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
    );
}