import { Button, Card, Flex, Grid, Heading, Stack, Text } from '@chakra-ui/react'
import { LuArrowUpRight, LuMessageSquare, LuPackage, LuSettings, LuSparkles } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'

const links = [
  { label: '주문', description: '구매한 상품과 배송 현황', icon: LuPackage, path: '/orders' },
  { label: '추천내역', description: '나를 위해 골라준 스타일', icon: LuSparkles, path: '/ai/history' },
  { label: '커뮤니티', description: '함께 나누는 스타일 이야기', icon: LuMessageSquare, path: '/community/main' },
  { label: '설정', description: '준비 중이에요', icon: LuSettings },
]

export const ProfileQuickLinks = () => {
  const navigate = useNavigate()

  return (
    <Card.Root
      as="section"
      rounded="3xl"
      borderColor="border.subtle"
    >
      <Card.Body
        padding={ { base: 4, md: 8 } }
        gap={ 4 }
      >
        <Heading
          as="h2"
          textStyle="md"
        >
          자주 찾는 메뉴
        </Heading>
        <Grid
          templateColumns="repeat(2, minmax(0, 1fr))"
          gap={ 4 }
        >
          { links.map(({ label, description, icon: LinkIcon, path }) => (
            <Button
              key={ label }
              variant="ghost"
              height="auto"
              padding={ 4 }
              rounded="2xl"
              bg="bg.subtle"
              whiteSpace="normal"
              disabled={ !path }
              onClick={ () => navigate(path) }
              _hover={ { bg: 'bg.muted' } }
            >
              <Stack
                width="full"
                gap={ 4 }
                align="start"
                textAlign="start"
              >
                <Flex
                  width="full"
                  align="center"
                  justify="space-between"
                  color="fg.muted"
                >
                  <LinkIcon/>
                  { path && <LuArrowUpRight/> }
                </Flex>
                <Stack gap={ 0 }>
                  <Text fontWeight="600">{ label }</Text>
                  <Text
                    textStyle="xs"
                    fontWeight="400"
                    color="fg.muted"
                  >
                    { description }
                  </Text>
                </Stack>
              </Stack>
            </Button>
          )) }
        </Grid>
      </Card.Body>
    </Card.Root>
  )
}