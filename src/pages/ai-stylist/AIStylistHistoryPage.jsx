import {
  Box,
  Button,
  Container,
  Flex,
  IconButton,
  Separator,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { LuTrash2 } from 'react-icons/lu'
import { api } from '../../api/axios.js'
import { Header } from '../../components/Header.jsx'
import { TabBar } from '../../components/TabBar.jsx'
import { toaster } from '../../components/ui/toaster.jsx'

// 응답이 오지 않는 요청은 10초 뒤 실패로 처리해 화면이 재시도 안내까지 갈 수 있게 합니다.
const TIMEOUT = { timeout: 10000 }

const formatRecommendationDate = (value) => {
  const date = new Date(value)

  if (!value || Number.isNaN(date.getTime())) return '추천 날짜 정보 없음'

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const AIStylistHistoryPage = () => {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [deletingRequestId, setDeletingRequestId] = useState(null)

  const deleteHistory = async (requestId) => {
    if (deletingRequestId !== null) return

    setDeletingRequestId(requestId)

    try {
      await api.delete(`/recommendation/${ encodeURIComponent(requestId) }`, TIMEOUT)
      setItems((items) => items.filter((item) => item.requestId !== requestId))
    } catch (error) {
      toaster.create({
        type: 'error',
        title: error.response?.data?.message || '대화 내역을 삭제하지 못했어요. 다시 시도해주세요.',
        closable: true,
      })
    } finally {
      setDeletingRequestId(null)
    }
  }

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    api.get('/recommendations', { params: { page, size: 20 }, ...TIMEOUT })
      .then(({ data }) => {
        if (cancelled) return
        setItems((items) => page === 0 ? data.content : [...items, ...data.content])
        setTotalPages(data.totalPages)
      })
      .catch(() => {
        if (!cancelled) setError('대화 내역을 불러오지 못했어요. 잠시 후 다시 시도해주세요.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [page, attempt])

  return (
    <Stack gap={ 4 } paddingY={ 4 } minHeight={ 'vh' }>
      <Header></Header>

      <Container maxWidth={ '3xl' } flex={ 1 }>
        <Stack gap={ 4 }>
          <Flex align="center" justify="space-between">
              <Text fontSize="lg" fontWeight="semibold">
                대화 내역
              </Text>
          </Flex>

          <Stack gap={ 0 } separator={ <Separator/> }>
            { items.map((item) => (
              <Flex key={ item.requestId } align="center" gap={ 4 } paddingY={ 4 }>
                <Box
                  asChild
                  flex={ 1 }
                  minWidth={ 0 }
                  paddingY={ 4 }
                  borderRadius="md"
                  _hover={ { bg: 'bg.subtle' } }
                >
                  <RouterLink to={ `/ai/${ item.requestId }` } state={ { query: item.queryText } }>
                    <Stack gap={ 4 }>
                      <Text truncate>{ item.queryText }</Text>
                      <Text fontSize="sm" color="fg.muted">
                        { formatRecommendationDate(item.createdAt) }
                      </Text>
                    </Stack>
                  </RouterLink>
                </Box>
                <IconButton
                  aria-label={ `${ item.queryText } 대화 내역 삭제` }
                  variant="ghost"
                  color="fg.muted"
                  flexShrink={ 0 }
                  loading={ deletingRequestId === item.requestId }
                  disabled={ deletingRequestId !== null }
                  onClick={ () => deleteHistory(item.requestId) }
                >
                  <LuTrash2/>
                </IconButton>
              </Flex>
            )) }
          </Stack>

          { loading && <Spinner size={ 'sm' } alignSelf={ 'center' }></Spinner> }
          { error && <Text color={ 'fg.error' }>{ error }</Text> }
          {
            !loading && error &&
            <Button variant={ 'outline' } onClick={ () => setAttempt(attempt + 1) }>다시 시도</Button>
          }
          {
            !loading && !error && items.length === 0 &&
            <Text color={ 'fg.muted' }>아직 추천받은 대화가 없어요.</Text>
          }
          {
            !loading && !error && page + 1 < totalPages &&
            <Button
              variant={ 'ghost' }
              disabled={ deletingRequestId !== null }
              onClick={ () => setPage(page + 1) }
            >
              더 보기
            </Button>
          }
        </Stack>
      </Container>

      <TabBar></TabBar>
    </Stack>
  )
}