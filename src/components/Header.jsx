import { useState } from 'react'
import {
  Box,
  chakra,
  Circle,
  Container,
  Float,
  Grid,
  GridItem,
  IconButton,
  Popover,
  Portal,
  Separator,
  Stack,
  Text,
} from '@chakra-ui/react'
import { LuBell, LuShoppingBag, LuLogIn, LuLogOut } from 'react-icons/lu'
import { motion, useScroll, useTransform } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/axios.js'
import { useAuth } from '../contexts/AuthContext.js'
import { toNotificationPath, toNotificationText, useNotifications } from '../hooks/useNotifications.js'
import { usePushNotifications } from '../hooks/usePushNotifications.js'
import { disablePush } from '../services/pushNotifications.js'
import { toaster } from './ui/toaster.jsx'
import { AIPromptCard } from './AIPromptCard.jsx'

const MotionBox = chakra(motion.div)

const GLASS_FADE_DISTANCE = 24

const GlassBackground = ({ opacity }) => (
  <MotionBox
    position="absolute"
    inset="0"
    overflow="hidden"
    bgGradient="to-b"
    gradientFrom="bg/70"
    gradientTo="bg/40"
    backdropFilter="auto"
    backdropBlur="md"
    backdropSaturate="200%"
    backdropBrightness="110%"
    borderBottomWidth="thin"
    borderColor="fg/10"
    boxShadow="xs"
    style={ { opacity } }
  >
    <Box
      position="absolute"
      insetX="0"
      top="0"
      height="1/2"
      bgGradient="to-b"
      gradientFrom="bg/60"
      gradientTo="transparent"
    />
    <Box
      position="absolute"
      insetX="0"
      bottom="0"
      height="0.5"
      bgGradient="to-r"
      gradientFrom="transparent"
      gradientVia="bg"
      gradientTo="transparent"
      opacity="0.9"
    />
  </MotionBox>
)

const isNotificationDenied = () => 'Notification' in window && Notification.permission === 'denied'

