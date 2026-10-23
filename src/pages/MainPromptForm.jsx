import { Grid, IconButton, Textarea } from '@chakra-ui/react'
import { LuArrowUp, LuSparkle } from 'react-icons/lu'
import { useState } from 'react'

const MAX_PROMPT_ROWS = 4

const MAX_QUERY_LENGTH = 500

export const MainPromptForm = ({ onSubmitQuery }) => {
  const [prompt, setPrompt] = useState('')
  const [isLongPrompt, setIsLongPrompt] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    const query = prompt.trim()
    if (!query) return
    onSubmitQuery(query)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      e.currentTarget.form.requestSubmit()
    }
  }

  return (
    <Grid
      as={ 'form' }
      templateColumns={ 'auto 1fr auto' }
      gap={ 2 }
      onSubmit={ onSubmit }
    >
      <IconButton
        type={ 'button' }
        rounded={ 'full' }
        aria-label={ '입력창 펼치기' }
        aria-pressed={ isLongPrompt }
        onClick={ () => setIsLongPrompt((isLongPrompt) => !isLongPrompt) }
      >
        <LuSparkle/>
      </IconButton>
      <Textarea
        resize={ 'none' }
        variant={ 'none' }
        aria-label={ 'AI에게 추천받을 내용' }
        maxLength={ MAX_QUERY_LENGTH }
        rows={ isLongPrompt ? MAX_PROMPT_ROWS : 1 }
        fieldSizing={ isLongPrompt ? 'fixed' : 'content' }
        maxHeight={ `calc(${ MAX_PROMPT_ROWS }lh + {spacing.4})` }
        value={ prompt }
        onChange={ (e) => setPrompt(e.target.value) }
        onKeyDown={ onKeyDown }
      />
      <IconButton
        type={ 'submit' }
        rounded={ 'full' }
        aria-label={ '추천받기' }
      >
        <LuArrowUp/>
      </IconButton>
    </Grid>
  )
}