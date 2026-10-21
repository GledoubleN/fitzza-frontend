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
  Dialog,
  Portal,
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
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    if (!value.trim()) {
      if (name === 'email') return '이메일을 입력해 주세요.';
      if (name === 'nickname') return '사용자명을 입력해 주세요.';
      if (name === 'password') return '비밀번호를 입력해 주세요.';
      return '';
    }

    if (name === 'email') {
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
      if (value.length > 255) {
        return '이메일의 총 길이는 255자 이하여야 합니다.';
      }
      if (value.split('@')[0].length > 64) {
        return '이메일의 @ 앞부분은 64자 이하여야 합니다.';
      }
      if (!emailRegex.test(value)) {
        return '올바른 이메일 형식이 아닙니다.';
      }
    } else if (name === 'nickname') {
      const nicknameRegex = /^[가-힣A-Za-z0-9]{2,10}$/;
      if (!nicknameRegex.test(value)) {
        return '사용자명은 2~10자의 한글, 영문, 숫자만 사용 가능합니다.';
      }
    } else if (name === 'password') {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,24}$/;
      if (!passwordRegex.test(value)) {
        return '비밀번호는 8~24자의 영문과 숫자를 모두 포함해야 합니다.';
      }
    }

    return '';
  };

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
    if (!value.trim()) return;

    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = { email: '', nickname: '', password: '', general: '' };
    let hasError = false;

    Object.keys(formData).forEach((key) => {
      const errorMsg = validateField(key, formData[key]);
      if (errorMsg) {
        newErrors[key] = errorMsg;
        hasError = true;
      }
    });

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

      setIsSuccessOpen(true);
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

      setErrors((prev) => ({
        ...prev,
        general: err.response?.data?.message || '회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.',
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setIsSuccessOpen(false);
    navigate("/signin");
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
              startElement={ <Box as={LuMail} boxSize={4} color={errors.email ? "fg.error" : "fg.muted"} /> }
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
                borderColor={errors.email ? "fg.error !important" : undefined}
              />
            </InputGroup>
            {errors.email && (
              <Text color="fg.error" fontSize="xs">
                {errors.email}
              </Text>
            )}
          </Field.Root>

          <Field.Root required w="100%">
            <InputGroup
              startElement={ <Box as={LuUser} boxSize={4} color={errors.nickname ? "fg.error" : "fg.muted"} /> }
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
                borderColor={errors.nickname ? "fg.error !important" : undefined}
              />
            </InputGroup>
            {errors.nickname && (
              <Text color="fg.error" fontSize="xs">
                {errors.nickname}
              </Text>
            )}
          </Field.Root>

          <Field.Root required w="100%">
            <InputGroup
              startElement={ <Box as={LuLockKeyhole} boxSize={4} color={errors.password ? "fg.error" : "fg.muted"} /> }
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
                borderColor={errors.password ? "fg.error !important" : undefined}
              />
            </InputGroup>
            {errors.password && (
              <Text color="fg.error" fontSize="xs">
                {errors.password}
              </Text>
            )}
          </Field.Root>

          { errors.general && (
            <Text color="fg.error" fontSize="sm">
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

      <Dialog.Root open={isSuccessOpen} onOpenChange={(e) => !e.open && handleDialogClose()}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Heading size="md">회원가입 완료</Heading>
              </Dialog.Header>
              <Dialog.Body>
                <Text>회원가입이 완료되었습니다. 로그인해주세요.</Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Button onClick={handleDialogClose} width="full">
                  확인
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Grid>
  );
};