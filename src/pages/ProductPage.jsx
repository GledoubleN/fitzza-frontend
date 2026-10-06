import {
  Container,
  Stack,
  Card,
  Image,
  Button,
  Tabs,
  Box,
  Heading,
  Text,
  Flex,
  Grid,
  GridItem,
  useTabs, IconButton,
  Avatar,
  Select, createListCollection, Portal,
} from '@chakra-ui/react'
import { AppBar } from '../components/AppBar.jsx'
import exampleProductImage from '/src/assets/hero.png'
import { useParams } from 'react-router-dom'
import { LuHeart } from 'react-icons/lu'
import { TabBar } from '../components/TabBar.jsx'

export const ProductPage = () => {
  const { id } = useParams()

  const tabs = useTabs({
    defaultValue: 'information',
  })

  const colors = createListCollection({
    items: [
      { label: '블랙', value: 'black' },
      { label: '그레이', value: 'gray' },
      { label: '네이비', value: 'navy' },
    ],
  })

  const sizes = createListCollection({
    items: [
      { label: 'S', value: 'small' },
      { label: 'M', value: 'medium' },
      { label: 'L', value: 'large' },
      { label: 'XL', value: 'extra-large' },
    ],
  })

  const getProductSelector = () => {
    return (
      <Stack gap={ 4 }>
        <Grid templateColumns={ 'auto 1fr' } gap={ 4 }>
          <Avatar.Root size={ 'xs' }></Avatar.Root>
          <Text alignContent={ 'center' }>고스트리퍼블릭</Text>
        </Grid>
        <Stack direction={ 'row' }>
          <Heading size={ { base: 'md', md: 'xl' } } alignContent={ 'center' }>
            헨리넥 세미크롭 맨투맨 3Color GMT-165
          </Heading>
          <IconButton variant={ 'ghost' } rounded={ 'full' }>
            <LuHeart></LuHeart>
          </IconButton>
        </Stack>
        <Select.Root collection={ colors } width="100%">
          <Select.HiddenSelect/>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="컬러"/>
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator/>
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {
                  colors.items.map((color) => (
                    <Select.Item item={ color } key={ color.value }>
                      { color.label }
                      <Select.ItemIndicator/>
                    </Select.Item>
                  ))
                }
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
        <Select.Root collection={ sizes } width="100%">
          <Select.HiddenSelect/>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="사이즈"/>
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator/>
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {
                  sizes.items.map((size) => (
                    <Select.Item item={ size } key={ size.value }>
                      { size.label }
                      <Select.ItemIndicator/>
                    </Select.Item>
                  ))
                }
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
        <Button width={ '100%' }>장바구니</Button>
      </Stack>
    )
  }

  function getEstimatedArrivalDate () {
    const date = new Date()
    const ESTIMATED_SHIPPING = 3
    date.setDate(date.getDate() + ESTIMATED_SHIPPING)

    return (
      date.toLocaleDateString('ko-KR', {
        month: '2-digit',
        day: '2-digit',
        weekday: 'short',
      }).replace(/\. \(/, ' (')
    );
  }

  return (
    <Stack height={ '100%' } direction={ 'column' } paddingY={ '4' } gap={ '4' }>
      <AppBar></AppBar>

      <Container maxWidth={ '7xl' }>
        <Grid templateColumns={ { base: '1fr', sm: '2fr 1fr' } } gap={ 4 }>
          <Stack gap={ 4 }>
            <Container maxWidth={ 'xl' }>
              <Image width={ '100%' } src={ exampleProductImage }></Image>
            </Container>

            <Box display={ { sm: 'none' } }>
              { getProductSelector() }
            </Box>

            <Card.Root>
              <Card.Body>
                <Stack>
                  <Text fontSize={ 'sm' }>{ getEstimatedArrivalDate() } 도착 예정 · 도착 확률 99%</Text>
                  <Text fontSize={ 'sm' }>결제 3일 이내 발송 예정 · 우체국택배</Text>
                </Stack>
              </Card.Body>
            </Card.Root>

            <Tabs.RootProvider value={ tabs }>
              <Tabs.List>
                <Tabs.Trigger flex="1" justifyContent={ 'center' } value={ 'information' }>정보</Tabs.Trigger>
                <Tabs.Trigger flex="1" justifyContent={ 'center' } value={ 'size' }>사이즈</Tabs.Trigger>
                <Tabs.Trigger flex="1" justifyContent={ 'center' } value={ 'review' }>후기</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="information">
                <Box width={ '100%' } height={ '100vh' }>
                  상품정보입니다.
                </Box>
              </Tabs.Content>
              <Tabs.Content value="size">
                <Box width={ '100%' } height={ '100vh' }>
                  사이즈입니다.
                </Box>
              </Tabs.Content>
              <Tabs.Content value="review">
                <Stack width={ '100%' } height={ '100vh' }>
                  후기입니다.
                </Stack>
              </Tabs.Content>
            </Tabs.RootProvider>
          </Stack>

          <GridItem
            display={ { base: 'none', sm: 'block' } }
            position={ 'sticky' }
            top={ 4 }
            alignSelf="start"
          >
            { getProductSelector() }
          </GridItem>
        </Grid>
      </Container>

      <TabBar></TabBar>
    </Stack>
  )
}