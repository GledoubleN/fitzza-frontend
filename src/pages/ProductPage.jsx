import { Stack, Card, Image, Button, Tabs, Box, Heading, Text } from '@chakra-ui/react'
import { PageLayout } from '../components/PageLayout.jsx'
import { AppBar } from '../components/AppBar.jsx'
import exampleProductImage from '/src/assets/hero.png'
import { useParams } from 'react-router-dom'

export const ProductPage = () => {
  const { id } = useParams()

  return (
    <PageLayout>
      <Stack height={ '100%' } direction={ 'column' } paddingY={ '4' } gap={ '4' }>
        <AppBar></AppBar>

        <Card.Root>
          <Card.Body>
            <Image src={ exampleProductImage }></Image>
          </Card.Body>
        </Card.Root>

        <Card.Root>
          <Card.Body>
            <Stack>
              <Text>09.22 (화) 도착 예정 · 도착 확률 99%</Text>
              <Text>결제 3일 이내 발송 예정 · 우체국택배</Text>
            </Stack>
          </Card.Body>
        </Card.Root>

        <Button>구매하기</Button>

        <Tabs.Root>
          <Tabs.List>
            <Tabs.Trigger flex="1" justifyContent={ 'center' } value={ 'information' }>정보</Tabs.Trigger>
            <Tabs.Trigger flex="1" justifyContent={ 'center' } value={ 'projects' }>사이즈</Tabs.Trigger>
            <Tabs.Trigger flex="1" justifyContent={ 'center' } value={ 'tasks' }>후기</Tabs.Trigger>
            <Tabs.Trigger flex="1" justifyContent={ 'center' } value={ 'inquiries' }>문의</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="information">
            <Box width={ '100%' } height={ '100vh' }>
              This is size information
            </Box>
          </Tabs.Content>
          <Tabs.Content value="projects">
            <Box width={ '100%' } height={ '100vh' }>
              This is product information
            </Box>
          </Tabs.Content>
          <Tabs.Content value="tasks">
            <Stack width={ '100%' } height={ '100vh' }>
              <Box>
                <Heading>Title</Heading>
                <Text>Hello World</Text>
              </Box>
              <Box>
                <Heading>Title</Heading>
                <Text>Hello World</Text>
              </Box>
              <Box>
                <Heading>Title</Heading>
                <Text>Hello World</Text>
              </Box>
            </Stack>
          </Tabs.Content>
          <Tabs.Content value="inquiries">
            <Stack width={ '100%' } height={ '100vh' }>
              <Box>
                <Heading>Title</Heading>
                <Text>Hello World</Text>
              </Box>
              <Box>
                <Heading>Title</Heading>
                <Text>Hello World</Text>
              </Box>
              <Box>
                <Heading>Title</Heading>
                <Text>Hello World</Text>
              </Box>
            </Stack>
          </Tabs.Content>
        </Tabs.Root>
      </Stack>
    </PageLayout>
  )
}