import { Button, Flex } from '@chakra-ui/react'
import { LuChevronLeft } from 'react-icons/lu'
import { useLocation, useNavigate } from 'react-router-dom'

export const CommunityTitleBar = ({ title = '커뮤니티', fallback = '/community/main', children }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const goBack = () => location.key === 'default' ? navigate(fallback, { replace: true }) : navigate(-1)

  return (
    <Flex align="center" justify="space-between" gap="4">
      <Button variant="plain" paddingX="0" fontSize="lg" fontWeight="bold" onClick={ goBack }>
        <LuChevronLeft/> { title }
      </Button>
      { children }
    </Flex>
  )
}
