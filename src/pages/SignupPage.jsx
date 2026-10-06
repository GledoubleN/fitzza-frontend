import React, { useState } from 'react';
import {
  Card,
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
import { TabBar } from '../components/TabBar.jsx';

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
    console.log('회원가입 요청 데이터:', formData);
    alert('회원가입 검증 완료! (콘솔창을 확인하세요)');
  };

  return (
    <Box position="relative" minH="100vh" pt={24} pb={28} bg="bg">
      <Box position="fixed" top={0} left={0} right={0} zIndex={10} bg="bg" px={5} py={4}>
        <Container maxW="7xl" mx="auto" px={0}>
          <AppBar />
        </Container>
      </Box>

      <Container maxW="3xl" mx="auto" px={5}>
        <Center w="100%" minH="65vh">
          <Box w="100%" maxW="lg">
            <Card.Root variant="subtle" borderWidth="thin" borderColor="border.subtle" bg="bg.panel" borderRadius="2xl" p={8} boxShadow="md">
              <Card.Body>
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
                          borderRadius="xl"
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
                          borderRadius="xl"
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
                          borderRadius="xl"
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
                      borderRadius="xl"
                    >
                      가입하기
                    </Button>
                  </GridItem>

                </Grid>
              </Card.Body>
            </Card.Root>
          </Box>
        </Center>
      </Container>

      <Box position="fixed" bottom={0} left={0} right={0} zIndex={10} bg="bg">
        <TabBar />
      </Box>
    </Box>
  );
}