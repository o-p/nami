import { useEffect, useCallback, useState } from 'react'
import { useWalletWrapper } from 'context/Wallet'
import { toBN } from 'utils/ethers'
import { useERC20Contract } from './useContract'
import { emptyAddress } from 'utils/helpers'

interface IAllowance {
  isNativeToken?: boolean
  tokenAddress: string
  allowAddress: string
}

export function useGetAllowance({
  isNativeToken,
  tokenAddress,
  allowAddress,
}: IAllowance) {
  const { account } = useWalletWrapper()
  const contract = useERC20Contract(isNativeToken ? emptyAddress : tokenAddress)
  const [allowance, setallowance] = useState(toBN('0'))

  const getAllowance = useCallback(async () => {
    if (account && !isNativeToken) {
      const res = await contract!.allowance(account, allowAddress)
      setallowance(res)
    }
  }, [contract, account, allowAddress, isNativeToken])

  useEffect(() => {
    getAllowance()
  }, [getAllowance])

  return { allowance, getAllowance }
}
