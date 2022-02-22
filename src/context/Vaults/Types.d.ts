import { BigNumber } from 'ethers'

export interface IVault {
  address: string
  virtualPrice: BigNumber
  stakedBalance: string
  pid: number
  vaultName: string
}
interface IVaultContext {
  vaults: IVault[]
  getAllVaults: Function
}
