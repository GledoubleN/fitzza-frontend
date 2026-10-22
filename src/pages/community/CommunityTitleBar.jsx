import { Flex, Text } from '@chakra-ui/react'

export const CommunityTitleBar = ({ title = '커뮤니티', children }) => (
  <Flex align="center" justify="space-between" gap="4" minHeight="10">
    <Text fontSize="lg" fontWeight="bold">{ title }</Text>
    { children }
  </Flex>
)
