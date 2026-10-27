import { chakra, Grid } from '@chakra-ui/react'
import {
  easeInOut,
  mix,
  motion,
  transform,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTime,
  useTransform,
} from 'motion/react'
import { useRef, useState } from 'react'
import { ProductItem } from '../../components/ProductItem.jsx'
import { useMeasure } from './useMeasure.js'

const MotionBox = chakra(motion.div)

const MARQUEE_LIMIT = 30

const MARQUEE_ROWS = [
  { bottomOffset: 170, speed: -0.03 },
]

const MARQUEE_SCALE = 0.5

const MARQUEE_GAP = 24

const FlyingProduct = ({ product, index, rowSize, layout, scrollY, progress, time, isArranged }) => {
  const row = MARQUEE_ROWS[index % MARQUEE_ROWS.length]
  const slot = Math.floor(index / MARQUEE_ROWS.length)
  const delay = index * 0.012

  const flight = useTransform(progress, (value) => transform(value, [delay, delay + 0.6], [0, 1], { ease: easeInOut }))

  const x = useTransform(() => {
    const cell = layout.get()?.cells[index]
    const elapsed = time.get()
    const flown = flight.get()
    if (!cell) return 0
    const spacing = cell.width * MARQUEE_SCALE + MARQUEE_GAP
    const rowLength = Math.max(rowSize * spacing, window.innerWidth + spacing)
    const travel = slot * spacing + elapsed * row.speed
    const marqueeCenter = ((travel % rowLength) + rowLength) % rowLength - spacing / 2
    return mix(marqueeCenter - (cell.left + cell.width / 2), 0, flown)
  })

  const y = useTransform(() => {
    const current = layout.get()
    const scrolled = scrollY.get()
    const flown = flight.get()
    const cell = current?.cells[index]
    if (!cell) return 0
    const cellCenter = current.gridTop + cell.top + cell.height / 2 - scrolled
    const rowCenter = window.innerHeight - row.bottomOffset - cell.height * MARQUEE_SCALE / 2
    return mix(rowCenter - cellCenter, 0, flown)
  })

  const scale = useTransform(() => mix(MARQUEE_SCALE, 1, flight.get()))
  const blur = useTransform(() => mix(1.5, 0, flight.get()))
  const filter = useMotionTemplate`blur(${ blur }px)`
  const opacity = useTransform(() => mix(0.85, 1, flight.get()))

  return (
    <MotionBox
      style={ { x, y, scale, filter, opacity } }
      pointerEvents={ isArranged ? 'auto' : 'none' }
    >
      <ProductItem product={ product }/>
    </MotionBox>
  )
}

export const ProductGrid = ({ products, scrollY, progress }) => {
  const prefersReducedMotion = useReducedMotion()
  const gridRef = useRef(null)
  const time = useTime()
  const layout = useMotionValue(null)
  const [isArranged, setIsArranged] = useState(false)

  const flyingCount = prefersReducedMotion ? 0 : Math.min(products.length, MARQUEE_LIMIT)

  useMeasure(() => {
    const grid = gridRef.current
    if (!grid) return

    const gridRect = grid.getBoundingClientRect()
    const cells = [...grid.children].slice(0, flyingCount).map((cell) => ({
      left: gridRect.left + cell.offsetLeft,
      top: cell.offsetTop,
      width: cell.offsetWidth,
      height: cell.offsetHeight,
    }))

    layout.set({
      gridTop: gridRect.top + window.scrollY,
      cells,
    })
  }, flyingCount)

  useMotionValueEvent(progress, 'change', (value) => setIsArranged(value > 0.97))

  return (
    <Grid
      ref={ gridRef }
      position="relative"
      templateColumns={ 'repeat(auto-fill, minmax(max(100px, calc((100% - {spacing.4} * 4) / 5)), 1fr))' }
      gap={ 4 }
    >
      {
        products.map((product, index) => index < flyingCount ? (
          <FlyingProduct
            key={ product.productId }
            product={ product }
            index={ index }
            rowSize={ Math.ceil(flyingCount / MARQUEE_ROWS.length) }
            layout={ layout }
            scrollY={ scrollY }
            progress={ progress }
            time={ time }
            isArranged={ isArranged }
          />
        ) : (
          <ProductItem
            key={ product.productId }
            product={ product }
          />
        ))
      }
    </Grid>
  )
}
