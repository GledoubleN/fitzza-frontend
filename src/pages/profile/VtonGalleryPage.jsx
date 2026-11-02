import { Box, Container, Flex, Heading, IconButton, Stack } from '@chakra-ui/react'
import { LuChevronLeft } from 'react-icons/lu'
import { useLocation, useNavigate } from 'react-router-dom'
import { Header } from '../../components/Header.jsx'
import { TabBar } from '../../components/TabBar.jsx'
import { VtonGallery } from './VtonGallery.jsx'

export const VtonGalleryPage = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const goBack = () => {
    if (location.key === 'default') {
      navigate('/profile', { replace: true })
      return
    }
    navigate(-1)
  }

  return (
    <Stack paddingY={ 4 } minHeight={ 'vh' } gap={ 4 }>
      <Header></Header>
      <Container maxWidth={ '5xl' } flex={ 1 }>
        <Stack gap={ 4 }>
          <Flex
            align="center"
            gap={ 4 }
          >
            <IconButton
              variant="ghost"
              aria-label="이전 화면으로 돌아가기"
              onClick={ goBack }
            >
              <Box
                as={ LuChevronLeft }
                boxSize={ 6 }
              />
            </IconButton>
            <Heading>가상 피팅 갤러리</Heading>
          </Flex>
          <VtonGallery></VtonGallery>
        </Stack>
      </Container>
      <TabBar/>
    </Stack>
  )
}
