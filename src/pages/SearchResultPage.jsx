import { Card, Container, Grid, GridItem, IconButton, Image, Input, InputGroup, Text, Box } from '@chakra-ui/react'
import { AppBar } from '../components/AppBar.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { LuHeart, LuSearch } from 'react-icons/lu'
import { products } from '../data/products.js'
import exampleProductImage from '../assets/hero.png'
import { useNavigate } from 'react-router-dom'

export const SearchResultPage = () => {
  const navigate = useNavigate();

  return (
    <Box position="relative" minH="100vh" pt={24} pb={28} bg="bg">
      <Box position="fixed" top={0} left={0} right={0} zIndex={10} bg="bg" px={5} py={4}>
        <Container maxW="7xl" mx="auto" px={0}>
          <AppBar />
        </Container>
      </Box>

      <Container maxW="3xl" mx="auto" px={5} mb={6}>
        <InputGroup startElement={<Box as={LuSearch} boxSize={5} color="fg.muted" />}>
          <Input
            placeholder="검색어를 입력해주세요"
            borderRadius="xl"
            borderWidth="thin"
            borderColor="border.subtle"
            py={5}
          />
        </InputGroup>
      </Container>

      <Container maxW="7xl" mx="auto" px={5}>
        <Grid
          templateColumns={{
            base: 'repeat(3, 1fr)',
            lg: 'repeat(5, 1fr)'
          }}
          gap={4}
        >
          {
            products.map((product, index) => {
              return (
                <GridItem key={index}>
                  <Card.Root
                    variant="subtle"
                    borderWidth="thin"
                    borderColor="border.subtle"
                    bg="bg.panel"
                    borderRadius="2xl"
                    overflow="hidden"
                    cursor="pointer"
                    position="relative"
                    _hover={{ borderColor: 'fg.muted' }}
                    onClick={() => navigate('/products/1')}
                  >
                    <Grid
                      templateRows="auto auto"
                      templateAreas={`
                        "image"
                        "content"
                      `}
                    >
                      <GridItem gridArea="image" position="relative">
                        <IconButton
                          position="absolute"
                          top={2}
                          right={2}
                          aria-label="찜하기"
                          rounded="full"
                          variant="ghost"
                          size="xs"
                          zIndex={2}
                        >
                          <Box as={LuHeart} boxSize={3.5} />
                        </IconButton>
                        <Image src={exampleProductImage} w="100%" h="28" objectFit="cover" />
                      </GridItem>

                      <GridItem gridArea="content">
                        <Card.Body p={2.5} gap={1}>
                          <Text textStyle="xs" fontWeight="semibold" truncate>{product.name}</Text>
                          <Text textStyle="2xs" color="fg.muted">{product.price.toLocaleString()} 원</Text>
                        </Card.Body>
                      </GridItem>
                    </Grid>
                  </Card.Root>
                </GridItem>
              )
            })
          }
        </Grid>
      </Container>

      <Box position="fixed" bottom={0} left={0} right={0} zIndex={10} bg="bg">
        <TabBar />
      </Box>
    </Box>
  )
}