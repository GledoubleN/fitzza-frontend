import { useEffect, useRef, useState } from 'react'

// 가로 스크롤 줄이 실제로 넘치는지 알려줍니다. 줄에 ref를 붙여 쓰고, 줄 크기가 바뀌면 다시 잽니다.
// content: 줄에 담긴 내용. 줄 크기는 그대로인데 내용만 바뀐 경우에도 다시 재기 위해 받습니다.
export const useOverflowing = (content) => {
  const ref = useRef(null)
  const [overflowing, setOverflowing] = useState(false)

  useEffect(() => {
    const row = ref.current
    if (!row) return
    const check = () => setOverflowing(row.scrollWidth > row.clientWidth)
    check()
    const observer = new ResizeObserver(check)
    observer.observe(row)
    return () => observer.disconnect()
  }, [content])

  return [ref, overflowing]
}
