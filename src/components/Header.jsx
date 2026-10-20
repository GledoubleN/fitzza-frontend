import { useState } from 'react'
import {
  Box,
  Container,
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
import { useNavigate } from 'react-router-dom'
import { api } from '../api/axios.js'
import { useAuth } from '../contexts/AuthContext.js'
import { usePushNotifications } from '../hooks/usePushNotifications.js'
import { disablePush } from '../services/pushNotifications.js'

export const Header = ({ maxWidth = '7xl' }) => {
  const navigate = useNavigate()
  const { isSignedIn, setAccessToken } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { notifications, error, isConfigured } = usePushNotifications(isSignedIn && !isSigningOut)

  const handleSignOutButtonClick = async () => {
    if (isSigningOut) return

    if (isSignedIn) {
      setIsSigningOut(true)

      try {
        await disablePush()
      } catch (error) {
        setIsSigningOut(false)
        alert(error.message || '푸시 알림을 해제하지 못했습니다. 다시 시도해주세요.')
        return
      }

      api.post('/auth/signout', undefined, {
        withCredentials: true,
      }).catch((error) => {
        console.log(error)
      })

      setAccessToken(null)
      setIsSigningOut(false)
      alert('로그아웃되었습니다.')
      navigate('/signin')

    } else {
      navigate('/signin')
    }
  }

  const buttonProps = {
    variant: 'ghost',
    rounded: 'full',
  }

  return (
    <Container maxWidth={ maxWidth }>
      <Grid templateColumns={ 'auto 1fr auto' } gap={ '4' }>
        <GridItem alignContent={ 'center' }>
          <Text
            fontSize="2xl"
            fontWeight="bold"
            cursor="pointer"
            onClick={ () => navigate('/') }
          >
            Fitzza
          </Text>
        </GridItem>
        <GridItem></GridItem>
        <GridItem alignContent={ 'center' }>
          <Stack direction={ 'row' } gap={ 4 } align="center">
            <Popover.Root>
              <Popover.Trigger asChild>
                <IconButton { ...buttonProps } title="알림">
                  <LuBell/>
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
                              { notifications.length === 0 ? (
                                <Text color="fg.muted">받은 알림이 없습니다.</Text>
                              ) : notifications.map((notification) => (
                                <Box
                                  key={ notification.id }
                                  overflowWrap="anywhere"
                                >
                                  <Text fontWeight="semibold">
                                    { notification.title }
                                  </Text>
                                  { notification.body && (
                                    <Text color="fg.muted">
                                      { notification.body }
                                    </Text>
                                  ) }
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
              onClick={ handleSignOutButtonClick }
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
  )
}