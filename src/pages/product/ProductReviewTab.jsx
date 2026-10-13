import { useEffect, useState } from 'react'
import { Button, Flex, Image, RatingGroup, Separator, Spinner, Stack, Text } from '@chakra-ui/react'
import { api } from '../../api/axios.js'

const PAGE_SIZE = 10

export const ProductReviewTab = ({ productId }) => {
  const [reviews, setReviews] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  // 실패한 페이지를 같은 번호로 다시 요청하기 위한 값
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let ignore = false
    api.get(`/products/${ productId }/reviews`, { params: { page, size: PAGE_SIZE } })
      .then((response) => {
        if (ignore) return
        setReviews((previous) => (page === 0 ? response.data.content : [...previous, ...response.data.content]))
        setTotalPages(response.data.totalPages)
      })
      .catch(() => !ignore && setHasError(true))
      .finally(() => !ignore && setIsLoading(false))

    return () => { ignore = true }
  }, [productId, page, attempt])

  const load = (nextPage) => {
    setIsLoading(true)
    setHasError(false)
    setPage(nextPage)
    setAttempt(attempt + 1)
  }

  return (
    <Stack gap={ 4 } paddingY={ 4 }>
      <Stack gap={ 4 } separator={ <Separator/> }>
        { reviews.map((review) => (
          <Stack key={ review.reviewId } gap={ 3 }>
            <Flex justify={ 'space-between' } align={ 'center' }>
              <RatingGroup.Root readOnly allowHalf count={ 5 } value={ review.rating } size={ 'sm' } colorPalette={ 'primary' }>
                <RatingGroup.HiddenInput/>
                <RatingGroup.Control/>
              </RatingGroup.Root>
              <Text textStyle={ 'xs' } color={ 'fg.muted' }>
                { new Date(review.createdAt).toLocaleDateString('ko-KR') }
              </Text>
            </Flex>
            { review.imageUrl && (
              <Image src={ review.imageUrl } alt={ '후기 사진' } boxSize={ 24 } objectFit={ 'cover' } rounded={ 'l2' } bg={ 'bg.muted' }/>
            ) }
            <Text whiteSpace={ 'pre-wrap' }>{ review.content }</Text>
          </Stack>
        )) }
      </Stack>

      { isLoading && <Spinner alignSelf={ 'center' }/> }
      { hasError && (
        <>
          <Text color={ 'fg.error' }>후기를 불러오지 못했어요.</Text>
          <Button variant={ 'outline' } onClick={ () => load(page) }>다시 시도</Button>
        </>
      ) }
      { !isLoading && !hasError && reviews.length === 0 && (
        <Text color={ 'fg.muted' }>아직 후기가 없어요.</Text>
      ) }
      { !isLoading && !hasError && page + 1 < totalPages && (
        <Button variant={ 'outline' } onClick={ () => load(page + 1) }>후기 더 보기</Button>
      ) }
    </Stack>
  )
}
