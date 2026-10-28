import { Card } from '@chakra-ui/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.js'
import { MainPromptForm } from './MainPromptForm.jsx'
import { SignInRequiredDialog } from './SignInRequiredDialog.jsx'

export const AIPromptCard = ({ hasShadow = false }) => {
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
        layerStyle="glass"
        boxShadow={ hasShadow ? 'lg' : 'none' }
        transition="box-shadow"
        transitionDuration="moderate"
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
