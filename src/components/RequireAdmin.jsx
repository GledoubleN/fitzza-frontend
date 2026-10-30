import { useEffect, useState } from 'react'
import { Button, Dialog, Portal } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/axios.js'
import { useAuth } from '../contexts/AuthContext.js'
import { RequireSignIn } from './RequireSignIn.jsx'

export const RequireAdmin = ({ children }) => {
  const { accessToken, isSignedIn } = useAuth()
  const navigate = useNavigate()
  const [permission, setPermission] = useState(null)

  useEffect(() => {
    if (!isSignedIn) return

    const controller = new AbortController()

    api.get('/users/me', { signal: controller.signal })
      .then(({ data }) => {
        if (!controller.signal.aborted) {
          setPermission({ accessToken, isAdmin: data?.role === 'ADMIN' })
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setPermission({ accessToken, isAdmin: false })
        }
      })

    return () => controller.abort()
  }, [accessToken, isSignedIn])

  if (!isSignedIn) return <RequireSignIn>{ children }</RequireSignIn>
  if (permission?.accessToken !== accessToken) return null
  if (!permission.isAdmin) {
    const goHome = () => navigate('/', { replace: true })

    return (
      <Dialog.Root
        open
        placement="center"
        size="xs"
        onOpenChange={ ({ open }) => { if (!open) goHome() } }
      >
        <Portal>
          <Dialog.Backdrop/>
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>관리자만 접속할 수 있습니다.</Dialog.Title>
              </Dialog.Header>
              <Dialog.Footer>
                <Button onClick={ goHome }>확인</Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    )
  }

  return children
}