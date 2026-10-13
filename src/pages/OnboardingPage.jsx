import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  Input,
  VStack,
  HStack,
  Flex,
  Wrap,
  WrapItem,
  Progress
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axios.js';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    bodyType: '보통',
    preferredFit: '레귤러',
    style: '캐주얼',
    topSize: 'M',
    weightSize: '27',
  });

  const topSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
  const bottomSizes = ['24', '25', '26', '27', '28', '29', '30', '32', '34', '36', '38'];

  const bodyTypeOptions = [
    { label: '마른편 (슬림)', value: '마른편' },
    { label: '보통 (스탠다드)', value: '보통' },
    { label: '근육질 (탄탄함)', value: '근육질' },
    { label: '통통한편 (체격 있음)', value: '통통한편' },
  ];

  const fitOptions = [
    { label: '슬림 핏', value: '슬림' },
    { label: '레귤러 핏', value: '레귤러' },
    { label: '오버사이즈', value: '오버사이즈' },
  ];

  const styleOptions = [
    { label: '캐주얼', value: '캐주얼' },
    { label: '스트릿', value: '스트릿' },
    { label: '미니멀', value: '미니멀' },
    { label: '포멀 / 비즈니스', value: '포멀' },
  ];

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, '');
    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const handleKeyDown = (e) => {
    if (['-', '+', 'e', 'E', '.'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await api.put('/profile', formData);
      setIsSaved(true);
    } catch (error) {
      console.error('저장 실패 (테스트 모드 진행):', error);
      setIsSaved(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    setIsSaved(false);
    navigate('/');
  };

  const progressValue = (step / 3) * 100;

  return (
    <Box
      maxW={{ base: 'md', md: 'lg' }}
      mx="auto"
      px={{ base: 5, md: 8 }}
      py={10}
      bg="white"
      minH="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      position="relative"
    >
      {isSaved && (
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.600"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={9999}
          px={4}
        >
          <Box
            bg="white"
            p={6}
            w="100%"
            maxW="sm"
            boxShadow="xl"
            textAlign="center"
          >
            <Heading size="md" mb={2}>저장 완료</Heading>
            <Text fontSize="sm" color="gray.600" mb={6}>
              신체 정보가 성공적으로 저장되었습니다!
            </Text>
            <Button
              colorScheme="gray"
              bg="gray.900"
              color="white"
              w="100%"
              size="lg"
              py={6}
              _hover={{ bg: 'gray.800' }}
              onClick={handleConfirm}
            >
              확인
            </Button>
          </Box>
        </Box>
      )}

      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Text fontSize="sm" fontWeight="bold" color="gray.400">
            STEP {step} / 3
          </Text>
          <Button variant="ghost" size="sm" color="gray.500" onClick={handleSkip}>
            건너뛰기
          </Button>
        </Flex>

        <Progress.Root value={progressValue} size="xs" colorPalette="gray" mb={8}>
          <Progress.Track bg="gray.100">
            <Progress.Range bg="gray.900" />
          </Progress.Track>
        </Progress.Root>

        {step === 1 && (
          <Box mb={8}>
            <Heading size="lg" fontWeight="bold" mb={2}>키와 몸무게를 알려주세요</Heading>
            <Text fontSize="sm" color="gray.500">정확한 AI 사이즈 추천과 비교에 사용돼요</Text>
          </Box>
        )}

        {step === 2 && (
          <Box mb={8}>
            <Heading size="lg" fontWeight="bold" mb={2}>평소 선호하는 사이즈는?</Heading>
            <Text fontSize="sm" color="gray.500">상의와 하의 평소 착용 치수를 선택해주세요</Text>
          </Box>
        )}

        {step === 3 && (
          <Box mb={8}>
            <Heading size="lg" fontWeight="bold" mb={2}>체형과 선호하는 스타일을 골라주세요</Heading>
            <Text fontSize="sm" color="gray.500">고객님께 딱 맞는 핏과 스타일을 추천해드려요</Text>
          </Box>
        )}

        {step === 1 && (
          <VStack spacing={6} align="stretch">
            <VStack align="stretch" spacing={3}>
              <Text fontSize="md" fontWeight="bold" color="gray.800">키 · 몸무게</Text>
              <HStack spacing={4}>
                <Box flex={1} position="relative">
                  <Input
                    name="height"
                    placeholder="165"
                    value={formData.height}
                    onChange={handleNumberChange}
                    onKeyDown={handleKeyDown}
                    maxLength={3}
                    autoComplete="off"
                    pr="3.5rem"
                    size="lg"
                    py={6}
                  />
                  <Box
                    position="absolute"
                    right="16px"
                    top="50%"
                    transform="translateY(-50%)"
                    fontSize="md"
                    color="gray.400"
                    pointerEvents="none"
                  >
                    cm
                  </Box>
                </Box>

                <Box flex={1} position="relative">
                  <Input
                    name="weight"
                    placeholder="58"
                    value={formData.weight}
                    onChange={handleNumberChange}
                    onKeyDown={handleKeyDown}
                    maxLength={3}
                    autoComplete="off"
                    pr="3.5rem"
                    size="lg"
                    py={6}
                  />
                  <Box
                    position="absolute"
                    right="16px"
                    top="50%"
                    transform="translateY(-50%)"
                    fontSize="md"
                    color="gray.400"
                    pointerEvents="none"
                  >
                    kg
                  </Box>
                </Box>
              </HStack>
            </VStack>
          </VStack>
        )}

        {step === 2 && (
          <VStack spacing={6} align="stretch">
            <VStack align="stretch" spacing={4}>
              <VStack align="stretch" spacing={2.5}>
                <Text fontSize="sm" color="gray.500">상의</Text>
                <Wrap spacing={2.5}>
                  {topSizes.map((size) => {
                    const isSelected = formData.topSize === size;
                    return (
                      <WrapItem key={size}>
                        <Button
                          size="md"
                          px={5}
                          py={5}
                          variant={isSelected ? 'solid' : 'outline'}
                          bg={isSelected ? 'gray.900' : 'transparent'}
                          color={isSelected ? 'white' : 'gray.700'}
                          borderColor={isSelected ? 'gray.900' : 'gray.200'}
                          _hover={{ bg: isSelected ? 'gray.800' : 'gray.50' }}
                          onClick={() => setFormData((prev) => ({ ...prev, topSize: size }))}
                        >
                          {size}
                        </Button>
                      </WrapItem>
                    );
                  })}
                </Wrap>
              </VStack>

              <VStack align="stretch" spacing={2.5} pt={2}>
                <Text fontSize="sm" color="gray.500">하의</Text>
                <Wrap spacing={2.5}>
                  {bottomSizes.map((size) => {
                    const isSelected = formData.weightSize === size;
                    return (
                      <WrapItem key={size}>
                        <Button
                          size="md"
                          px={5}
                          py={5}
                          variant={isSelected ? 'solid' : 'outline'}
                          bg={isSelected ? 'gray.900' : 'transparent'}
                          color={isSelected ? 'white' : 'gray.700'}
                          borderColor={isSelected ? 'gray.900' : 'gray.200'}
                          _hover={{ bg: isSelected ? 'gray.800' : 'gray.50' }}
                          onClick={() => setFormData((prev) => ({ ...prev, weightSize: size }))}
                        >
                          {size}
                        </Button>
                      </WrapItem>
                    );
                  })}
                </Wrap>
              </VStack>
            </VStack>
          </VStack>
        )}

        {step === 3 && (
          <VStack spacing={6} align="stretch">
            <VStack align="stretch" spacing={2.5}>
              <Text fontSize="md" fontWeight="bold" color="gray.800">체형</Text>
              <Wrap spacing={2.5}>
                {bodyTypeOptions.map((item) => {
                  const isSelected = formData.bodyType === item.value;
                  return (
                    <WrapItem key={item.value}>
                      <Button
                        size="md"
                        px={5}
                        py={5}
                        variant={isSelected ? 'solid' : 'outline'}
                        bg={isSelected ? 'gray.900' : 'transparent'}
                        color={isSelected ? 'white' : 'gray.700'}
                        borderColor={isSelected ? 'gray.900' : 'gray.200'}
                        _hover={{ bg: isSelected ? 'gray.800' : 'gray.50' }}
                        onClick={() => setFormData((prev) => ({ ...prev, bodyType: item.value }))}
                      >
                        {item.label}
                      </Button>
                    </WrapItem>
                  );
                })}
              </Wrap>
            </VStack>

            <VStack align="stretch" spacing={2.5}>
              <Text fontSize="md" fontWeight="bold" color="gray.800">선호 핏</Text>
              <HStack spacing={3}>
                {fitOptions.map((item) => {
                  const isSelected = formData.preferredFit === item.value;
                  return (
                    <Button
                      key={item.value}
                      flex={1}
                      size="md"
                      py={5}
                      variant={isSelected ? 'solid' : 'outline'}
                      bg={isSelected ? 'gray.900' : 'transparent'}
                      color={isSelected ? 'white' : 'gray.700'}
                      borderColor={isSelected ? 'gray.900' : 'gray.200'}
                      _hover={{ bg: isSelected ? 'gray.800' : 'gray.50' }}
                      onClick={() => setFormData((prev) => ({ ...prev, preferredFit: item.value }))}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </HStack>
            </VStack>

            <VStack align="stretch" spacing={2.5}>
              <Text fontSize="md" fontWeight="bold" color="gray.800">선호 스타일</Text>
              <Wrap spacing={2.5}>
                {styleOptions.map((item) => {
                  const isSelected = formData.style === item.value;
                  return (
                    <WrapItem key={item.value}>
                      <Button
                        size="md"
                        px={5}
                        py={5}
                        variant={isSelected ? 'solid' : 'outline'}
                        bg={isSelected ? 'gray.900' : 'transparent'}
                        color={isSelected ? 'white' : 'gray.700'}
                        borderColor={isSelected ? 'gray.900' : 'gray.200'}
                        _hover={{ bg: isSelected ? 'gray.800' : 'gray.50' }}
                        onClick={() => setFormData((prev) => ({ ...prev, style: item.value }))}
                      >
                        {item.label}
                      </Button>
                    </WrapItem>
                  );
                })}
              </Wrap>
            </VStack>
          </VStack>
        )}
      </Box>

      <Box pt={12} pb={8} w="100%">
        <HStack spacing={3}>
          {step > 1 && (
            <Button
              variant="outline"
              size="lg"
              py={7}
              w="35%"
              fontSize="md"
              borderColor="gray.300"
              color="gray.700"
              _hover={{ bg: 'gray.50' }}
              onClick={handlePrev}
            >
              이전
            </Button>
          )}

          {step < 3 ? (
            <Button
              colorScheme="gray"
              bg="gray.900"
              color="white"
              flex={1}
              size="lg"
              py={7}
              fontSize="md"
              _hover={{ bg: 'gray.800' }}
              onClick={handleNext}
            >
              다음
            </Button>
          ) : (
            <Button
              colorScheme="gray"
              bg="gray.900"
              color="white"
              flex={1}
              size="lg"
              py={7}
              fontSize="md"
              _hover={{ bg: 'gray.800' }}
              isLoading={isLoading}
              loadingText="저장 중..."
              onClick={handleSave}
            >
              저장하기
            </Button>
          )}
        </HStack>
      </Box>
    </Box>
  );
}