import { http, HttpResponse } from 'msw/http'
import { api } from '../api/axios.js'
import dashboardPeriods from '../data/analytics.json'

export const analyticsHandlers = [
  http.get(`${ api.defaults.baseURL }/analytics`, ({ request }) => {
    const period = new URL(request.url).searchParams.get('period') ?? 'daily'

    if (!Object.hasOwn(dashboardPeriods, period)) {
      return HttpResponse.json(
        { code: 'INVALID_PERIOD', message: '지원하지 않는 조회 기간입니다.' },
        { status: 400 },
      )
    }

    return HttpResponse.json(dashboardPeriods[period])
  }),
]