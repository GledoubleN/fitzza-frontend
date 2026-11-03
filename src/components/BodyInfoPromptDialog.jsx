import { Button, Dialog, Portal } from '@chakra-ui/react'

export const BodyInfoPromptDialog = ({ open, onLater, onGo }) => (
  <Dialog.Root
    open={ open }
    placement={ 'center' }
    size={ 'xs' }
    onOpenChange={ (e) => { if (!e.open) onLater() } }
  >
    <Portal>
      <Dialog.Backdrop/>
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Body paddingTop={ 6 }>
            키와 몸무게 정보가 있으면 더 정확한 추천을 받을 수 있어요
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant={ 'outline' } flex={ 1 } onClick={ onLater }>다음에 할게요</Button>
            <Button bg="terracotta.solid/70" color="terracotta.contrast" flex={ 1 } onClick={ onGo }>하러 갈게요</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
)
