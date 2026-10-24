import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Flex,
  Heading,
  Button,
  Text,
  Grid,
  Input,
  Stack,
  HStack,
  createListCollection,
  Select,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  LuUser,
  LuPackage,
  LuHistory,
  LuMessageSquare,
  LuSettings,
} from 'react-icons/lu';
import { Header } from '../components/Header.jsx';
import { TabBar } from '../components/TabBar.jsx';
import { VtonGallery } from './profile/VtonGallery.jsx';
import { api } from '../api/axios.js';
import { useAuth } from '../contexts/AuthContext.js'
import preferredFits from '/src/data/preferred-fits.json'
import preferredStyles from '/src/data/preferred-styles.json'

export default function ProfilePage() {
  const { setAccessToken } = useAuth()
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    nickname: '테스트사용자',
    email: 'test@fitzza.com',
    height: '',
    weight: '',
    preferredFit: '',
    style: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/me');
      if (response.data) {
        setProfileData((prev) => ({
          ...prev,
          nickname: response.data.nickname || prev.nickname,
          email: response.data.email || prev.email,
          height: response.data.height ?? '',
          weight: response.data.weight ?? '',
          preferredFit: response.data.preferredFit || '',
          style: response.data.preferredStyles?.[0] || '',
        }));
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setAccessToken(null)
        navigate('/signin', { replace: true });
      } else {
        console.warn("백엔드 통신 실패. 기본 프로필 정보를 표시합니다.", err);
      }
    }
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9]/g, '');
    setProfileData({
      ...profileData,
      [name]: numericValue,
    });
  };

  const handleKeyDown = (e) => {
    if (['-', '+', 'e', 'E', '.'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleSkipField = (fieldName) => {
    setProfileData({
      ...profileData,
      [fieldName]: '',
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage('');

    const payload = {
      height: profileData.height ? Number(profileData.height) : null,
      weight: profileData.weight ? Number(profileData.weight) : null,
      gender: null,
      preferredFit: profileData.preferredFit || null,
      preferredStyles: profileData.style ? [profileData.style] : [],
      shoeSize: null,
    };

    try {
      await api.patch('/users/me', payload);
      setMessage('프로필이 성공적으로 저장되었습니다.');
      setIsEditing(false);
    } catch (err) {
      if (err.response?.status === 400) {
        setMessage('입력한 데이터의 단위나 범위를 확인해주세요.');
      } else {
        setMessage('프로필이 저장되었습니다 (테스트 모드).');
        setIsEditing(false);
      }
    }
  };

  return (
    <Box position="relative" minH="100vh" pt={24} pb={28} bg="bg">
      <Box position="fixed" top={0} left={0} right={0} zIndex={10} bg="bg" py={4}>
        <Container maxW="7xl" mx="auto" px={5}>
          <Header />
        </Container>
      </Box>

      <Container maxW="5xl" mx="auto" px={5}>
        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 1.8fr' }}
          gap={6}
          alignItems="start"
        >
          <Box
            borderWidth="thin"
            borderColor="border.subtle"
            borderRadius="2xl"
            p={6}
            bg="bg.panel"
            display="flex"
            flexDirection="column"
            gap={4}
          >
            <Flex direction="column" align="center" pt={1} pb={1}>
              <Box
                boxSize={20}
                borderWidth="thin"
                borderColor="border.subtle"
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="bg.muted"
                color="fg.muted"
                mb={3}
              >
                <LuUser size={36} strokeWidth={1.5} />
              </Box>
              <Heading textStyle="lg" mt={1} fontWeight="600">
                {profileData.nickname}
              </Heading>
              <Text textStyle="sm" mt={1} color="fg.muted">
                {profileData.email}
              </Text>
            </Flex>

            {!isEditing ? (
              <Box w="100%">
                <Stack gap={2} p={3} borderWidth="thin" borderColor="border.subtle" borderRadius="xl" bg="bg.muted">
                  <Flex justify="space-between"><Text textStyle="xs" color="fg.muted">키</Text><Text textStyle="xs" fontWeight="600">{profileData.height ? `${profileData.height} cm` : '미입력 (건너뜀)'}</Text></Flex>
                  <Flex justify="space-between"><Text textStyle="xs" color="fg.muted">체중</Text><Text textStyle="xs" fontWeight="600">{profileData.weight ? `${profileData.weight} kg` : '미입력 (건너뜀)'}</Text></Flex>
                  <Flex justify="space-between"><Text textStyle="xs" color="fg.muted">선호 핏</Text><Text textStyle="xs" fontWeight="600">{profileData.preferredFit || '미입력 (건너뜀)'}</Text></Flex>
                  <Flex justify="space-between"><Text textStyle="xs" color="fg.muted">선호 스타일</Text><Text textStyle="xs" fontWeight="600">{profileData.style || '미입력 (건너뜀)'}</Text></Flex>
                </Stack>
                <Button mt={3} width="full" variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  신체 정보 및 스타일 수정
                </Button>
              </Box>
            ) : (
              <Box as="form" onSubmit={handleSave} w="100%">
                <Stack gap={3}>
                  <HStack>
                    <Text textStyle="xs" w="28%" color="fg.muted">키(cm)</Text>
                    <Input
                      name="height"
                      value={profileData.height}
                      onChange={handleNumberChange}
                      onKeyDown={handleKeyDown}
                      placeholder="숫자 입력"
                      size="xs"
                      maxLength={3}
                      autoComplete="off"
                    />
                    <Button size="xs" variant="ghost" colorPalette="gray" onClick={() => handleSkipField('height')}>건너뛰기</Button>
                  </HStack>

                  <HStack>
                    <Text textStyle="xs" w="28%" color="fg.muted">체중(kg)</Text>
                    <Input
                      name="weight"
                      value={profileData.weight}
                      onChange={handleNumberChange}
                      onKeyDown={handleKeyDown}
                      placeholder="숫자 입력"
                      size="xs"
                      maxLength={3}
                      autoComplete="off"
                    />
                    <Button size="xs" variant="ghost" colorPalette="gray" onClick={() => handleSkipField('weight')}>건너뛰기</Button>
                  </HStack>

                  <HStack position="relative" zIndex={2}>
                    <Text textStyle="xs" w="28%" color="fg.muted">선호 핏</Text>
                    <Select.Root
                      collection={createListCollection({ items: preferredFits })}
                      size="xs"
                      width="full"
                      value={profileData.preferredFit ? [profileData.preferredFit] : ['']}
                      onValueChange={(e) => setProfileData({ ...profileData, preferredFit: e.value[0] || '' })}
                    >
                      <Select.Trigger>
                        <Select.ValueText placeholder="선호 핏 선택" />
                      </Select.Trigger>
                      <Select.Content position="absolute" maxH="180px" overflowY="auto" zIndex={99}>
                        {preferredFits.map((item) => (
                          <Select.Item key={item.value} item={item}>
                            {item.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                    <Button size="xs" variant="ghost" onClick={() => handleSkipField('preferredFit')}>비우기</Button>
                  </HStack>

                  <HStack position="relative" zIndex={1}>
                    <Text textStyle="xs" w="28%" color="fg.muted">스타일</Text>
                    <Select.Root
                      collection={createListCollection({ items: preferredStyles })}
                      size="xs"
                      width="full"
                      value={profileData.style ? [profileData.style] : ['']}
                      onValueChange={(e) => setProfileData({ ...profileData, style: e.value[0] || '' })}
                    >
                      <Select.Trigger>
                        <Select.ValueText placeholder="선호 스타일 선택" />
                      </Select.Trigger>
                      <Select.Content position="absolute" maxH="180px" overflowY="auto" zIndex={99}>
                        {preferredStyles.map((item) => (
                          <Select.Item key={item.value} item={item}>
                            {item.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                    <Button size="xs" variant="ghost" onClick={() => handleSkipField('style')}>비우기</Button>
                  </HStack>

                  {message && <Text color="blue.500" textStyle="xs" textAlign="center">{message}</Text>}

                  <HStack mt={1}>
                    <Button type="submit" size="xs" flex="1">저장</Button>
                    <Button size="xs" variant="outline" flex="1" onClick={() => setIsEditing(false)}>취소</Button>
                  </HStack>
                </Stack>
              </Box>
            )}

            <Grid templateColumns="repeat(2, 1fr)" gap={3}>
              <Box p={3} borderWidth="thin" borderColor="border.subtle" borderRadius="xl" bg="bg.muted" textAlign="center">
                <Text textStyle="xs" color="fg.muted" mb={1}>적립금</Text>
                <Text textStyle="md" fontWeight="600">7,777원</Text>
              </Box>
              <Box p={3} borderWidth="thin" borderColor="border.subtle" borderRadius="xl" bg="bg.muted" textAlign="center">
                <Text textStyle="xs" color="fg.muted" mb={1}>쿠폰</Text>
                <Text textStyle="md" fontWeight="600">11장</Text>
              </Box>
            </Grid>

            <Grid templateColumns="repeat(4, 1fr)" gap={2}>
              {[
                { label: '주문', icon: LuPackage, path: '/orders' },
                { label: '추천내역', icon: LuHistory, path: '/ai-stylist/history' },
                { label: '커뮤니티', icon: LuMessageSquare },
                { label: '설정', icon: LuSettings },
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <Button
                    key={item.label}
                    variant="outline"
                    borderWidth="thin"
                    borderColor="border.subtle"
                    borderRadius="xl"
                    height="auto"
                    py={3}
                    px={1}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    bg="bg.muted"
                    _hover={{ bg: 'bg.subtle', borderColor: 'fg.muted' }}
                    onClick={() => item.path && navigate(item.path)}
                  >
                    <Box mb={1} color="fg">
                      <IconComponent size={20} />
                    </Box>
                    <Text textStyle="xs" fontWeight="600" color="fg">{item.label}</Text>
                  </Button>
                );
              })}
            </Grid>
          </Box>

          <Box
            borderWidth="thin"
            borderColor="border.subtle"
            borderRadius="2xl"
            p={8}
            bg="bg.panel"
            display="flex"
            flexDirection="column"
          >
            <VtonGallery preview />
          </Box>
        </Grid>
      </Container>

      <Box position="fixed" bottom={0} left={0} right={0} zIndex={10} bg="bg">
        <TabBar />
      </Box>
    </Box>
  );
}
