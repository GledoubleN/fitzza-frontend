import {
  Button,
  Container, Flex,
  HStack,
  IconButton,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { LuChevronLeft, LuSearch } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { AppBar } from '../../components/AppBar.jsx'
import { TabBar } from '../../components/TabBar.jsx'
import { ensureLogin, getRecommendationHistory } from './aiApi.js'

export const AiHistoryPage = () => {
  const navigate = useNavigate()

  const [items, setItems] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!ensureLogin(navigate)) return

    let cancelled = false
    setLoading(true)
    setError('')
    getRecommendationHistory(page)
      .then((data) => {
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
    <Stack gap={ 4 } paddingY={ 4 } minHeight={ '100vh' }>
      <AppBar></AppBar>

      <Container maxWidth={ '3xl' } flex={ 1 }>
        <Stack gap={ 4 }>
          <Flex align="center" justify="space-between">
              <Text fontSize="lg" fontWeight="semibold">
                대화 내역
              </Text>
          </Flex>

          {
            items.map((item) => (
              <Button
                key={ item.requestId }
                variant={ 'outline' }
                height={ 'auto' }
                paddingY={ 4 }
                justifyContent={ 'flex-start' }
                textAlign={ 'start' }
                whiteSpace={ 'normal' }
                onClick={ () => navigate(`/ai/${ item.requestId }`, { state: { query: item.queryText } }) }
              >
                { item.queryText }
              </Button>
            ))
          }

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
            <Button variant={ 'ghost' } onClick={ () => setPage(page + 1) }>더 보기</Button>
          }
        </Stack>
      </Container>

      <TabBar></TabBar>
    </Stack>
  )
}
