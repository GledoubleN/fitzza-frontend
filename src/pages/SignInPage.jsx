import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Field, Heading, Input, Stack } from "@chakra-ui/react";

export const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const moveUrl = useNavigate();

  const changeHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("로그인 시도:", { email, password });
      console.log("로그인 완료됨 처리");
      moveUrl("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth={ "md" } py={ 16 }>
      <Stack as="form" gap={ 6 } onSubmit={ changeHandler }>
        <Heading size="lg">로그인</Heading>

        <Field.Root required>
          <Field.Label>이메일</Field.Label>
          <Input
            type="email"
            placeholder="이메일을 입력해주세요"
            value={ email }
            onChange={ (e) => setEmail(e.target.value) }
          />
        </Field.Root>

        <Field.Root required>
          <Field.Label>비밀번호</Field.Label>
          <Input
            type="password"
            placeholder="비밀번호 관련 규약 필요"
            value={ password }
            onChange={ (e) => setPassword(e.target.value) }
          />
        </Field.Root>

        <Button
          type="submit"
          loading={ loading }
          size="lg"
          width="full"
          color="white"
          fontWeight="semibold"
          rounded="xl"
          bg="rgba(225, 76, 47, 0.75)"
          backdropFilter="blur(12px) saturate(180%)"
          borderWidth="1px"
          borderColor="rgba(255, 255, 255, 0.35)"
          boxShadow="0 8px 24px rgba(225, 76, 47, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.45)"
          transition="all 0.2s"
          _hover={ { bg: "rgba(225, 76, 47, 0.9)", transform: "translateY(-1px)" } }
          _active={ { bg: "rgba(225, 76, 47, 1)", transform: "translateY(0)" } }
        >
          로그인
        </Button>
      </Stack>
    </Container>
  );
}
