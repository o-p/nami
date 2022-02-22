import { BlockTag } from '@ethersproject/abstract-provider'
import { useCallback, useEffect, useState } from 'react'
import { getProvider } from 'utils/ethers'

const blockLimit = 86400 * 2 - 10
const safeRateLimit = 50
const interval = 1000

interface IUseGetPastEvents {
  ethereum: any
  delay: number
  getEvents: (
    fromBlockOrBlockhash?: BlockTag | string,
    toBlock?: BlockTag
  ) => Promise<any>
  fromBlock?: number
  toBlock?: number
  isRunConditionMatched?: boolean
}

// getEvents = useCallback function, to prevent unnecessary rerenders
export default function useGetPastEvents({
  ethereum,
  delay,
  getEvents,
  fromBlock,
  toBlock,
  isRunConditionMatched,
}: IUseGetPastEvents) {
  const [events, setevents] = useState<any[]>([])
  const [isLoading, setisLoading] = useState(true)
  const [startingBlock, setstartingBlock] = useState(0)
  const [endBlock, setendBlock] = useState(0)

  const pollEvents = useCallback(async () => {
    // getEvents: .queryFilter, .getLogs
    if (startingBlock < endBlock) {
      // console.log('getting events...')
      try {
        const promises: any[] = []
        let currentSearchBlock = startingBlock
        // console.log('currentSearchBlock:', currentSearchBlock)
        while (
          currentSearchBlock < endBlock &&
          promises.length < safeRateLimit
        ) {
          promises.push(
            getEvents(
              currentSearchBlock,
              currentSearchBlock + blockLimit >= endBlock
                ? endBlock
                : currentSearchBlock + blockLimit
            )
          )
          // console.log('current:', currentSearchBlock, promises.length)
          currentSearchBlock += blockLimit
        }
        const allEvents = await Promise.all(promises)
        const flattened = allEvents.reduce((accu, cur) => [...accu, ...cur], [])
        setevents((prev) => [...prev, ...flattened])
        setTimeout(() => {
          setstartingBlock(currentSearchBlock)
          if (currentSearchBlock >= endBlock) setisLoading(false)
        }, interval)
      } catch (error) {
        console.log('pollEvents error:', error)
      }
    }
  }, [getEvents, endBlock, startingBlock])

  const trigger = useCallback(() => {
    if (
      ethereum &&
      (isRunConditionMatched !== undefined ? isRunConditionMatched : true)
    ) {
      setTimeout(async () => {
        try {
          setisLoading(true)
          const provider = getProvider(ethereum)
          let startingBlock = fromBlock || 0
          const blockNumber = (await provider.getBlockNumber()) as number
          const endBlock = toBlock || blockNumber
          setstartingBlock(startingBlock)
          setendBlock(endBlock)
        } catch (error) {
          console.log('pollEvents error:', error)
        }
      }, delay)
    }
  }, [ethereum, fromBlock, toBlock, delay, isRunConditionMatched])

  useEffect(() => {
    pollEvents()
  }, [pollEvents])

  useEffect(() => {
    trigger()
  }, [trigger])

  return { events, isLoading, getPastEvents: trigger }
}
