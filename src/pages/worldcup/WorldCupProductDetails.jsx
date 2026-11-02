import { Stack, Text } from '@chakra-ui/react'
import { getSeasonLabel } from './seasonLabel.js'

export const WorldCupProductDetails = ({ product }) => (
  <Stack
    gap={ 1 }
    textStyle="xs"
    color="fg.muted"
  >
    <Text>계절: { getSeasonLabel(product?.season) }</Text>
    <Text>핏: { product?.fitType || '정보 없음' }</Text>
    <Text>
      색상: { [...new Set(product?.options?.map(option => option.color).filter(Boolean) ?? [])].join(', ') || '정보 없음' }
    </Text>
  </Stack>
)
