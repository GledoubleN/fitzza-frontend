import { Box, Heading, IconButton, Stack, Image, Text } from '@chakra-ui/react'
import { LuHeart } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export const ProductItem = ({ product }) => {
  const [isLiked, setIsLiked] = useState(true)
  const navigate = useNavigate()

  function handleProductClick (product) {
    navigate(`/products/${ product.productId }`)
  }

  function handleLikeButtonClick () {
    setIsLiked((isLiked) => !isLiked)
  }

  return (
    <Stack gap={ 4 }>
      <Box
        position={ 'relative' }
        gap={ 4 }
      >
        <Image
          width={ '100%' }
          aspectRatio={ 1 }
          objectFit={ 'contain' }
          src={ product.thumbnailUrl }
          onClick={ () => handleProductClick(product) }
          cursor="pointer"
        ></Image>
        <IconButton
          position={ 'absolute' }
          top={ 0 }
          right={ 0 }
          rounded={ 'full' }
          variant={ 'ghost' }
          onClick={ (event) => {
            event.stopPropagation()
            handleLikeButtonClick()
          } }
        >
          <LuHeart
            color={ isLiked ? 'red' : 'black' }
            fill={ isLiked ? 'red' : 'none' }
          ></LuHeart>
        </IconButton>
      </Box>
      <Stack gap={ 0 }>
        <Text
          textStyle="xs"
          color="fg.muted"
          truncate
        >
          { product.brandName }
        </Text>
        <Heading
          size={ { base: 'sm', md: 'lg' } }
          truncate
        >
          { product.productName }
        </Heading>
        <Text
          textStyle={ { base: 'xs', md: 'sm' } }
          fontWeight="bold"
        >
          { product.price?.toLocaleString() } 원
        </Text>
      </Stack>
    </Stack>
  )
}