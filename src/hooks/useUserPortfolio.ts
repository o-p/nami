import { useCallback, useEffect, useMemo, useState } from 'react'
import { useWalletWrapper } from 'context/Wallet'
import { bigZero, ether } from 'utils/ethers'
import { usePoolsContext } from 'context/Pools'
import {
  useERC20Contract,
  useOakContract,
  useOakViewContract,
} from 'hooks/useContract'
import { networkID } from 'utils/helpers'
import { contractAddresses, startingBlock } from 'constants/index'
import { BigNumber } from 'ethers'
import { useGlobalsContext } from 'context/Globals'
import { EContexts } from 'context/Globals/Context'
import { IPortfolio, IUserVaultAssets } from 'context/User/Types'
import useGetPastEvents from './useGetPastEvents'
import { BlockTag } from '@ethersproject/abstract-provider'

export function useUserPortfolio(): IPortfolio {
  const { account } = useWalletWrapper()
  const { pools } = usePoolsContext()
  const [poolDeposit, setpoolDeposit] = useState(bigZero)
  const [vaultsDeposit, setvaultsDeposit] = useState(bigZero)
  const [acornEarned, setacornEarned] = useState(bigZero)
  const [userVaults, setuserVaults] = useState<{
    totalStaked: BigNumber
    totalBalance: BigNumber
    assets: IUserVaultAssets[]
  }>({
    totalStaked: bigZero,
    totalBalance: bigZero,
    assets: [],
  })
  const acorn = useERC20Contract(contractAddresses[networkID].acorn.address)
  const oak = useOakContract()
  const { isLoadingContext } = useGlobalsContext()
  const oakView = useOakViewContract()
  const { ethereum } = useWalletWrapper()

  const getAE = useCallback(
    async (fromBlockOrBlockhash?: BlockTag | string, toBlock?: BlockTag) => {
      const eventFilter = acorn!.filters.Transfer(oak!.address, account)
      return await acorn!.queryFilter(
        eventFilter,
        fromBlockOrBlockhash,
        toBlock
      )
    },
    [account, acorn, oak]
  )

  const {
    events: transferEvents,
    isLoading,
    getPastEvents,
  } = useGetPastEvents({
    ethereum,
    delay: 3000,
    getEvents: getAE,
    fromBlock: startingBlock[networkID],
    isRunConditionMatched: !!account,
  })

  const getAcornsEarned = useCallback(
    () =>
      new Promise<void>((resolve) => {
        getPastEvents()
        resolve()
      }),
    [getPastEvents]
  )

  useEffect(() => {
    const earned = transferEvents.reduce((accu, cur) => {
      if (cur.args) {
        return accu.add(cur.args.value)
      }
      return accu
    }, bigZero)
    setacornEarned(earned)
  }, [transferEvents])

  const getPoolDeposits = useCallback(async () => {
    if (account) {
      try {
        const deposits = await Promise.all(
          Object.values(pools).map(async (pool) => {
            const balance = await pool.contract.balanceOf(account)
            return balance.mul(pool ? pool.virtualPrice : '0')
          })
        )
        const pooldeposits = deposits.reduce(
          (accu, cur) => accu.add(cur),
          bigZero
        )
        setpoolDeposit(pooldeposits)
      } catch (error) {
        console.log('error:', error)
      }
    }
  }, [account, pools])

  const getUserStaking = useCallback(async () => {
    if (account) {
      try {
        const oakInfo = await oakView!.portfolio(account)
        setuserVaults(oakInfo)
        setvaultsDeposit(oakInfo.totalStaked)
      } catch (error) {
        console.log('getUserStaking error:', error)
      }
    }
  }, [oakView, account])

  useEffect(() => {
    if (isLoadingContext === EContexts.None) {
      getUserStaking()
      getPoolDeposits()
    }
  }, [getPoolDeposits, isLoadingContext, getUserStaking])

  const deposits = useMemo(() => {
    return poolDeposit.add(vaultsDeposit.mul(ether))
  }, [poolDeposit, vaultsDeposit])

  return {
    deposits,
    getPoolDeposits,
    acornEarned,
    getAcornsEarned,
    userVaults,
    isLoading,
    getUserStaking,
  }
}
