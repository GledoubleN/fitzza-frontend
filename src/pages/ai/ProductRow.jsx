import { Box, Flex, IconButton } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import { productCardWidth } from './productCardWidth.js'

// 상품 카드를 가로로 나열하고, 넘길 수 있는 방향에만 넘기기 버튼을 띄웁니다.
export const ProductRow = ({ children }) => {
  const rowRef = useRef(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  useEffect(() => {
    const row = rowRef.current
    // 양 끝에 닿으면 그쪽 버튼이 사라지도록 남은 거리를 봅니다. 1은 소수점 반올림 오차 여유입니다.
    const check = () => {
      setCanScrollPrev(row.scrollLeft > 1)
      setCanScrollNext(row.scrollLeft + row.clientWidth < row.scrollWidth - 1)
    }
    check()
    row.addEventListener('scroll', check)
    const observer = new ResizeObserver(check)
    observer.observe(row)
    return () => {
      row.removeEventListener('scroll', check)
      observer.disconnect()
    }
  }, [])

  // 온전히 보이는 카드 수만큼만 넘겨서, 걸쳐 보이던 카드가 다음 화면의 첫 카드가 되게 합니다.
  // direction: 1은 다음, -1은 이전.
  const scroll = (direction) => {
    const row = rowRef.current
    const [first, second] = row.children
    // 카드 한 장이 차지하는 폭(카드 + 간격)
    const step = second ? second.offsetLeft - first.offsetLeft : row.clientWidth
    const gap = second ? step - first.offsetWidth : 0
    const count = Math.max(1, Math.floor((row.clientWidth + gap) / step))
    row.scrollBy({ left: direction * count * step, behavior: 'smooth' })
  }

  const buttons = [
    { show: canScrollPrev, side: { left: 1 }, justify: 'flex-start', label: '이전 상품 보기', direction: -1, icon: <LuChevronLeft/> },
    { show: canScrollNext, side: { right: 1 }, justify: 'flex-end', label: '다음 상품 보기', direction: 1, icon: <LuChevronRight/> },
  ]

  return (
    <Box position={ 'relative' }>
      {/* 손으로 넘겨도 카드가 잘린 채 멈추지 않도록 카드 시작 위치에 맞춰 멈춥니다. */}
      <Flex
        ref={ rowRef }
        gap={ 3 }
        paddingBottom={ 2 }
        overflowX={ 'auto' }
        scrollSnapType={ 'x proximity' }
      >
        { children }
      </Flex>
      {
        buttons.filter((button) => button.show).map((button) => (
          // 상품 사진과 같은 크기의 정사각형을 줄 위쪽 가장자리에 겹쳐 두고, 그 세로 가운데에 버튼을 놓습니다.
          // 카드 크기가 바뀌어도 버튼이 항상 사진 높이의 정중앙에 옵니다.
          <Flex
            key={ button.label }
            position={ 'absolute' }
            top={ 0 }
            { ...button.side }
            { ...productCardWidth }
            aspectRatio={ 1 }
            align={ 'center' }
            justify={ button.justify }
            pointerEvents={ 'none' }
          >
            <IconButton
              size={ 'sm' }
              variant={ 'outline' }
              rounded={ 'full' }
              bg={ 'bg.panel' }
              boxShadow={ 'md' }
              pointerEvents={ 'auto' }
              aria-label={ button.label }
              onClick={ () => scroll(button.direction) }
            >
              { button.icon }
            </IconButton>
          </Flex>
        ))
      }
    </Box>
  )
}
