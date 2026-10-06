import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Field, Grid, GridItem, Heading, Input, Text, Box, Center, Card } from "@chakra-ui/react";
import { api } from "../api/axios.js";
import { AppBar } from "../components/AppBar.jsx";

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
    <Grid templateRows={'auto 1fr'} minHeight="100vh" paddingY={4} bg="bg">
      <AppBar />

      <Container maxW="3xl" mx="auto" px={5}>
        <Center w="100%" minH="65vh">
          <Box w="100%" maxW="lg">
            <Card.Root variant="subtle" borderWidth="thin" borderColor="border.subtle" bg="bg.panel" boxShadow="md">
              <Card.Body p={8}>
                <Grid as="form" onSubmit={changeHandler} templateRows="auto repeat(3, auto) auto auto" gap={6} alignItems="center">

                  <GridItem textAlign="center" w="100%" mb={2}>
                    <Heading size="lg">로그인</Heading>
                  </GridItem>

                  <GridItem w="100%">
                    <Field.Root required w="100%">
                      <Field.Label>이메일</Field.Label>
                      <Input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        variant="outline"
                        size="lg"
                      />
                    </Field.Root>
                  </GridItem>

                  <GridItem w="100%">
                    <Field.Root required w="100%">
                      <Field.Label>비밀번호</Field.Label>
                      <Input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        variant="outline"
                        size="lg"
                      />
                    </Field.Root>
                  </GridItem>

                  {error && (
                    <GridItem textAlign="center">
                      <Text color="red.500" textStyle="sm">{error}</Text>
                    </GridItem>
                  )}

                  <GridItem w="100%" mt={2}>
                    <Button
                      type="submit"
                      loading={loading}
                      size="lg"
                      width="full"
                    >
                      로그인
                    </Button>
                  </GridItem>

                </Grid>
              </Card.Body>
            </Card.Root>
          </Box>
        </Center>
      </Container>
    </Grid>
  );
}