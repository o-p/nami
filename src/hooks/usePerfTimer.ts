import { useCallback, useEffect, useState } from 'react'

interface IUseTimer {
  stopTimer: Function
  startTimer: Function
  logTime: Function
}

export function usePerfTimer(): IUseTimer {
  const [timerID, settimerID] = useState<NodeJS.Timeout | undefined>(undefined)
  const [timer, settimer] = useState<number | null>(0)

  const stopTimer = useCallback(() => {
    if (timerID) {
      settimerID(undefined)
      clearInterval(timerID)
    }
  }, [timerID])

  const startTimer = useCallback(() => {
    const id = setInterval(() => {
      settimer((prev) => prev! + 1)
    }, 1000)
    settimerID(id)
  }, [])

  const logTime = useCallback(
    (useAlert?: boolean) => {
      if (useAlert) {
        alert(`testing: ${timer} seconds`)
      } else {
        console.log(`testing: ${timer} seconds`)
      }
    },
    [timer]
  )

  useEffect(() => {
    return () => {
      console.log('cleaning up timerID')
      if (timerID) {
        clearInterval(timerID)
      }
    }
  }, [timerID])

  return { stopTimer, startTimer, logTime }
}
