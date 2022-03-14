import {
  createContext,
  useContext,
  ReactChild,
} from 'react'
import { UseWalletProvider } from 'use-wallet'
import { ethers } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers'

import configs, { config } from 'configs'
import useMount from 'hooks/useMount'
import useGlobalStates, { AppGlobalState } from './useGlobalStates'

const debug = require('debug')('planet-master:web3-context')

export const context = createContext<AppGlobalState>({
  configs,
  balances: {},
  game: {
    dpAllowance: ethers.constants.Zero,
    acculatedPrize: ethers.constants.Zero,
    unboxFee: ethers.constants.WeiPerEther.mul(6),
  },
  network: {},
  wallet: {},
  actions: {},
})

function AppGlobalsProvider({ children }: { children: ReactChild }) {
  const globalStates = useGlobalStates()
  const { wallet, actions } = globalStates

  useMount(() => {
    async function autoReload() {
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', () => document.location.reload())
        window.ethereum.on('chainChanged', () => document.location.reload())
      }
    }

    async function autoConnect() {
      if (wallet.status !== 'connected') {
        if (window.ethereum) {
          const library = window.ethereum instanceof JsonRpcProvider
            ? window.ethereum
            : new ethers.providers.Web3Provider(window.ethereum)

          const accounts = await library.listAccounts()
          debug('provider accounts: %o', accounts)

          if (accounts.length >= 1) {
            debug('already bind accounts, auto-connect to injected provider')
            return actions.setConnection('injected')
          }
        }
        debug('no suitable provider, use json-rpc provider')
        return actions.setConnection('')
      }
    }

    autoConnect()
    autoReload()
  })

  return (
    <context.Provider value={globalStates}>
      { children }
    </context.Provider>
  )
}

const rpcUrl = config<string>('rpc-url', 'https://mainnet-rpc.thundercore.com')
const chainId = config<number>('chain-id', 108)

export function Provider({ children }: { children: ReactChild }) {
  return (
    <UseWalletProvider
      chainId={chainId}
      connectors={{
        walletconnect: { rpcUrl },
      }}
    >
      <AppGlobalsProvider>
        { children }
      </AppGlobalsProvider>
    </UseWalletProvider>
  )
}

export const useDApp = () => useContext<AppGlobalState>(context)
export default useDApp
