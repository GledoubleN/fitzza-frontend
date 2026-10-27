import { Grid, IconButton, Textarea } from '@chakra-ui/react'
import { LuArrowUp, LuSparkle } from 'react-icons/lu'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MAX_PROMPT_ROWS = 4

const MAX_QUERY_LENGTH = 500

export const PromptForm = ({ onSubmitQuery }) => {
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState('')

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
      alignItems={ 'end' }
      gap={ 2 }
      onSubmit={ onSubmit }
    >
      <IconButton
        type={ 'button' }
        rounded={ 'full' }
        aria-label={ '대화 내역' }
        onClick={ () => navigate('/ai-stylist/history') }
      >
        <LuSparkle/>
      </IconButton>
      <Textarea
        resize={ 'none' }
        variant={ 'none' }
        aria-label={ 'AI에게 추천받을 내용' }
        maxLength={ MAX_QUERY_LENGTH }
        rows={ 1 }
        fieldSizing={ 'content' }
        maxHeight={ `calc(${ MAX_PROMPT_ROWS }lh + {spacing.4})` }
        textStyle={'md'}
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