export const CATEGORY_LABELS = {
  FASHION: '패션',
  COORDI_QUESTION: '코디 질문',
  DAILY: '일상',
}

export const SOURCE_LABELS = {
  AI_RECOMMEND: 'AI 추천',
  WISHLIST: '찜',
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

export const displayNickname = (nickname) => nickname ?? '알 수 없음'

export const formatRemaining = (dateTime) => {
  const left = Date.parse(dateTime) - Date.now()

  if (left < HOUR) return `${ Math.max(1, Math.ceil(left / MINUTE)) }분 남음`
  if (left < DAY) {
    const hours = Math.floor(left / HOUR)
    const minutes = Math.floor((left % HOUR) / MINUTE)
    return minutes ? `${ hours }시간 ${ minutes }분 남음` : `${ hours }시간 남음`
  }
  return `${ Math.floor(left / DAY) }일 남음`
}

export const MAX_VOTE_OPTIONS = 4

export const VOTE_LABELS = 'ABCD'

export const optionKey = ({ source, itemType, itemId }) => `${ source }-${ itemType }-${ itemId }`
