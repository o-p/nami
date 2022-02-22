import { ethers } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'

export const ether = ethers.BigNumber.from('10').pow(
  ethers.BigNumber.from('18')
)

export const bigZero = ethers.BigNumber.from('0')
export const bigOne = ethers.BigNumber.from('1')
export const bigTen = ethers.BigNumber.from('10')

export const max = ethers.constants.MaxUint256

export const isBigNumber = (bigNm: BigNumberish) =>
  ethers.BigNumber.isBigNumber(bigNm)

export const toWei = (amount: string): BigNumber => {
  try {
    return ethers.utils.parseEther(amount || '0')
  } catch (error) {
    return handleToUnitErrors(error, amount, 18)
  }
}

export const toEther = (amount: BigNumberish): string =>
  ethers.utils.formatEther(amount || '0')

export const toBN = (amount: BigNumberish): BigNumber =>
  ethers.BigNumber.from(amount || '0')

export const toUnits = (amount: string, decimals: BigNumberish): BigNumber => {
  try {
    return ethers.utils.parseUnits(amount, decimals)
  } catch (error) {
    return handleToUnitErrors(error, amount, decimals)
  }
}

export const fromUnits = (
  amount: BigNumberish,
  decimals: string | BigNumberish
): string => ethers.utils.formatUnits(amount, decimals)

export function isAddress(value: string): boolean {
  try {
    return !!ethers.utils.getAddress(value.toLowerCase())
  } catch {
    return false
  }
}

export function findBigNumberArrayMin(arr: string[]): string {
  let min = arr[0] || '0'
  arr.forEach((item, idx, arr) => {
    if (arr[idx + 1]) {
      min = toWei(item).lte(toWei(arr[idx + 1])) ? item : arr[idx + 1]
    }
  })
  return min
}

export function getProvider(library: any) {
  if (library instanceof JsonRpcProvider) return library
  return new ethers.providers.Web3Provider(library)
}

const handleToUnitErrors = (
  error: Error,
  amount: string,
  decimals: BigNumberish
) => {
  if (error.message.includes('exceeds decimals')) {
    const decimalIndex = amount.indexOf('.') + 1
    const slicedDecimals = toBN(decimalIndex).add(decimals)
    // console.log('amount:', amount)
    // console.log('new amt: ', amount.slice(0, slicedDecimals.toNumber()))
    return ethers.utils.parseUnits(
      amount.slice(0, slicedDecimals.toNumber()),
      decimals
    )
  }
  return bigZero
}
