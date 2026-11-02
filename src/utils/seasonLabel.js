const seasonLabels = {
  SPRING: '봄',
  SUMMER: '여름',
  AUTUMN: '가을',
  FALL: '가을',
  WINTER: '겨울',
}

export const getSeasonLabel = (season) => {
  if (!season) return '정보 없음'

  const normalizedSeason = season.trim().toUpperCase()

  return seasonLabels[normalizedSeason] || season
}
