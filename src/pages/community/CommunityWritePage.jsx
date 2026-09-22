import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Grid,
  Group,
  IconButton,
  Input, InputGroup,
  Stack,
  Text,
} from '@chakra-ui/react'
import { AppBar } from '../../components/AppBar.jsx'
import { PageLayout } from '../../components/PageLayout.jsx'
import { Control, RichTextEditor } from '/src/components/ui/rich-text-editor'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'
import { LuCircle, LuPlus, LuTrash } from 'react-icons/lu'

export const CommunityWritePage = () => {
  const [editable, setEditable] = useState(true)
  const [mode, setMode] = useState('default')

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

      case 'versus':
        return (
          <Grid templateColumns={ '1fr auto 1fr' } gap={ 4 }>
            <Card.Root>
              <Card.Body>
                <IconButton variant={ 'ghost' }>
                  <LuPlus></LuPlus>
                </IconButton>
              </Card.Body>
            </Card.Root>
            <Text alignContent={ 'center' }>VS</Text>
            <Card.Root>
              <Card.Body>
                <IconButton variant={ 'ghost' }>
                  <LuPlus></LuPlus>
                </IconButton>
              </Card.Body>
            </Card.Root>
          </Grid>
        )

      case 'vote':
        return (
          <Stack direction={ 'column' } gap={ '2' }>
            <Group attached>
              <Input></Input>
              <IconButton variant={ 'outline' }>
                <LuTrash></LuTrash>
              </IconButton>
            </Group>
            <Group attached>
              <Input></Input>
              <IconButton variant={ 'outline' }>
                <LuTrash></LuTrash>
              </IconButton>
            </Group>
            <Button>추가하기</Button>
          </Stack>
        )

      default:
        throw Error
    }
  }

  return (
    <PageLayout>
      <Stack paddingY={ '4' } gap={ '4' }>
        <AppBar></AppBar>

        <Grid templateColumns={ 'repeat(3, 1fr)' } gap={ '4' }>
          <Button onClick={ () => {setMode('default')} }>기본</Button>
          <Button onClick={ () => {setMode('versus')} }>비교</Button>
          <Button onClick={ () => {setMode('vote')} }>투표</Button>
        </Grid>

        {
          getAdditionalInput()
        }

        <RichTextEditor.Root editor={ editor } height={ '400px' }>
          <RichTextEditor.Toolbar>
            <RichTextEditor.ControlGroup>
              <Control.Bold/>
              <Control.Italic/>
              <Control.Underline/>
            </RichTextEditor.ControlGroup>
          </RichTextEditor.Toolbar>
          <RichTextEditor.Content/>
        </RichTextEditor.Root>

        <Button>작성하기</Button>
      </Stack>
    </PageLayout>
  )
}