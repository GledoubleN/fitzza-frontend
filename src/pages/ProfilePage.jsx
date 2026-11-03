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
  Portal,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import {
  LuUser,
  LuPackage,
  LuSparkle,
  LuTrophy,
  LuSettings,
  LuRotateCw,
  LuChartColumn,
} from 'react-icons/lu';
import { Header } from '../components/Header.jsx';
import { TabBar } from '../components/TabBar.jsx';
import { VtonGallery } from './profile/VtonGallery.jsx';
import { api } from '../api/axios.js';
import { toaster } from '../components/ui/toaster.jsx'
import { useAuth } from '../contexts/AuthContext.js'
import { useUserPreferences } from '../hooks/useUserPreferences.js'
import { findBodyMeasurementRangeError } from '../utils/bodyMeasurements.js'
import { topSizes, bottomSizes } from '../components/onboarding/ClothingSizeStep.jsx'

export default function ProfilePage() {
  const { setAccessToken } = useAuth()
  const { preferredFits, preferredStyles, isFailed: isPreferencesFailed, reload: reloadPreferences } = useUserPreferences()
  const fitOptions = [{ label: '선택 안함', value: '' }, ...preferredFits]
  const styleOptions = [{ label: '선택 안함', value: '' }, ...preferredStyles]
  const toSizeOptions = (sizes) => [{ label: '선택 안함', value: '' }, ...sizes.map((size) => ({ label: size, value: size }))]
  const topSizeOptions = toSizeOptions(topSizes)
  const bottomSizeOptions = toSizeOptions(bottomSizes)
  const findLabel = (options, value) => options.find((option) => option.value === value)?.label ?? value
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    nickname: '테스트사용자',
    email: 'test@fitzza.com',
    height: '',
    weight: '',
    shoeSize: '',
    preferredFit: '',
    style: '',
    topSize: '',
    bottomSize: '',
    isAdmin: false,
  });
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
          shoeSize: response.data.shoeSize ?? '',
          preferredFit: response.data.preferredFit || '',
          style: response.data.preferredStyles?.[0] || '',
          topSize: response.data.topSize || '',
          bottomSize: response.data.bottomSize || '',
          isAdmin: response.data.role === 'ADMIN',
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

  const handleSave = async (e) => {
    e.preventDefault();

    const rangeError = findBodyMeasurementRangeError('height', profileData.height)
      || findBodyMeasurementRangeError('weight', profileData.weight)
      || findBodyMeasurementRangeError('shoeSize', profileData.shoeSize)
    if (rangeError) {
      toaster.create({ type: 'error', title: rangeError });
      return;
    }

    const payload = {
      height: profileData.height ? Number(profileData.height) : null,
      weight: profileData.weight ? Number(profileData.weight) : null,
      shoeSize: profileData.shoeSize ? Number(profileData.shoeSize) : null,
      preferredFit: profileData.preferredFit || null,
      preferredStyles: profileData.style ? [profileData.style] : [],
      topSize: profileData.topSize || null,
      bottomSize: profileData.bottomSize || null,
    };

    try {
      await api.patch('/users/me', payload);
      toaster.create({ type: 'success', title: '프로필이 성공적으로 저장되었습니다.' });
      setIsEditing(false);
    } catch (err) {
      if (err.response?.status === 400) {
        toaster.create({ type: 'error', title: '입력한 데이터의 단위나 범위를 확인해주세요.' });
      } else {
        toaster.create({ type: 'success', title: '프로필이 저장되었습니다 (테스트 모드).' });
        setIsEditing(false);
      }
    }
  };

  return (
    <Stack position="relative" minH="100vh" paddingY={4} gap={4} bg="bg">
      <Header />

      <Container maxW="5xl" mx="auto" px={5} flex="1">
        <Grid
          templateColumns={{ base: '1fr', lg: '1fr 1.8fr' }}
          gap={6}
          alignItems="start"
        >
          <Box
            borderWidth="thin"
            borderColor="border.subtle"
            p={6}
            bg="bg.panel"
            boxShadow="md"
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
                <Stack gap={2} p={3} borderWidth="thin" borderColor="border.subtle" layerStyle="glass" boxShadow="xs">
                  <Flex justify="space-between"><Text textStyle="xs" color="fg.muted">키</Text><Text textStyle="xs" fontWeight="600">{profileData.height ? `${profileData.height} cm` : '미입력'}</Text></Flex>
                  <Flex justify="space-between"><Text textStyle="xs" color="fg.muted">체중</Text><Text textStyle="xs" fontWeight="600">{profileData.weight ? `${profileData.weight} kg` : '미입력'}</Text></Flex>
                  <Flex justify="space-between"><Text textStyle="xs" color="fg.muted">선호 핏</Text><Text textStyle="xs" fontWeight="600">{profileData.preferredFit ? findLabel(preferredFits, profileData.preferredFit) : '미입력'}</Text></Flex>
                  <Flex justify="space-between"><Text textStyle="xs" color="fg.muted">선호 스타일</Text><Text textStyle="xs" fontWeight="600">{profileData.style ? findLabel(preferredStyles, profileData.style) : '미입력'}</Text></Flex>
                </Stack>
                <Button
                  mt={3}
                  width="full"
                  size="sm"
                  bg="terracotta.solid/70"
                  bgImage="none"
                  backdropFilter="auto"
                  backdropBlur="sm"
                  color="terracotta.contrast"
                  borderWidth="thin"
                  borderColor="fg/10"
                  boxShadow="md"
                  onClick={() => setIsEditing(true)}
                >
                  신체 정보 및 스타일 수정
                </Button>
              </Box>
            ) : (
              <Box as="form" onSubmit={handleSave} w="100%">
                <Stack gap={3}>
                  <HStack>
                    <Text textStyle="xs" w="28%" flexShrink={0} whiteSpace="nowrap" color="fg.muted">키(cm)</Text>
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
                  </HStack>

                  <HStack>
                    <Text textStyle="xs" w="28%" flexShrink={0} whiteSpace="nowrap" color="fg.muted">체중(kg)</Text>
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
                  </HStack>

                  <HStack>
                    <Text textStyle="xs" w="28%" flexShrink={0} whiteSpace="nowrap" color="fg.muted">발 사이즈(mm)</Text>
                    <Input
                      name="shoeSize"
                      value={profileData.shoeSize}
                      onChange={handleNumberChange}
                      onKeyDown={handleKeyDown}
                      placeholder="숫자 입력"
                      size="xs"
                      maxLength={3}
                      autoComplete="off"
                    />
                  </HStack>

                  <HStack>
                    <Text textStyle="xs" w="28%" flexShrink={0} whiteSpace="nowrap" color="fg.muted">상의 사이즈</Text>
                    <Select.Root
                      collection={createListCollection({ items: topSizeOptions })}
                      size="xs"
                      width="full"
                      value={profileData.topSize ? [profileData.topSize] : ['']}
                      onValueChange={(e) => setProfileData({ ...profileData, topSize: e.value[0] || '' })}
                    >
                      <Select.Trigger>
                        <Select.ValueText placeholder="상의 사이즈 선택" />
                      </Select.Trigger>
                      <Portal>
                        <Select.Positioner>
                          <Select.Content maxH="44" overflowY="auto">
                            {topSizeOptions.map((item) => (
                              <Select.Item key={item.value} item={item}>
                                {item.label}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Portal>
                    </Select.Root>
                  </HStack>

                  <HStack>
                    <Text textStyle="xs" w="28%" flexShrink={0} whiteSpace="nowrap" color="fg.muted">하의 사이즈</Text>
                    <Select.Root
                      collection={createListCollection({ items: bottomSizeOptions })}
                      size="xs"
                      width="full"
                      value={profileData.bottomSize ? [profileData.bottomSize] : ['']}
                      onValueChange={(e) => setProfileData({ ...profileData, bottomSize: e.value[0] || '' })}
                    >
                      <Select.Trigger>
                        <Select.ValueText placeholder="하의 사이즈 선택" />
                      </Select.Trigger>
                      <Portal>
                        <Select.Positioner>
                          <Select.Content maxH="44" overflowY="auto">
                            {bottomSizeOptions.map((item) => (
                              <Select.Item key={item.value} item={item}>
                                {item.label}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Portal>
                    </Select.Root>
                  </HStack>

                  <HStack>
                    <Text textStyle="xs" w="28%" flexShrink={0} whiteSpace="nowrap" color="fg.muted">선호 핏</Text>
                    <Select.Root
                      collection={createListCollection({ items: fitOptions })}
                      size="xs"
                      width="full"
                      value={profileData.preferredFit ? [profileData.preferredFit] : ['']}
                      onValueChange={(e) => setProfileData({ ...profileData, preferredFit: e.value[0] || '' })}
                    >
                      <Select.Trigger>
                        <Select.ValueText placeholder="선호 핏 선택" />
                      </Select.Trigger>
                      <Portal>
                        <Select.Positioner>
                          <Select.Content maxH="44" overflowY="auto">
                            {fitOptions.map((item) => (
                              <Select.Item key={item.value} item={item}>
                                {item.label}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Portal>
                    </Select.Root>
                  </HStack>

                  <HStack>
                    <Text textStyle="xs" w="28%" flexShrink={0} whiteSpace="nowrap" color="fg.muted">스타일</Text>
                    <Select.Root
                      collection={createListCollection({ items: styleOptions })}
                      size="xs"
                      width="full"
                      value={profileData.style ? [profileData.style] : ['']}
                      onValueChange={(e) => setProfileData({ ...profileData, style: e.value[0] || '' })}
                    >
                      <Select.Trigger>
                        <Select.ValueText placeholder="선호 스타일 선택" />
                      </Select.Trigger>
                      <Portal>
                        <Select.Positioner>
                          <Select.Content maxH="44" overflowY="auto">
                            {styleOptions.map((item) => (
                              <Select.Item key={item.value} item={item}>
                                {item.label}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Positioner>
                      </Portal>
                    </Select.Root>
                  </HStack>

                  {isPreferencesFailed && (
                    <Button size="xs" variant="ghost" alignSelf="flex-start" onClick={reloadPreferences}>
                      <LuRotateCw />
                      선택지 다시 불러오기
                    </Button>
                  )}

                  <HStack mt={1}>
                    <Button type="submit" size="xs" flex="1" colorPalette="terracotta" bg="terracotta.solid/70">저장</Button>
                    <Button size="xs" variant="outline" flex="1" onClick={() => setIsEditing(false)}>취소</Button>
                  </HStack>
                </Stack>
              </Box>
            )}

            <Grid templateColumns="repeat(2, 1fr)" gap={3}>
              <Box p={3} borderWidth="thin" borderColor="border.subtle" layerStyle="glass" boxShadow="xs" textAlign="center">
                <Text textStyle="xs" color="fg.muted" mb={1}>적립금</Text>
                <Text textStyle="md" fontWeight="600">7,777원</Text>
              </Box>
              <Box p={3} borderWidth="thin" borderColor="border.subtle" layerStyle="glass" boxShadow="xs" textAlign="center">
                <Text textStyle="xs" color="fg.muted" mb={1}>쿠폰</Text>
                <Text textStyle="md" fontWeight="600">11장</Text>
              </Box>
            </Grid>

            <Grid templateColumns="repeat(4, 1fr)" gap={2}>
              {[
                { label: '주문', icon: LuPackage, path: '/orders' },
                { label: '추천내역', icon: LuSparkle, path: '/ai-stylist/history' },
                { label: '월드컵', icon: LuTrophy, path: '/worldcup/history' },
                { label: '설정', icon: LuSettings },
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <Button
                    key={item.label}
                    variant="outline"
                    borderWidth="thin"
                    borderColor="border.subtle"
                    height="auto"
                    py={3}
                    px={1}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    layerStyle="glass"
                    boxShadow="xs"
                    _hover={{ bg: 'transparent' }}
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

            {profileData.isAdmin && (
              <Button
                variant="outline"
                size="sm"
                width="full"
                borderWidth="thin"
                borderColor="border.subtle"
                layerStyle="glass"
                boxShadow="xs"
                _hover={{ bg: 'transparent' }}
                onClick={() => navigate('/admin/dashboard')}
              >
                <LuChartColumn />
                관리자 대시보드
              </Button>
            )}
          </Box>

          <Box
            borderWidth="thin"
            borderColor="border.subtle"
            p={8}
            bg="bg.panel"
            display="flex"
            flexDirection="column"
          >
            <VtonGallery preview />
          </Box>
        </Grid>
      </Container>

      <TabBar />
    </Stack>
  );
}
