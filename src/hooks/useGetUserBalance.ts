import { useCallback, useEffect, useState } from 'react'
import { useWalletWrapper } from 'context/Wallet'
import { BigNumber } from 'ethers'
import { bigZero, getProvider } from 'utils/ethers'
import { useERC20Contract } from './useContract'

export function useGetUserBalance(
  isNativeToken: boolean,
  tokenAddress?: any,
  timeOut?: number
) {
  const { account, ethereum } = useWalletWrapper()
  const [balance, setbalance] = useState(bigZero)
  const tt20 = useERC20Contract(tokenAddress)

  const getUserBalance = useCallback(async () => {
    if (account) {
      if (isNativeToken) {
        const provider = getProvider(ethereum)
        const userBalance = await provider.getBalance(account)
        setbalance(userBalance)
      } else if (tt20) {
        const userBalance = (await tt20.balanceOf(account)) as BigNumber
        setbalance(userBalance)
      }
    }
  }, [tt20, account, setbalance, ethereum, isNativeToken])

  useEffect(() => {
    const timeoutID = setInterval(() => {
      getUserBalance()
    }, timeOut || 5000)

    return () => {
      clearInterval(timeoutID)
    }
  }, [getUserBalance, timeOut])

  return { getUserBalance, balance }
}
