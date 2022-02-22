import { useMemo } from 'react'
import { useWalletWrapper } from 'context/Wallet'
import { getContract } from 'utils/contract'
import { AbiItem } from 'web3-utils'
import erc20 from 'constants/abis/erc20.json'
import nPool from 'constants/abis/NPool.json'
import oak from 'constants/abis/Oak.json'
import acornHelpersAbi from 'constants/abis/AcornHelpers.json'
import squirrelAbi from 'constants/abis/Squirrel.json'
import acornAbi from 'constants/abis/Acorn.json'
import strategy from 'constants/abis/Strategy.json'
import oakView from 'constants/abis/OakView.json'
import { contractAddresses, pools } from 'constants/index'
import { networkID } from 'utils/helpers'

function useContract(address: string, abi: AbiItem) {
  const { ethereum: library } = useWalletWrapper()
  try {
    return useMemo(
      () => getContract(address, abi, library),
      [library, address, abi]
    )
  } catch (error) {
    // console.warn('Failed to get contract', error)
    return null
  }
}

export function useERC20Contract(address?: string) {
  const abi = erc20 as unknown as AbiItem
  return useContract(address || '', abi)
}

export function useNPoolContract() {
  const nPoolAbi = nPool as unknown as AbiItem
  return useContract(pools[networkID][0] || '', nPoolAbi)
}

// Oak - controller for strategy pools
export function useOakContract() {
  const oakAbi = oak as unknown as AbiItem
  return useContract(contractAddresses[networkID].oak.address || '', oakAbi)
}

export function useAcornHelpersContract() {
  const abi = acornHelpersAbi as unknown as AbiItem
  return useContract(
    contractAddresses[networkID].acornHelpers.address || '',
    abi
  )
}

export function useSquirrelContract() {
  const abi = squirrelAbi as unknown as AbiItem
  return useContract(contractAddresses[networkID].squirrel.address || '', abi)
}

export function useStrategyContract(address: string) {
  const abi = strategy as unknown as AbiItem
  return useContract(address || '', abi)
}

export function useAcornContract() {
  const abi = acornAbi as unknown as AbiItem
  return useContract(contractAddresses[networkID].acorn.address, abi)
}

export function useOakViewContract() {
  const abi = oakView as unknown as AbiItem
  return useContract(contractAddresses[networkID].oakView.address, abi)
}
