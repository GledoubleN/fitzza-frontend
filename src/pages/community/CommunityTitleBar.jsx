import { Button, Flex } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

export const CommunityTitleBar = ({ title = '커뮤니티', children }) => {
  const navigate = useNavigate()

  return (
    <Flex align="center" justify="space-between" gap="4" minHeight="10">
      <Button
        variant="plain"
        paddingX="0"
        fontSize="lg"
        fontWeight="bold"
        onClick={ () => navigate('/community/main') }
      >
        { title }
      </Button>
      { children }
    </Flex>
  )
}
