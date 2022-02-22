// tokenContext, TokenProvider, useTokenWrapper
import erc677 from 'constants/abis/erc677.json'
import {
  contractAddresses,
  strategiesAssets,
  swapAssets,
} from 'constants/index'
import { createContext, useContext, useEffect, useState } from 'react'
import { getContract } from 'utils/contract'
import { networkID } from 'utils/helpers'
import { useWalletWrapper } from 'context/Wallet'
import { useGlobalsContext } from 'context/Globals'
import { EContexts } from 'context/Globals/Context'
import { BigNumber } from 'ethers'
import { bigZero, toWei } from 'utils/ethers'

export interface IToken {
  decimals: number
  name: string
  underlyingAddress: string
  contract: any
  price: BigNumber // 1e18
}
interface ITokens {
  [key: string]: IToken
}

export const tokenContext = createContext({})

export const TokenProvider: React.FC = ({ children }) => {
  const [tokens, settokens] = useState<ITokens>({})
  const { ethereum } = useWalletWrapper()
  const { isLoadingContext, setisLoadingContext, dexTokens } =
    useGlobalsContext()

  useEffect(() => {
    const getTokens = (): Promise<any>[] => {
      const strategyAssets = strategiesAssets.reduce(
        (accu: string[], cur: string) =>
          cur === 'tt-strategy' ? accu : [...accu, cur.split('-')[0]],
        []
      )
      const allAssets = [...strategyAssets, ...swapAssets]
      return allAssets.map(async (token: string) => {
        const tokenAddr = contractAddresses[networkID][token].address
        const contract = getContract(tokenAddr, erc677, ethereum)
        const decimals = (await contract!.decimals()) as number
        return {
          name: token,
          decimals,
          underlyingAddress: tokenAddr,
          contract,
          price: dexTokens[token]
            ? toWei(dexTokens[token].price.toString())
            : bigZero,
        }
      })
    }
    const init = async () => {
      if (
        Object.keys(tokens).length === 0 &&
        ethereum &&
        isLoadingContext === EContexts.Token
      ) {
        let newTokens = {}
        for (const iterator of await Promise.all(getTokens())) {
          newTokens = {
            ...newTokens,
            [iterator.name]: iterator,
          }
        }
        settokens(newTokens)
        setisLoadingContext(EContexts.Token)
      }
    }
    init()
  }, [ethereum, tokens, setisLoadingContext, isLoadingContext, dexTokens])

  return (
    <tokenContext.Provider value={tokens}>{children}</tokenContext.Provider>
  )
}

export function useTokenContext(): ITokens {
  const context = useContext<ITokens>(tokenContext)
  return context
}
