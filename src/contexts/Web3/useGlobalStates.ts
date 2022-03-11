import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { useWallet, Connectors, Wallet } from 'use-wallet'
import { BigNumber, BigNumberish, ethers } from 'ethers'
import { ExternalProvider } from '@ethersproject/providers'

import configs, { config } from 'configs'
import useThunderHub from './useThunderHub'
import { useP, useSlotMachine } from './contracts'
import formatWei from 'utils/formatWei'

const debug = require('debug')('planet-master:use-global-states')

export interface AppGlobalState {
  configs: any
  balances: {
    [token: string]: {
      amount: BigNumber
      decimals: number
      display: string
    }
  }
  network: any
  wallet: Wallet<unknown> | {
    account?: string
    balance?: string
    chainId?: number
    ethereum?: any
  }
  actions: {
    [action: string]: (...args: any) => any
  }
}

const readonly = new ethers.providers.JsonRpcProvider(config<string>('rpc-url', ''))

const initState: AppGlobalState = {
  configs,
  balances: {},
  network: {
    defaultProvider: readonly,
    providers: {
      readonly,
    },
    isReadOnly: true,
    error: null,
  },
  wallet: {},
  actions: {},
}

function useClientWallet() {
  const wallet = useWallet({ pollBalanceInterval: 3000 })
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

const formatP = formatWei()
export default function useGlobalStates() {
  const wallet = useClientWallet()
  const [fullState, changeState] = useReducer((full: AppGlobalState, changes: Partial<AppGlobalState>) => ({
    ...full,
    ...changes,
  }), initState)

  const tokenP = useP(fullState.network.defaultProvider) as null | {
    balanceOf: (account: string) => Promise<BigNumber>
  }

  const game = useSlotMachine(fullState.network.defaultProvider) as null | {
    play: (settings: { value: BigNumberish }) => any
  }

  const play = useCallback(async (bet: number) => {
    if (wallet.status !== 'connected') throw new Error('Unable to play game before connecting')

    console.log('bet amount: ', ethers.utils.parseEther(bet.toString()))
    const { wait } = await game?.play({
      value: ethers.utils.parseEther(bet.toString()),
    })

    const { events } = await wait(1)

    debug('Play slot-machine, got events: %o', events)

    const event = events.find(({ event }: { event: string }) => event === 'Play')

    // Contract didn't emit Play event correctly.
    // One possible reason could be the Vault liquidity too low.
    if (!event) throw new Error('Play failure, please try again.')

    const {
      args: {
        left,
        mid,
        right,
        payment,
        tokenReward,
      },
    } = event

    return {
      symbols: [
        left.toNumber(),
        mid.toNumber(),
        right.toNumber(),
      ],
      payment: ethers.utils.formatEther(payment),
      tokenReward: ethers.utils.formatEther(tokenReward),
    }
  }, [wallet.status, game])

  const setConnection = useCallback(async (method: keyof Connectors | '') => {
    debug('switch connection to: %s', method)
    if (method !== '') {
      try {
        await wallet.connect(method)
        changeState({
          network: {
            ...fullState.network,
            isReadOnly: false,
            defaultProvider: method,
            error: null,
          },
        })
      } catch (error) {
        debug('Set connection error: %o', error)
        changeState({
          network: {
            ...fullState.network,
            isReadOnly: true,
            defaultProvider: 'readonly',
            error,
          }
        })
      }
    } else {
      changeState({
        network: {
          ...fullState.network,
          isReadOnly: true,
          defaultProvider: 'readonly',
        },
      })
    }
  }, [fullState.network, wallet])

  const switchNetwork = useCallback(() => {
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
  }, [fullState.network])

  // on wallet initialized
  useEffect(() => {
    if (wallet.status === 'connected' && wallet.account && tokenP) {
      tokenP
        .balanceOf(wallet.account)
        .then(balance => changeState({
          balances: {
            ...fullState.balances,
            P: {
              amount: balance,
              decimals: 18,
              display: formatP(balance),
            },
          },
        }))
        .catch((e) => {
          console.error(e)
        })
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [wallet.status])

  // update default provider
  useEffect(() => {
    if (wallet.status === 'connected') {
      const { ethereum } = wallet
      const provider = new ethers.providers.Web3Provider(ethereum as ExternalProvider)
      const signer = provider.getSigner().connectUnchecked()
      changeState({
        ...fullState,
        network: {
          ...fullState.network,
          providers: {
            ...fullState.network.providers,
            web3: provider,
          },
          defaultProvider: signer,
          isReadOnly: false,
        },
      })
    } else if (fullState.network.defaultProvider !== fullState.network.providers.readonly) {
      changeState({
        ...fullState,
        network: {
          ...fullState.network,
          defaultProvider: fullState.network.providers.readonly,
          isReadOnly: true,
        },
      })
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [wallet.status])

  return {
    ...fullState,
    wallet,
    actions: {
      play,
      setConnection,
      switchNetwork,
    },
  }
}
