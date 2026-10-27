import { Card } from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.js'
import { MainPromptForm } from './MainPromptForm.jsx'
import { SignInRequiredDialog } from './SignInRequiredDialog.jsx'

export const AIPromptCard = () => {
  const navigate = useNavigate()
  const { isSignedIn } = useAuth()
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false)

  const onSubmitQuery = (query) => {
    if (!isSignedIn) {
      setIsSignInDialogOpen(true)
      return
    }
    navigate('/ai-stylist', { state: { query } })
  }

  return (
    <>
      <Card.Root
        rounded="3xl"
        bg="bg.panel/80"
        backdropFilter="auto"
        backdropBlur="lg"
        backdropSaturate="160%"
        boxShadow="lg"
      >
        <Card.Body padding={ 1 }>
          <MainPromptForm onSubmitQuery={ onSubmitQuery }/>
        </Card.Body>
      </Card.Root>

      <SignInRequiredDialog
        open={ isSignInDialogOpen }
        onClose={ () => setIsSignInDialogOpen(false) }
      />
    </>
  )
}
