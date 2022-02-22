import { useCallback, useEffect } from 'react'
import { useWalletWrapper } from 'context/Wallet'
import { BigNumber } from 'ethers'

export function useGetUserTT20Balance(
  setbalance: Function,
  tokenContract: any,
  timeOut?: number
) {
  const { account } = useWalletWrapper()
  const getUserTT20Balance = useCallback(async () => {
    if (tokenContract && account) {
      const userBalance = (await tokenContract.balanceOf(account)) as BigNumber
      setbalance(userBalance)
    }
  }, [tokenContract, account, setbalance])

  useEffect(() => {
    const timeoutID = setInterval(() => {
      getUserTT20Balance()
    }, timeOut || 5000)

    return () => {
      clearInterval(timeoutID)
    }
  }, [getUserTT20Balance, timeOut])

  return getUserTT20Balance
}
