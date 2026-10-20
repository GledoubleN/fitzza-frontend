import {
  AspectRatio,
  Box,
  Button,
  CloseButton,
  Dialog,
  Flex,
  Grid,
  Heading,
  Image,
  Portal,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/axios.js'
import { toaster } from '../../components/ui/toaster.jsx'

const PAGE_SIZE = 20
const PREVIEW_SIZE = 4

const formatDate = (value) => new Date(value).toLocaleDateString('ko-KR')

const FittingThumbnail = ({ fitting }) => {
  if (fitting.status === 'COMPLETED' && fitting.resultImageUrl) {
    return <Image src={ fitting.resultImageUrl } alt={ '가상 피팅 결과' } objectFit={ 'cover' }></Image>
  }

  return (
    <Flex direction={ 'column' } align={ 'center' } justify={ 'center' } gap={ 2 } bg={ 'bg.muted' }>
      <Spinner size={ 'sm' }></Spinner>
      <Text textStyle={ 'xs' } color={ 'fg.muted' }>만드는 중</Text>
    </Flex>
  )
}

export const VtonGallery = ({ preview = false }) => {
  const navigate = useNavigate()
  const [fittings, setFittings] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [status, setStatus] = useState('loading')
  const [selected, setSelected] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const successfulFittings = fittings.filter((fitting) => fitting.status !== 'FAILED')
  const visibleFittings = preview ? successfulFittings.slice(0, PREVIEW_SIZE) : successfulFittings
  const hasMore = preview
    ? successfulFittings.length > PREVIEW_SIZE || fittings.length < totalCount
    : fittings.length < totalCount

  const load = async (offset = 0) => {
    setStatus('loading')
    try {
      const { data } = await api.get('/vton', { params: { limit: PAGE_SIZE, offset } })
      setFittings((fittings) => offset ? [...fittings, ...data.items] : data.items)
      setTotalCount(data.totalCount)
      setStatus('done')
    } catch {
      setStatus('failed')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const deleteFitting = async () => {
    setIsDeleting(true)
    try {
      await api.delete(`/vton/${ selected.fittingId }`)
      setFittings((fittings) => fittings.filter((fitting) => fitting.fittingId !== selected.fittingId))
      setTotalCount((count) => count - 1)
      setSelected(null)
    } catch {
      toaster.create({ type: 'error', title: '가상 피팅을 삭제하지 못했어요. 다시 시도해 주세요.' })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Stack gap={ 4 }>
      { preview && <Heading textStyle={ 'md' } fontWeight={ '700' }>가상 피팅 갤러리</Heading> }

      {
        status === 'done' && !visibleFittings.length &&
        <Stack align={ 'center' } gap={ 3 } paddingY={ 8 }>
          <Text color={ 'fg.muted' }>아직 입어본 옷이 없어요. AI 스타일리스트의 추천 상품으로 입어보세요.</Text>
          <Button variant={ 'outline' } size={ 'sm' } onClick={ () => navigate('/ai') }>AI 스타일리스트로 가기</Button>
        </Stack>
      }

      <Grid
        templateColumns={ preview
          ? { base: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }
          : { base: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)', lg: 'repeat(6, 1fr)' } }
        gap={ 4 }
      >
        {
          visibleFittings.map((fitting) => (
            <Button
              key={ fitting.fittingId }
              variant={ 'plain' }
              height={ 'auto' }
              padding={ 0 }
              display={ 'block' }
              textAlign={ 'start' }
              onClick={ () => setSelected(fitting) }
            >
              <AspectRatio ratio={ 3 / 4 } borderRadius={ 'xl' } overflow={ 'hidden' } borderWidth={ 'thin' } borderColor={ 'border.subtle' }>
                <FittingThumbnail fitting={ fitting }></FittingThumbnail>
              </AspectRatio>
              <Text textStyle={ 'xs' } color={ 'fg.muted' } marginTop={ 2 } truncate>
                { fitting.products?.map((product) => product.productName).join(', ') }
              </Text>
              <Text textStyle={ 'xs' } color={ 'fg.subtle' }>{ formatDate(fitting.createdAt) }</Text>
            </Button>
          ))
        }
      </Grid>

      { status === 'loading' && <Flex justify={ 'center' } paddingY={ 4 }><Spinner></Spinner></Flex> }
      {
        status === 'failed' &&
        <Stack align={ 'center' } gap={ 3 }>
          <Text color={ 'fg.error' }>가상 피팅 기록을 불러오지 못했어요.</Text>
          <Button variant={ 'outline' } size={ 'sm' } onClick={ () => load(fittings.length) }>다시 시도</Button>
        </Stack>
      }
      {
        status === 'done' && hasMore &&
        <Button
          variant={ 'outline' }
          size={ 'sm' }
          onClick={ () => preview ? navigate('/profile/fittings') : load(fittings.length) }
        >
          더 보기
        </Button>
      }

      <Dialog.Root
        open={ !!selected }
        onOpenChange={ (event) => !event.open && setSelected(null) }
        placement={ 'center' }
        scrollBehavior={ 'inside' }
        size={ 'xl' }
      >
        <Portal>
          <Dialog.Backdrop/>
          <Dialog.Positioner>
            <Dialog.Content marginX={ 4 }>
              <Dialog.Header>
                <Dialog.Title>{ selected && formatDate(selected.createdAt) } 가상 피팅</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                {
                  selected &&
                  <Grid templateColumns={ { base: '1fr', md: '3fr 2fr' } } gap={ 4 } alignItems={ 'start' }>
                    <Stack gap={ 2 }>
                      <AspectRatio ratio={ 3 / 4 } width={ 'full' } maxWidth={ 'xs' } marginX={ 'auto' } borderRadius={ 'xl' } overflow={ 'hidden' }>
                        <FittingThumbnail fitting={ selected }></FittingThumbnail>
                      </AspectRatio>
                      <Text textStyle={ 'xs' } color={ 'fg.muted' }>AI 생성 이미지 · 실제와 다를 수 있어요</Text>
                    </Stack>
                    <Stack gap={ 4 }>
                      {
                        selected.products?.map((product) => (
                          <Flex
                            key={ product.productId }
                            as={ 'button' }
                            align={ 'center' }
                            gap={ 3 }
                            textAlign={ 'start' }
                            cursor={ 'pointer' }
                            onClick={ () => navigate(`/products/${ product.productId }`) }
                          >
                            <Box width={ 12 } flexShrink={ 0 }>
                              <AspectRatio ratio={ 1 } borderRadius={ 'md' } overflow={ 'hidden' } bg={ 'bg.muted' }>
                                <Image src={ product.imageUrl } alt={ product.productName }></Image>
                              </AspectRatio>
                            </Box>
                            <Stack gap={ 0 } minWidth={ 0 }>
                              <Text textStyle={ 'sm' } truncate>{ product.productName }</Text>
                              <Text textStyle={ 'xs' } color={ 'fg.muted' }>{ product.price.toLocaleString() }원</Text>
                            </Stack>
                          </Flex>
                        ))
                      }
                    </Stack>
                  </Grid>
                }
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant={ 'outline' } loading={ isDeleting } onClick={ deleteFitting }>
                  삭제
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size={ 'sm' }/>
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Stack>
  )
}
