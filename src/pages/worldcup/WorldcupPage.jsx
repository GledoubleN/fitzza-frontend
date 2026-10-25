import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../../api/axios.js'
import { toaster } from '../../components/ui/toaster.jsx'
import { WorldcupHistoryPage } from './WorldcupHistoryPage.jsx'
import { WorldcupResultPage } from './WorldcupResultPage.jsx'
import { WorldcupTournamentPage } from './WorldcupTournamentPage.jsx'

const HISTORY_PAGE_SIZE = 20

const shuffle = (array) => {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export default function WorldcupPage () {
  const location = useLocation()
  const navigate = useNavigate()

  const rawSelectedProducts = location.state?.selectedProducts || []

  const [viewMode, setViewMode] = useState('tournament')
  const [previousViewMode, setPreviousViewMode] = useState('tournament')
  const [matchList, setMatchList] = useState([])
  const [nextRoundList, setNextRoundList] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [roundTitle, setRoundTitle] = useState('월드컵')
  const [winnerProduct, setWinnerProduct] = useState(null)
  const [savedResult, setSavedResult] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaveFailed, setIsSaveFailed] = useState(false)

  const [historyList, setHistoryList] = useState([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [historyPage, setHistoryPage] = useState(0)
  const [hasNextHistory, setHasNextHistory] = useState(false)
  const [isLoadingMoreHistory, setIsLoadingMoreHistory] = useState(false)

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
      navigate('/select')
      return
    }

    const shuffled = shuffle(rawSelectedProducts)
    setMatchList(shuffled)
    setNextRoundList([])
    setCurrentIndex(0)
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

  const fetchHistoryList = async (page = 0) => {
    const setLoading = page === 0 ? setIsLoadingHistory : setIsLoadingMoreHistory
    setLoading(true)
    try {
      const response = await api.get('/worldcups/history', {
        params: { page, size: HISTORY_PAGE_SIZE },
      })

      const { content, hasNext } = response.data
      setHistoryList((previousList) => (page === 0 ? content : [...previousList, ...content]))
      setHistoryPage(page)
      setHasNextHistory(hasNext)
    } catch (error) {
      console.warn('월드컵 이력 조회 실패:', error)
      toaster.create({
        title: '우승 이력을 불러오지 못했습니다.',
        type: 'error',
        closable: true,
      })
    } finally {
      setLoading(false)
    }
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
    setPreviousViewMode(viewMode)
    fetchHistoryList()
    setViewMode('history')
  }

  if (viewMode === 'tournament' && (!leftProduct || !rightProduct)) {
    return null
  }

  if (viewMode === 'history') {
    return (
      <WorldcupHistoryPage
        historyList={ historyList }
        isLoadingHistory={ isLoadingHistory }
        hasNextHistory={ hasNextHistory }
        isLoadingMoreHistory={ isLoadingMoreHistory }
        onBack={ () => setViewMode(previousViewMode) }
        onLoadMore={ () => fetchHistoryList(historyPage + 1) }
      />
    )
  }

  if (viewMode === 'result' && winnerProduct) {
    return (
      <WorldcupResultPage
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
    <WorldcupTournamentPage
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