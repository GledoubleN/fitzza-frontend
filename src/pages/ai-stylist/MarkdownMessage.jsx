import { Markdown } from '@tiptap/markdown'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Marked } from 'marked'
import { RichTextEditor } from '../../components/ui/rich-text-editor.jsx'

const BOLD_PATTERN = /^\*\*(?=\S)([\s\S]*?\S)\*\*/

const boldFollowedByKorean = {
  name: 'strong',
  level: 'inline',
  start: (source) => source.indexOf('**'),
  tokenizer(source) {
    const match = BOLD_PATTERN.exec(source)
    if (!match) return

    return {
      type: 'strong',
      raw: match[0],
      text: match[1],
      tokens: this.lexer.inlineTokens(match[1]),
    }
  },
}

const marked = new Marked().use({ extensions: [boldFollowedByKorean] })

export const MarkdownMessage = ({ markdown }) => {
  const editor = useEditor({
    editable: false,
    extensions: [StarterKit.configure({ link: false }), Markdown.configure({ marked })],
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