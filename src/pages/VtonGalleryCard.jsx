import { Badge, Card, Flex, Stack, Text } from '@chakra-ui/react'
import { VtonGallery } from './profile/VtonGallery.jsx'

export const VtonGalleryCard = ({ height }) => (
  <Card.Root
    as="section"
    rounded="3xl"
    height={ height }
    borderColor="border.subtle"
    overflow="hidden"
  >
    <Card.Body
      padding={ { base: 4, md: 8 } }
      gap={ 8 }
    >
      <Flex
        align="start"
        justify="space-between"
        gap={ 4 }
      >
        <Stack gap={ 4 }>
          <Text
            textStyle="xs"
            fontWeight="700"
            letterSpacing="widest"
            color="fg.muted"
          >
            MY FITTING ROOM
          </Text>
          <Text
            textStyle="sm"
            color="fg.muted"
          >
            입어보고 발견한 나만의 스타일을 모았어요.
          </Text>
        </Stack>
        <Badge
          variant="subtle"
          colorPalette="primary"
          rounded="full"
          paddingX={ 4 }
        >
          AI 피팅
        </Badge>
      </Flex>
      <VtonGallery preview/>
    </Card.Body>
  </Card.Root>
)