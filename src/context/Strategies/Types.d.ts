import { BigNumber } from 'ethers'

export interface IStrategy {
  tvl: string
  entranceFeeFactor: BigNumber
  denominator: BigNumber
  vPriceYesterday: BigNumber
  name: string
}

export type IStrategyContext = {
  strategies: {
    [key: string]: IStrategy
  }
  getStrategies: Function
}
