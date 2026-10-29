import { Box, Container, IconButton } from '@chakra-ui/react'

export const FloatingButton = ({ bottom = '24', align = 'flex-end', ...buttonProps }) => (
  <Box
    position="fixed"
    bottom={ bottom }
    left="0"
    right="0"
    zIndex="docked"
    pointerEvents="none"
  >
    <Container
      maxWidth="5xl"
      display="flex"
      justifyContent={ align }
    >
      <IconButton
        size="xl"
        rounded="full"
        layerStyle="glass"
        color="fg"
        borderWidth="thin"
        borderColor="fg/10"
        boxShadow="md"
        transition="box-shadow 0.2s ease, scale 0.2s ease"
        _hover={ { boxShadow: 'lg', scale: '1.05' } }
        pointerEvents="auto"
        { ...buttonProps }
      />
    </Container>
  </Box>
)
