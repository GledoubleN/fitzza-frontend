import {
  Box,
  Flex,
  Text,
  IconButton,
  Image,
  Center,
  Button,
  Grid,
  GridItem,
  Container,
  Stack,
} from '@chakra-ui/react'
import { LuChevronLeft, LuHistory } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { Header } from '../../components/Header.jsx'
import { TabBar } from '../../components/TabBar.jsx'
import { Footer } from '../../components/Footer.jsx'
import defaultHeroImage from '../../assets/hero.png'

export const WorldcupTournamentPage = ({
  leftProduct,
  rightProduct,
  roundTitle,
  currentIndex,
  matchList,
  isSaving,
  onOpenHistory,
  onSelect,
}) => {
  const navigate = useNavigate()

  return (
    <Stack
      gap={ 4 }
      paddingY={ 4 }
      minHeight="100vh"
    >
      <Header/>
      <Container
        maxWidth="5xl"
        flex={ 1 }
      >
        <Grid gap={ 8 }>
          <GridItem>
            <Flex
              align="center"
              justify="space-between"
            >
              <Flex
                align="center"
                gap={ 4 }
              >
                <IconButton
                  variant="ghost"
                  aria-label="후보 선택 화면으로 돌아가기"
                  onClick={ () => navigate('/select') }
                >
                  <Box
                    as={ LuChevronLeft }
                    boxSize={ 6 }
                  />
                </IconButton>
                <Text
                  textStyle="lg"
                  fontWeight="bold"
                >
                  이상형 월드컵 ({ roundTitle })
                </Text>
              </Flex>
              <Button
                size="sm"
                variant="outline"
                borderRadius="xl"
                onClick={ onOpenHistory }
              >
                <Box
                  as={ LuHistory }
                  boxSize={ 4 }
                />
                우승 이력 보기
              </Button>
            </Flex>
          </GridItem>

          <GridItem textAlign="center">
            <Text
              textStyle="md"
              fontWeight="medium"
              color="fg.muted"
            >
              마음에 드는 상품을 선택해 주세요 ({ Math.floor(currentIndex / 2) + 1 } / { Math.ceil(matchList.length / 2) })
            </Text>
          </GridItem>

          <GridItem>
            <Grid
              templateColumns="1fr auto 1fr"
              gap={ 4 }
              alignItems="center"
              position="relative"
            >
              <GridItem
                borderWidth="thin"
                borderColor="border.subtle"
                borderRadius="2xl"
                p={ 4 }
                cursor={ isSaving ? 'not-allowed' : 'pointer' }
                bg="bg.panel"
                _hover={ { borderColor: 'border.emphasized', transform: 'translateY(calc(-1 * {spacing.1}))' } }
                transition="all 0.2s"
                onClick={ () => onSelect(leftProduct) }
              >
                <Box
                  w="100%"
                  h={ { base: '40', md: '60' } }
                  borderRadius="xl"
                  overflow="hidden"
                  mb={ 4 }
                  bg="bg.subtle"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image
                    src={ leftProduct?.thumbnailUrl || leftProduct?.imageUrl || defaultHeroImage }
                    alt={ leftProduct?.productName || leftProduct?.name }
                    w="100%"
                    h="100%"
                    objectFit="contain"
                  />
                </Box>
                <Text
                  textStyle="xs"
                  color="fg.muted"
                  truncate
                >
                  { leftProduct?.brandName }
                </Text>
                <Text
                  textStyle={ { base: 'xs', md: 'md' } }
                  fontWeight="bold"
                  textAlign="center"
                  truncate
                >
                  { leftProduct?.productName || leftProduct?.name }
                </Text>
              </GridItem>

              <GridItem zIndex={ 10 }>
                <Center
                  boxShadow="md"
                  borderRadius="full"
                  boxSize={ { base: 9, md: 12 } }
                  bg="bg.panel"
                  borderWidth="thin"
                  borderColor="border.subtle"
                >
                  <Text
                    textStyle={ { base: 'xs', md: 'sm' } }
                    fontWeight="bold"
                  >
                    VS
                  </Text>
                </Center>
              </GridItem>

              <GridItem
                borderWidth="thin"
                borderColor="border.subtle"
                borderRadius="2xl"
                p={ 4 }
                cursor={ isSaving ? 'not-allowed' : 'pointer' }
                bg="bg.panel"
                _hover={ { borderColor: 'border.emphasized', transform: 'translateY(calc(-1 * {spacing.1}))' } }
                transition="all 0.2s"
                onClick={ () => onSelect(rightProduct) }
              >
                <Box
                  w="100%"
                  h={ { base: '40', md: '60' } }
                  borderRadius="xl"
                  overflow="hidden"
                  mb={ 4 }
                  bg="bg.subtle"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image
                    src={ rightProduct?.thumbnailUrl || rightProduct?.imageUrl || defaultHeroImage }
                    alt={ rightProduct?.productName || rightProduct?.name }
                    w="100%"
                    h="100%"
                    objectFit="contain"
                  />
                </Box>
                <Text
                  textStyle="xs"
                  color="fg.muted"
                  truncate
                >
                  { rightProduct?.brandName }
                </Text>
                <Text
                  textStyle={ { base: 'xs', md: 'md' } }
                  fontWeight="bold"
                  textAlign="center"
                  truncate
                >
                  { rightProduct?.productName || rightProduct?.name }
                </Text>
              </GridItem>
            </Grid>
          </GridItem>

          <GridItem
            textAlign="center"
            pt={ 4 }
          >
            <Text
              textStyle="xs"
              color="fg.muted"
            >
              상품 정보는 판매처 기준입니다
            </Text>
          </GridItem>
        </Grid>
      </Container>
      <TabBar/>
      <Footer/>
    </Stack>
  )
}