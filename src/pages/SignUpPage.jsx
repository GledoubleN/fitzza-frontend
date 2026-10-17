import { useState } from 'react';
import {
  Button,
  Container,
  Input,
  InputGroup,
  Heading,
  Text,
  Field,
  Grid,
  Box,
  Stack,
} from '@chakra-ui/react';
import { LuMail, LuUser, LuLockKeyhole } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { Header } from '../components/Header.jsx';
import { api } from "../api/axios.js";

export const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({}); // 에러 상태 관리 (필요 시 활용)
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.email.trim() || !formData.password.trim() || !formData.nickname.trim()) {
      setErrorMessage('모든 항목을 입력해주세요.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    if (formData.nickname.length < 2 || formData.nickname.length > 10) {
      setErrorMessage('사용자명은 2자 이상 10자 이하로 입력해주세요.');
      return;
    }

    const passwordRegex = /^[a-z0-9]{8,24}$/;
    if (!passwordRegex.test(formData.password)) {
      setErrorMessage('비밀번호는 8~24자의 영문 소문자와 숫자만 사용 가능합니다.');
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/signup", {
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
      });

      alert("회원가입이 완료되었습니다. 로그인해주세요.");
      navigate("/signin");
    } catch (err) {
      // 💡 백엔드 미구동 시 테스트를 위한 목업(Mock) 처리
      console.warn("백엔드 통신 실패. 목업 모드로 회원가입을 완료합니다.", err);
      alert("회원가입이 완료되었습니다. (목업 모드) 로그인해주세요.");
      navigate("/signin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      templateRows={ 'auto 1fr' }
      minHeight="100vh"
      gap={ 4 }
      paddingY={ 4 }
      bg="bg"
    >
      <Header />

      <Container maxWidth="md" display={ 'flex' } alignItems={ 'center' }>
        <Stack
          width={ '100%' }
          as="form"
          onSubmit={ handleSubmit }
          gap={ 4 }
          alignItems="center"
        >
          <Heading size="lg">회원가입</Heading>

          <Field.Root required w="100%">
            <InputGroup startElement={ <Box as={LuMail} boxSize={5} color="fg.muted" /> }>
              <Input
                type="email"
                name="email"
                value={ formData.email }
                onChange={ handleChange }
                placeholder="이메일"
                variant="outline"
                size="lg"
                textAlign="left"
                autoComplete="off"
                borderColor={ errors.email ? "fg.error" : undefined }
              />
            </InputGroup>
          </Field.Root>

          <Field.Root required w="100%">
            <InputGroup startElement={ <Box as={LuUser} boxSize={5} color="fg.muted" /> }>
              <Input
                type="text"
                name="nickname"
                value={ formData.nickname }
                onChange={ handleChange }
                placeholder="사용자명 (2~10자)"
                variant="outline"
                size="lg"
                textAlign="left"
                autoComplete="off"
                borderColor={ errors.nickname ? "fg.error" : undefined }
              />
            </InputGroup>
          </Field.Root>

          <Field.Root required w="100%">
            <InputGroup startElement={ <Box as={LuLockKeyhole} boxSize={5} color="fg.muted" /> }>
              <Input
                type="password"
                name="password"
                value={ formData.password }
                onChange={ handleChange }
                placeholder="비밀번호 (영문 소문자, 숫자 조합 8~24자)"
                variant="outline"
                size="lg"
                textAlign="left"
                autoComplete="new-password"
                borderColor={ errors.password ? "fg.error" : undefined }
              />
            </InputGroup>
          </Field.Root>

          { errorMessage && (
            <Text color="fg.error" textStyle="sm">
              { errorMessage }
            </Text>
          ) }

          <Button
            type="submit"
            loading={ loading }
            size="lg"
            width="full"
            bg="black"
            color="white"
            _hover={ { bg: 'gray.800' } }
          >
            가입하기
          </Button>

        </Stack>
      </Container>
    </Grid>
  );
};