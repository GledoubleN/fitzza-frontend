import { Button, Flex, Stack, Text } from '@chakra-ui/react'
import { toaster } from '../components/ui/toaster.jsx'
import { api } from '../api/axios.js'

const failNextRequest = async ({ label, method, path, respond }) => {
  const [{ worker }, { http, HttpResponse }] = await Promise.all([import('./browser'), import('msw')])
  worker.use(http[method](
    `${ api.defaults.baseURL }${ path }`,
    () => respond ? respond(HttpResponse) : new HttpResponse(null, { status: 500 }),
    { once: true },
  ))
  toaster.create({ title: `${ label }: 해당 요청이 한 번 실패해요.` })
}

export const FailureTestButtons = ({ tests, children }) => (
  <Stack gap={ 4 }>
    <Text textStyle={ 'xs' } color={ 'fg.muted' }>실패 테스트 (개발 서버에서만 표시)</Text>
    <Flex gap={ 4 } wrap={ 'wrap' }>
      { tests.map((test) => (
        <Button key={ test.label } variant={ 'outline' } size={ 'xs' } onClick={ () => failNextRequest(test) }>
          { test.label }
        </Button>
      )) }
      { children }
    </Flex>
  </Stack>
)
