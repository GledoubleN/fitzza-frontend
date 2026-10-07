import { useState } from 'react';
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
  Center
} from '@chakra-ui/react';
import { LuMail, LuUser, LuLockKeyhole } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { AppBar } from '../components/AppBar.jsx';

export default function SignupPage() {
  const [ formData, setFormData ] = useState({
    email: '',
    password: '',
    nickname: '',
  });

  const [ errorMessage, setErrorMessage ] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.nickname) {
      setErrorMessage('모든 항목을 입력해주세요.');
      return;
    }

    setErrorMessage('');
  };

  return (
    <Grid templateRows={'auto 1fr'} minHeight="100vh" paddingY={4}>
      <AppBar />

      <Container maxW="3xl" mx="auto" px={5}>
        <Center w="100%" minH="65vh">
          <Box w="100%" maxW="lg">
            <Grid as="form" onSubmit={handleSubmit} templateRows="auto repeat(3, auto) auto auto" gap={6} alignItems="center">

              <GridItem textAlign="center" w="100%" mb={2}>
                <Heading size="lg">회원가입</Heading>
              </GridItem>

              <GridItem w="100%">
                <Field.Root required w="100%">
                  <InputGroup startElement={<Box as={LuMail} boxSize={5} color="fg.muted" />}>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="이메일"
                      variant="outline"
                      size="lg"
                      textAlign="left"
                    />
                  </InputGroup>
                </Field.Root>
              </GridItem>

              <GridItem w="100%">
                <Field.Root required w="100%">
                  <InputGroup startElement={<Box as={LuUser} boxSize={5} color="fg.muted" />}>
                    <Input
                      type="text"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleChange}
                      placeholder="사용자명"
                      variant="outline"
                      size="lg"
                      textAlign="left"
                    />
                  </InputGroup>
                </Field.Root>
              </GridItem>

              <GridItem w="100%">
                <Field.Root required w="100%">
                  <InputGroup startElement={<Box as={LuLockKeyhole} boxSize={5} color="fg.muted" />}>
                    <Input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="비밀번호"
                      variant="outline"
                      size="lg"
                      textAlign="left"
                    />
                  </InputGroup>
                </Field.Root>
              </GridItem>

              {errorMessage && (
                <GridItem textAlign="center">
                  <Text color="red.500" textStyle="sm">
                    {errorMessage}
                  </Text>
                </GridItem>
              )}

              <GridItem w="100%" mt={2}>
                <Button
                  type="submit"
                  size="lg"
                  width="full"
                >
                  가입하기
                </Button>
              </GridItem>

            </Grid>
          </Box>
        </Center>
      </Container>
    </Grid>
  );
}