import { Box, Container, Stack, Text } from '@chakra-ui/react'
import { useMotionValue, useScroll, useTransform } from 'motion/react'
import { Header } from '../components/Header.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { Footer } from '../components/Footer.jsx'
import { useEffect, useRef, useState } from 'react'
import { api } from '../api/axios.js'
import { HttpStatusCode } from 'axios'
import { HeroLighting } from './main/HeroLighting.jsx'
import { MainHero } from './main/MainHero.jsx'
import { MoodboardCollage } from './main/MoodboardCollage.jsx'
import { LOGO_TEXT_PROPS } from './main/logoTextProps.js'
import { ProductGrid } from './main/ProductGrid.jsx'
import { useMeasure } from './main/useMeasure.js'

export const MainPage = () => {
  const [products, setProducts] = useState([])

  const headerRef = useRef(null)
  const logoSlotRef = useRef(null)
  const promptSlotRef = useRef(null)
  const productGridRef = useRef(null)

  const { scrollY } = useScroll()
  const arrivalScrollY = useMotionValue(1)
  const progress = useTransform(() => Math.min(Math.max(scrollY.get() / arrivalScrollY.get(), 0), 1))
  const headerBackgroundOpacity = useTransform(progress, [0.6, 0.85], [0, 1])

  useMeasure(() => {
    const productGridTop = productGridRef.current.getBoundingClientRect().top + window.scrollY
    const headerHeight = headerRef.current.offsetHeight
    arrivalScrollY.set(Math.max(productGridTop - headerHeight - 16, 1))
  })

  async function loadRecommendedProducts () {
    api.get('/products', {}).then((response) => {
      if (response.status !== HttpStatusCode.Ok) {
        return
      }

      setProducts(response.data.content)
    }).catch(error => console.log(error))
  }

  useEffect(() => {
    loadRecommendedProducts()
  }, [])

  return (
    <Stack
      gap={ 4 }
      minHeight="100vh"
      paddingTop={ 4 }
    >
      <Header
        ref={ headerRef }
        backgroundOpacity={ headerBackgroundOpacity }
        logo={
          <Text
            ref={ logoSlotRef }
            { ...LOGO_TEXT_PROPS }
            fontSize="2xl"
            visibility="hidden"
          >
            Fitzza
          </Text>
        }
        center={
          <Box
            ref={ promptSlotRef }
            maxWidth="xl"
            height="12"
            marginX="auto"
          />
        }
      />

      <HeroLighting progress={ progress }/>

      <MoodboardCollage
        products={ products }
        progress={ progress }
      />

      <MainHero
        progress={ progress }
        logoSlotRef={ logoSlotRef }
        promptSlotRef={ promptSlotRef }
      />

      <Box
        height="100vh"
        aria-hidden
      />

      <Container
        ref={ productGridRef }
        maxWidth={ '5xl' }
        paddingBottom={ 8 }
      >
        <ProductGrid products={ products }/>
      </Container>

      <TabBar></TabBar>

      <Footer></Footer>
    </Stack>
  )
}
