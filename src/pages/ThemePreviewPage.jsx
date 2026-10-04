import {
  Box,
  Container,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react'
import system from '../theme.js'

const colorScales = {
  primary: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  secondary: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  accent: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
  background: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
}

const semanticColors = [
  'primary.solid',
  'primary.contrast',
  'primary.fg',
  'primary.muted',
  'primary.subtle',
  'primary.emphasized',
  'primary.focusRing',

  'secondary.solid',
  'secondary.contrast',
  'secondary.fg',
  'secondary.muted',
  'secondary.subtle',
  'secondary.emphasized',
  'secondary.focusRing',

  'accent.solid',
  'accent.contrast',
  'accent.fg',
  'accent.muted',
  'accent.subtle',
  'accent.emphasized',
  'accent.focusRing',
]

const spacing = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '12',
  '14',
  '16',
  '20',
  '24',
  '28',
  '32',
  '36',
  '40',
  '44',
  '48',
  '52',
  '56',
  '60',
  '64',
  '72',
  '80',
  '96',
  'px',
  '0.5',
  '1.5',
  '2.5',
  '3.5',
]

const radii = [
  'none',
  'sm',
  'base',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  'full',
]

const shadows = [
  'xs',
  'sm',
  'base',
  'md',
  'lg',
  'xl',
  '2xl',
  'outline',
  'inner',
  'none',
  'dark-lg',
]

const fontSizes = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
]

const fontWeights = [
  'hairline',
  'thin',
  'light',
  'normal',
  'medium',
  'semibold',
  'bold',
  'extrabold',
  'black',
]

function Section ({ title, children }) {
  return (
    <Stack gap={ 4 }>
      <Heading size="lg">{ title }</Heading>
      { children }
    </Stack>
  )
}

function ColorScale ({ name, shades }) {
  return (
    <Stack gap={ 2 }>
      <Text fontWeight="bold">{ name }</Text>

      <SimpleGrid columns={ { base: 2, sm: 5, lg: 10 } } gap={ 2 }>
        { shades.map((shade) => {
          const token = `${ name }.${ shade }`

          return (
            <Stack key={ token } gap={ 1 }>
              <Box
                h="64px"
                rounded="md"
                bg={ token }
                borderWidth="1px"
              />

              <Text fontSize="xs">
                { shade }
              </Text>

              <Text fontSize="xs" color="fg.muted">
                { token }
              </Text>
            </Stack>
          )
        }) }
      </SimpleGrid>
    </Stack>
  )
}

export function ThemePreviewPage () {
  return (
    <Container maxW="7xl" py={ 10 }>
      <Stack gap={ 12 }>
        <Heading size="2xl">
          Theme Preview
        </Heading>

        <Section title="Colors">
          <Stack gap={ 8 }>
            { Object.entries(colorScales).map(
              ([name, shades]) => (
                <ColorScale
                  key={ name }
                  name={ name }
                  shades={ shades }
                />
              ),
            ) }
          </Stack>
        </Section>

        <Section title="Semantic Colors">
          <SimpleGrid
            columns={ { base: 1, sm: 2, lg: 4 } }
            gap={ 4 }
          >
            { semanticColors.map((token) => (
              <Stack key={ token } gap={ 2 }>
                <Box
                  h="80px"
                  rounded="lg"
                  bg={ token }
                  borderWidth="1px"
                />

                <Text fontSize="sm" fontWeight="medium">
                  { token }
                </Text>
              </Stack>
            )) }
          </SimpleGrid>
        </Section>

        <Section title="Spacing">
          <Stack gap={ 3 }>
            { spacing.map((token) => (
              <HStack key={ token } gap={ 4 }>
                <Text w="12" fontSize="sm">
                  { token }
                </Text>

                <Box
                  h="6"
                  w={ token }
                  bg="primary.solid"
                  rounded="sm"
                />
              </HStack>
            )) }
          </Stack>
        </Section>

        <Section title="Radii">
          <SimpleGrid
            columns={ { base: 3, md: 5, lg: 9 } }
            gap={ 4 }
          >
            { radii.map((token) => (
              <Stack key={ token } gap={ 2 }>
                <Box
                  h="16"
                  bg="primary.solid"
                  rounded={ token }
                />

                <Text fontSize="sm">
                  { token }
                </Text>
              </Stack>
            )) }
          </SimpleGrid>
        </Section>

        <Section title="Shadows">
          <SimpleGrid
            columns={ { base: 1, md: 2, lg: 3 } }
            gap={ 6 }
          >
            { shadows.map((token) => (
              <Box
                key={ token }
                h="100px"
                p={ 4 }
                rounded="lg"
                bg="bg.canvas"
                shadow={ token }
              >
                <Text>{ token }</Text>
              </Box>
            )) }
          </SimpleGrid>
        </Section>

        <Section title="Font Sizes">
          <Stack gap={ 4 }>
            { fontSizes.map((token) => (
              <Box key={ token }>
                <Text fontSize={ token }>
                  The quick brown fox — { token }
                </Text>

                <Text fontSize="xs" color="fg.muted">
                  { token }
                </Text>
              </Box>
            )) }
          </Stack>
        </Section>

        <Section title="Font Weights">
          <Stack gap={ 3 }>
            { fontWeights.map((token) => (
              <Text
                key={ token }
                fontSize="lg"
                fontWeight={ token }
              >
                The quick brown fox — { token }
              </Text>
            )) }
          </Stack>
        </Section>

        <Section title="Fonts">
          <Stack gap={ 4 }>
            <Text fontFamily="heading" fontSize="2xl">
              { system.tokens.getByName('fonts.heading').value } — heading
            </Text>

            <Text fontFamily="body" fontSize="lg">
              { system.tokens.getByName('fonts.body').value } — body
            </Text>

            <Text fontFamily="mono">
              { system.tokens.getByName('fonts.mono').value } — monospace
            </Text>
          </Stack>
        </Section>
      </Stack>
    </Container>
  )
}