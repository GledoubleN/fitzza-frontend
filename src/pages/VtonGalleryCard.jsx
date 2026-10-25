import { Card } from '@chakra-ui/react'
import { VtonGallery } from './profile/VtonGallery.jsx'

export const VtonGalleryCard = () => (
  <Card.Root rounded={ '4xl' }>
    <Card.Body padding={ 8 }>
      <VtonGallery preview/>
    </Card.Body>
  </Card.Root>
)