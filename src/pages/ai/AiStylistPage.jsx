import { Button, Card, Container, Flex, IconButton, Input, InputGroup, Spinner, Stack, Text } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { LuArrowUp, LuMenu } from 'react-icons/lu'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { AppBar } from '../../components/AppBar.jsx'
import { Toaster } from '../../components/ui/toaster.jsx'
import {
  ensureLogin,
  getRecommendation,
  getRecommendationMessages,
  MAX_QUERY_LENGTH,
  postRecommendation,
} from './aiApi.js'
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
  const [input, setInput] = useState('')
  const [status, setStatus] = useState(requestId || location.state?.query ? 'loading' : 'idle')
  const [result, setResult] = useState(null)
  const [message, setMessage] = useState('')
  const [attempt, setAttempt] = useState(0)
  const postedKey = useRef(null)
  const activeKey = useRef(null)

  // 지금 보고 있는 화면의 위치. 요청 응답이 늦게 왔을 때 아직 같은 화면인지 확인하는 데 쓴다.
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
      // 응답을 기다리는 사이 다른 화면으로 옮겼으면 끌고 오지 않는다.
      if (activeKey.current !== key) return
      navigate(`/ai/${ data.requestId }`, { replace: status !== 'done', state: { query: text } })
    } catch (err) {
      if (activeKey.current !== key) return
      fail(err.response?.status === 400 ? '추천받을 내용을 입력해주세요.' : '')
    }
  }

  useEffect(() => {
    if (!ensureLogin(navigate)) return

    if (!requestId) {
      // 메인 화면에서 넘어온 질의는 한 번만 요청합니다.
      const text = location.state?.query
      if (text && postedKey.current !== location.key) {
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

  const onSubmit = (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || status === 'loading') return
    setInput('')
    request(text)
  }

  const retry = () => {
    if (query) request(query)
    else setAttempt((attempt) => attempt + 1)
  }

  const items = result?.items ?? []
  const combos = result?.combos ?? []
  const bubbleProps = { maxWidth: '80%', rounded: '2xl' }

  return (
    <Stack gap={ 4 } paddingY={ 4 } minHeight={ '100vh' }>
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
            status === 'idle' &&
            <Text color={ 'fg.muted' }>원하는 스타일을 알려주시면 어울리는 코디를 찾아드려요.</Text>
          }

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

      <Container maxWidth={ '3xl' } position={ 'sticky' } bottom={ 4 }>
        <form onSubmit={ onSubmit }>
          <InputGroup
            endElement={
              <IconButton
                type={ 'submit' }
                size={ 'xs' }
                rounded={ 'full' }
                aria-label={ '추천받기' }
                disabled={ status === 'loading' }
              >
                <LuArrowUp></LuArrowUp>
              </IconButton>
            }
          >
            <Input
              rounded={ 'full' }
              bg={ 'bg.panel' }
              placeholder={ query ? '조건을 바꿔서 다시 추천받기' : '무엇을 도와드릴까요' }
              aria-label={ '추천 조건' }
              maxLength={ MAX_QUERY_LENGTH }
              value={ input }
              onChange={ (e) => setInput(e.target.value) }
            ></Input>
          </InputGroup>
        </form>
      </Container>

      <Toaster></Toaster>
    </Stack>
  )
}
