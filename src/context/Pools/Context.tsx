import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react'
import { pools, swapAssets, swapTokenAddrs } from 'constants/index'
import { blocksPerDay, networkID } from 'utils/helpers'
import { ICoins, IPoolContext } from './Types'
import { getContract } from 'utils/contract'
import NPoolAbi from 'constants/abis/NPool.json'
import { useWalletWrapper } from 'context/Wallet'
import reducer, { initialState, setAllPools } from './Reducer'
import { ether, getProvider } from 'utils/ethers'
import { useGlobalsContext } from 'context/Globals'
import { EContexts } from 'context/Globals/Context'
import { useAcornHelpersContract } from 'hooks/useContract'

export const poolsContext = createContext({
  pools: {},
  getAllPools: () => {},
})

export const PoolsProvider: React.FC = ({ children }) => {
  const { isLoadingContext, setisLoadingContext } = useGlobalsContext()
  const [state, dispatch] = useReducer(reducer, initialState)
  const { ethereum } = useWalletWrapper()
  const acornHelpers = useAcornHelpersContract()

  const getPool = useCallback(
    async (pool: string, blockNumber: number) => {
      const contract = getContract(pool, NPoolAbi, ethereum)
      const yesterdayBlockNumber = blockNumber - blocksPerDay

      const [helpers, prevVPrice] = await Promise.all([
        acornHelpers!.swap(),
        contract!.get_virtual_price({ blockTag: yesterdayBlockNumber }),
      ])
      const {
        // precision,
        coinList,
        tvl,
        poolTokenName,
        totalSupply,
        vPrice,
        poolBalances,
      } = helpers

      const coins = coinList.map(
        (coinAddress: string, contractIndex: number): ICoins => {
          const tokenIndex = swapTokenAddrs.indexOf(coinAddress.toLowerCase())
          return {
            address: coinAddress,
            token: swapAssets[tokenIndex],
            index: contractIndex,
          }
        }
      )
      const vPriceQuotient = vPrice.mul(ether).div(prevVPrice).sub(ether)

      return {
        coins,
        poolTokenName,
        contract,
        tvl,
        totalSupply,
        poolAPR: vPriceQuotient,
        virtualPrice: vPrice,
        poolBalances,
      }
    },
    [ethereum, acornHelpers]
  )

  const getAllPools = useCallback(async () => {
    let allPools = {}
    const provider = getProvider(ethereum)
    const blockNumber = await provider.getBlockNumber()

    for (const iterator of await Promise.all(
      pools[networkID].map(async (pool: string) => {
        return await getPool(pool, blockNumber)
      })
    )) {
      allPools = {
        [iterator.poolTokenName]: {
          coins: iterator.coins,
          poolTokenName: iterator.poolTokenName,
          contract: iterator.contract,
          tvl: iterator.tvl,
          totalSupply: iterator.totalSupply,
          poolAPR: iterator.poolAPR,
          virtualPrice: iterator.virtualPrice,
          poolBalances: iterator.poolBalances,
        },
      }
    }
    dispatch(setAllPools(allPools))
    setisLoadingContext(EContexts.Pools)
  }, [getPool, setisLoadingContext, ethereum])

  useEffect(() => {
    const init = async () => {
      if (ethereum && isLoadingContext === EContexts.Pools) await getAllPools()
    }
    init()
  }, [getAllPools, ethereum, isLoadingContext])

  return (
    <poolsContext.Provider value={{ pools: state, getAllPools }}>
      {children}
    </poolsContext.Provider>
  )
}

export function usePoolsContext(): IPoolContext {
  const context = useContext<IPoolContext>(poolsContext)
  return context
}
