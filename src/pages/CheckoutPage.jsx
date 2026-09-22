import {
  IconButton,
  Stack,
  Text,
  Card,
  Image,
  Grid,
  GridItem,
  Table,
  Heading,
  Button, Input,
  Select, createListCollection, Portal,
} from '@chakra-ui/react'
import { PageLayout } from '../components/PageLayout.jsx'
import { LuChevronLeft, LuMinus, LuPlus } from 'react-icons/lu'
import { products } from '../data/products.js'
import exampleProductImage from '/src/assets/react.svg'

export const CheckoutPage = () => {
  const frameworks = createListCollection({
    items: [
      { label: 'React.js', value: 'react' },
      { label: 'Vue.js', value: 'vue' },
      { label: 'Angular', value: 'angular' },
      { label: 'Svelte', value: 'svelte' },
    ],
  })

  return (
    <PageLayout>
      <Stack direction={ 'column' }>
        <Stack direction={ 'row' } gap={ '4' }>
          <IconButton rounded={ 'full' }>
            <LuChevronLeft></LuChevronLeft>
          </IconButton>
          <Text alignContent={ 'center' }>주문/결제</Text>
        </Stack>

        {
          products.slice(0, 3).map((product, index) => {
            return (
              <Card.Root key={ index }>
                <Card.Body>
                  <Grid templateColumns={ 'auto 1fr' } gap={ '4' }>
                    <GridItem>
                      <Image width={ '100px' } src={ exampleProductImage }></Image>
                    </GridItem>
                    <GridItem>
                      <Stack direction={ 'column' }>
                        <Text>{ product.name }</Text>
                        <Text>{ (product.price).toLocaleString() } 원</Text>
                        <Stack direction={ 'row' }>
                          <IconButton size={ 'sm' } rounded={ 'full' }>
                            <LuMinus></LuMinus>
                          </IconButton>
                          <Text alignContent={ 'center' }>{ 1 }</Text>
                          <IconButton size={ 'sm' } rounded={ 'full' }>
                            <LuPlus></LuPlus>
                          </IconButton>
                        </Stack>
                      </Stack>
                    </GridItem>
                  </Grid>
                </Card.Body>
              </Card.Root>
            )
          })
        }

        <Card.Root>
          <Card.Body>
            <Grid templateColumns={ 'auto 1fr' } gap={ '4' }>
              <GridItem alignContent={ 'center' }>
                <Text>
                  쿠폰
                </Text>
              </GridItem>
              <GridItem>
                <Select.Root collection={ frameworks }>
                  <Select.HiddenSelect/>
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select framework"/>
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator/>
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {
                          frameworks.items.map((framework) => (
                            <Select.Item item={ framework } key={ framework.value }>
                              { framework.label }
                              <Select.ItemIndicator/>
                            </Select.Item>
                          ))
                        }
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </GridItem>
              <GridItem alignContent={ 'center' }>
                <Text>
                  적립금
                </Text>
              </GridItem>
              <GridItem>
                <Stack direction={ 'row' }>
                  <Input></Input>
                  <Button>사용</Button>
                </Stack>
              </GridItem>
            </Grid>
          </Card.Body>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Title>결제금액</Card.Title>
          </Card.Header>
          <Card.Body>
            <Table.Root>
              <Table.Row>
                <Table.Cell>상품금액</Table.Cell>
                <Table.Cell textAlign="end">{ (300_000).toLocaleString() } 원</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>쿠폰할인</Table.Cell>
                <Table.Cell textAlign="end">- { (10_000).toLocaleString() } 원</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>적립금 사용</Table.Cell>
                <Table.Cell textAlign="end">- { (7_000).toLocaleString() } 원</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>배송비</Table.Cell>
                <Table.Cell textAlign="end">+ { (3_000).toLocaleString() } 원</Table.Cell>
              </Table.Row>
            </Table.Root>
          </Card.Body>
          <Card.Footer>
            <Table.Root>
              <Table.Row>
                <Table.Cell>
                  <Heading>총 결제금액</Heading>
                </Table.Cell>
                <Table.Cell textAlign="end">
                  <Heading>
                    { (286_000).toLocaleString() } 원
                  </Heading>
                </Table.Cell>
              </Table.Row>
            </Table.Root>
          </Card.Footer>
        </Card.Root>

        <Button>
          결제하기
        </Button>
      </Stack>
    </PageLayout>
  )
}