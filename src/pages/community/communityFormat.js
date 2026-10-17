export const CATEGORY_LABELS = {
  FASHION: '패션',
  COORDI_QUESTION: '코디 질문',
  DAILY: '일상',
}

export const CATEGORIES = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }))

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export const formatRelativeTime = (dateTime) => {
  const elapsed = Date.now() - Date.parse(dateTime)

  if (elapsed < MINUTE) return '방금'
  if (elapsed < HOUR) return `${ Math.floor(elapsed / MINUTE) }분 전`
  if (elapsed < DAY) return `${ Math.floor(elapsed / HOUR) }시간 전`
  if (elapsed < 7 * DAY) return `${ Math.floor(elapsed / DAY) }일 전`
  return new Date(dateTime).toLocaleDateString('ko-KR')
}

export const errorMessage = (error, fallback) => error.response?.data?.message ?? fallback
