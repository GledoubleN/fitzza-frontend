import { useState } from 'react'
import {
  Button,
  Container,
  Input,
  InputGroup,
  Heading,
  Text,
  Field,
  GridItem,
  Grid,
  Box,
  Center, Stack,
} from '@chakra-ui/react'
import { LuMail, LuUser, LuLockKeyhole } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { AppBar } from '../components/AppBar.jsx'
import { Footer } from '../components/Footer.jsx'

export default function SignupPage () {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: '',
  })

  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password || !formData.nickname) {
      setErrorMessage('모든 항목을 입력해주세요.')
      return
    }

    setErrorMessage('')
  }

  return (
    <Grid
      templateRows={ 'auto 1fr' }
      minHeight="100vh"
      paddingY={ 4 }
      gap={ 4 }
      alignItems={ 'center' }
    >
      <AppBar/>

      <Container maxWidth="md">
        <Stack
          as="form"
          gap={ 4 }
          onSubmit={ handleSubmit }
          alignItems="center"
        >

          <Heading>회원가입</Heading>

          <Field.Root required w="100%">
            <InputGroup startElement={ <LuMail/> }>
              <Input
                type="email"
                name="email"
                value={ formData.email }
                onChange={ handleChange }
                placeholder="이메일"
                variant="outline"
                size="lg"
                textAlign="left"
              />
            </InputGroup>
          </Field.Root>

          <Field.Root required w="100%">
            <InputGroup startElement={ <LuUser/> }>
              <Input
                type="text"
                name="nickname"
                value={ formData.nickname }
                onChange={ handleChange }
                placeholder="사용자명"
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
                name="password"
                value={ formData.password }
                onChange={ handleChange }
                placeholder="비밀번호"
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
            size="lg"
            width="full"
          >
            가입하기
          </Button>

        </Stack>
      </Container>

      <Footer></Footer>
    </Grid>
  )
}