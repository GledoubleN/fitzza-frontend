import {
  Box,
  Flex,
  Text,
  IconButton,
  Grid,
  GridItem,
  Container,
  Separator,
  Stack,
} from '@chakra-ui/react'
import { LuChevronLeft } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { Header } from '../../components/Header.jsx'
import { TabBar } from '../../components/TabBar.jsx'
import { ProductImage } from '../../components/ProductImage.jsx'

export const WorldCupTournamentPage = ({
  leftProduct,
  rightProduct,
  roundTitle,
  currentIndex,
  matchList,
  isSaving,
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
            <Stack gap={ 4 }>
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
                    onClick={ () => navigate('/worldcup/setup') }
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
                    월드컵 ({ roundTitle })
                  </Text>
                </Flex>
              </Flex>

              <Text
                textAlign="center"
                textStyle="md"
                fontWeight="medium"
                color="fg.muted"
              >
                마음에 드는 상품을 선택해 주세요 ({ Math.floor(currentIndex / 2) + 1 } / { Math.ceil(matchList.length / 2) })
              </Text>
            </Stack>
          </GridItem>

          <GridItem>
            <Grid
              templateColumns="minmax(0, 1fr) auto minmax(0, 1fr)"
              gap={ 4 }
              alignItems="center"
              position="relative"
              maxWidth="3xl"
              marginX="auto"
            >
              <GridItem
                className="group"
                minWidth={ 0 }
                display="flex"
                flexDirection="column"
                gap={ 3 }
                padding={ 2 }
                paddingBottom={ 3 }
                cursor={ isSaving ? 'not-allowed' : 'pointer' }
                bg="bg.panel"
                borderWidth="thin"
                borderColor="border.subtle"
                boxShadow="sm"
                transition="box-shadow 0.25s ease"
                _hover={ { boxShadow: 'lg' } }
                onClick={ () => onSelect(leftProduct) }
              >
                <Box
                  width="full"
                  aspectRatio={ { base: 3 / 4, md: 1 } }
                  overflow="hidden"
                  bg="bg.muted"
                >
                  <ProductImage
                    src={ leftProduct?.thumbnailUrl || leftProduct?.imageUrl }
                    alt={ leftProduct?.productName || leftProduct?.name }
                    width="full"
                    height="full"
                    objectFit="cover"
                    transition="transform 0.4s ease"
                    _groupHover={ { transform: 'scale(1.05)' } }
                  />
                </Box>
                <Stack gap={ 1 }>
                  <Text
                    textStyle="xs"
                    fontWeight="semibold"
                    letterSpacing="wide"
                    textTransform="uppercase"
                    color="fg.muted"
                    truncate
                  >
                    { leftProduct?.brandName }
                  </Text>
                  <Text
                    textStyle={ { base: 'xs', md: 'md' } }
                    lineClamp={ 2 }
                    minHeight="2lh"
                  >
                    { leftProduct?.productName || leftProduct?.name }
                  </Text>
                </Stack>
              </GridItem>

              <GridItem alignSelf="stretch">
                <Separator
                  orientation="vertical"
                  height="full"
                  borderColor="fg.muted/30"
                />
              </GridItem>

              <GridItem
                className="group"
                minWidth={ 0 }
                display="flex"
                flexDirection="column"
                gap={ 3 }
                padding={ 2 }
                paddingBottom={ 3 }
                cursor={ isSaving ? 'not-allowed' : 'pointer' }
                bg="bg.panel"
                borderWidth="thin"
                borderColor="border.subtle"
                boxShadow="sm"
                transition="box-shadow 0.25s ease"
                _hover={ { boxShadow: 'lg' } }
                onClick={ () => onSelect(rightProduct) }
              >
                <Box
                  width="full"
                  aspectRatio={ { base: 3 / 4, md: 1 } }
                  overflow="hidden"
                  bg="bg.muted"
                >
                  <ProductImage
                    src={ rightProduct?.thumbnailUrl || rightProduct?.imageUrl }
                    alt={ rightProduct?.productName || rightProduct?.name }
                    width="full"
                    height="full"
                    objectFit="cover"
                    transition="transform 0.4s ease"
                    _groupHover={ { transform: 'scale(1.05)' } }
                  />
                </Box>
                <Stack gap={ 1 }>
                  <Text
                    textStyle="xs"
                    fontWeight="semibold"
                    letterSpacing="wide"
                    textTransform="uppercase"
                    color="fg.muted"
                    truncate
                  >
                    { rightProduct?.brandName }
                  </Text>
                  <Text
                    textStyle={ { base: 'xs', md: 'md' } }
                    lineClamp={ 2 }
                    minHeight="2lh"
                  >
                    { rightProduct?.productName || rightProduct?.name }
                  </Text>
                </Stack>
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
    </Stack>
  )
}