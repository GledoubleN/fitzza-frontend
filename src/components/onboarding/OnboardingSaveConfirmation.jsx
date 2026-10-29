import { Button, Dialog, Portal } from '@chakra-ui/react'

export function OnboardingSaveConfirmation ({ onConfirm }) {
  return (
    <Dialog.Root
      open
      placement="center"
      size="xs"
      onOpenChange={ (event) => { if (!event.open) onConfirm() } }
    >
      <Portal>
        <Dialog.Backdrop/>
        <Dialog.Positioner>
          <Dialog.Content textAlign="center">
            <Dialog.Header justifyContent="center">
              <Dialog.Title>저장 완료</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body
              fontSize="sm"
              color="fg.muted"
            >
              프로필과 신체 정보가 성공적으로 반영되었습니다!
            </Dialog.Body>
            <Dialog.Footer>
              <Button
                width="full"
                size="md"
                onClick={ onConfirm }
              >
                확인
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
