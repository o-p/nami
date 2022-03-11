import { useMemo } from 'react'
import { ethers, Contract, ContractInterface } from 'ethers'
import { AbiItem } from 'web3-utils'
import { BaseProvider } from '@ethersproject/providers'

import { config } from 'configs'

const ERC20: AbiItem = require('./abi/ERC20.abi.json')
const SlotMachine: AbiItem = require('./abi/SlotMachine.abi.json')

function createContractInstance(provider: BaseProvider, address: string, abi: ethers.ContractInterface): Contract | null {
  try {
    return new ethers.Contract(address, abi, provider)
  } catch (e) {
    console.error(e)
    return null
  }
}

function useContract(provider: BaseProvider, address: string, abi: AbiItem) {
  return useMemo<Contract | null>(
    () => createContractInstance(provider, address, abi as unknown as ContractInterface),
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [provider, address]
  )
}

export function useERC20(provider: BaseProvider, address: string) {
  return useContract(provider, address, ERC20)
}

export function useWTT(provider: BaseProvider) {
  return useERC20(provider, config('token.WTT.address'))
}

export function useP(provider: BaseProvider) {
  return useERC20(provider, config('token.P.address'))
}

export function useSlotMachine(provider: BaseProvider) {
  return useContract(provider, config('contract.SlotMachine'), SlotMachine)
}
