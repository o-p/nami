import { useCallback, useEffect, useState } from 'react'
import { ether, toEther } from 'utils/ethers'
import { useAcornHelpersContract } from './useContract'

export function useGetStakingAPY(pid: number) {
  const [stakingAPY, setstakingAPY] = useState('0')
  const acornHelpers = useAcornHelpersContract()

  const getAPY = useCallback(async () => {
    try {
      const { apy, precision } = await acornHelpers!.vault(pid)
      const res = apy.mul(ether).mul(100).div(precision)
      setstakingAPY(toEther(res))
    } catch (error) {
      console.log('error:', error)
    }
  }, [pid, acornHelpers])

  useEffect(() => {
    getAPY()
  }, [getAPY])

  return { getAPY, stakingAPY }
}
