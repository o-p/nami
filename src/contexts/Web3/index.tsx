import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useMemo,
  useState,
  ReactChild,
} from 'react'
import { Connectors, useWallet, UseWalletProvider } from 'use-wallet'
import { ethers } from 'ethers'
import { JsonRpcProvider } from '@ethersproject/providers'

import configs, { config } from 'configs'
import useMount from 'hooks/useMount'
import useGlobalStates, { AppGlobalState } from './useGlobalStates'

export const context = createContext<AppGlobalState>({
  configs,
  balances: {},
  network: {},
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

          if (accounts.length >= 1) {
            actions.setConnection('injected')
            // setConnection('injected')
          } else {
            actions.setConnection('')
            // connectByNetwork()
          }
        } else {
          actions.setConnection('')
          // connectByNetwork()
        }
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
