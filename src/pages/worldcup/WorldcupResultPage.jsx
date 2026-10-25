import {
  Box,
  Flex,
  Text,
  IconButton,
  Image,
  Button,
  Grid,
  GridItem,
  Table,
  Container,
  Stack,
} from '@chakra-ui/react'
import { LuChevronLeft, LuRotateCcw, LuShare2, LuHistory } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { Header } from '../../components/Header.jsx'
import { TabBar } from '../../components/TabBar.jsx'
import { Footer } from '../../components/Footer.jsx'
import defaultHeroImage from '../../assets/hero.png'

export const WorldcupResultPage = ({
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
                  이상형 월드컵 결과
                </Text>
              </Flex>
              <Button
                size="sm"
                variant="outline"
                borderRadius="xl"
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

          <GridItem textAlign="center">
            <Text
              textStyle="md"
              fontWeight="bold"
            >
              당신의 최종 선택은?
            </Text>
          </GridItem>

          <GridItem
            textAlign="center"
            cursor="pointer"
            onClick={ () => navigate(`/products/${ winnerId }`) }
            _hover={ { opacity: 0.9 } }
            transition="opacity 0.2s"
          >
            <Box
              w="100%"
              h={ { base: 'sm', md: 'md' } }
              borderRadius="2xl"
              overflow="hidden"
              mb={ 4 }
              borderWidth="thin"
              borderColor="border.subtle"
              bg="bg.subtle"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Image
                src={ winnerProduct.thumbnailUrl || winnerProduct.imageUrl || defaultHeroImage }
                alt={ winnerProduct.productName || winnerProduct.name }
                w="100%"
                h="100%"
                objectFit="contain"
              />
            </Box>
            <Text
              textStyle="xl"
              fontWeight="bold"
              _hover={ { textDecoration: 'underline' } }
            >
              { winnerProduct.productName || winnerProduct.name }
            </Text>
            <Text
              textStyle="sm"
              color="fg.muted"
            >
              { winnerProduct.brandName }
            </Text>
          </GridItem>

          <GridItem
            borderWidth="thin"
            borderColor="border.subtle"
            borderRadius="2xl"
            p={ 4 }
            bg="bg.panel"
          >
            <Text
              textStyle="sm"
              fontWeight="bold"
              mb={ 4 }
              textAlign="center"
              color="fg.muted"
            >
              우승 상품 정보
            </Text>

            <Table.Root size="sm">
              <Table.Body>
                <Table.Row>
                  <Table.Cell
                    fontWeight="medium"
                    w="30%"
                    color="fg.muted"
                  >
                    가격
                  </Table.Cell>
                  <Table.Cell
                    textAlign="right"
                    fontWeight="bold"
                  >
                    { winnerProduct.price ? `${ winnerProduct.price.toLocaleString() }원` : '정보 없음' }
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell
                    fontWeight="medium"
                    color="fg.muted"
                  >
                    브랜드
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    { winnerProduct.brandName || '정보 없음' }
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </GridItem>

          { isSaveFailed && !savedResult && (
            <GridItem textAlign="center">
              <Flex
                direction="column"
                align="center"
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
              </Flex>
            </GridItem>
          ) }

          <GridItem>
            <Grid
              templateColumns="1fr 1fr"
              gap={ 4 }
            >
              <Button
                size="lg"
                variant="outline"
                borderRadius="xl"
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
                borderRadius="xl"
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
          </GridItem>
        </Grid>
      </Container>
      <TabBar/>
      <Footer/>
    </Stack>
  )
}