import { BigNumber } from 'ethers'

export interface ISwapToken {
  blockExplorer: string
  circulatingSupply: number
  name: string
  price: number
  priceDelta24H: number
  symbol: string
  tokenAddress: string
  totalValueLocked: number
  tradingVol24H: number
  website: string
}

export interface IGlobalsContext {
  //   slippage: BigNumber
  dexTokens: {
    [key: string]: ISwapToken
  }
  tt: {
    price: BigNumber
  }
  isLoadingContext: Contexts
  setisLoadingContext: React.Dispatch<React.SetStateAction<Contexts>>
}
