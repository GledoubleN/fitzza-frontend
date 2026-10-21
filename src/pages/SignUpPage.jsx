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

  const [errors, setErrors] = useState({
    email: '',
    nickname: '',
    password: '',
    general: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '', general: '' }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let errorMsg = '';

    if (!value.trim()) return;

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMsg = '올바른 이메일 형식을 입력해 주세요.';
      }
    } else if (name === 'nickname') {
      // 💡 백엔드 닉네임 규칙 적용 (한글, 영문, 숫자만 허용, 2~10자)
      const nicknameRegex = /^[가-힣A-Za-z0-9]{2,10}$/;
      if (!nicknameRegex.test(value)) {
        errorMsg = '사용자명은 2~10자의 한글, 영문, 숫자만 사용 가능합니다.';
      }
    } else if (name === 'password') {
      // 💡 백엔드 비밀번호 규칙 적용 (영문, 숫자 모두 포함, 대소문자 허용, 8~24자)
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,24}$/;
      if (!passwordRegex.test(value)) {
        errorMsg = '비밀번호는 8~24자의 영문과 숫자를 모두 포함해야 합니다.';
      }
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = { email: '', nickname: '', password: '', general: '' };
    let hasError = false;

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해 주세요.';
      hasError = true;
    }
    if (!formData.nickname.trim()) {
      newErrors.nickname = '사용자명을 입력해 주세요.';
      hasError = true;
    }
    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해 주세요.';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해 주세요.';
      hasError = true;
    }

    // 💡 폼 제출 시 닉네임 검증 정규식 동기화
    const nicknameRegex = /^[가-힣A-Za-z0-9]{2,10}$/;
    if (!nicknameRegex.test(formData.nickname)) {
      newErrors.nickname = '사용자명은 2~10자의 한글, 영문, 숫자만 사용 가능합니다.';
      hasError = true;
    }

    // 💡 폼 제출 시 비밀번호 검증 정규식 동기화
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,24}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = '비밀번호는 8~24자의 영문과 숫자를 모두 포함해야 합니다.';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
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
      if (err.response?.status === 409) {
        const errorData = err.response.data;
        const serverErrors = errorData?.errors;

        if (Array.isArray(serverErrors) && serverErrors.length > 0) {
          const nextErrors = { email: '', nickname: '', password: '', general: '' };

          serverErrors.forEach((errItem) => {
            if (errItem.field === 'email') {
              nextErrors.email = errItem.reason || '이미 사용 중인 이메일입니다.';
            } else if (errItem.field === 'nickname') {
              nextErrors.nickname = errItem.reason || '이미 사용 중인 사용자명입니다.';
            }
          });

          setErrors((prev) => ({ ...prev, ...nextErrors }));
        } else {
          setErrors((prev) => ({
            ...prev,
            general: errorData?.message || '중복된 회원 정보가 존재합니다.',
          }));
        }
        return;
      }

      setErrors((prev) => ({ ...prev, general: err.response?.data?.message || '회원가입 중 오류가 발생했습니다.' }));
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
          noValidate
          gap={ 4 }
          alignItems="center"
        >
          <Heading size="lg">회원가입</Heading>

          <Field.Root required w="100%">
            <InputGroup
              startElement={ <Box as={LuMail} boxSize={5} color={errors.email ? "red.500" : "fg.muted"} /> }
              w="100%"
            >
              <Input
                type="email"
                name="email"
                value={ formData.email }
                onChange={ handleChange }
                onBlur={ handleBlur }
                placeholder="이메일"
                variant="outline"
                size="lg"
                textAlign="left"
                autoComplete="off"
                borderColor={errors.email ? "red.500 !important" : undefined}
              />
            </InputGroup>
            {errors.email && (
              <Text color="red.500" fontSize="xs" mt={1}>
                {errors.email}
              </Text>
            )}
          </Field.Root>

          <Field.Root required w="100%">
            <InputGroup
              startElement={ <Box as={LuUser} boxSize={5} color={errors.nickname ? "red.500" : "fg.muted"} /> }
              w="100%"
            >
              <Input
                type="text"
                name="nickname"
                value={ formData.nickname }
                onChange={ handleChange }
                onBlur={ handleBlur }
                placeholder="사용자명"
                variant="outline"
                size="lg"
                textAlign="left"
                autoComplete="off"
                borderColor={errors.nickname ? "red.500 !important" : undefined}
              />
            </InputGroup>
            {errors.nickname && (
              <Text color="red.500" fontSize="xs" mt={1}>
                {errors.nickname}
              </Text>
            )}
          </Field.Root>

          <Field.Root required w="100%">
            <InputGroup
              startElement={ <Box as={LuLockKeyhole} boxSize={5} color={errors.password ? "red.500" : "fg.muted"} /> }
              w="100%"
            >
              <Input
                type="password"
                name="password"
                value={ formData.password }
                onChange={ handleChange }
                onBlur={ handleBlur }
                placeholder="비밀번호"
                variant="outline"
                size="lg"
                textAlign="left"
                autoComplete="new-password"
                borderColor={errors.password ? "red.500 !important" : undefined}
              />
            </InputGroup>
            {errors.password && (
              <Text color="red.500" fontSize="xs" mt={1}>
                {errors.password}
              </Text>
            )}
          </Field.Root>

          { errors.general && (
            <Text color="red.500" fontSize="sm">
              { errors.general }
            </Text>
          ) }

          <Button
            type="submit"
            loading={ loading }
            size="lg"
            width="full"
          >
            가입하기
          </Button>

        </Stack>
      </Container>
    </Grid>
  );
};