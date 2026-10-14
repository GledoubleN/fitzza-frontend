import { useEffect, useState } from 'react'
import {
  Button,
  CloseButton,
  Dialog,
  Image,
  Portal,
  Spinner,
  Stack,
  Text,
  createListCollection,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/axios.js'
import { toaster } from '../../components/ui/toaster.jsx'
import { OptionSelect } from './ProductOptionSelector.jsx'

// TODO API 필요: 아래는 명세에 없거나 확정되지 않아 가정한 계약이며, 지금은 목으로만 동작한다.
// - GET /users/me 의 photoId: 프로필에 올린 전신 사진 ID (명세에 필드 없음)
// - POST /vton: 명세는 { photoId, productIds } 초안(FIX 안됨). 색상·사이즈(color, size)는 가정해서 추가로 보낸다.
// - GET /vton/{fittingId}: 피팅 결과 조회 (명세에 없음, 추후 추가 예정)
// - GET /vton/latest?productId=: 이 상품에서 만든 내 최신 피팅 조회 (명세에 없음)
const FINISHED = ['DONE', 'FAILED']
const POLLING_INTERVAL = 2000

const LOGIN_NOTICE = {
  title: '로그인이 필요한 기능입니다.',
  description: '로그인 후 가상 피팅을 이용해 주세요.',
  actionLabel: '로그인',
  to: '/signin',
}
const PHOTO_NOTICE = {
  title: '사용자님의 사진이 필요합니다.',
  description: '가상 피팅을 하려면 프로필에 전신 사진을 올려 주세요.',
  actionLabel: '프로필로 이동',
  to: '/profile',
}

const unique = (values) => [...new Set(values.filter(Boolean))]

export const ProductTryOnTab = ({ product }) => {
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem('accessToken')
  const [fitting, setFitting] = useState(null)
  const [isLoading, setIsLoading] = useState(isLoggedIn)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [color, setColor] = useState('')
  const [size, setSize] = useState('')
  // 닫히는 동안에도 내용이 남아 있도록 안내 내용과 열림 여부를 따로 둔다.
  const [notice, setNotice] = useState(LOGIN_NOTICE)
  const [isNoticeOpen, setIsNoticeOpen] = useState(false)

  const options = product.options ?? []
  const colors = unique(options.map((option) => option.color))
  // 사이즈는 선택 사항이라 고른 색상의 사이즈만 보여주고, 색상이 없는 상품이면 전체를 보여준다.
  const sizes = unique(
    options.filter((option) => colors.length === 0 || option.color === color).map((option) => option.size),
  )
  const toCollection = (values) => createListCollection({
    items: values.map((value) => ({ label: value, value })),
  })
  const isInProgress = !!fitting && !FINISHED.includes(fitting.status)

  useEffect(() => {
    if (!isLoggedIn) return
    let ignore = false
    api.get('/vton/latest', { params: { productId: product.productId } })
      .then((response) => !ignore && setFitting(response.data))
      .catch(() => {})
      .finally(() => !ignore && setIsLoading(false))

    return () => { ignore = true }
  }, [isLoggedIn, product.productId])

  useEffect(() => {
    if (!isInProgress) return
    const timer = setTimeout(() => {
      api.get(`/vton/${ fitting.fittingId }`)
        .then((response) => setFitting(response.data))
        .catch(() => setFitting({ ...fitting, status: 'FAILED' }))
    }, POLLING_INTERVAL)

    return () => clearTimeout(timer)
  }, [fitting, isInProgress])

  // isWithoutPhoto: 프로필 사진이 없는 경우를 개발 중에 확인하기 위한 값
  const showNotice = (nextNotice) => {
    setNotice(nextNotice)
    setIsNoticeOpen(true)
  }

  const tryOn = async (isWithoutPhoto = false) => {
    if (!isLoggedIn) {
      showNotice(LOGIN_NOTICE)
      return
    }

    setIsSubmitting(true)
    try {
      const { data: me } = await api.get('/users/me')
      if (isWithoutPhoto || !me.photoId) {
        showNotice(PHOTO_NOTICE)
        return
      }

      const { data } = await api.post('/vton', {
        photoId: me.photoId,
        productIds: [product.productId],
        color: color || undefined,
        size: size || undefined,
      })
      setFitting(data)
    } catch {
      toaster.create({ type: 'error', title: '가상 피팅을 요청하지 못했어요. 다시 시도해 주세요.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Stack gap={ 4 } paddingY={ 4 }>
      { colors.length > 0 && (
        <OptionSelect
          label={ '색상' }
          collection={ toCollection(colors) }
          value={ color ? [color] : [] }
          onValueChange={ (event) => {
            setColor(event.value[0] ?? '')
            setSize('')
          } }
        />
      ) }
      <OptionSelect
        label={ '사이즈 (선택)' }
        collection={ toCollection(sizes) }
        disabled={ sizes.length === 0 }
        value={ size ? [size] : [] }
        onValueChange={ (event) => setSize(event.value[0] ?? '') }
      />
      <Button
        size={ 'lg' }
        disabled={ (colors.length > 0 && !color) || isInProgress }
        loading={ isSubmitting }
        onClick={ () => tryOn() }
      >
        입어보기
      </Button>
      { import.meta.env.DEV && (
        <Button
          variant={ 'outline' }
          disabled={ (colors.length > 0 && !color) || isInProgress }
          loading={ isSubmitting }
          onClick={ () => tryOn(true) }
        >
          사진 없이 입은 경우 (개발용)
        </Button>
      ) }

      { isLoading && <Spinner alignSelf={ 'center' }/> }
      { !isLoading && !fitting && (
        <Text color={ 'fg.muted' } textAlign={ 'center' }>색상을 고르고 입어보기를 눌러 보세요.</Text>
      ) }
      { isInProgress && (
        <Stack gap={ 4 } align={ 'center' } paddingY={ 8 }>
          <Spinner/>
          <Text color={ 'fg.muted' }>가상 피팅 이미지를 만들고 있어요.</Text>
        </Stack>
      ) }
      { fitting?.status === 'DONE' && (
        <Image
          width={ '100%' }
          rounded={ 'l3' }
          bg={ 'bg.muted' }
          src={ fitting.resultImageUrl }
          alt={ `${ product.productName } 가상 피팅 결과` }
        />
      ) }
      { fitting?.status === 'FAILED' && (
        <Text color={ 'fg.error' } textAlign={ 'center' }>가상 피팅 이미지를 만들지 못했어요. 다시 시도해 주세요.</Text>
      ) }

      <Dialog.Root
        open={ isNoticeOpen }
        onOpenChange={ (event) => setIsNoticeOpen(event.open) }
        placement={ 'center' }
      >
        <Portal>
          <Dialog.Backdrop/>
          <Dialog.Positioner>
            <Dialog.Content marginX={ 4 }>
              <Dialog.Header>
                <Dialog.Title>{ notice.title }</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text color={ 'fg.muted' }>{ notice.description }</Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant={ 'outline' }>취소</Button>
                </Dialog.ActionTrigger>
                <Button onClick={ () => navigate(notice.to) }>{ notice.actionLabel }</Button>
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
