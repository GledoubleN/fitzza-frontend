import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Container,
  Flex,
  Grid,
  Group,
  IconButton,
  Image,
  Input, InputGroup,
  NativeSelect,
  Separator,
  Stack,
  Tabs,
  Text,
} from '@chakra-ui/react'
import { AppBar } from '../../components/AppBar.jsx'
import { RichTextEditor } from '/src/components/ui/rich-text-editor'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LuChevronLeft, LuCircle, LuPlus, LuTrash } from 'react-icons/lu'
import exampleProductImage from '/src/assets/hero.png'

// 게시글 분류. 값은 게시글 작성 API의 category를 따릅니다.
const CATEGORIES = [
  { value: 'FASHION', label: '패션' },
  { value: 'COORDI_QUESTION', label: '코디 질문' },
  { value: 'DAILY', label: '일상' },
]

const MODES = [
  { value: 'default', label: '기본' },
  { value: 'vote', label: '투표' },
]

const MIN_VOTE_OPTIONS = 2
const MAX_VOTE_OPTIONS = 4

export const CommunityWritePage = () => {
  const [editable, setEditable] = useState(true)
  const [mode, setMode] = useState('default')
  const [category, setCategory] = useState('')
  const [title, setTitle] = useState('')
  const navigate = useNavigate()
  // AI 추천 화면에서 공유하기로 넘어온 코디. 게시글 작성 API 연동 시 sharedType, sharedId를 함께 보냅니다.
  const shared = useLocation().state

  // 투표 선택지. 공유로 넘어온 코디가 있으면 미리 채우고, 모자라면 빈 선택지로 최소 개수를 맞춰줍니다.
  const [voteOptions, setVoteOptions] = useState(() => {
    const options = (shared?.voteOptions ?? []).slice(0, MAX_VOTE_OPTIONS)
    while (options.length < MIN_VOTE_OPTIONS) options.push({ text: '' })
    return options
  })

  const changeVoteOptionText = (index, text) => {
    setVoteOptions(voteOptions.map((option, i) => i === index ? { text } : option))
  }

  const editor = useEditor({
    extensions: [StarterKit],
    content: `<p>Edit this text...</p>`,
    editable,
    shouldRerenderOnTransaction: true,
    immediatelyRender: false,
  })

  function getAdditionalInput () {
    switch (mode) {
      case 'default':
        return (
          <></>
        )

      case 'vote':
        return (
          <Stack direction={ 'column' } gap={ '2' }>
            {
              voteOptions.map((option, index) => (
                <Group attached key={ index }>
                  {
                    option.items
                      ? (
                        <Card.Root flex={ '1' } minWidth={ '0' } size={ 'sm' }>
                          <Card.Body gap={ '2' }>
                            <Text fontSize={ 'sm' }>{ option.label }</Text>
                            <Flex gap={ '2' } overflowX={ 'auto' }>
                              {
                                option.items.map((item) => (
                                  <Image
                                    key={ item.productId }
                                    src={ item.imageUrl || exampleProductImage }
                                    alt={ item.productName }
                                    boxSize={ '16' }
                                    flexShrink={ '0' }
                                    objectFit={ 'cover' }
                                    rounded={ 'sm' }
                                    bg={ 'bg.muted' }
                                  ></Image>
                                ))
                              }
                            </Flex>
                          </Card.Body>
                        </Card.Root>
                      )
                      : (
                        <Input
                          placeholder={ `선택지 ${ index + 1 }` }
                          value={ option.text }
                          onChange={ (e) => changeVoteOptionText(index, e.target.value) }
                        ></Input>
                      )
                  }
                  <IconButton
                    variant={ 'outline' }
                    height={ 'auto' }
                    aria-label={ `선택지 ${ index + 1 } 삭제` }
                    disabled={ voteOptions.length <= MIN_VOTE_OPTIONS }
                    onClick={ () => setVoteOptions(voteOptions.filter((_, i) => i !== index)) }
                  >
                    <LuTrash></LuTrash>
                  </IconButton>
                </Group>
              ))
            }
            <Button
              variant={ 'outline' }
              disabled={ voteOptions.length >= MAX_VOTE_OPTIONS }
              onClick={ () => setVoteOptions([...voteOptions, { text: '' }]) }
            >
              <LuPlus></LuPlus> 선택지 추가 (최대 { MAX_VOTE_OPTIONS }개)
            </Button>
          </Stack>
        )

      default:
        throw Error
    }
  }

  return (
    <Container maxWidth={ 'xl' } height={ '100vh' }>
      <Stack paddingY={ '4' } gap={ '4' }>
        <AppBar></AppBar>

        <Flex align={ 'center' } gap={ '1' }>
          <IconButton variant={ 'ghost' } rounded={ 'full' } aria-label={ '뒤로 가기' } onClick={ () => navigate(-1) }>
            <LuChevronLeft></LuChevronLeft>
          </IconButton>
          <Text fontSize={ 'lg' } fontWeight={ 'bold' }>커뮤니티</Text>
        </Flex>

        <Tabs.Root fitted variant={ 'plain' } value={ mode } onValueChange={ (e) => setMode(e.value) }>
          <Tabs.List>
            {
              MODES.map((mode) => (
                <Tabs.Trigger
                  key={ mode.value }
                  value={ mode.value }
                  color={ 'fg.muted' }
                  _selected={ { color: 'fg', fontWeight: 'bold' } }
                >
                  { mode.label }
                </Tabs.Trigger>
              ))
            }
          </Tabs.List>
        </Tabs.Root>

        {
          mode !== 'vote' &&
          <NativeSelect.Root>
            <NativeSelect.Field
              placeholder={ '카테고리 선택' }
              aria-label={ '카테고리' }
              value={ category }
              onChange={ (e) => setCategory(e.target.value) }
            >
              {
                CATEGORIES.map((category) => (
                  <option key={ category.value } value={ category.value }>{ category.label }</option>
                ))
              }
            </NativeSelect.Field>
            <NativeSelect.Indicator/>
          </NativeSelect.Root>
        }

        {
          getAdditionalInput()
        }

        <Input
          placeholder={ '제목' }
          aria-label={ '제목' }
          value={ title }
          onChange={ (e) => setTitle(e.target.value) }
        ></Input>

        <RichTextEditor.Root editor={ editor } height={ '400px' }>
          {
            // 공유할 코디 부분. 일단 본문 상자 안에 임의로 넣었습니다.
            shared?.snapshot && mode !== 'vote' &&
            <Stack gap={ '2' } padding={ '5' } paddingBottom={ '0' }>
              <Text fontWeight={ 'bold' }>공유할 코디</Text>
              {
                shared.snapshot.items.map((item) => (
                  <Flex key={ item.productId } justify={ 'space-between' } gap={ '2' }>
                    <Text>{ item.productName }</Text>
                    <Text>{ item.price.toLocaleString() }원</Text>
                  </Flex>
                ))
              }
              <Text fontWeight={ 'bold' } alignSelf={ 'flex-end' }>
                합계 { shared.snapshot.totalPrice.toLocaleString() }원
              </Text>
              <Separator></Separator>
            </Stack>
          }
          <RichTextEditor.Content/>
        </RichTextEditor.Root>

        <Button>작성하기</Button>
      </Stack>
    </Container>
  )
}