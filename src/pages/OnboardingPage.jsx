import { useState } from 'react'
import {
  Box,
  Button,
  Heading,
  Text,
  HStack,
  Flex,
  Progress,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/axios.js'
import { BodyMeasurementsStep } from '../components/onboarding/BodyMeasurementsStep.jsx'
import { ClothingSizeStep } from '../components/onboarding/ClothingSizeStep.jsx'
import { StylePreferencesStep } from '../components/onboarding/StylePreferencesStep.jsx'

export default function OnboardingPage () {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaved, setIsSaved] = useState(false)

  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    bodyType: '보통',
    preferredFit: '레귤러',
    style: '캐주얼',
    topSize: 'M',
    weightSize: '27',
  })

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errorMessage) setErrorMessage('')
  }

  const handleSkip = () => {
    navigate('/')
  }

  const handleNext = () => {
    if (step === 1) {
      const h = Number(formData.height)
      const w = Number(formData.weight)

      if (!formData.height || !formData.weight) {
        setErrorMessage('키와 몸무게를 모두 입력해주세요.')
        return
      }
      if (h < 130 || h > 200) {
        setErrorMessage('키는 130cm ~ 200cm 사이로 입력해주세요.')
        return
      }
      if (w < 30 || w > 120) {
        setErrorMessage('몸무게는 30kg ~ 120kg 사이로 입력해주세요.')
        return
      }
    }

    setErrorMessage('')
    if (step < 3) setStep(step + 1)
  }

  const handlePrev = () => {
    setErrorMessage('')
    if (step > 1) setStep(step - 1)
  }

  const handleSave = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      await api.put('/profile', formData)
      setIsSaved(true)
    } catch (error) {
      console.error('프로필 저장 실패:', error)
      setIsSaved(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirm = () => {
    setIsSaved(false)
    navigate('/')
  }

  const progressValue = (step / 3) * 100

  return (
    <Box
      maxW={ { base: 'md', md: 'lg' } }
      mx="auto"
      px={ { base: 4, md: 8 } }
      py={ 12 }
      bg="white"
      minH="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      position="relative"
    >
      { isSaved && (
        <Box
          position="fixed"
          top={ 0 }
          left={ 0 }
          right={ 0 }
          bottom={ 0 }
          bg="blackAlpha.600"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={ 9999 }
          px={ 4 }
        >
          <Box
            bg="white"
            p={ 8 }
            w="100%"
            maxW="sm"
            boxShadow="xl"
            textAlign="center"
          >
            <Heading size="md" mb={ 4 }>저장 완료</Heading>
            <Text fontSize="sm" color="gray.600" mb={ 8 }>
              프로필과 신체 정보가 성공적으로 반영되었습니다!
            </Text>
            <Button
              colorScheme="gray"
              bg="gray.900"
              color="white"
              w="100%"
              size="lg"
              py={ 8 }
              _hover={ { bg: 'gray.800' } }
              onClick={ handleConfirm }
            >
              확인
            </Button>
          </Box>
        </Box>
      ) }

      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={ 4 }>
          <Text fontSize="sm" fontWeight="bold" color="gray.400">
            STEP { step } / 3
          </Text>
          <Button variant="ghost" size="sm" color="gray.500"
                  onClick={ handleSkip }>
            건너뛰기
          </Button>
        </Flex>

        <Progress.Root value={ progressValue } size="xs" colorPalette="gray"
                       mb={ 8 }>
          <Progress.Track bg="gray.100">
            <Progress.Range bg="gray.900"/>
          </Progress.Track>
        </Progress.Root>

        { step === 1 && (
          <BodyMeasurementsStep formData={ formData } onFieldChange={ handleFieldChange } />
        ) }

        { step === 2 && (
          <ClothingSizeStep formData={ formData } onFieldChange={ handleFieldChange } />
        ) }

        { step === 3 && (
          <StylePreferencesStep formData={ formData } onFieldChange={ handleFieldChange } />
        ) }

        { errorMessage && (
          <Text color="red.500" fontSize="sm" mt={ 4 } textAlign="center">
            { errorMessage }
          </Text>
        ) }
      </Box>

      <Box pt={ 12 } pb={ 8 } w="100%">
        <HStack gap={ 4 }>
          { step > 1 && (
            <Button
              variant="outline"
              size="lg"
              py={ 8 }
              w="35%"
              fontSize="md"
              borderColor="gray.300"
              color="gray.700"
              _hover={ { bg: 'gray.50' } }
              onClick={ handlePrev }
            >
              이전
            </Button>
          ) }

          { step < 3 ? (
            <Button
              colorScheme="gray"
              bg="gray.900"
              color="white"
              flex={ 1 }
              size="lg"
              py={ 8 }
              fontSize="md"
              _hover={ { bg: 'gray.800' } }
              onClick={ handleNext }
            >
              다음
            </Button>
          ) : (
            <Button
              colorScheme="gray"
              bg="gray.900"
              color="white"
              flex={ 1 }
              size="lg"
              py={ 8 }
              fontSize="md"
              _hover={ { bg: 'gray.800' } }
              isLoading={ isLoading }
              loadingText="저장 중..."
              onClick={ handleSave }
            >
              저장하기
            </Button>
          ) }
        </HStack>
      </Box>
    </Box>
  )
}
