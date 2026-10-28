import { Button, Dialog, Portal, Text } from '@chakra-ui/react'

export const CommunityConfirmDialog = ({ open, title, description, confirmLabel, loading, onConfirm, onClose }) => (
  <Dialog.Root
    open={ open }
    placement="center"
    size="xs"
    onOpenChange={ (e) => !e.open && onClose() }
  >
    <Portal>
      <Dialog.Backdrop/>
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>{ title }</Dialog.Title>
          </Dialog.Header>
          { description && (
            <Dialog.Body>
              <Text color="fg.muted">{ description }</Text>
            </Dialog.Body>
          ) }
          <Dialog.Footer>
            <Button variant="outline" flex="1" onClick={ onClose }>취소</Button>
            <Button flex="1" loading={ loading } onClick={ onConfirm }>{ confirmLabel }</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
)
