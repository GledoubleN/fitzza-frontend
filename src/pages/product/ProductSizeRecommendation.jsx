import { useEffect, useState } from 'react'
import { Button, Card, Flex, Heading, Spinner, Stack, Text } from '@chakra-ui/react'
import { api } from '../../api/axios.js'
import { useAuth } from '../../contexts/AuthContext.js'

export const ProductSizeRecommendation = ({ productId }) => {
  const { isSignedIn } = useAuth()
  const [recommendation, setRecommendation] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!isSignedIn) return

    let cancelled = false
    setIsLoading(true)
    setRecommendation(null)
    setError('')

    api.get(`/recommendations/${ encodeURIComponent(productId) }/size`, { timeout: 10000 })
      .then(({ data }) => {
        if (!cancelled) setRecommendation(data)
      })
      .catch(() => {
        if (!cancelled) setError('추천 사이즈를 불러오지 못했어요.')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [productId, isSignedIn, attempt])

  return (
    <Card.Root>
      <Card.Body gap={ 4 }>
        <Heading size={ 'md' }>나에게 맞는 추천 사이즈</Heading>
        { !isSignedIn ? (
          <Text color={ 'fg.muted' }>로그인하면 맞춤 사이즈를 확인할 수 있어요.</Text>
        ) : isLoading ? (
          <Flex align={ 'center' } gap={ 4 } role={ 'status' }>
            <Spinner size={ 'sm' }/>
            <Text>추천 사이즈를 확인하고 있어요.</Text>
          </Flex>
        ) : error ? (
          <Stack gap={ 4 }>
            <Text color={ 'fg.error' }>{ error }</Text>
            <Button
              variant={ 'outline' }
              alignSelf={ 'flex-start' }
              onClick={ () => setAttempt((value) => value + 1) }
            >
              다시 시도
            </Button>
          </Stack>
        ) : (
          <Stack gap={ 4 }>
            { recommendation?.recommendedSize && (
              <Flex align={ 'center' } gap={ 4 } wrap={ 'wrap' }>
                <Text textStyle={ 'xl' } fontWeight={ 'bold' }>{ recommendation.recommendedSize }</Text>
                { recommendation.fitPercent != null && (
                  <Text color={ 'fg.muted' }>적합도 { recommendation.fitPercent }%</Text>
                ) }
              </Flex>
            ) }
            <Text color={ 'fg.muted' }>
              { recommendation?.evidence || '추천 사이즈 정보가 없습니다.' }
            </Text>
          </Stack>
        ) }
      </Card.Body>
    </Card.Root>
  )
}