import { Box } from '@chakra-ui/react'
import { AuroraSpinner } from '../../components/AuroraSpinner.jsx'

export const FittingLoading = () => (
  <Box
    position={ 'relative' }
    width={ 'full' }
    maxWidth={ 'xs' }
    aspectRatio={ 3 / 4 }
    overflow={ 'hidden' }
    rounded={ 'l2' }
  >
    <AuroraSpinner label={ '옷을 입혀 보고 있어요' }/>
  </Box>
)
