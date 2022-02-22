import { useEffect, useCallback } from 'react'
import { useWalletWrapper } from 'context/Wallet'
import { toUnits } from 'utils/ethers'
import { useERC20Contract } from './useContract'

interface IAllowance {
  tokenAddress: string
  allowAddress: string
  approveAmount: string
  token: string
  tokenDecimal?: number
  setisAllowed: React.Dispatch<React.SetStateAction<boolean>>
}

export function useCheckAllowance({
  token,
  tokenAddress,
  allowAddress,
  approveAmount,
  setisAllowed,
  tokenDecimal = 18,
}: IAllowance) {
  const { account } = useWalletWrapper()
  const contract = useERC20Contract(tokenAddress)

  const getAllowance = useCallback(async () => {
    if (token === 'TT') {
      setisAllowed(true)
    } else {
      try {
        const allowance = await contract?.allowance(account, allowAddress)
        const bigApproveAmt = toUnits(approveAmount || '0', tokenDecimal)
        if (bigApproveAmt.gt(allowance) || allowance.isZero()) {
          setisAllowed(false)
        } else {
          setisAllowed(true)
        }
      } catch (error) {
        console.log('error:', error)
      }
    }
  }, [
    contract,
    approveAmount,
    account,
    allowAddress,
    setisAllowed,
    token,
    tokenDecimal,
  ])

  useEffect(() => {
    if (contract) getAllowance()
  }, [getAllowance, contract])

  return getAllowance
}
