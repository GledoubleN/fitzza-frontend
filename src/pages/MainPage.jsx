import {
  Button,
  Container,
  Grid,
  IconButton,
  Stack,
  Card,
  Text,
  GridItem,
  Image,
  Carousel,
  Box, Center, InputGroup, Input, Switch, Textarea, Marquee,
} from '@chakra-ui/react'
import {
  LuArrowUp,
  LuBell,
  LuBot,
  LuBotOff, LuCamera,
  LuChevronLeft,
  LuChevronRight,
  LuHeart, LuPlus,
  LuSearch,
  LuShoppingBag, LuSparkle,
} from 'react-icons/lu'
import exampleProductImage from '/src/assets/hero.png'
import exampleBannerImage from '/src/assets/vite.svg'
import { products } from '/src/data/products.js'
import { banners } from '/src/data/banners.js'
import { HiCheck, HiX } from 'react-icons/hi'
import { AppBar } from '../components/AppBar.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { useNavigate } from 'react-router-dom'
import { IoLogoFigma, IoLogoGitlab } from 'react-icons/io5'
import { IoLogoJavascript, IoLogoLinkedin, IoLogoTwitter, IoLogoVimeo } from 'react-icons/io'
import { Footer } from '../components/Footer.jsx'
import { MAX_QUERY_LENGTH } from './ai/aiApi.js'
import { useEffect, useRef, useState } from 'react'

// AI 버튼(LuSparkle)으로 펼쳤을 때의 줄 수이자 자동으로 늘어나는 최대 줄 수.
const MAX_PROMPT_ROWS = 4

export const MainPage = () => {
  const navigate = useNavigate()

  const [prompt, setPrompt] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    const query = prompt.trim()
    if (!query) return
    navigate('/ai', { state: { query } })
  }

  const [isLongPrompt, setIsLongPrompt] = useState(false)
  const [promptRows, setPromptRows] = useState(1)

  const promptRef = useRef(null)

  // 내용이 다 보이는 가장 작은 줄 수를 찾고, 설정한 값을 넘어가면 스크롤할 수 있도록 합니다.
  const fitPromptRows = () => {
    const textarea = promptRef.current
    const currentRows = textarea.rows
    let rows = 1
    for (; rows < MAX_PROMPT_ROWS; rows++) {
      textarea.rows = rows
      if (textarea.scrollHeight <= textarea.clientHeight) break
    }
    textarea.rows = currentRows
    setPromptRows(rows)
  }

  const onChange = (e) => {
    setPrompt(e.target.value)
    fitPromptRows()
  }

  // 창 너비가 바뀌면 줄넘김이 달라지므로 다시 맞춥니다.
  useEffect(() => {
    window.addEventListener('resize', fitPromptRows)
    return () => window.removeEventListener('resize', fitPromptRows)
  }, [])

  // Enter는 전송, Shift+Enter는 줄바꿈. 한글 입력시 전송이 두번 되거나, 마지막 글자가 한 번 더 붙는 것을 방지합니다.
  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      e.currentTarget.form.requestSubmit()
    }
  }

  return (
    <Stack
      gap={ 4 }
      paddingY={ '4' }
      minHeight={ '100vh' }
    >
      <AppBar></AppBar>

      <Container maxWidth={ '3xl' }>
        <Card.Root
          height={ '100%' }
          rounded={ '3xl' }
        >
          <Card.Body padding={ 2 }>
            <Stack height={ '100%' } gap={ 2 } position="relative">
              <Grid as={ 'form' } templateColumns={ 'auto 1fr auto' } gap={ 2 } onSubmit={ onSubmit }>
                <IconButton
                  type={ 'button' }
                  rounded={ 'full' }
                  aria-label={ '입력창 펼치기' }
                  aria-pressed={ isLongPrompt }
                  onClick={ () => { setIsLongPrompt((isLongPrompt) => !isLongPrompt) } }
                >
                  <LuSparkle/>
                </IconButton>
                <Textarea
                  resize={ 'none' }
                  variant={ 'none' }
                  ref={ promptRef }
                  aria-label={ 'AI에게 추천받을 내용' }
                  maxLength={ MAX_QUERY_LENGTH }
                  rows={ isLongPrompt ? MAX_PROMPT_ROWS : promptRows }
                  value={ prompt }
                  onChange={ onChange }
                  onKeyDown={ onKeyDown }
                ></Textarea>
                <IconButton type={ 'submit' } rounded={ 'full' } aria-label={ '추천받기' }>
                  <LuArrowUp/>
                </IconButton>
              </Grid>
            </Stack>
          </Card.Body>
        </Card.Root>
      </Container>

      <Container maxWidth={ '5xl' }>
        <Grid templateColumns={ 'repeat(3, 1fr)' } gap={ 4 }>
          {
            products.map((product, index) => (
              <Stack gap={ 4 }>
                <Box position={ 'relative' }>
                  <Image src={ exampleProductImage } onClick={ () => {navigate('products/1')} }></Image>
                  <IconButton
                    position={ 'absolute' }
                    bottom={ 0 }
                    right={ 0 }
                    variant={ 'ghost' }
                    rounded={ 'full' }
                  >
                    <LuHeart></LuHeart>
                  </IconButton>
                </Box>
                <Stack gap={ 0 }>
                  <Text>{ product.brand }</Text>
                  <Text>{ product.price.toLocaleString() }원</Text>
                </Stack>
              </Stack>
            ))
          }
        </Grid>
      </Container>

      <TabBar></TabBar>

      <Footer></Footer>
    </Stack>
  )
}