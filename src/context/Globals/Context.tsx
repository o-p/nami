import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { IGlobalsContext, ISwapToken } from './Types'
import { useAcornHelpersContract } from 'hooks/useContract'
import { bigZero } from 'utils/ethers'
import { useWalletWrapper } from 'context/Wallet'

export enum EContexts {
  None = 0,
  Globals = 1,
  Token = 2,
  Pools = 3,
  Vaults = 4,
  Strategies = 5,
}

export const globalsContext = createContext({
  dexTokens: {},
  tt: { price: bigZero },
  isLoadingContext: EContexts.None,
  setisLoadingContext: (prev: EContexts) => {},
})

export const GlobalsProvider: React.FC = ({ children }) => {
  const [isLoadingContext, setLoadingContextState] = useState<EContexts>(
    EContexts.Globals
  )

  const setisLoadingContext = useCallback(
    (val: EContexts) => {
      if (val === EContexts.None) setLoadingContextState(EContexts.None)
      if (isLoadingContext === val) {
        setLoadingContextState(val + 1)
      }
    },
    [setLoadingContextState, isLoadingContext]
  )

  const acornHelpers = useAcornHelpersContract()
  const [tt, settt] = useState({ price: bigZero })
  const { ethereum } = useWalletWrapper()
  const [dexTokens, setdexTokens] = useState({
    Acorn: {
      blockExplorer: '',
      circulatingSupply: 0,
      name: '',
      price: 0,
      priceDelta24H: 0,
      symbol: '',
      tokenAddress: '',
      totalValueLocked: 0,
      tradingVol24H: 0,
      website: '',
    },
  })

  useEffect(() => {
    const getTTSwapInfo = async () => {
      const time = new Date()
      try {
        const res = await fetch(
          `https://ttswap.space/api/tokens?${time.getTime()}`
        )
        const {
          data: { tokenList },
        } = await res.json()

        const tokens = tokenList.reduce(
          (accu: { [key: string]: ISwapToken }, cur: ISwapToken) => {
            const formattedSymbol = cur.symbol.toLowerCase().startsWith('tt-')
              ? cur.symbol.toLowerCase().slice(3)
              : cur.symbol.toLowerCase()
            return {
              ...accu,
              [formattedSymbol]: cur,
            }
          },
          {}
        )
        setdexTokens(tokens)
      } catch (error) {
        console.log('error:', error)
      }
    }

    const getTT = async () => {
      const price = await acornHelpers!.ttPrice()
      settt({ price })
    }

    const init = async () => {
      if (ethereum && isLoadingContext === EContexts.Globals) {
        await Promise.all([getTTSwapInfo(), getTT()])
        setisLoadingContext(EContexts.Globals)
      }
    }
    init()
  }, [acornHelpers, ethereum, setisLoadingContext, isLoadingContext])

  return (
    <globalsContext.Provider
      value={{ dexTokens, tt, isLoadingContext, setisLoadingContext }}
    >
      {children}
    </globalsContext.Provider>
  )
}

export function useGlobalsContext(): IGlobalsContext {
  const context = useContext<IGlobalsContext>(globalsContext)
  return context
}
