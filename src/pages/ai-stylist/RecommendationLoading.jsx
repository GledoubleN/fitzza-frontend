import { useEffect, useState } from 'react'
import { Box, Flex, Skeleton, Stack, Text } from '@chakra-ui/react'
import { PantoneAurora } from '../../components/PantoneAurora.jsx'
import { ProductSlot } from './ProductCard.jsx'

const STAGES = [
  '고객님의 취향을 살펴보고 있어요',
  '어울리는 상품을 고르고 있어요',
  '코디를 맞춰 보고 있어요',
]

const STAGE_INTERVAL = 3500

const SKELETON_CARD_COUNT = 4

export const RecommendationLoading = () => {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setStage((stage) => Math.min(stage + 1, STAGES.length - 1))
    }, STAGE_INTERVAL)

    return () => clearInterval(timer)
  }, [])

  return (
    <Stack gap={ 4 }>
      <Text
        key={ stage }
        aria-live={ 'polite' }
        animationName={ 'fade-in' }
        animationDuration={ 'moderate' }
      >
        { STAGES[stage] }
      </Text>

      <Flex
        gap={ 3 }
        overflow={ 'hidden' }
        aria-hidden
      >
        {
          Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
            <ProductSlot
              key={ index }
              direction={ 'column' }
              gap={ 2 }
              flexShrink={ 0 }
            >
              <Box
                position={ 'relative' }
                aspectRatio={ 3 / 4 }
                overflow={ 'hidden' }
                rounded={ 'l2' }
              >
                <PantoneAurora delay={ -index * 1.5 }/>
              </Box>
              <Skeleton height={ '4' }/>
              <Skeleton height={ '4' } width={ '1/2' }/>
            </ProductSlot>
          ))
        }
      </Flex>
    </Stack>
  )
}
