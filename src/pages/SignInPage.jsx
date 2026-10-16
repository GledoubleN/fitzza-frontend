import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Container,
  Field,
  Grid,
  Heading,
  Text,
  Input,
  InputGroup,
  Stack,
} from '@chakra-ui/react'
import { LuMail, LuLockKeyhole } from 'react-icons/lu'
import { api } from '../api/axios.js'
import { Header } from '../components/Header.jsx'
import { useAuth } from '../contexts/AuthContext.js'

export const SignInPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const { setAccessToken } = useAuth()

  const changeHandler = async (e) => {
    e.preventDefault()

    setLoading(true)
    setErrorMessage('')

    try {
      const response = await api.post('/auth/signin', { email, password })
      const token = response.data?.accessToken

      setAccessToken(token)
      navigate('/')

    } catch (err) {

    } finally {
      setLoading(false)
    }
  }

  return (
    <Grid
      templateRows={ 'auto 1fr' }
      minHeight="100vh"
      gap={ 4 }
      paddingY={ 4 }
      bg="bg"
    >
      <Header/>

      <Container maxWidth="md" display={ 'flex' } alignItems={ 'center' }>
        <Stack
          width={ '100%' }
          as="form"
          onSubmit={ changeHandler }
          gap={ 4 }
          alignItems="center"
        >
          <Heading size="lg">로그인</Heading>

          <Field.Root w="100%">
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

          <Field.Root w="100%">
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

          <Button
            variant="plain"
            size="sm"
            width="full"
            onClick={() => navigate('/signup')}
            color="fg.muted"
          >
            계정이 없으신가요?
          </Button>

        </Stack>
      </Container>
    </Grid>
  )
}
