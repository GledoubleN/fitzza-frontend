import { useState, useEffect } from 'react'
import { Box, Container, Grid, GridItem, IconButton, Popover, Portal, Separator, Stack, Text } from '@chakra-ui/react'
import { LuBell, LuShoppingBag, LuLogIn, LuLogOut } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/axios.js'

export const Header = ({ maxWidth = '7xl' }) => {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    setIsLoggedIn(!!token)
  }, [])

  const handleAuthAction = () => {
    if (isLoggedIn) {
      api.post('/auth/logout').catch(() => {})
      localStorage.removeItem("accessToken")
      setIsLoggedIn(false)
      alert("로그아웃되었습니다.")
      navigate("/signin")
    } else {
      navigate("/signin")
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
          <Text fontSize="2xl" fontWeight="bold" cursor="pointer" onClick={ () => navigate('/') }>
            Fitzza
          </Text>
        </GridItem>
        <GridItem></GridItem>
        <GridItem alignContent={ 'center' }>
          <Stack direction={ 'row' } gap={ 2 } align="center">
            <Popover.Root>
              <Popover.Trigger asChild>
                <IconButton { ...buttonProps } title="알림">
                  <LuBell />
                </IconButton>
              </Popover.Trigger>
              <Portal>
                <Popover.Positioner>
                  <Popover.Content width="sm">
                    <Popover.Arrow />
                    <Popover.Body>
                      <Stack separator={<Separator />}>
                        <Box>Notification 1</Box>
                        <Box>Notification 2</Box>
                        <Box>Notification 3</Box>
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
              onClick={handleAuthAction}
              title={isLoggedIn ? "로그아웃" : "로그인"}
            >
              {isLoggedIn ? <LuLogOut /> : <LuLogIn />}
            </IconButton>
          </Stack>
        </GridItem>
      </Grid>
      <Portal>
      </Portal>
    </Container>
  )
}