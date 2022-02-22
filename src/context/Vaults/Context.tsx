import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { IVault, IVaultContext } from './Types'
import {
  useAcornHelpersContract,
  useERC20Contract,
  useOakContract,
} from 'hooks/useContract'
import { vaultPid, contractAddresses } from 'constants/index'
import { useGlobalsContext } from 'context/Globals'
import { bigZero, ether, fromUnits, getProvider, toBN } from 'utils/ethers'
import strategyABI from 'constants/abis/Strategy.json'
import { usePoolsContext } from 'context/Pools'
import { networkID } from 'utils/helpers'
import { useWalletWrapper } from 'context/Wallet'
import { EContexts } from 'context/Globals/Context'
import { getContract } from 'utils/contract'
import erc20 from 'constants/abis/erc20.json'
import { useTokenContext } from 'context/Tokens'
// export { vaultsContext, VaultsProvider, useVaultsContext } from './Context'

export const VaultsContext = createContext<IVaultContext>({
  vaults: [],
  getAllVaults: () => {},
})

export const VaultsProvider: React.FC = ({ children }) => {
  const { isLoadingContext, setisLoadingContext } = useGlobalsContext()
  const [vaults, setvaults] = useState<IVault[]>([])
  const oak = useOakContract()
  const { tt } = useGlobalsContext()
  const poolCtx = usePoolsContext()
  const { ethereum } = useWalletWrapper()
  const acornHelpers = useAcornHelpersContract()
  const acorn = useERC20Contract(contractAddresses[networkID].acorn.address)
  const tokenContext = useTokenContext()

  const getAllVaults = useCallback(async () => {
    // return bignumber(1e18)
    const getVirtualPrice = async (pid: number, vaultName: string) => {
      if (vaultName.includes('strategy')) {
        const strategyAddr = contractAddresses[networkID][vaultName].address
        const strategy = getContract(strategyAddr, strategyABI, ethereum)
        try {
          const underlyingDecimals =
            vaultName.split('-')[0] === 'tt'
              ? 18
              : tokenContext[vaultName.split('-')[0]].decimals
          const [vPrice] = await Promise.all([strategy!.exchangeRate()])
          return vPrice.mul(ether).div(toBN('10').pow(underlyingDecimals))
        } catch (error) {
          console.log('error:', error)
          return bigZero
        }
      }
      switch (pid) {
        case 0:
          return poolCtx.pools['3 Acorn']
            ? poolCtx.pools['3 Acorn'].virtualPrice
            : bigZero
        case 1: {
          const acornTTAddr = contractAddresses[networkID]['acorn-TT'].address
          const lpContract = getContract(acornTTAddr, erc20, ethereum)
          const provider = getProvider(ethereum)
          const [ttBal, lpSupply] = await Promise.all([
            provider.getBalance(acornTTAddr),
            lpContract!.totalSupply(),
          ])
          return ttBal.mul('2').mul(tt.price).div(lpSupply)
        }
        default:
          return bigZero
      }
    }

    try {
      const vaultAddresses = (await oak!.getVaults()) as string[]
      const vaultsInfo = await Promise.all(
        Object.keys(vaultPid[networkID]).map(async (vaultName: string) => {
          const pid = vaultPid[networkID][vaultName]
          const [stakedBalanceInTT, virtualPrice] = await Promise.all([
            acornHelpers!.vaultStakedValue(pid),
            getVirtualPrice(pid, vaultName),
          ])
          const stakedBalance = fromUnits(tt.price.mul(stakedBalanceInTT), 36)
          return {
            vaultName,
            address: vaultAddresses[pid],
            virtualPrice,
            stakedBalance,
            pid,
          }
        })
      )
      setvaults(vaultsInfo)
    } catch (error) {
      console.log('error:', error)
    }
  }, [oak, acorn, acornHelpers, ethereum, tt.price, poolCtx])

  useEffect(() => {
    const init = async () => {
      if (ethereum && isLoadingContext === EContexts.Vaults) {
        await getAllVaults()
        setisLoadingContext(EContexts.Vaults)
      }
    }
    init()
  }, [getAllVaults, ethereum, isLoadingContext, setisLoadingContext])

  return (
    <VaultsContext.Provider value={{ vaults, getAllVaults }}>
      {children}
    </VaultsContext.Provider>
  )
}

export function useVaultsContext(): IVaultContext {
  const context = useContext<IVaultContext>(VaultsContext)
  return context
}
