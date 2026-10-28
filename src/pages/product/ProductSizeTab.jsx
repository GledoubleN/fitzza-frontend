import { DataList, Flex, Heading, Icon, Image, Stack, Table, Text } from '@chakra-ui/react'
import { LuInfo } from 'react-icons/lu'

const NOTICES = [
  '상세 사이즈는 측정 방법과 위치, 소재에 따라 오차가 발생할 수 있습니다.',
  '제품 컬러는 모니터 해상도와 각도에 따라 다르게 보일 수 있습니다.',
  '아이보리, 화이트 계열의 경우 비침이 있을 수도 있습니다.',
  '모델컷보다 디테일컷이 실제 상품 색상에 가깝습니다.',
]

const unique = (values) => [...new Set(values.filter(Boolean))]

const TOP_PARTS = ['총장', '어깨너비', '가슴단면', '소매길이', '밑단단면', '소매부리단면', '암홀']
const RAGLAN_PARTS = ['총장', '가슴단면', '소매부리단면', '전체소매길이', '밑단단면', '암홀']
const BOTTOM_PARTS = ['총장', '허리단면', '엉덩이단면', '허벅지단면', '밑위', '밑단단면']
const SHOES_PARTS = ['발길이', '발볼', '발목높이', '굽높이']

const PART_ORDER_BY_SIZE_TYPE = {
  셔츠: TOP_PARTS,
  긴소매티셔츠: TOP_PARTS,
  반소매티셔츠: TOP_PARTS,
  점퍼: TOP_PARTS,
  코트: TOP_PARTS,
  헤비아우터: TOP_PARTS,
  블레이져: [...TOP_PARTS, '허리단면'],
  민소매: ['총장', '가슴단면', '어깨너비', '밑단단면', '암홀'],
  베스트: ['총장', '어깨너비', '가슴단면', '밑단단면', '암홀'],
  긴소매_래글런: RAGLAN_PARTS,
  반소매_래글런: RAGLAN_PARTS,
  점퍼_래글런: ['총장', '가슴단면', '소매부리단면', '전체소매길이', '밑단 단면', '암홀'],
  바지: BOTTOM_PARTS,
  반바지: BOTTOM_PARTS,
  '캡/야구모자': ['머리둘레', '챙길이', '깊이'],
  비니: ['머리둘레', '깊이'],
  신발: SHOES_PARTS,
  스니커즈: SHOES_PARTS,
}

export const ProductSizeTab = ({ product }) => {
  const options = product.options ?? []
  const sizeGuide = product.sizeGuide ?? {}
  const measurements = sizeGuide.measurements ?? []
  const partOrder = Object.hasOwn(PART_ORDER_BY_SIZE_TYPE, sizeGuide.typeName)
    ? PART_ORDER_BY_SIZE_TYPE[sizeGuide.typeName]
    : undefined

  const sizes = measurements.map((m) => m.size).filter(Boolean)

  const parts = unique(measurements.flatMap((m) => Object.keys(m.values ?? {})))
  if (partOrder) {
    parts.sort((a, b) => {
      const indexA = partOrder.indexOf(a)
      const indexB = partOrder.indexOf(b)
      if (indexA === -1) return indexB === -1 ? 0 : 1
      if (indexB === -1) return -1
      return indexA - indexB
    })
  }

  const measurementsBySize = new Map(
    measurements.map((m) => [m.size, m.values ?? {}])
  )

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

      { sizes.length === 0 || parts.length === 0 ? (
        <Text color={ 'fg.muted' }>정보가 없습니다.</Text>
      ) : (
        <Stack gap={ 3 }>
          { partOrder && sizeGuide.guideImageUrl && (
            <Image
              src={ sizeGuide.guideImageUrl }
              alt={ `${sizeGuide.typeName} 측정 가이드` }
              width="full"
              maxHeight="80"
              objectFit="contain"
            />
          ) }
          { sizeGuide.unit && (
            <Text textStyle={ 'xs' } color={ 'fg.muted' } textAlign={ 'end' }>
              측정 단위({ sizeGuide.unit })
            </Text>
          ) }
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
                    <Table.Cell fontWeight={ 'bold' } textAlign={ 'center' }>
                      { partOrder?.includes(part) ? `${partOrder.indexOf(part) + 1}. ${part}` : part }
                    </Table.Cell>
                    { sizes.map((size) => {
                      const valuesMap = measurementsBySize.get(size) || {}
                      return (
                        <Table.Cell key={ size } textAlign={ 'center' }>
                          { valuesMap[part] ?? '-' }
                        </Table.Cell>
                      )
                    }) }
                  </Table.Row>
                )) }
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>

        </Stack>
      ) }

      <Flex gap={ 2 } color={ 'fg.muted' }>
        <Icon marginTop={ 1 }><LuInfo/></Icon>
        <Stack gap={ 1 }>
          { sizeGuide.description && (
            <Text textStyle={ 'xs' }>{ sizeGuide.description }</Text>
          ) }
          <Text textStyle={ 'xs' }>
            스캔 과정에서 오류가 발생하거나 상품 판매자가 정보를 수정하는 경우 정확한 정보가 아닐 수 있으므로 참고용으로만 봐 주세요.
          </Text>
        </Stack>
      </Flex>

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
