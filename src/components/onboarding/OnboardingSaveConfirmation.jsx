import { Box, Button, Heading, Text } from '@chakra-ui/react'

export function OnboardingSaveConfirmation ({ onConfirm }) {
  return (
    <Box
      position="fixed"
      inset={ 0 }
      bg="bg.inverted/60"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex="modal"
      px={ 4 }
    >
      <Box bg="bg" p={ 8 } w="full" maxW="sm" boxShadow="xl" textAlign="center">
        <Heading size="md" mb={ 4 }>저장 완료</Heading>
        <Text fontSize="sm" color="fg.muted" mb={ 8 }>
          프로필과 신체 정보가 성공적으로 반영되었습니다!
        </Text>
        <Button w="full" size="md" onClick={ onConfirm }>
          확인
        </Button>
      </Box>
    </Box>
  )
}
