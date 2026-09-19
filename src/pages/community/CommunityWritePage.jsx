import { Button, Container, Stack } from '@chakra-ui/react'
import { AppBar } from '../../components/AppBar.jsx'
import { Control, RichTextEditor } from '/src/components/ui/rich-text-editor'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'

export const CommunityWritePage = () => {
  const [editable, setEditable] = useState(true)

  const editor = useEditor({
    extensions: [StarterKit],
    content: `<p>Edit this text...</p>`,
    editable,
    shouldRerenderOnTransaction: true,
    immediatelyRender: false,
  })

  return (
    <Container maxWidth={ 'xl' } height={ '100vh' }>
      <Stack paddingY={ '4' } gap={ '4' }>
        <AppBar></AppBar>

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
    </Container>
  )
}