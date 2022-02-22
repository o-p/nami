import { BigNumber } from '@ethersproject/bignumber'

export interface IUserVaultAssets {
  acornClaimable: BigNumber
  balance: BigNumber
  balanceValue: BigNumber
  staked: BigNumber
  stakedValue: BigNumber
  token: string
  tokenDecimal: number
  vault: string
}
export interface IPortfolio {
  deposits: BigNumber
  acornEarned: BigNumber
  getPoolDeposits: () => Promise<void>
  getAcornsEarned: () => Promise<void>
  getUserStaking: () => Promise<void>
  isLoading: boolean
  userVaults: {
    totalStaked: BigNumber
    totalBalance: BigNumber
    assets: IUserVaultAssets[]
  }
}

interface IUserContext {
  portfolio: IPortfolio
}
