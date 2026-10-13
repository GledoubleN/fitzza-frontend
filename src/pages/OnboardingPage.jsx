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
