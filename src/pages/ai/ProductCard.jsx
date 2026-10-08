import { Badge, Box, IconButton, Image, Stack, Text } from '@chakra-ui/react'
import { LuHeart } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import exampleProductImage from '/src/assets/hero.png'

export const ProductCard = ({ item }) => {
  return (
    <Box position={ 'relative' } width={ 32 } flexShrink={ 0 }>
      <Stack gap={ 1 } asChild>
        <Link to={ `/products/${ item.productId }` }>
          <Image
            src={ item.imageUrl || exampleProductImage }
            alt={ item.productName }
            aspectRatio={ 1 }
            objectFit={ 'cover' }
            rounded={ 'md' }
            bg={ 'bg.muted' }
          ></Image>
          <Text fontSize={ 'sm' } lineClamp={ 1 }>{ item.productName }</Text>
          <Text fontSize={ 'sm' } fontWeight={ 'bold' }>{ item.price.toLocaleString() }원</Text>
          {
            item.fitPercent != null &&
            <Badge alignSelf={ 'flex-start' }>핏 { item.fitPercent }%</Badge>
          }
          {
            item.evidence &&
            <Text fontSize={ 'xs' } color={ 'fg.muted' }>{ item.evidence }</Text>
          }
        </Link>
      </Stack>
      <IconButton
        position={ 'absolute' }
        top={ 0 }
        right={ 0 }
        size={ 'sm' }
        variant={ 'ghost' }
        rounded={ 'full' }
        aria-label={ '찜' }
      >
        <LuHeart></LuHeart>
      </IconButton>
    </Box>
  )
}