const formatNotificationTime = (value) => new Date(value).toLocaleString('ko-KR', {
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

export const Header = ({ ref, maxWidth = '7xl', logo, center, backgroundOpacity }) => {
  const navigate = useNavigate()
  const { scrollY } = useScroll()
  const scrolledOpacity = useTransform(scrollY, [0, GLASS_FADE_DISTANCE], [0, 1])
  const { isSignedIn, setAccessToken } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { error, isConfigured } = usePushNotifications(isSignedIn && !isSigningOut)
  const { notifications, status: notificationStatus, hasUnread, reload, markAsRead } = useNotifications(isSignedIn && !isSigningOut)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  const openNotification = (notification) => {
    if (!notification.isRead) markAsRead(notification.notificationId)
    const path = toNotificationPath(notification)
    if (!path) return
    setIsNotificationOpen(false)
    navigate(path)
  }

  const handleSignIn = () => {
    navigate('/signin')
  }

  const handleSignOut = async () => {
    if (isSigningOut) return

    setIsSigningOut(true)

    try {
      await disablePush()
    } catch (error) {
      setIsSigningOut(false)
      toaster.create({
        type: 'error',
        title: error.message || '푸시 알림을 해제하지 못했습니다. 다시 시도해주세요.',
        closable: true,
      })
      return
    }

    api.post('/auth/signout').catch((error) => {
      console.log(error)
    })

    setAccessToken(null)
    setIsSigningOut(false)
    navigate('/')
    toaster.create({ type: 'success', title: '로그아웃되었습니다.', closable: true })
  }

  const handleAuthButtonClick = () => {
    if (isSigningOut) return

    return isSignedIn ? handleSignOut() : handleSignIn()
  }

  const buttonProps = {
    variant: 'ghost',
    rounded: 'full',
  }

  return (
    <Box
      ref={ ref }
      position="sticky"
      top="0"
      zIndex="sticky"
      marginTop={ -4 }
      paddingY={ 4 }
    >
      <GlassBackground opacity={ backgroundOpacity ?? scrolledOpacity }/>
      <Container
        position="relative"
        maxWidth={ maxWidth }
      >
        <Grid templateColumns={ 'auto 1fr auto' } gap={ '4' }>
          <GridItem alignContent={ 'center' }>
            { logo ?? (
              <Text
                fontSize="2xl"
                fontWeight="bold"
                cursor="pointer"
                onClick={ () => navigate('/') }
              >
                Fitzza
              </Text>
            ) }
          </GridItem>
          <GridItem
            gridColumn={ { base: '1 / -1', md: 'auto' } }
            gridRow={ { base: '2', md: 'auto' } }
            alignContent={ 'center' }
          >
            { center ?? (
              <Box
                maxWidth="xl"
                marginX="auto"
              >
                <AIPromptCard/>
              </Box>
            ) }
          </GridItem>
          <GridItem
            gridColumn={ '3' }
            alignContent={ 'center' }
          >
            <Stack direction={ 'row' } gap={ 4 } align="center">
              <Popover.Root
                open={ isNotificationOpen }
                onOpenChange={ (event) => {
                  setIsNotificationOpen(event.open)
                  if (event.open && isSignedIn) reload()
                } }
              >
                <Popover.Trigger asChild>
                  <IconButton
                    { ...buttonProps }
                    position="relative"
                    title={ hasUnread ? '새 알림 있음' : '알림' }
                  >
                    <LuBell/>
                    { hasUnread && (
                      <Float placement="top-end" offset="2">
                        <Circle size="2" bg="fg.error"/>
                      </Float>
                    ) }
                  </IconButton>
                </Popover.Trigger>
                <Portal>
                  <Popover.Positioner>
                    <Popover.Content width="sm">
                      <Popover.Arrow/>
                      <Popover.Body>
                        <Stack gap={ 4 }>
                          <Text fontWeight="bold">알림</Text>
                          { !isSignedIn ? (
                            <Text color="fg.muted">로그인 후 알림을 받을 수 있습니다.</Text>
                          ) : (
                            <>
                              { !isConfigured &&
                                <Text color="fg.muted">푸시 알림 설정이 필요합니다.</Text> }
                              { isConfigured && isNotificationDenied() &&
                                <Text color="fg.muted">브라우저 설정에서 알림을 허용하면 결과를 바로 받을 수 있어요.</Text> }
                              { error && (
                                <Text role="alert" color="fg.error">{ error }</Text>
                              ) }
                              <Stack
                                gap={ 4 }
                                separator={ <Separator/> }
                                maxHeight="80"
                                overflowY="auto"
                                aria-live="polite"
                              >
                                { notificationStatus === 'failed' ? (
                                  <Text color="fg.error">알림을 불러오지 못했습니다.</Text>
                                ) : notifications.length === 0 ? (
                                  <Text color="fg.muted">
                                    { notificationStatus === 'loading' ? '알림을 불러오는 중입니다.' : '받은 알림이 없습니다.' }
                                  </Text>
                                ) : notifications.map((notification) => (
                                  <Box
                                    key={ notification.notificationId }
                                    as="button"
                                    textAlign="start"
                                    cursor="pointer"
                                    overflowWrap="anywhere"
                                    onClick={ () => openNotification(notification) }
                                  >
                                    <Stack direction="row" gap={ 4 } align="center">
                                      <Text
                                        flex="1"
                                        fontWeight={ notification.isRead ? 'normal' : 'semibold' }
                                        color={ notification.isRead ? 'fg.muted' : 'fg' }
                                      >
                                        { toNotificationText(notification) }
                                      </Text>
                                      { !notification.isRead && <Circle size="2" bg="fg.error" flexShrink={ 0 }/> }
                                    </Stack>
                                    <Text textStyle="xs" color="fg.subtle">
                                      { formatNotificationTime(notification.createdAt) }
                                    </Text>
                                  </Box>
                                )) }
                              </Stack>
                            </>
                          ) }
                        </Stack>
                      </Popover.Body>
                    </Popover.Content>
                  </Popover.Positioner>
                </Portal>
              </Popover.Root>

              <IconButton
                { ...buttonProps }
                onClick={ () => { navigate('/shopping-cart') } }
                title="장바구니"
              >
                <LuShoppingBag/>
              </IconButton>

              <IconButton
                { ...buttonProps }
                onClick={ handleAuthButtonClick }
                disabled={ isSigningOut }
                title={ isSignedIn ? '로그아웃' : '로그인' }
              >
                { isSignedIn ? <LuLogOut/> : <LuLogIn/> }
              </IconButton>
            </Stack>
          </GridItem>
        </Grid>
        <Portal>
        </Portal>
      </Container>
    </Box>
  )
}