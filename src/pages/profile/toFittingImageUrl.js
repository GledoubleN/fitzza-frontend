import { api } from '../../api/axios.js'

// 백엔드는 S3와 PUBLIC_BASE_URL이 모두 없으면 결과 이미지를 /api/vton/{id}/image 같은 상대 경로로 줍니다.
// 그대로 쓰면 브라우저가 프론트 서버에 이미지를 요청하므로 API 서버 출처 기준의 절대 주소로 바꿉니다.
// 배포 환경처럼 절대 주소(S3 등)가 오면 그대로 둡니다.
export const toFittingImageUrl = (url) => {
  if (!url) return url
  const apiBaseUrl = new URL(api.defaults.baseURL, window.location.origin)
  return new URL(url, apiBaseUrl).href
}
