import { DataList, Flex, Heading, Icon, Stack, Table, Text } from '@chakra-ui/react'
import { LuInfo } from 'react-icons/lu'

const NOTICES = [
  '상세 사이즈는 측정 방법과 위치, 소재에 따라 1~3cm 오차가 발생할 수 있습니다.',
  '제품 컬러는 모니터 해상도와 각도에 따라 다르게 보일 수 있습니다.',
  '아이보리, 화이트 계열의 경우 비침이 있을 수도 있습니다.',
  '모델컷보다 디테일컷이 실제 상품 색상에 가깝습니다.',
  '사이즈는 단면(cm) 측정입니다.',
]

const unique = (values) => [...new Set(values.filter(Boolean))]

export const ProductSizeTab = ({ product }) => {
  const options = product.options ?? []
  // 실측은 옵션별로 내려오지만 같은 사이즈면 색상과 무관하게 같다고 보고 사이즈당 하나만 쓴다.
  // measurement의 세부 필드는 명세에 정의되지 않아 내려온 키를 그대로 행 이름으로 쓴다.
  const measurementsBySize = new Map(
    options.filter((option) => option.measurement).map((option) => [option.size, option.measurement]),
  )
  const sizes = [...measurementsBySize.keys()]
  const parts = unique(sizes.flatMap((size) => Object.keys(measurementsBySize.get(size))))

  const details = [
    { label: '소재', value: product.material },
    { label: '핏', value: product.fitType },
    { label: '색상', value: unique(options.map((option) => option.color)).join(', ') },
    { label: '사이즈', value: unique(options.map((option) => option.size)).join(', ') },
  ]

  return (
    <Stack gap={ 6 } paddingY={ 4 }>
      <Stack gap={ 1 }>
        <Heading size={ 'lg' }>AI 실측 사이즈</Heading>
        <Text textStyle={ 'sm' } color={ 'fg.muted' }>상세 페이지를 스캔해 실측정보를 찾아왔어요!</Text>
      </Stack>

      { sizes.length === 0 ? (
        <Text color={ 'fg.muted' }>정보가 없습니다.</Text>
      ) : (
        <Stack gap={ 3 }>
          <Text textStyle={ 'xs' } color={ 'fg.muted' } textAlign={ 'end' }>단면(cm)</Text>
          <Table.ScrollArea border={ 'sm' } borderColor={ 'border' } rounded={ 'l2' }>
            <Table.Root textAlign={ 'center' }>
              <Table.Header>
                <Table.Row bg={ 'bg.muted' }>
                  <Table.ColumnHeader textAlign={ 'center' }>사이즈</Table.ColumnHeader>
                  { sizes.map((size) => (
                    <Table.ColumnHeader key={ size } textAlign={ 'center' }>{ size }</Table.ColumnHeader>
                  )) }
                </Table.Row>
              </Table.Header>
              <Table.Body>
                { parts.map((part) => (
                  <Table.Row key={ part }>
                    <Table.Cell fontWeight={ 'bold' } textAlign={ 'center' }>{ part }</Table.Cell>
                    { sizes.map((size) => (
                      <Table.Cell key={ size } textAlign={ 'center' }>
                        { measurementsBySize.get(size)[part] ?? '-' }
                      </Table.Cell>
                    )) }
                  </Table.Row>
                )) }
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
          <Flex gap={ 2 } color={ 'fg.muted' }>
            <Icon marginTop={ 1 }><LuInfo/></Icon>
            <Text textStyle={ 'xs' }>
              스캔 과정에서 오류가 발생하거나, 상품 판매자가 정보를 수정하는 경우 정확한 정보가 아닐 수 있으므로 참고용으로만 봐 주세요.
            </Text>
          </Flex>
        </Stack>
      ) }

      <DataList.Root orientation={ 'horizontal' }>
        { details.map((detail) => (
          <DataList.Item key={ detail.label } paddingTop={ 4 } borderTop={ 'sm' } borderColor={ 'border' }>
            <DataList.ItemLabel>{ detail.label }</DataList.ItemLabel>
            <DataList.ItemValue fontWeight={ 'bold' }>{ detail.value || '정보가 없습니다.' }</DataList.ItemValue>
          </DataList.Item>
        )) }
      </DataList.Root>

      <Stack gap={ 1 }>
        { NOTICES.map((notice) => (
          <Text key={ notice } textStyle={ 'sm' } color={ 'fg.muted' }>{ notice }</Text>
        )) }
      </Stack>
    </Stack>
  )
}
