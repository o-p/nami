import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { IStrategy, IStrategyContext } from './Types'
import { useGlobalsContext } from 'context/Globals'
import { EContexts } from 'context/Globals/Context'
import { useWalletWrapper } from 'context/Wallet'
import strategyABI from 'constants/abis/Strategy.json'
import { contractAddresses, strategiesAssets } from 'constants/index'
import { bigZero, ether, fromUnits, getProvider, toBN } from 'utils/ethers'
import { blocksPerDay, networkID } from 'utils/helpers'
import { BigNumber } from 'ethers'
import { getContract } from 'utils/contract'
import { useTokenContext } from 'context/Tokens'

export const strategyTokenDecimals = 18

export const strategiesContext = createContext<IStrategyContext>({
  strategies: {},
  getStrategies: () => {},
})

export const StrategiesProvider: React.FC = ({ children }) => {
  const { isLoadingContext, setisLoadingContext } = useGlobalsContext()
  const { ethereum } = useWalletWrapper()
  const tokenContext = useTokenContext()
  const { tt } = useGlobalsContext()
  const [strategies, setstrategies] = useState<{
    [key: string]: IStrategy
  }>({})

  const getStrategies = useCallback(async () => {
    const provider = getProvider(ethereum)
    const blockNumber = await provider.getBlockNumber()

    const getStrategy = async (name: string, strategy: any) => {
      const underlying = name.split('-')[0].toLowerCase()
      const price =
        underlying === 'tt' ? tt.price : tokenContext[underlying].price
      const underlyingDecimals =
        underlying === 'tt' ? 18 : tokenContext[underlying].decimals

      const vPriceYesterday = await strategy!
        .exchangeRate({ blockTag: blockNumber - blocksPerDay })
        .catch(() => bigZero)

      try {
        const [locked, entranceFeeFactor, denominator] = (await Promise.all([
          strategy!.wantLockedTotal(),
          strategy!.entranceFeeFactor(),
          strategy!.DENOMINATE(),
        ])) as BigNumber[]
        return {
          entranceFeeFactor: entranceFeeFactor,
          denominator: denominator,
          tvl: fromUnits(
            locked.mul(price),
            strategyTokenDecimals + underlyingDecimals
          ),
          vPriceYesterday: vPriceYesterday
            .mul(ether)
            .div(toBN('10').pow(underlyingDecimals)),
          name: underlying,
        }
      } catch (error) {
        console.log('error:', error)
        return {
          entranceFeeFactor: bigZero,
          denominator: bigZero,
          tvl: '0',
          vPriceYesterday: bigZero,
          name: underlying,
        }
      }
    }

    const strategyList = await Promise.all(
      strategiesAssets.map(async (name: string) => {
        const strategyContract = getContract(
          contractAddresses[networkID][name].address,
          strategyABI,
          ethereum
        )
        return getStrategy(name, strategyContract)
      })
    )

    const allStrategies = strategyList.reduce(
      (accu, cur) => ({ ...accu, [cur.name]: cur }),
      {}
    )
    setstrategies(allStrategies)
  }, [ethereum, tokenContext, tt])

  useEffect(() => {
    const init = async () => {
      if (ethereum && isLoadingContext === EContexts.Strategies) {
        await getStrategies()
        setisLoadingContext(EContexts.None)
      }
    }
    init()
  }, [getStrategies, ethereum, isLoadingContext, setisLoadingContext])

  return (
    <strategiesContext.Provider value={{ strategies, getStrategies }}>
      {children}
    </strategiesContext.Provider>
  )
}

export function useStrategiesContext(): IStrategyContext {
  const context = useContext<IStrategyContext>(strategiesContext)
  return context
}
