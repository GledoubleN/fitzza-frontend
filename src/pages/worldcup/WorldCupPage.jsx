import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../../api/axios.js'
import { toaster } from '../../components/ui/toaster.jsx'
import { WorldCupResultPage } from './WorldCupResultPage.jsx'
import { WorldCupTournamentPage } from './WorldCupTournamentPage.jsx'

const shuffle = (array) => {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export default function WorldCupPage () {
  const location = useLocation()
  const navigate = useNavigate()

  const rawSelectedProducts = location.state?.selectedProducts || []

  const [viewMode, setViewMode] = useState('tournament')
  const [matchList, setMatchList] = useState([])
  const [nextRoundList, setNextRoundList] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [roundTitle, setRoundTitle] = useState('월드컵')
  const [winnerProduct, setWinnerProduct] = useState(null)
  const [savedResult, setSavedResult] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaveFailed, setIsSaveFailed] = useState(false)

  const latestSaveIdRef = useRef(0)

  useEffect(() => () => {
    latestSaveIdRef.current += 1
  }, [])

  useEffect(() => {
    if (location.state?.winnerProduct) {
      setWinnerProduct(location.state.winnerProduct)
      setSavedResult(location.state.savedResult)
      setIsSaveFailed(!location.state.savedResult)
      setViewMode('result')
      return
    }

    if (rawSelectedProducts.length < 2) {
      navigate('/worldcup/setup')
      return
    }

    const tournamentState = location.state?.tournamentState
    const shuffled = tournamentState?.matchList ?? shuffle(rawSelectedProducts)
    setMatchList(shuffled)
    setNextRoundList(tournamentState?.nextRoundList ?? [])
    setCurrentIndex(tournamentState?.currentIndex ?? 0)
    setWinnerProduct(null)
    setSavedResult(null)
    setIsSaveFailed(false)
    setViewMode('tournament')
    updateRoundTitle(shuffled.length)
  }, [location.state])

  const updateRoundTitle = (length) => {
    if (length <= 2) setRoundTitle('결승')
    else if (length <= 4) setRoundTitle('4강')
    else if (length <= 8) setRoundTitle('8강')
    else if (length <= 16) setRoundTitle('16강')
    else if (length <= 32) setRoundTitle('32강')
    else setRoundTitle('64강')
  }

  const hasBye = matchList.length % 2 !== 0 && currentIndex === matchList.length - 1
  const byeProduct = hasBye ? matchList[matchList.length - 1] : null

  useEffect(() => {
    if (hasBye && byeProduct) {
      const updatedNextRound = [...nextRoundList, byeProduct]
      const shuffledNext = shuffle(updatedNextRound)

      const timer = setTimeout(() => {
        setMatchList(shuffledNext)
        setNextRoundList([])
        setCurrentIndex(0)
        updateRoundTitle(shuffledNext.length)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, matchList.length, hasBye, byeProduct])

  const leftProduct = !hasBye ? matchList[currentIndex] : null
  const rightProduct = !hasBye ? matchList[currentIndex + 1] : null

  const saveWorldCupResult = async (winner, candidates) => {
    const saveId = latestSaveIdRef.current + 1
    latestSaveIdRef.current = saveId

    setIsSaving(true)
    setIsSaveFailed(false)

    let result = null

    try {
      const winnerId = winner.productId ?? winner.itemId
      const candidateIds = candidates.map(item => item.productId ?? item.itemId)

      const response = await api.post('/worldcups', {
        winnerProductId: winnerId,
        candidateProductIds: candidateIds,
      })

      result = response.data
    } catch (error) {
      console.warn('월드컵 결과 저장 실패:', error)
    } finally {
      setIsSaving(false)
    }

    if (saveId !== latestSaveIdRef.current) return

    if (!result) {
      toaster.create({
        title: '월드컵 결과를 저장하지 못했습니다.',
        type: 'error',
        closable: true,
      })
    }

    navigate(location.pathname, {
      replace: true,
      state: {
        selectedProducts: rawSelectedProducts,
        winnerProduct: winner,
        savedResult: result,
      },
    })
  }

  const handleSelect = async (selected) => {
    if (isSaving) return

    const updatedNextRound = [...nextRoundList, selected]
    const nextIndex = currentIndex + 2

    if (nextIndex >= matchList.length) {
      if (updatedNextRound.length === 1) {
        const winner = updatedNextRound[0]
        setWinnerProduct(winner)
        setViewMode('result')

        await saveWorldCupResult(winner, rawSelectedProducts)
      } else {
        const shuffledNext = shuffle(updatedNextRound)
        setMatchList(shuffledNext)
        setNextRoundList([])
        setCurrentIndex(0)
        updateRoundTitle(shuffledNext.length)
      }
    } else {
      setNextRoundList(updatedNextRound)
      setCurrentIndex(nextIndex)
    }
  }

  const handleRestart = () => {
    navigate(location.pathname, {
      replace: true,
      state: { selectedProducts: rawSelectedProducts },
    })
  }

  const handleShareToCommunity = () => {
    if (!savedResult) return

    navigate('/community/write', {
      state: {
        sharedType: 'WORLDCUP',
        sharedId: savedResult.worldcupHistoryId,
        snapshot: savedResult.winnerProduct,
      },
    })
  }

  const handleOpenHistory = () => {
    navigate(location.pathname, {
      replace: true,
      state: {
        ...location.state,
        tournamentState: { matchList, nextRoundList, currentIndex },
      },
    })
    navigate('/worldcup/history', { state: { fromWorldCup: true } })
  }

  if (viewMode === 'tournament' && (!leftProduct || !rightProduct)) {
    return null
  }

  if (viewMode === 'result' && winnerProduct) {
    return (
      <WorldCupResultPage
        winnerProduct={ winnerProduct }
        isSaving={ isSaving }
        isSaveFailed={ isSaveFailed }
        savedResult={ savedResult }
        onOpenHistory={ handleOpenHistory }
        onRetrySave={ () => saveWorldCupResult(winnerProduct, rawSelectedProducts) }
        onRestart={ handleRestart }
        onShare={ handleShareToCommunity }
      />
    )
  }

  return (
    <WorldCupTournamentPage
      leftProduct={ leftProduct }
      rightProduct={ rightProduct }
      roundTitle={ roundTitle }
      currentIndex={ currentIndex }
      matchList={ matchList }
      isSaving={ isSaving }
      onOpenHistory={ handleOpenHistory }
      onSelect={ handleSelect }
    />
  )
}