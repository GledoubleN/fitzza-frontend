import { Button, Card, Container, Flex, IconButton, Spinner, Stack, Text } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { LuMenu } from 'react-icons/lu'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { AppBar } from '../../components/AppBar.jsx'
import { Toaster } from '../../components/ui/toaster.jsx'
import { ensureLogin, getRecommendation, getRecommendationMessages, postRecommendation } from './aiApi.js'
import { ComboCard } from './ComboCard.jsx'
import { ProductCard } from './ProductCard.jsx'

const POLL_INTERVAL = 2000
const MAX_POLLS = 30
const FAIL_MESSAGE = '추천을 불러오지 못했어요. 잠시 후 다시 시도해주세요.'

export const AiStylistPage = () => {
  const { requestId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [query, setQuery] = useState(location.state?.query ?? '')
  const [status, setStatus] = useState('loading')
  const [result, setResult] = useState(null)
  const [message, setMessage] = useState('')
  const [attempt, setAttempt] = useState(0)
  const postedKey = useRef(null)
  const activeKey = useRef(null)

  // 지금 보고 있는 화면의 위치. 요청 응답이 늦게 왔을 때 아직 같은 화면인지 확인하는 데 씁니다.
  useEffect(() => {
    activeKey.current = location.key
    return () => { activeKey.current = null }
  }, [location.key])

  const fail = (text) => {
    setStatus('failed')
    setMessage(text || FAIL_MESSAGE)
  }

  const request = async (text) => {
    setQuery(text)
    setResult(null)
    setStatus('loading')
    const key = location.key
    try {
      const data = await postRecommendation(text)
      // 응답을 기다리는 사이 다른 화면으로 옮겼으면 결과화면으로 강제로 이동시키지 않습니다.
      if (activeKey.current !== key) return
      navigate(`/ai/${ data.requestId }`, { replace: true, state: { query: text } })
    } catch (err) {
      if (activeKey.current !== key) return
      fail(err.response?.status === 400 ? '추천받을 내용을 입력해주세요.' : '')
    }
  }

  useEffect(() => {
    // 질의도 결과도 없이 들어오면 보여줄 것이 없으므로 메인 화면으로 돌려보냅니다.
    // 개발시에는 /ai/sample Route 사용 필요
    if (!requestId && !location.state?.query) {
      navigate('/', { replace: true })
      return
    }

    if (!ensureLogin(navigate)) return

    if (!requestId) {
      // 질의의 중복 전송을 방지합니다.
      const text = location.state?.query
      if (postedKey.current !== location.key) {
        postedKey.current = location.key
        request(text)
      }
      return
    }

    let cancelled = false
    let timer
    const poll = async (tries) => {
      try {
        const data = await getRecommendation(requestId)
        if (cancelled) return
        if (data.status === 'DONE') {
          setResult(data)
          setStatus('done')
        } else if (data.status === 'FAILED' || tries >= MAX_POLLS) {
          fail(data.message)
        } else {
          timer = setTimeout(() => poll(tries + 1), POLL_INTERVAL)
        }
      } catch {
        if (!cancelled) fail()
      }
    }

    setResult(null)
    setStatus('loading')
    const text = location.state?.query
    setQuery(text ?? '')
    if (!text) {
      getRecommendationMessages(requestId)
        .then((messages) => {
          if (!cancelled) setQuery(messages.find((m) => m.senderType === 'USER')?.content ?? '')
        })
        .catch(() => {})
    }
    poll(0)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [requestId, location.key, attempt])

  const retry = () => {
    if (query) request(query)
    else setAttempt((attempt) => attempt + 1)
  }

  const items = result?.items ?? []
  const combos = result?.combos ?? []
  const bubbleProps = { maxWidth: '4/5', rounded: '2xl' }

  return (
    <Stack gap={ 4 } paddingY={ 4 } minHeight={ 'vh' }>
      <AppBar maxWidth={ '3xl' }></AppBar>

      <Container maxWidth={ '3xl' } flex={ 1 }>
        <Stack gap={ 4 }>
          <Flex align={ 'center' } gap={ 3 }>
            <IconButton
              variant={ 'outline' }
              rounded={ 'full' }
              aria-label={ '대화 내역' }
              onClick={ () => navigate('/ai/history') }
            >
              <LuMenu></LuMenu>
            </IconButton>
            <Text color={ 'fg.muted' }>AI 스타일리스트</Text>
          </Flex>

          {
            query &&
            <Card.Root { ...bubbleProps } alignSelf={ 'flex-end' } bg={ 'bg.muted' }>
              <Card.Body>{ query }</Card.Body>
            </Card.Root>
          }

          {
            status === 'loading' &&
            <Card.Root { ...bubbleProps } alignSelf={ 'flex-start' }>
              <Card.Body>
                <Flex align={ 'center' } gap={ 3 }>
                  <Spinner size={ 'sm' }></Spinner>
                  <Text>고객님에게 맞는 제품을 찾고 있어요</Text>
                </Flex>
              </Card.Body>
            </Card.Root>
          }

          {
            status === 'failed' &&
            <Card.Root { ...bubbleProps } alignSelf={ 'flex-start' }>
              <Card.Body gap={ 3 }>
                <Text color={ 'fg.error' }>{ message }</Text>
                <Button variant={ 'outline' } alignSelf={ 'flex-start' } onClick={ retry }>다시 시도</Button>
              </Card.Body>
            </Card.Root>
          }

          {
            status === 'done' &&
            <>
              <Card.Root { ...bubbleProps } alignSelf={ 'flex-start' }>
                <Card.Body gap={ 1 }>
                  <Text>
                    {
                      result.message || (
                        items.length || combos.length
                          ? '고객님에게 맞는 제품을 찾았어요!'
                          : '조건에 맞는 상품을 찾지 못했어요.'
                      )
                    }
                  </Text>
                  {
                    result.tpoSummary &&
                    <Text fontSize={ 'sm' } color={ 'fg.muted' }>{ result.tpoSummary }</Text>
                  }
                </Card.Body>
              </Card.Root>

              {
                items.length > 0 &&
                <Card.Root rounded={ '2xl' }>
                  <Card.Body gap={ 3 }>
                    <Flex justify={ 'space-between' } align={ 'center' } gap={ 2 }>
                      <Text fontWeight={ 'bold' }>이런 상품은 어때요?</Text>
                      <Text fontSize={ 'xs' } color={ 'fg.muted' }>옆으로 넘겨보세요 ›</Text>
                    </Flex>
                    <Flex gap={ 3 } paddingBottom={ 2 } overflowX={ 'auto' }>
                      {
                        items.map((item) => (
                          <ProductCard key={ item.productId } item={ item }></ProductCard>
                        ))
                      }
                    </Flex>
                  </Card.Body>
                </Card.Root>
              }

              {
                combos.map((combo, index) => (
                  <ComboCard
                    key={ combo.comboId }
                    combo={ combo }
                    combos={ combos }
                    index={ index }
                  ></ComboCard>
                ))
              }
            </>
          }
        </Stack>
      </Container>

      <Toaster></Toaster>
    </Stack>
  )
}
