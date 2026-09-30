import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Field, Grid, GridItem, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { api } from "../api/axios.js";

export const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const moveUrl = useNavigate();

  const changeHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/login/sample", { email, password });
      console.log("로그인 성공, 메인페이지로 이동", {email, password});
      moveUrl("/");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("이메일 혹은 비밀번호가 틀렸습니다.");
      } else if(window.confirm("로그인에 실패했습니다. 메인페이지로 넘어가기 (개발 중)")){
        console.log("로그인 없이 넘어감(개발)", {email, password});
        moveUrl("/");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.md" height="100vh">
      <Grid height="100%" templateRows="1fr auto 1fr">
        <GridItem></GridItem>
        <GridItem>
          <Stack as="form" gap={6} onSubmit={changeHandler}>
            <Heading size="lg">로그인</Heading>

            <Field.Root required>
              <Field.Label>이메일</Field.Label>
              <Input
                type="email"
                placeholder="이메일을 입력해주세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>비밀번호</Field.Label>
              <Input
                type="password"
                placeholder="비밀번호 관련 규약 필요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field.Root>

            {/* fontSize="sm" 속성을 Chakra 디자인 토큰 체계인 textStyle="sm"으로 변경 */}
            {error && <Text color="red.500" textStyle="sm">{error}</Text>}

            <Button
              type="submit"
              loading={loading}
              size="lg"
              width="full">
              로그인
            </Button>
          </Stack>
        </GridItem>
        <GridItem></GridItem>
      </Grid>
    </Container>
  );
}