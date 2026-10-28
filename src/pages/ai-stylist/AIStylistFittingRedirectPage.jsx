import { Center, Spinner } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api/axios.js'

const TIMEOUT = { timeout: 10000 }

export const AIStylistFittingRedirectPage = () => {
  const { fittingId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    const galleryPath = `/profile/fittings?fittingId=${ encodeURIComponent(fittingId) }`

    api.get(`/vton/${ encodeURIComponent(fittingId) }`, TIMEOUT)
      .then(({ data }) => data.requestId ? `/ai-stylist/${ data.requestId }` : galleryPath)
      .catch(() => galleryPath)
      .then((path) => {
        if (!cancelled) navigate(path, { replace: true })
      })

    return () => { cancelled = true }
  }, [fittingId])

  return (
    <Center minHeight={ 'vh' }>
      <Spinner></Spinner>
    </Center>
  )
}