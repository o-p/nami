import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { useWallet, Connectors, Wallet } from 'use-wallet'
import { ethers, Contract, ContractInterface } from 'ethers'
import { AbiItem } from 'web3-utils'
import { ExternalProvider, JsonRpcProvider, BaseProvider } from '@ethersproject/providers'

import ERC20 from './abi/ERC20.abi.json'
import configs, { config } from 'configs'
import useThunderHub from './useThunderHub'

export interface AppGlobalState {
  configs: any
  debug?: any
  balances: {
    [token: string]: {
      amount: string
      decimals: number
      display: string
    }
  }
  network: any
  wallet: Wallet<unknown> | {
    account?: string
    chainId?: number
    ethereum?: any
  }
  actions: {
    [action: string]: (...args: any) => any
  }
}

const jsonRpc = new ethers.providers.JsonRpcProvider(config<string>('rpc-url', ''))

const initState: AppGlobalState = {
  configs,
  debug: null,
  balances: {},
  network: {
    defaultProvider: jsonRpc,
    providers: {
      jsonRpc,
    },
    isReadOnly: true,
    error: null,
  },
  wallet: {},
  actions: {},
}

function createContractInstance(provider: BaseProvider, address: string, abi: ethers.ContractInterface): Contract | null {
  try {
    return new ethers.Contract(address, abi, provider)
  } catch (e) {
    console.error(e)
    return null
  }
}

function useContract(provider: BaseProvider, address: string, abi: AbiItem) {
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  return useMemo<Contract | null>(
    () => createContractInstance(provider, address, abi as unknown as ContractInterface),
    [provider, address, abi]
  )
}

function useERC20(provider: BaseProvider, address: string) {
  return useContract(provider, address, ERC20 as any as AbiItem)
}

function useWTT(provider: BaseProvider) {
  return useERC20(provider, config('token.WTT.address'))
}

function useDPT(provider: BaseProvider) {
  return useERC20(provider, config('token.DPT.address'))
}

function useClientWallet() {
  const wallet = useWallet()
  const { isHub, hubData } = useThunderHub()

  return useMemo(
    () => {
      return isHub
        ? {
          ...wallet,
          account: hubData?.walletAddress ?? '',
          chainId: config('chain-id', 0),
          ethereum: window.ethereum,
          status: 'connected',
          // unused: connect, error, networkName, type
        }
        : wallet
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [wallet]
  )
}

export default function useGlobalStates() {
  const wallet = useClientWallet()
  const [fullState, changeState] = useReducer((full: AppGlobalState, changes: Partial<AppGlobalState>) => ({
    ...full,
    ...changes,
  }), initState)

  const DPT = useDPT(fullState.network.defaultProvider)

  useEffect(() => {
    if (wallet.account && DPT) {
      // @ts-ignore
      DPT.balanceOf(wallet.account).then(balance => changeState({
        balances: {
          ...fullState.balances,
          DPT: balance,
        },
      }))
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [wallet.account])

  return {
    ...fullState,
    wallet,
    actions: {
      debug(props: any) {
        changeState({ debug: props })
      },
      async setConnection(method: keyof Connectors | '') {
        if (method !== '') {
          try {
            await wallet.connect(method)
            const external = new ethers.providers.Web3Provider(wallet.ethereum as ExternalProvider)
            changeState({
              network: {
                ...fullState.network,
                isReadOnly: false,
                defaultProvider: external,
                error: null,
                providers: {
                  ...fullState.network.providers,
                  external,
                },
              },
            })
          } catch (error) {
            changeState({
              network: {
                ...fullState.network,
                isReadOnly: true,
                defaultProvider: fullState.network.providers.jsonRpc,
                error,
              }
            })
          }
        } else {
          changeState({
            network: {
              ...fullState.network,
              isReadOnly: true,
              defaultProvider: fullState.network.providers.jsonRpc,
            },
          })
        }
      },

      switchNetwork() {
        if (window.ethereum) {
          window.ethereum
            .request({
              method: 'wallet_addEthereumChain',
              params: [configs.network],
            })
            .catch((error: any) => {
              changeState({
                network: {
                  ...fullState.network,
                  error,
                },
              })
            })
        }
      },
    },
  }
}
