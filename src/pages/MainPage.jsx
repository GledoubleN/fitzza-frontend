import {
  Container,
  Grid,
  IconButton,
  Stack,
  Card,
  Text,
  Image,
  Box,
  Input,
  Textarea,
} from '@chakra-ui/react'
import {
  LuArrowUp,
  LuHeart,
  LuSparkle,
} from 'react-icons/lu'
import exampleProductImage from '/src/assets/hero.png'
import { Header } from '../components/Header.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { useNavigate } from 'react-router-dom'
import { Footer } from '../components/Footer.jsx'
import { useEffect, useRef, useState } from 'react'
import { api } from '../api/axios.js'
import { HttpStatusCode } from 'axios'
import { ProductItem } from '../components/ProductItem.jsx'

// AI 버튼(LuSparkle)으로 펼쳤을 때의 줄 수이자 자동으로 늘어나는 최대 줄 수.
const MAX_PROMPT_ROWS = 4

// 추천 질의 최대 글자 수 입니다. 약식으로 정해진 거라 실제 값은 확정이 필요해보입니다.
const MAX_QUERY_LENGTH = 500

export const MainPage = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])

  const [prompt, setPrompt] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    const query = prompt.trim()
    if (!query) return
    navigate('/ai', { state: { query } })
  }

  async function loadRecommendedProducts () {
    api.get('/products', {}).then((response) => {
      if (response.status !== HttpStatusCode.Ok) {
        return
      }

      setProducts(response.data)
    }).catch(error => console.log(error))
  }

  useEffect(() => {
    loadRecommendedProducts()
  }, [])

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
      <Header></Header>

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
                  onClick={ () => {
                    setIsLongPrompt((isLongPrompt) => !isLongPrompt)
                  } }
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
        <Grid
          templateColumns={ 'repeat(auto-fill, minmax(max(100px, calc((100% - {spacing.4} * 4) / 5)), 1fr))' }
          gap={ 4 }
        >
          {
            products.map((product, index) => (
              <ProductItem key={ index } product={ product }></ProductItem>
            ))
          }
        </Grid>
      </Container>

      <TabBar></TabBar>

      <Footer></Footer>
    </Stack>
  )
}