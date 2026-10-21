import { Container, Heading, Stack } from '@chakra-ui/react'
import { Header } from '../../components/Header.jsx'
import { TabBar } from '../../components/TabBar.jsx'
import { Toaster } from '../../components/ui/toaster.jsx'
import { VtonGallery } from './VtonGallery.jsx'

export const VtonGalleryPage = () => {
  return (
    <Stack paddingY={ 4 } minHeight={ 'vh' } gap={ 4 }>
      <Header></Header>
      <Container maxWidth={ '5xl' } flex={ 1 }>
        <Stack gap={ 4 }>
          <Heading>가상 피팅 갤러리</Heading>
          <VtonGallery></VtonGallery>
        </Stack>
      </Container>
      <TabBar/>
      <Toaster></Toaster>
    </Stack>
  )
}
