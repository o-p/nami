import { useCallback, useEffect, useState } from 'react'
import { useWalletWrapper } from 'context/Wallet'
import { BigNumber } from 'ethers'
import { useTokenContext } from 'context/Tokens'
import { IPoolData } from 'context/Pools/Types'

export interface IAccountPoolInfo {
  [key: string]: {
    balance: BigNumber
    allowance: BigNumber
  }
}

export function useUserPoolInfo(pool: IPoolData) {
  const { account } = useWalletWrapper()
  const tokenContext = useTokenContext()
  const [accountPoolInfo, setAccountPoolInfo] = useState<IAccountPoolInfo>({})

  const getAccountPoolInfo = useCallback(async () => {
    const getPoolToken = async () => {
      const [name, balance, allowance] = await Promise.all([
        pool.poolTokenName,
        pool.contract.balanceOf(account),
        pool.contract.allowance(account, pool.contract.address),
      ])
      return { name, balance, allowance }
    }
    const getTokens = (): Promise<{
      name: string
      balance: any
      allowance: any
    }>[] => {
      const underlyingList = Object.keys(tokenContext).map(
        async (token: string) => {
          const { contract } = tokenContext[token]
          const balance = await contract.balanceOf(account)
          const allowance = await contract.allowance(
            account,
            pool.contract.address
          )
          return { name: token, balance, allowance }
        }
      )
      return [...underlyingList, getPoolToken()]
    }

    if (Object.keys(tokenContext).length > 0 && account) {
      let accountPoolInfo = {}
      for (const iterator of await Promise.all(getTokens())) {
        accountPoolInfo = {
          ...accountPoolInfo,
          [iterator.name]: {
            balance: iterator.balance,
            allowance: iterator.allowance,
          },
        }
      }
      setAccountPoolInfo(accountPoolInfo)
    }
  }, [tokenContext, account, pool.contract, pool.poolTokenName])

  useEffect(() => {
    getAccountPoolInfo()
  }, [getAccountPoolInfo])

  return { getAccountPoolInfo, accountPoolInfo }
}
