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

const SCATTER_POINTS = [
  [0.07, 0.14, -9],
  [0.27, 0.09, 6],
  [0.5, 0.07, -3],
  [0.73, 0.1, 5],
  [0.93, 0.15, -7],
  [0.05, 0.42, 5],
  [0.95, 0.43, -5],
  [0.12, 0.7, -6],
  [0.88, 0.7, 7],
  [0.06, 0.93, 4],
  [0.29, 0.9, -5],
  [0.5, 0.95, 3],
  [0.71, 0.9, -4],
  [0.94, 0.93, 6],
  [0.2, 0.3, 3],
]

const FlyingProduct = ({ product, index, layout, scrollY, progress, time, isArranged }) => {
  const [scatterX, scatterY, scatterRotate] = SCATTER_POINTS[index]
  const depth = 0.5 + ((index * 37) % 30) / 100
  const delay = (index % 5) * 0.025 + Math.floor(index / 5) * 0.03

  const flight = useTransform(progress, (value) => transform(value, [delay, delay + 0.8], [0, 1], { ease: easeInOut }))

  const drift = (period, amplitude) => Math.sin(time.get() / period + index * 1.3) * amplitude * (1 - flight.get())

  const x = useTransform(() => {
    const cell = layout.get()?.cells[index]
    const flown = flight.get()
    if (!cell) return 0
    const offset = scatterX * window.innerWidth - (cell.left + cell.width / 2)
    return mix(offset, 0, flown)
  })

  const y = useTransform(() => {
    const current = layout.get()
    const scrolled = scrollY.get()
    const flown = flight.get()
    const floating = drift(1800, 14)
    const cell = current?.cells[index]
    if (!cell) return 0
    const cellCenter = current.gridTop + cell.top + cell.height / 2 - scrolled
    const offset = scatterY * window.innerHeight - cellCenter
    return mix(offset, 0, flown) + floating
  })

  const rotate = useTransform(() => mix(scatterRotate, 0, flight.get()) + drift(2400, 3))
  const scale = useTransform(() => mix(depth, 1, flight.get()))
  const blur = useTransform(() => mix(14 - depth * 10, 0, flight.get()))
  const filter = useMotionTemplate`blur(${ blur }px)`
  const opacity = useTransform(() => mix(0.7, 1, flight.get()))

  return (
    <MotionBox
      style={ { x, y, rotate, scale, filter, opacity } }
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

  const flyingCount = prefersReducedMotion ? 0 : Math.min(products.length, SCATTER_POINTS.length)

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
