import { BigNumber } from 'ethers'

export interface ICoins {
  address: string
  token: string
  index: number
}
export interface IPoolData {
  coins: ICoins[]
  contract: any
  tvl: BigNumber
  poolTokenName: string
  totalSupply: BigNumber
  poolAPR: BigNumber
  virtualPrice: BigNumber
  poolBalances: BigNumber[]
}

export interface IPools {
  [key: string]: IPoolData
}
export interface IPoolContext {
  pools: IPools
  getAllPools: () => void
}
