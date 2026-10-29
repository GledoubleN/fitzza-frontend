import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Grid,
  GridItem,
  LinkOverlay,
  Container,
  Stack,
} from '@chakra-ui/react'
import { LuChevronLeft, LuRotateCcw, LuShare2, LuHistory } from 'react-icons/lu'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Header } from '../../components/Header.jsx'
import { TabBar } from '../../components/TabBar.jsx'
import { ProductImage } from '../../components/ProductImage.jsx'

export const WorldCupResultPage = ({
  winnerProduct,
  isSaving,
  isSaveFailed,
  savedResult,
  onOpenHistory,
  onRetrySave,
  onRestart,
  onShare,
}) => {
  const navigate = useNavigate()
  const winnerId = winnerProduct.productId || winnerProduct.itemId

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
                  월드컵 결과
                </Text>
              </Flex>
              <Button
                size="sm"
                variant="outline"
                disabled={ isSaving }
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

          <GridItem>
            <Grid
              templateColumns={ { base: '1fr', md: '{sizes.sm} 1fr' } }
              gap={ 8 }
              alignItems="center"
            >
              <Box
                className="group"
                position="relative"
                aspectRatio={ 3 / 4 }
                overflow="hidden"
                bg="bg.muted"
                borderWidth="thin"
                borderColor="border.subtle"
              >
                <ProductImage
                  src={ winnerProduct.thumbnailUrl || winnerProduct.imageUrl }
                  alt={ winnerProduct.productName || winnerProduct.name }
                  width="full"
                  height="full"
                  objectFit="cover"
                  transition="transform 0.4s ease"
                  _groupHover={ { transform: 'scale(1.05)' } }
                />
                <LinkOverlay asChild>
                  <RouterLink
                    to={ `/products/${ winnerId }` }
                    aria-label={ `${ winnerProduct.productName || winnerProduct.name } 상세 보기` }
                  />
                </LinkOverlay>
              </Box>

              <Stack gap={ 8 }>
                <Stack gap={ 4 }>
                  <Text
                    textStyle="md"
                    fontWeight="bold"
                    color="fg.muted"
                  >
                    당신의 최종 선택은?
                  </Text>
                  <Stack gap={ 1 }>
                    <Text
                      textStyle="xs"
                      fontWeight="semibold"
                      letterSpacing="wide"
                      textTransform="uppercase"
                      color="fg.muted"
                    >
                      { winnerProduct.brandName }
                    </Text>
                    <Text
                      asChild
                      textStyle="2xl"
                      fontWeight="bold"
                      _hover={ { textDecoration: 'underline' } }
                    >
                      <RouterLink to={ `/products/${ winnerId }` }>
                        { winnerProduct.productName || winnerProduct.name }
                      </RouterLink>
                    </Text>
                  </Stack>
                  <Text
                    textStyle="xl"
                    fontWeight="bold"
                  >
                    { winnerProduct.price ? `${ winnerProduct.price.toLocaleString() } 원` : '가격 정보 없음' }
                  </Text>
                </Stack>

                { isSaveFailed && !savedResult && (
                  <Stack
                    align="flex-start"
                    gap={ 4 }
                  >
                    <Text
                      textStyle="xs"
                      color="fg.error"
                    >
                      결과 저장에 실패하여 커뮤니티에 공유할 수 없습니다.
                    </Text>
                    <Button
                      size="sm"
                      variant="outline"
                      loading={ isSaving }
                      onClick={ onRetrySave }
                    >
                      결과 저장 다시 시도
                    </Button>
                  </Stack>
                ) }

                <Grid
                  templateColumns="1fr 1fr"
                  gap={ 4 }
                >
                  <Button
                    size="lg"
                    variant="outline"
                    disabled={ isSaving }
                    onClick={ onRestart }
                  >
                    <Box
                      as={ LuRotateCcw }
                      boxSize={ 4 }
                    />
                    다시 하기
                  </Button>
                  <Button
                    size="lg"
                    bg="fg"
                    color="bg"
                    disabled={ !savedResult || isSaving }
                    _hover={ { opacity: 0.9 } }
                    onClick={ onShare }
                  >
                    <Box
                      as={ LuShare2 }
                      boxSize={ 4 }
                    />
                    커뮤니티에 공유
                  </Button>
                </Grid>
              </Stack>
            </Grid>
          </GridItem>
        </Grid>
      </Container>
      <TabBar/>
    </Stack>
  )
}