import { Box, Flex, Spinner } from '@chakra-ui/react'
import { PantoneAurora } from './PantoneAurora.jsx'

export const AuroraSpinner = ({ label, spinDuration = '1.5s' }) => (
  <Box
    position={ 'absolute' }
    inset={ '0' }
  >
    <PantoneAurora/>
    <Flex
      position={ 'absolute' }
      inset={ '0' }
      align={ 'center' }
      justify={ 'center' }
    >
      <Flex
        padding={ 3 }
        rounded={ 'full' }
        layerStyle={ 'glass' }
        borderWidth={ 'thin' }
        borderColor={ 'fg/10' }
        boxShadow={ 'sm' }
      >
        <Spinner
          size={ 'md' }
          color={ 'fg.muted' }
          animationDuration={ spinDuration }
          aria-label={ label }
        />
      </Flex>
    </Flex>
  </Box>
)
