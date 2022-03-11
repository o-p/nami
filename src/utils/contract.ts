import { Contract, ethers } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers'
import { getProvider, isAddress } from './ethers'

export function getProviderOrSigner(library: any): any {
  if (library instanceof JsonRpcProvider) return library
  const provider = getProvider(library)
  const signer = provider.getSigner().connectUnchecked()
  return signer
}

export function getContract(
  address: string,
  ABI: any,
  library: any
): Contract | null {
  if (!isAddress(address) || address === ethers.constants.AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return new ethers.Contract(address, ABI, getProviderOrSigner(library))
}
