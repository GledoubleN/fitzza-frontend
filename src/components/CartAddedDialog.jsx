import { Button, Dialog, Portal } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

// 장바구니에 담은 뒤 다음 행동을 고르게 하는 확인 창.
// To-Do-Next : description을 받았을 때 정보를 어떻게 띄워줄 것인가...지금정도로 괜찮은 것일까...
export const CartAddedDialog = ({ open, onClose, description }) => {
  const navigate = useNavigate()

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
              <Dialog.Title>상품을 장바구니에 담았어요</Dialog.Title>
            </Dialog.Header>
            {/*<Dialog.Body>{ description }</Dialog.Body>*/}
            <Dialog.Footer>
              <Button variant={ 'outline' } flex={ 1 } onClick={ onClose }>계속 쇼핑</Button>
              <Button flex={ 1 } onClick={ () => navigate('/shopping-cart') }>장바구니 보기</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
