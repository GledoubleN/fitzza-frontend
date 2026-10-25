import { Card } from '@chakra-ui/react'
import { VtonGallery } from './profile/VtonGallery.jsx'

export const VtonGalleryCard = ({ height }) => (
  <Card.Root rounded={ '4xl' } height={ height }>
    <Card.Body padding={ 8 }>
      <VtonGallery preview/>
    </Card.Body>
  </Card.Root>
)