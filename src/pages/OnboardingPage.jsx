import { useState } from 'react'
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
    shoeSize: '',          // 발사이즈 추가
    gender: '기타',
    bodyType: '보통',
    preferredFit: '레귤러',
    style: '캐주얼',
    topSize: 'M',
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
      const s = Number(formData.shoeSize)

      if (!formData.height || !formData.weight || !formData.shoeSize) {
        setErrorMessage('키, 몸무게, 발사이즈를 모두 입력해주세요.')
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
      if (s < 210 || s > 320) {
        setErrorMessage('발사이즈는 210mm ~ 320mm 사이로 입력해주세요.')
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

    const payload = {
      height: formData.height ? Number(formData.height) : null,
      weight: formData.weight ? Number(formData.weight) : null,
      shoeSize: formData.shoeSize ? Number(formData.shoeSize) : null,
      gender: formData.gender || null,
      preferredFit: formData.preferredFit || null,
      preferredStyles: formData.style ? [formData.style] : [],
    }

    try {
      await api.patch('/users/me', payload)
      setIsSaved(true)
    } catch (error) {
      console.error('프로필 저장 실패:', error)
      const status = error.response?.status
      if (status === 400) {
        setErrorMessage('입력한 단위나 허용 범위를 확인해주세요. (FR-PRF-01, 02)')
      } else if (status === 401) {
        setErrorMessage('로그인 정보가 만료되었거나 토큰이 없습니다. 다시 로그인해주세요.')
      } else {
        setIsSaved(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirm = () => {
    setIsSaved(false)
    navigate('/')
  }

  const sharedProps = {
    formData,
    onFieldChange: handleFieldChange,
    onSkip: handleSkip,
    errorMessage,
  }

  switch (step) {
    case 1:
      return (
        <BodyMeasurementsStep
          { ...sharedProps }
          onNext={ handleNext }
        />
      )
    case 2:
      return (
        <ClothingSizeStep
          { ...sharedProps }
          onPrev={ handlePrev }
          onNext={ handleNext }
        />
      )
    case 3:
      return (
        <StylePreferencesStep
          { ...sharedProps }
          onPrev={ handlePrev }
          onSave={ handleSave }
          isLoading={ isLoading }
          isSaved={ isSaved }
          onConfirm={ handleConfirm }
        />
      )
    default:
      return null
  }
}