import { Markdown } from '@tiptap/markdown'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { RichTextEditor } from '../../components/ui/rich-text-editor.jsx'

export const MarkdownMessage = ({ markdown }) => {
  const editor = useEditor({
    editable: false,
    extensions: [StarterKit, Markdown],
    content: markdown,
    contentType: 'markdown',
  }, [markdown])

  return (
    <RichTextEditor.Root
      editor={ editor }
      borderWidth={ 0 }
      css={ { '--content-padding-x': 0, '--content-padding-y': 0 } }
    >
      <RichTextEditor.Content/>
    </RichTextEditor.Root>
  )
}