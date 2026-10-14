import {
  Box,
  Button,
  Card,
  CloseButton,
  Container,
  Dialog,
  Flex,
  IconButton,
  Image,
  Portal,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { LuClock } from 'react-icons/lu'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/axios.js'
import { AppBar } from '../../components/AppBar.jsx'
import { Toaster } from '../../components/ui/toaster.jsx'
import { ComboCard } from './ComboCard.jsx'
import { ProductCard } from './ProductCard.jsx'
import { ProductRow } from './ProductRow.jsx'

const FAIL_MESSAGE = '추천을 불러오지 못했어요. 잠시 후 다시 시도해주세요.'
// 응답이 오지 않는 요청은 10초 뒤 실패로 처리해 화면이 재시도 안내까지 갈 수 있게 합니다.
const TIMEOUT = { timeout: 10000 }
// 추천 요청은 응답에 결과가 담겨 올 때까지 기다리므로 더 길게 잡습니다. 추천 처리 시간이 정해지면 맞춰야 하는 임시 값입니다.
const RECOMMEND_TIMEOUT = { timeout: 60000 }
// 응답을 기다리던 중 새로고침된 추천 요청을 알아보기 위한 표시입니다. (sessionStorage 키)
const PENDING_KEY = 'ai-recommendation-pending'
// 가상 피팅은 결과 이미지가 응답에 담겨 올 때까지 기다리므로 더 길게 잡습니다. 생성 시간이 정해지면 맞춰야 하는 임시 값입니다.
const FITTING_TIMEOUT = { timeout: 120000 }

export const AIStylistPage = () => {
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

  // failedByServer: 응답은 왔지만 서버가 추천 실패(FAILED)를 돌려준 경우. 재시도 방식이 달라집니다.
  const [failedByServer, setFailedByServer] = useState(false)

  const fail = (text, byServer = false) => {
    setStatus('failed')
    setMessage(text || FAIL_MESSAGE)
    setFailedByServer(byServer)
  }

  const show = (data) => {
    setResult(data)
    setStatus('done')
  }

  // 추천을 요청합니다. 결과는 이 요청의 응답에 바로 담겨 옵니다.
  const request = async (text) => {
    setQuery(text)
    setResult(null)
    setStatus('loading')
    const key = location.key
    sessionStorage.setItem(PENDING_KEY, key)
    try {
      const { data } = await api.post('/recommendations', { query: text }, RECOMMEND_TIMEOUT)
      sessionStorage.removeItem(PENDING_KEY)
      // 응답을 기다리는 사이 다른 화면으로 옮겼으면 결과화면으로 강제로 이동시키지 않습니다.
      if (activeKey.current !== key) return
      if (data.status === 'FAILED') {
        fail(data.message, true)
      } else if (data.requestId) {
        // 받은 결과를 함께 넘겨서, 주소를 바꾼 뒤 같은 추천을 다시 조회하지 않게 합니다.
        navigate(`/ai/${ data.requestId }`, { replace: true, state: { query: text, result: data } })
      } else {
        show(data)
      }
    } catch (err) {
      sessionStorage.removeItem(PENDING_KEY)
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

    if (!requestId) {
      // 질의의 중복 전송을 방지합니다.
      if (postedKey.current === location.key) return
      postedKey.current = location.key
      const text = location.state?.query
      // 응답을 기다리던 중 새로고침된 경우에는 자동으로 다시 요청하지 않습니다.
      // 처음 요청이 서버에서 계속 처리 중일 수 있어서, 다시 보내면 추천이 중복으로 생깁니다.
      if (sessionStorage.getItem(PENDING_KEY) === location.key) {
        setQuery(text)
        fail('추천 요청이 중단됐어요. 다시 요청해주세요.')
        return
      }
      request(text)
      return
    }

    let cancelled = false
    const text = location.state?.query
    setQuery(text ?? '')
    if (!text) {
      api.get(`/recommendations/${ encodeURIComponent(requestId) }/messages`, TIMEOUT)
        .then(({ data: messages }) => {
          if (!cancelled) setQuery(messages.find((m) => m.senderType === 'USER')?.content ?? '')
        })
        .catch(() => {})
    }

    if (location.state?.result) {
      // 방금 추천 요청의 응답으로 받은 결과입니다.
      show(location.state.result)
    } else {
      // 대화 내역이나 주소로 들어온 지난 추천은 조회해서 보여줍니다.
      setResult(null)
      setStatus('loading')
      api.get(`/recommendations/${ encodeURIComponent(requestId) }`, TIMEOUT)
        .then(({ data }) => {
          if (cancelled) return
          if (data.status === 'FAILED') fail(data.message, true)
          else show(data)
        })
        .catch(() => {
          if (!cancelled) fail()
        })
    }

    return () => { cancelled = true }
  }, [requestId, location.key, attempt])

  // 추천 요청 자체가 실패했거나 서버가 추천 실패를 돌려준 경우에만 새로 요청합니다.
  // 지난 추천의 조회가 실패한 경우(네트워크, 타임아웃)에는 같은 추천을 다시 조회해서 추천이 중복으로 생기지 않게 합니다.
  const requestsAgain = !requestId || (failedByServer && !!query)

  const retry = () => {
    if (requestsAgain) request(query)
    else setAttempt((attempt) => attempt + 1)
  }

  // 이 화면에서 입어본 가상 피팅들. { id, label, items, status, fittingId, imageUrl, message, retryable }
  const [fittings, setFittings] = useState([])
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false)
  const fittingsEnd = useRef(null)
  const tryingOn = fittings.some((fitting) => fitting.status === 'loading')

  // 입어보기를 누르거나 결과가 오면 그 말풍선이 보이게 내립니다.
  useEffect(() => {
    if (fittings.length) fittingsEnd.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [fittings])

  // 프로필에 올려둔 전신 사진으로 바로 입어봅니다. 사진이 없으면 프로필로 안내합니다.
  // isWithoutPhoto: 프로필 사진이 없는 경우를 개발 중에 확인하기 위한 값
  const runFitting = async (fitting, isWithoutPhoto = false) => {
    const update = (patch) => setFittings((fittings) => [
      ...fittings.filter((other) => other.id !== fitting.id),
      { ...fitting, ...patch },
    ])
    update({ status: 'loading' })
    try {
      // TODO API 필요: 프로필 전신 사진 ID(photoId)는 명세의 /users/me 응답에 없는 가정 필드입니다.
      const { data: me } = await api.get('/users/me', TIMEOUT)
      if (isWithoutPhoto || !me.photoId) {
        setFittings((fittings) => fittings.filter((other) => other.id !== fitting.id))
        setIsPhotoDialogOpen(true)
        return
      }

      // 결과는 이 요청의 응답에 바로 담겨 옵니다. (조회·폴링 없음)
      const { data } = await api.post('/fittings', {
        photoId: me.photoId,
        productIds: fitting.items.map((item) => item.productId),
      }, FITTING_TIMEOUT)
      if (data.status === 'COMPLETED' && data.resultImageUrl) {
        update({ status: 'done', fittingId: data.fittingId, imageUrl: data.resultImageUrl })
      } else {
        update({ status: 'failed', message: data.failReason, retryable: data.retryable !== false })
      }
    } catch (err) {
      update({
        status: 'failed',
        message: err.response?.status === 400 ? '사진이나 상품을 확인한 뒤 다시 시도해주세요.' : '',
        retryable: true,
      })
    }
  }

  const tryOn = (label, items) => runFitting({ id: crypto.randomUUID(), label, items })

  const shareFitting = (fitting) => {
    // 작성 화면에 보여줄 피팅 결과.
    navigate('/community/write', {
      state: {
        sharedType: 'FITTING',
        sharedId: fitting.fittingId,
        snapshot: {
          imageUrl: fitting.imageUrl,
          items: fitting.items,
          totalPrice: fitting.items.reduce((sum, item) => sum + item.price, 0),
        },
      },
    })
  }

  const items = result?.items ?? []
  const combos = result?.combos ?? []
  const bubbleProps = { maxWidth: '4/5' }

  return (
    <Stack gap={ 4 } paddingY={ 4 } minHeight={ 'vh' }>
      <AppBar></AppBar>

      <Container maxWidth={ '3xl' } flex={ 1 }>
        <Stack gap={ 4 }>
          <Flex align={ 'center' } gap={ 3 }>
            <IconButton
              variant={ 'outline' }
              rounded={ 'full' }
              aria-label={ '대화 내역' }
              onClick={ () => navigate('/ai/history') }
            >
              <LuClock></LuClock>
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
                <Button variant={ 'outline' } alignSelf={ 'flex-start' } onClick={ retry }>
                  { requestId && requestsAgain ? '다시 추천받기' : '다시 시도' }
                </Button>
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
                <Card.Root>
                  <Card.Body gap={ 3 }>
                    <Text fontWeight={ 'bold' }>이런 상품은 어때요?</Text>
                    <ProductRow>
                      {
                        items.map((item) => (
                          <ProductCard
                            key={ item.productId }
                            item={ item }
                            tryingOn={ tryingOn }
                            onTryOn={ () => tryOn(item.productName, [item]) }
                          ></ProductCard>
                        ))
                      }
                    </ProductRow>
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
                    tryingOn={ tryingOn }
                    onTryOn={ () => tryOn(`코디 ${ index + 1 }`, combo.items) }
                  ></ComboCard>
                ))
              }

              {
                fittings.map((fitting) => (
                  <Card.Root key={ fitting.id } { ...bubbleProps } alignSelf={ 'flex-start' }>
                    <Card.Body gap={ 3 }>
                      <Text fontWeight={ 'bold' }>{ fitting.label } 가상 피팅</Text>
                      {
                        fitting.status === 'loading' &&
                        <Flex align={ 'center' } gap={ 3 }>
                          <Spinner size={ 'sm' }></Spinner>
                          <Text>고객님 사진에 입혀보고 있어요</Text>
                        </Flex>
                      }
                      {
                        fitting.status === 'failed' &&
                        <>
                          <Text color={ 'fg.error' }>
                            { fitting.message || '가상 피팅을 만들지 못했어요. 잠시 후 다시 시도해주세요.' }
                          </Text>
                          {
                            fitting.retryable &&
                            <Button variant={ 'outline' } alignSelf={ 'flex-start' } onClick={ () => runFitting(fitting) }>
                              다시 시도
                            </Button>
                          }
                        </>
                      }
                      {
                        fitting.status === 'done' &&
                        <>
                          <Image src={ fitting.imageUrl } alt={ `${ fitting.label } 가상 피팅 결과` } bg={ 'bg.muted' }></Image>
                          <Text fontSize={ 'sm' } color={ 'fg.muted' }>AI 생성 이미지 · 실제와 다를 수 있어요</Text>
                          <Button variant={ 'outline' } alignSelf={ 'flex-start' } onClick={ () => shareFitting(fitting) }>
                            공유하기
                          </Button>
                        </>
                      }
                    </Card.Body>
                  </Card.Root>
                ))
              }
              { import.meta.env.DEV && (
                <Button
                  variant={ 'outline' }
                  alignSelf={ 'flex-start' }
                  disabled={ tryingOn }
                  onClick={ () => runFitting({ id: crypto.randomUUID(), label: '개발용', items: [] }, true) }
                >
                  사진 없이 입은 경우 (개발용)
                </Button>
              ) }
              <Box ref={ fittingsEnd }></Box>
            </>
          }
        </Stack>
      </Container>

      <Dialog.Root
        open={ isPhotoDialogOpen }
        onOpenChange={ (event) => setIsPhotoDialogOpen(event.open) }
        placement={ 'center' }
      >
        <Portal>
          <Dialog.Backdrop/>
          <Dialog.Positioner>
            <Dialog.Content marginX={ 4 }>
              <Dialog.Header>
                <Dialog.Title>사용자님의 사진이 필요합니다.</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text color={ 'fg.muted' }>가상 피팅을 하려면 프로필에 전신 사진을 올려 주세요.</Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant={ 'outline' }>취소</Button>
                </Dialog.ActionTrigger>
                <Button onClick={ () => navigate('/profile') }>프로필로 이동</Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size={ 'sm' }/>
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
      <Toaster></Toaster>
    </Stack>
  )
}
