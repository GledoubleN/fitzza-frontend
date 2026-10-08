// 백엔드 미연결 시 사용하는 개발용 샘플. API 명세서의 응답 형태를 따른다.
// color, size: 추천 옵션. 상품 옵션과 일치하면 화면에서 바로 선택된다.
const item = (productId, productName, price, fitPercent, evidence, color = '블랙', size = 'M') => ({
  productId,
  productName,
  price,
  imageUrl: null,
  fitPercent,
  evidence,
  color,
  size,
})

export const sampleResult = {
  status: 'DONE',
  searchType: 'COMBO',
  tpoSummary: '주말 데이트 · 편안한 분위기',
  message: '주말 데이트에 어울리는 코디 2가지를 골랐어요',
  items: [
    item(1, '코튼 셔츠', 39000, 92, '선호하는 레귤러 핏과 잘 맞아요'),
    item(2, '집업 가디건', 59000, 88, '간절기에 걸치기 좋은 두께예요'),
    item(3, '코튼 재킷', 79000, 85, '셔츠와 톤이 어울려요', '네이비', 'L'),
  ],
  combos: [
    {
      comboId: 'sample-combo-1',
      items: [
        item(1, '코튼 셔츠', 39000, 92, '선호하는 레귤러 핏과 잘 맞아요'),
        item(4, '와이드 팬츠', 49000, 90, '상의와 실루엣 균형이 좋아요'),
        item(5, '캔버스 스니커즈', 79000, 95, '캐주얼한 무드를 완성해요'),
      ],
      totalPrice: 167000,
      passStatus: 'PASS',
      harmonyScore: 0.91,
      feedbackSummary: '편안한 데이트룩 · 톤온톤으로 차분하게 맞췄어요',
      budgetExceeded: false,
    },
    {
      comboId: 'sample-combo-2',
      items: [
        item(6, '니트 베스트', 49000, 89, '레이어드하기 좋은 기장이에요'),
        item(7, '슬랙스', 59000, 93, '체형에 맞는 허리 실측이에요', '네이비', 'M'),
        item(8, '더비 슈즈', 90000, 90, '세미 캐주얼에 어울려요'),
      ],
      totalPrice: 198000,
      passStatus: 'PASS',
      harmonyScore: 0.87,
      feedbackSummary: '깔끔한 세미 캐주얼 · 단정한 인상을 줘요',
      budgetExceeded: false,
    },
  ],
}

export const sampleHistory = {
  content: [
    { requestId: 'sample-1', queryText: '요즘 유행하는 가을 코디 추천', tpoSummary: '가을 · 데일리', createdAt: '2026-10-08T10:00:00' },
    { requestId: 'sample-2', queryText: '캐주얼한 데일리룩으로 출근복으로도 활용 가능한 스타일', tpoSummary: '출근 · 캐주얼', createdAt: '2026-10-07T19:30:00' },
    { requestId: 'sample-3', queryText: '니트랑 어울리는 바지 조합', tpoSummary: '데일리', createdAt: '2026-10-06T08:12:00' },
  ],
  page: 0,
  totalPages: 1,
}

export const sampleMessages = [
  { messageId: 'sample-message-1', senderType: 'USER', content: '샘플', createdAt: '2026-10-08T10:00:00' },
]

export const sampleProduct = {
  options: [
    { optionId: 1, color: '블랙', size: 'M', available: true },
    { optionId: 2, color: '블랙', size: 'L', available: true },
    { optionId: 3, color: '네이비', size: 'M', available: true },
    { optionId: 4, color: '네이비', size: 'L', available: false },
  ],
}
