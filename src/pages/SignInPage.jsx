import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Container,
  Field,
  Grid,
  GridItem,
  Heading,
  Text,
  Box,
  Center,
  Input,
  InputGroup, Stack,
} from '@chakra-ui/react'
import { LuMail, LuLockKeyhole } from 'react-icons/lu'
import { api } from '../api/axios.js'
import { AppBar } from '../components/AppBar.jsx'
import { Footer } from '../components/Footer.jsx'

export const SignInPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const moveUrl = useNavigate()

  const changeHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')
    try {
      await api.post('/auth/login/sample', { email, password })
      moveUrl('/')
    } catch (err) {
      if (err.response?.status === 401) {
        setErrorMessage('이메일 혹은 비밀번호가 틀렸습니다.')
      } else {
        setErrorMessage('로그인에 실패했습니다.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Grid
      templateRows={ 'auto 1fr auto' }
      minHeight="100vh"
      gap={ 4 }
      paddingY={ 4 }
      bg="bg"
    >
      <AppBar/>

      <Container maxWidth="md" display={ 'flex' } alignItems={ 'center' }>
        <Stack
          width={ '100%' }
          as="form"
          onSubmit={ changeHandler }
          gap={ 4 }
          alignItems="center"
        >
          <Heading size="lg">로그인</Heading>

          <Field.Root required w="100%">
            <InputGroup startElement={ <LuMail/> }>
              <Input
                type="email"
                placeholder="이메일"
                value={ email }
                onChange={ (e) => setEmail(e.target.value) }
                variant="outline"
                size="lg"
                textAlign="left"
              />
            </InputGroup>
          </Field.Root>

          <Field.Root required w="100%">
            <InputGroup startElement={ <LuLockKeyhole/> }>
              <Input
                type="password"
                placeholder="비밀번호"
                value={ password }
                onChange={ (e) => setPassword(e.target.value) }
                variant="outline"
                size="lg"
                textAlign="left"
              />
            </InputGroup>
          </Field.Root>

          { errorMessage && (
            // TODO
            <Text color="red.500" textStyle="sm">{ errorMessage }</Text>
          ) }

          <Button
            type="submit"
            loading={ loading }
            size="lg"
            width="full"
          >
            로그인
          </Button>

        </Stack>
      </Container>

      <Footer></Footer>
    </Grid>
  )
}