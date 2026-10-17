import { Flex, Grid, Link, Stack, StackSeparator, Text } from '@chakra-ui/react'

export const Footer = () => (
  <Stack
    direction={ { base: 'column', md: 'row' } }
    justifyContent={ 'center' }
    alignItems={ 'center' }
  >
    <Link>&copy; { new Date().getFullYear() } Fitzza Corp.</Link>
  </Stack>
)