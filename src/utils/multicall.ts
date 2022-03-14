import { JsonFragment } from '@ethersproject/abi'
import { ethers, Contract } from 'ethers'

export type MultiCallResponse<T> = T | null

export interface Call {
  address: string // Address of the contract
  name: string    // Function name on the contract (example: balanceOf)
  params?: any[]  // Function params
}

interface MulticallOptions {
  requireSuccess?: boolean
}

/**
 * Multicall V2 uses the new "tryAggregate" function. It is different in 2 ways
 *
 * 1. If "requireSuccess" is false multicall will not bail out if one of the calls fails
 * 2. The return includes a boolean whether the call was successful e.g. [wasSuccessful, callResult]
 */
export const multicallv2 = async <T = any>(
  multiCallContract: Contract | undefined,
  abi: JsonFragment[],
  calls: Call[],
  options: MulticallOptions = { requireSuccess: true },
): Promise<MultiCallResponse<T>> => {
  const { requireSuccess } = options
  const itf = new ethers.utils.Interface(abi)

  if (!multiCallContract) throw new Error("No Multicall contract")

  const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])
  const returnData = await multiCallContract.callStatic.tryAggregate(requireSuccess, calldata)
  const res = returnData.map((call: any, i: any) => {
    const [result, data] = call
    return result ? itf.decodeFunctionResult(calls[i].name, data) : null
  })

  return res
}
