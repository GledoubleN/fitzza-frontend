import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    Input,
    Heading,
    Text,
    VStack,
    Field
} from '@chakra-ui/react';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        passwordConfirm: '',
        nickname: '',
    });

    const [errorMessage, setErrorMessage] = useState('');

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

        if (formData.password !== formData.passwordConfirm) {
            setErrorMessage('비밀번호가 일치하지 않습니다.');
            return;
        }

        setErrorMessage('');
        console.log('회원가입 요청 데이터:', formData);
        alert('회원가입 검증 완료! (콘솔창을 확인하세요)');
    };

    return (
        <Container maxW="container.sm" centerContent minH="100vh" justifyContent="center">
            <Box
                p={8}
                borderWidth="1px"
                borderRadius="lg"
                boxShadow="lg"
                bg="white"
                w="100%"
                maxW="400px"
            >
                <VStack spacing={4} as="form" onSubmit={handleSubmit}>
                    <Heading size="lg" mb={2}>회원가입</Heading>

                    {/* 이메일 입력 */}
                    <Field.Root>
                        <Field.Label>이메일</Field.Label>
                        <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@email.com"
                        />
                    </Field.Root>

                    {/* 닉네임 입력 */}
                    <Field.Root isRequired>
                        <Field.Label>닉네임</Field.Label>
                        <Input
                            type="text"
                            name="nickname"
                            value={formData.nickname}
                            onChange={handleChange}
                            placeholder="사용하실 닉네임을 입력하세요"
                        />
                    </Field.Root>

                    {/* 비밀번호 입력 */}
                    <Field.Root isRequired>
                        <Field.Label>비밀번호</Field.Label>
                        <Input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="비밀번호를 입력하세요"
                        />
                    </Field.Root>

                    {/* 비밀번호 확인 */}
                    <Field.Root isRequired>
                        <Field.Label>비밀번호 확인</Field.Label>
                        <Input
                            type="password"
                            name="passwordConfirm"
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                            placeholder="비밀번호를 다시 입력하세요"
                        />
                    </Field.Root>

                    {/* 에러 메시지 출력 */}
                    {errorMessage && (
                        <Text color="red.500" fontSize="sm">
                            {errorMessage}
                        </Text>
                    )}

                    {/* 가입 버튼 */}
                    <Button type="submit" colorScheme="blue" w="100%" mt={4}>
                        가입하기
                    </Button>
                </VStack>
            </Box>
        </Container>
    );
}