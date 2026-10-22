import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.js'
import { SignInRequiredDialog } from './SignInRequiredDialog.jsx'

export const RequireSignIn = ({ children }) => {
  const { isSignedIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (isSignedIn) return children

  const goBack = () => {
    if (location.key === 'default') navigate('/', { replace: true })
    else navigate(-1)
  }

  return <SignInRequiredDialog open onClose={ goBack } replace/>
}
