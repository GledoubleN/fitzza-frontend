import { Markdown } from '@tiptap/markdown'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Marked } from 'marked'
import { RichTextEditor } from '../../components/ui/rich-text-editor.jsx'

const BOLD_PATTERN = /^\*\*(?=[^\s*])([\s\S]*?\S)\*\*/

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

const SENTENCE_END_PATTERN = /[.!?](?=\s+\S)/

const separateLeadSentence = (markdown) => {
  const [firstBlock] = marked.lexer(markdown)
  if (firstBlock?.type !== 'paragraph' || !markdown.startsWith(firstBlock.raw)) return markdown

  let offset = 0
  for (const token of firstBlock.tokens) {
    const sentenceEnd = token.type === 'text' ? token.raw.search(SENTENCE_END_PATTERN) : -1
    if (sentenceEnd >= 0) {
      const cut = offset + sentenceEnd + 1
      return `${ markdown.slice(0, cut) }\n\n${ markdown.slice(cut).trimStart() }`
    }
    offset += token.raw.length
  }
  return markdown
}

const messageCss = {
  '--content-padding-x': 0,
  '--content-padding-y': 0,
  '& .ProseMirror': { lineHeight: 'tall' },
  '& .ProseMirror > p:first-of-type:not(:last-child)': { fontWeight: 'semibold' },
  '& .ProseMirror :is(h1, h2, h3, h4)': { fontSize: 'md' },
}

export const MarkdownMessage = ({ markdown }) => {
  const editor = useEditor({
    editable: false,
    extensions: [StarterKit.configure({ link: false }), Markdown.configure({ marked })],
    content: separateLeadSentence(markdown),
    contentType: 'markdown',
  }, [markdown])

  return (
    <RichTextEditor.Root
      editor={ editor }
      borderWidth={ 0 }
      css={ messageCss }
    >
      <RichTextEditor.Content/>
    </RichTextEditor.Root>
  )
}