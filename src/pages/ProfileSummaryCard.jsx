import { useEffect, useState } from 'react'
import { Avatar, Badge, Box, Button, Card, Flex, Grid, Heading, Separator, Skeleton, Stack, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/axios.js'
import { useAuth } from '../contexts/AuthContext.js'
import preferredFits from '/src/data/preferred-fits.json'
import preferredStyles from '/src/data/preferred-styles.json'
import { ProfileFieldEditor } from './ProfileFieldEditor.jsx'

export const ProfileSummaryCard = ({ height }) => {
  const { setAccessToken } = useAuth()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState({
    nickname: '내 프로필',
    email: '',
    height: '',
    weight: '',
    preferredFit: '',
    style: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const completedFields = ['height', 'weight', 'preferredFit', 'style']
    .filter(field => profileData[field] !== '' && profileData[field] !== null).length

  useEffect(() => {
    const controller = new AbortController()

    api.get('/users/me', { signal: controller.signal }).then(({ data }) => {
      if (controller.signal.aborted) return
      setProfileData({
        nickname: data.nickname || '내 프로필',
        email: data.email || '',
        height: data.height ?? '',
        weight: data.weight ?? '',
        preferredFit: data.preferredFit || '',
        style: data.preferredStyles?.[0] || '',
      })
    }).catch(error => {
      if (controller.signal.aborted) return
      if (error.response?.status === 401) {
        setAccessToken(null)
        navigate('/signin', { replace: true })
        return
      }
      setLoadError('프로필을 불러오지 못했어요. 다시 시도해주세요.')
    }).finally(() => {
      if (!controller.signal.aborted) setIsLoading(false)
    })

    return () => controller.abort()
  }, [navigate, setAccessToken, retryCount])

  const saveField = async (field, value) => {
    const savedValue = field === 'height' || field === 'weight'
      ? value ? Number(value) : null
      : value || null
    const payload = field === 'style'
      ? { preferredStyles: value ? [value] : [] }
      : { [field]: savedValue }

    await api.patch('/users/me', payload)
    setProfileData(previous => ({ ...previous, [field]: savedValue ?? '' }))
  }

  const retry = () => {
    setIsLoading(true)
    setLoadError('')
    setRetryCount(count => count + 1)
  }

  return (
    <Card.Root
      as="section"
      rounded="3xl"
      height={ height }
      borderColor="border.subtle"
      overflow="hidden"
    >
      <Card.Body
        padding={ { base: 4, md: 8 } }
        gap={ 8 }
      >
        <Flex
          align="center"
          gap={ 4 }
          minWidth={ 0 }
        >
          <Avatar.Root
            size="2xl"
            bg="primary.subtle"
            color="primary.fg"
            flexShrink={ 0 }
          >
            <Avatar.Fallback name={ profileData.nickname }/>
          </Avatar.Root>
          <Stack
            gap={ 4 }
            minWidth={ 0 }
          >
            <Text
              textStyle="xs"
              fontWeight="700"
              letterSpacing="widest"
              color="fg.muted"
            >
              MY PROFILE
            </Text>
            <Skeleton loading={ isLoading }>
              <Heading
                as="h2"
                textStyle="xl"
                truncate
              >
                { profileData.nickname }
              </Heading>
              <Text
                textStyle="sm"
                color="fg.muted"
                truncate
              >
                { profileData.email || '나만의 스타일을 찾아가는 중' }
              </Text>
            </Skeleton>
          </Stack>
        </Flex>
        <Separator/>
        <Stack gap={ 4 }>
          <Flex
            justify="space-between"
            align="center"
            gap={ 4 }
          >
            <Heading
              as="h3"
              textStyle="md"
            >
              추천을 위한 내 정보
            </Heading>
            <Badge
              variant="subtle"
              colorPalette="primary"
              rounded="full"
              paddingX={ 4 }
            >
              { completedFields } / 4
            </Badge>
          </Flex>
          <Text
            textStyle="sm"
            color="fg.muted"
          >
            나에게 맞는 핏과 스타일을 위해, 한 항목씩 편하게 수정하세요.
          </Text>
          <Flex
            role="progressbar"
            aria-label="프로필 입력 현황"
            aria-valuemin={ 0 }
            aria-valuemax={ 4 }
            aria-valuenow={ completedFields }
            gap={ 4 }
          >
            { [0, 1, 2, 3].map(index => (
              <Box
                key={ index }
                flex={ 1 }
                height={ 1 }
                rounded="full"
                bg={ index < completedFields ? 'primary.solid' : 'bg.muted' }
              />
            )) }
          </Flex>
        </Stack>
        { loadError && (
          <Stack gap={ 4 }>
            <Text
              role="alert"
              textStyle="sm"
              color="fg.error"
            >
              { loadError }
            </Text>
            <Button
              size="sm"
              variant="outline"
              alignSelf="start"
              onClick={ retry }
            >
              다시 불러오기
            </Button>
          </Stack>
        ) }
        <Grid
          templateColumns="repeat(auto-fit, minmax(min(100%, {sizes.36}), 1fr))"
          gap={ 4 }
        >
          <ProfileFieldEditor
            label="키"
            value={ profileData.height }
            unit="cm"
            disabled={ isLoading || !!loadError }
            onSave={ value => saveField('height', value) }
          />
          <ProfileFieldEditor
            label="체중"
            value={ profileData.weight }
            unit="kg"
            disabled={ isLoading || !!loadError }
            onSave={ value => saveField('weight', value) }
          />
          <ProfileFieldEditor
            label="선호 핏"
            value={ profileData.preferredFit }
            options={ preferredFits }
            disabled={ isLoading || !!loadError }
            onSave={ value => saveField('preferredFit', value) }
          />
          <ProfileFieldEditor
            label="선호 스타일"
            value={ profileData.style }
            options={ preferredStyles }
            disabled={ isLoading || !!loadError }
            onSave={ value => saveField('style', value) }
          />
        </Grid>
      </Card.Body>
    </Card.Root>
  )
}