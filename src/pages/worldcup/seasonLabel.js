const seasonLabels = {
  SPRING: '봄',
  SUMMER: '여름',
  FALL: '가을',
  WINTER: '겨울',
}

export const getSeasonLabel = (season) => seasonLabels[season] ?? '정보 없음'
