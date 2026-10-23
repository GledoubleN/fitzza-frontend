import { useEffect, useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
  Stack,
  Tabs,
  Text,
} from '@chakra-ui/react'
import { LuChartColumn, LuMessageSquare, LuShoppingBag } from 'react-icons/lu'
import { Header } from '../components/Header.jsx'
import { Footer } from '../components/Footer.jsx'
import { api } from '../api/axios.js'

const periods = [
  { value: 'daily', label: '일간' },
  { value: 'weekly', label: '주간' },
  { value: 'monthly', label: '월간' },
  { value: 'yearly', label: '연간' },
]

const formatNumber = (value) => value.toLocaleString('ko-KR')
const sumCounts = (items) => items.reduce((total, item) => total + item.count, 0)

const SummaryCard = ({ icon, label, value, unit, detail }) => (
  <Card.Root bg="bg.panel" borderColor="border">
    <Card.Body gap={ 4 } padding={ 8 }>
      <Flex align="center" justify="space-between" gap={ 4 }>
        <Text color="fg.muted" fontWeight="medium">{ label }</Text>
        <Box color="primary.fg" fontSize="xl">{ icon }</Box>
      </Flex>
      <Text fontSize="3xl" fontWeight="bold" fontVariantNumeric="tabular-nums">
        { formatNumber(value) }
        <Text as="span" fontSize="sm" color="fg.muted" marginStart={ 4 }>{ unit }</Text>
      </Text>
      <Text fontSize="sm" color="fg.muted">{ detail }</Text>
    </Card.Body>
  </Card.Root>
)

const RankingCard = ({ title, description, items, unit }) => (
  <Card.Root as="section" bg="bg.panel" borderColor="border">
    <Card.Header padding={ 8 }>
      <Flex align="center" justify="space-between" gap={ 4 }>
        <Heading size="lg">{ title }</Heading>
        <Badge bg="bg.muted" color="fg.muted">TOP { items.length }</Badge>
      </Flex>
      <Text fontSize="sm" color="fg.muted">{ description }</Text>
    </Card.Header>
    <Card.Body padding={ 8 } paddingTop={ 0 }>
      <Stack as="ol" listStyleType="none" gap={ 8 } margin={ 0 } padding={ 0 }>
        { items.map((item, index) => (
          <Flex key={ item.name } as="li" align="start" gap={ 4 }>
            <Flex
              align="center"
              justify="center"
              boxSize={ 8 }
              flexShrink={ 0 }
              borderRadius="lg"
              bg={ index === 0 ? 'primary.subtle' : 'bg.muted' }
              color={ index === 0 ? 'primary.fg' : 'fg.muted' }
              fontWeight="bold"
            >
              { index + 1 }
            </Flex>
            <Stack flex={ 1 } minWidth={ 0 } gap={ 4 }>
              <Flex justify="space-between" align="start" gap={ 4 }>
                <Box minWidth={ 0 }>
                  <Text fontWeight="medium" overflowWrap="anywhere">{ item.name }</Text>
                  { item.brand && <Text fontSize="xs" color="fg.muted">{ item.brand }</Text> }
                </Box>
                <Text flexShrink={ 0 } fontSize="sm" fontVariantNumeric="tabular-nums">
                  { formatNumber(item.count) }{ unit }
                </Text>
              </Flex>
              <Box height={ 1 } bg="bg.muted" borderRadius="full" overflow="hidden">
                <Box
                  height="full"
                  width={ `${ item.count / items[0].count * 100 }%` }
                  bg={ index === 0 ? 'primary.solid' : 'secondary.emphasized' }
                  borderRadius="full"
                />
              </Box>
            </Stack>
          </Flex>
        )) }
      </Stack>
    </Card.Body>
  </Card.Root>
)

