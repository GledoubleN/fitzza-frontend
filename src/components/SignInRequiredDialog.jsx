import { Button, Dialog, Portal } from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom'

export const SignInRequiredDialog = ({ open, onClose, replace = false }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.pathname + location.search + location.hash

  return (
    <Dialog.Root
      open={ open }
      placement={ 'center' }
      size={ 'xs' }
      onOpenChange={ (e) => { if (!e.open) onClose() } }
    >
      <Portal>
        <Dialog.Backdrop/>
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>로그인이 필요합니다.</Dialog.Title>
            </Dialog.Header>
            <Dialog.Footer>
              <Button variant={ 'outline' } flex={ 1 } onClick={ onClose }>돌아가기</Button>
              <Button flex={ 1 } onClick={ () => navigate('/signin', { replace, state: { from } }) }>로그인하기</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
