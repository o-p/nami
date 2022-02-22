import { useCallback, useEffect } from 'react'
import { useWalletWrapper } from 'context/Wallet'
import { getProvider } from 'utils/ethers'

export function useGetUserTTBalance(setbalance: any, timeOut?: number) {
  const { account, ethereum } = useWalletWrapper()
  const getUserTTBalance = useCallback(async () => {
    if (account) {
      const provider = getProvider(ethereum)
      const userBalance = await provider.getBalance(account)
      setbalance(userBalance)
    }
  }, [account, setbalance, ethereum])

  useEffect(() => {
    const timeoutID = setInterval(() => {
      getUserTTBalance()
    }, timeOut || 5000)

    return () => {
      clearInterval(timeoutID)
    }
  }, [getUserTTBalance, timeOut])

  return getUserTTBalance
}