export const DashboardPage = () => {
  const [period, setPeriod] = useState('daily')
  const [result, setResult] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const status = result?.period === period && result?.attempt === attempt ? result.status : 'loading'
  const data = status === 'success' ? result.data : { usage: [], keywords: [], products: [] }

  useEffect(() => {
    const controller = new AbortController()

    api.get('/analytics', { params: { period }, signal: controller.signal })
      .then(({ data }) => {
        if (!controller.signal.aborted) setResult({ period, attempt, status: 'success', data })
      })
      .catch(() => {
        if (!controller.signal.aborted) setResult({ period, attempt, status: 'error' })
      })

    return () => controller.abort()
  }, [period, attempt])

  const inputTokens = data.usage.reduce((total, item) => total + item.input, 0)
  const outputTokens = data.usage.reduce((total, item) => total + item.output, 0)
  const maxTokens = Math.max(1, ...data.usage.map((item) => item.input + item.output))

  return (
    <Stack
      gap={ 4 }
      paddingY={ 4 }
      minHeight="vh"
      bg="bg"
      color="fg"
    >
      <Header/>

      <Container
        as="main"
        maxWidth="5xl"
        flex={ 1 }
      >
        <Stack gap={ 8 }>
          <Stack gap={ 4 }>
            <Flex align="center" gap={ 4 } wrap="wrap">
              <Badge bg="primary.subtle" color="primary.fg">ADMIN</Badge>
              { import.meta.env.VITE_ENABLE_MOCKING === 'true' && (
                <Badge bg="bg.muted" color="fg.muted">예시 데이터</Badge>
              ) }
            </Flex>
            <Heading as="h1" size="3xl">관리자 대시보드</Heading>
            <Text color="fg.muted">AI 사용 현황과 사용자 관심사, 상품 추천 추이를 확인하세요.</Text>
          </Stack>

          <Tabs.Root value={ period } onValueChange={ ({ value }) => setPeriod(value) } variant="outline">
            <Tabs.List aria-label="통계 조회 기간">
              { periods.map(({ value, label }) => (
                <Tabs.Trigger key={ value } value={ value } flex={ 1 } paddingX={ 4 }>
                  { label }
                </Tabs.Trigger>
              )) }
            </Tabs.List>
            { periods.map(({ value }) => (
              <Tabs.Content key={ value } value={ value } paddingTop={ 8 } paddingBottom={ 0 }>
                { status === 'loading' && (
                  <Stack align="center" gap={ 4 } paddingY={ 8 } role="status">
                    <Spinner/>
                    <Text color="fg.muted">통계를 불러오는 중입니다.</Text>
                  </Stack>
                ) }
                { status === 'error' && (
                  <Stack align="center" gap={ 4 } paddingY={ 8 } role="alert">
                    <Text color="fg.error">통계를 불러오지 못했습니다.</Text>
                    <Button variant="outline" onClick={ () => setAttempt((value) => value + 1) }>
                      다시 시도
                    </Button>
                  </Stack>
                ) }
                { status === 'success' && (
                  <Stack gap={ 8 }>
                    <Flex justify="space-between" gap={ 4 } wrap="wrap" color="fg.muted" fontSize="sm">
                      <Text>{ data.description }</Text>
                      { import.meta.env.VITE_ENABLE_MOCKING === 'true' && (
                        <Text>실제 운영 통계가 아닌 화면 확인용 예시입니다.</Text>
                      ) }
                    </Flex>

                    <SimpleGrid columns={ { base: 1, md: 3 } } gap={ 4 }>
                      <SummaryCard
                        icon={ <LuChartColumn/> }
                        label="총 토큰 사용량"
                        value={ inputTokens + outputTokens }
                        unit="토큰"
                        detail={ `입력 ${ formatNumber(inputTokens) } · 출력 ${ formatNumber(outputTokens) }` }
                      />
                      <SummaryCard
                        icon={ <LuMessageSquare/> }
                        label="인기 프롬프트 키워드"
                        value={ sumCounts(data.keywords) }
                        unit="회"
                        detail={ `상위 ${ data.keywords.length }개 키워드 입력 횟수 합계` }
                      />
                      <SummaryCard
                        icon={ <LuShoppingBag/> }
                        label="인기 상품 추천"
                        value={ sumCounts(data.products) }
                        unit="회"
                        detail={ `상위 ${ data.products.length }개 상품 추천 횟수 합계` }
                      />
                    </SimpleGrid>

                    <Card.Root as="section" bg="bg.panel" borderColor="border">
                      <Card.Header padding={ 8 }>
                        <Heading size="lg">토큰 사용량 추이</Heading>
                        <Flex gap={ 4 } wrap="wrap" fontSize="sm" color="fg.muted">
                          <Text>입력 토큰 { formatNumber(inputTokens) }</Text>
                          <Text>출력 토큰 { formatNumber(outputTokens) }</Text>
                        </Flex>
                      </Card.Header>
                      <Card.Body padding={ 8 } paddingTop={ 0 }>
                        <Box overflowX="auto">
                          <Flex align="end" gap={ 4 } minWidth={ data.usage.length > 7 ? '2xl' : 'md' }>
                            { data.usage.map((item) => (
                              <Stack key={ item.label } flex={ 1 } align="center" gap={ 4 }>
                                <Text fontSize="xs" color="fg.muted">
                                  { formatNumber((item.input + item.output) / 1000) }천
                                </Text>
                                <Flex height={ 48 } width="full" align="end" justify="center" gap={ 0 }>
                                  <Stack
                                    width="full"
                                    maxWidth={ 12 }
                                    height={ `${ (item.input + item.output) / maxTokens * 100 }%` }
                                    gap={ 0 }
                                    overflow="hidden"
                                    borderTopRadius="md"
                                    role="img"
                                    aria-label={ `${ item.label }: 입력 ${ formatNumber(item.input) }, 출력 ${ formatNumber(item.output) } 토큰` }
                                    title={ `입력 ${ formatNumber(item.input) } / 출력 ${ formatNumber(item.output) }` }
                                  >
                                    <Box flex={ item.output } bg="secondary.emphasized"/>
                                    <Box flex={ item.input } bg="primary.solid"/>
                                  </Stack>
                                </Flex>
                                <Text fontSize="xs" color="fg.muted">{ item.label }</Text>
                              </Stack>
                            )) }
                          </Flex>
                        </Box>
                        <Flex justify="center" gap={ 8 } marginTop={ 8 } fontSize="sm">
                          <Flex align="center" gap={ 4 }>
                            <Box boxSize={ 4 } bg="primary.solid" borderRadius="sm"/>
                            <Text>입력 토큰</Text>
                          </Flex>
                          <Flex align="center" gap={ 4 }>
                            <Box boxSize={ 4 } bg="secondary.emphasized" borderRadius="sm"/>
                            <Text>출력 토큰</Text>
                          </Flex>
                        </Flex>
                      </Card.Body>
                    </Card.Root>

                    <SimpleGrid columns={ { base: 1, lg: 2 } } gap={ 8 }>
                      <RankingCard
                        title="프롬프트 키워드 순위"
                        description="사용자가 입력한 키워드를 횟수순으로 정렬했습니다."
                        items={ data.keywords }
                        unit="회"
                      />
                      <RankingCard
                        title="추천 상품 순위"
                        description="AI가 추천한 상품을 추천 횟수순으로 정렬했습니다."
                        items={ data.products }
                        unit="회"
                      />
                    </SimpleGrid>
                  </Stack>
                ) }
              </Tabs.Content>
            )) }
          </Tabs.Root>
        </Stack>
      </Container>

      <Container
        as="footer"
        maxWidth="5xl"
      >
        <Footer/>
      </Container>
    </Stack>
  )
}