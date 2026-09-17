import { Button, Container, Field, Heading, Input, Stack } from "@chakra-ui/react";

export const SignInPage = () => {
  return (
    <Container maxWidth={ "sm" } py={ 16 }>
      <Stack as="form" gap={ 6 }>
        <Heading size="lg">로그인</Heading>

        <Field.Root required>
          <Field.Label>이메일</Field.Label>
          <Input type="email" placeholder="이메일을 입력해주세요" />
        </Field.Root>

        <Field.Root required>
          <Field.Label>비밀번호</Field.Label>
          <Input type="password" placeholder="비밀번호 관련 규약 필요" />
        </Field.Root>

        <Button type="submit" colorPalette="blue">로그인</Button>
      </Stack>
    </Container>
  );
}
