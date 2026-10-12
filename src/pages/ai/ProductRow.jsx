import { Box, Flex, IconButton } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { LuChevronRight } from 'react-icons/lu'
import { productCardWidth } from './productCardWidth.js'

// 상품 카드를 가로로 나열하고, 오른쪽으로 더 넘길 수 있을 때만 넘기기 버튼을 띄웁니다.
export const ProductRow = ({ children }) => {
  const rowRef = useRef(null)
  const [canScrollNext, setCanScrollNext] = useState(false)

  useEffect(() => {
    const row = rowRef.current
    // 끝까지 넘기면 버튼이 사라지도록 남은 거리를 봅니다. 1은 소수점 반올림 오차 여유입니다.
    const check = () => setCanScrollNext(row.scrollLeft + row.clientWidth < row.scrollWidth - 1)
    check()
    row.addEventListener('scroll', check)
    const observer = new ResizeObserver(check)
    observer.observe(row)
    return () => {
      row.removeEventListener('scroll', check)
      observer.disconnect()
    }
  }, [])

  // 보이는 너비만큼 한 번에 넘깁니다.
  const scrollNext = () => {
    const row = rowRef.current
    row.scrollBy({ left: row.clientWidth, behavior: 'smooth' })
  }

  return (
    <Box position={ 'relative' }>
      <Flex ref={ rowRef } gap={ 3 } paddingBottom={ 2 } overflowX={ 'auto' }>
        { children }
      </Flex>
      {
        canScrollNext &&
        // 상품 사진과 같은 크기의 정사각형을 줄 오른쪽 위에 겹쳐 두고, 그 세로 가운데에 버튼을 놓습니다.
        // 카드 크기가 바뀌어도 버튼이 항상 사진 높이의 정중앙에 옵니다.
        <Flex
          position={ 'absolute' }
          top={ 0 }
          right={ 1 }
          { ...productCardWidth }
          aspectRatio={ 1 }
          align={ 'center' }
          justify={ 'flex-end' }
          pointerEvents={ 'none' }
        >
          <IconButton
            size={ 'sm' }
            variant={ 'outline' }
            rounded={ 'full' }
            bg={ 'bg.panel' }
            boxShadow={ 'md' }
            pointerEvents={ 'auto' }
            aria-label={ '다음 상품 보기' }
            onClick={ scrollNext }
          >
            <LuChevronRight></LuChevronRight>
          </IconButton>
        </Flex>
      }
    </Box>
  )
}
