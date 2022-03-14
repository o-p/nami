import { useMemo } from 'react'
import { BaseProvider } from '@ethersproject/providers'
import { ethers, Contract, ContractInterface, BigNumber } from 'ethers'
import { JsonFragment, Result as ContractResult } from '@ethersproject/abi'
import { Event as ContractEvent } from '@ethersproject/contracts'

import { config } from 'configs'

export const ERC20: JsonFragment[] = require('./abi/ERC20.abi.json')
export const SlotMachine: JsonFragment[] = require('./abi/SlotMachine.abi.json')
export const Multicall2: JsonFragment[] = require('./abi/Multicall2.abi.json')

function createContractInstance(provider: BaseProvider, address: string, abi: ethers.ContractInterface): Contract | null {
  try {
    return new ethers.Contract(address, abi, provider)
  } catch (e) {
    console.error(e)
    return null
  }
}

function useContract(provider: BaseProvider, address: string, abi: JsonFragment[]) {
  return useMemo<Contract | null>(
    () => createContractInstance(provider, address, abi as unknown as ContractInterface),
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [provider, address]
  )
}


interface ApprovalEventResult extends ContractResult {
  owner: string
  spender: string
  value: BigNumber
}

export interface ApprovalEvent extends ContractEvent {
  args: ApprovalEventResult
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

interface PlayEventResult extends ContractResult {
  player: string
  wage: BigNumber
  left: BigNumber
  mid: BigNumber
  right: BigNumber
  payment: BigNumber
  tokenReward: BigNumber
}

export interface PlayEvent extends ContractEvent {
  args: PlayEventResult
}

interface UnboxEventResult extends ContractResult {
  player: string
  rng: BigNumber
  payment: BigNumber
}

export interface UnboxEvent extends ContractEvent {
  args: UnboxEventResult
}
export function useSlotMachine(provider: BaseProvider) {
  return useContract(provider, config('contract.SlotMachine'), SlotMachine)
}

export function useMulticall2(provider: BaseProvider) {
  return useContract(provider, config('contract.Multicall2'), Multicall2)
}
