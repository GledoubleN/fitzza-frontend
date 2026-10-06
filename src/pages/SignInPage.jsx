import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Field, Grid, GridItem, Heading, Input, Text, Box, Center } from "@chakra-ui/react";
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
    <Box position="relative" minH="100vh" pt={24} pb={12} bg="bg">
      <Box position="fixed" top={0} left={0} right={0} zIndex={10} bg="bg" px={5} py={4}>
        <Container maxW="7xl" mx="auto" px={0}>
          <AppBar />
        </Container>
      </Box>

      <Container maxW="3xl" mx="auto" px={5}>
        <Center w="100%" minH="65vh">
          <Box w="100%" maxW="lg">
            <Box
              variant="subtle"
              borderWidth="thin"
              borderColor="border.subtle"
              bg="bg.panel"
              borderRadius="2xl"
              p={8}
              boxShadow="md"
            >
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
                      borderRadius="xl"
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
                      borderRadius="xl"
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
                    borderRadius="xl">
                    로그인
                  </Button>
                </GridItem>

              </Grid>
            </Box>
          </Box>
        </Center>
      </Container>
    </Box>
  );
}