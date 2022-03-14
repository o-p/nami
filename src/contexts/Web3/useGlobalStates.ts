import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { useWallet, Connectors, Wallet } from 'use-wallet'
import { BigNumber, BigNumberish, ethers } from 'ethers'
import { ExternalProvider } from '@ethersproject/providers'
import { ContractTransaction } from '@ethersproject/contracts'

import configs, { config } from 'configs'
import useThunderHub from './useThunderHub'
import { useMulticall2, useP, useSlotMachine, ERC20, SlotMachine, PlayEvent, UnboxEvent } from './contracts'
import formatWei from 'utils/formatWei'
import { multicallv2 } from 'utils/multicall'

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
  game: {
    dpAllowance: BigNumber
    acculatedPrize: BigNumber
    unboxFee: BigNumber
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
  game: {
    dpAllowance: ethers.constants.Zero,
    acculatedPrize: ethers.constants.Zero,
    unboxFee: ethers.constants.WeiPerEther.mul(6),
  },
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
    approve: (spender: string, amount: BigNumberish) => Promise<ContractTransaction>
  }

  const game = useSlotMachine(fullState.network.defaultProvider) as null | {
    play: (settings: { value: BigNumberish }) => Promise<ContractTransaction>
    unbox: (prize: BigNumberish) => Promise<ContractTransaction>
  }

  const theMultiCall = useMulticall2(fullState.network.providers.readonly)

  const play = useCallback(async (bet: number) => {
    if (wallet.status !== 'connected') throw new Error('Unable to play game before connecting')
    if (!game) throw new Error('Contract disconnected')

    debug('Play -- bet amount: %d', bet)

    const { wait } = await game?.play({
      value: ethers.utils.parseEther(bet.toString()),
    })

    const { events = [] } = await wait(1)

    debug('Play -- receive events: %o', events)

    const event = events.find(({ event }) => event === 'Play')

    // Contract didn't emit Play event correctly.
    // One possible reason could be the Vault liquidity too low.
    if (!event) throw new Error('Transaction failure, please try again.')

    const {
      args: {
        left,
        mid,
        right,
        payment,
        tokenReward,
      },
    } = event as PlayEvent

    return {
      symbols: [
        fullState.configs.game.symbolMappings[left.toString()],
        fullState.configs.game.symbolMappings[mid.toString()],
        fullState.configs.game.symbolMappings[right.toString()],
      ],
      payment: ethers.utils.formatEther(payment),
      tokenReward: ethers.utils.formatEther(tokenReward),
    }
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [fullState.network.defaultProvider])

  const unbox = useCallback(async (prize: BigNumberish) => {
    if (wallet.status !== 'connected') throw new Error('Unable to unbox before connecting')
    if (!game) throw new Error('Contract disconnected')

    debug('Unbox -- current prize: %s', prize.toString())

    const { wait } = await game?.unbox(prize)

    const { events = [] } = await wait(1)

    debug('Unbox -- receive events: %o', events)

    const event = events.find(({ event }) => event === 'Unbox')

    // 1. Not win the prize
    // 2. Contract error
    if (!event) return { win: '' }

    const {
      args: {
        payment,
      },
    } = event as UnboxEvent

    return {
      win: ethers.utils.formatEther(payment),
    }
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [fullState.network.defaultProvider])

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

  const approveDP = useCallback(async () => {
    if (wallet.status !== 'connected') throw new Error('Unable to approve before connecting')
    if (!tokenP) throw new Error('Contract disconnected')

    debug('Approve DP')
    const gameAddress = fullState.configs.contract.SlotMachine
    const { wait } = await tokenP?.approve(gameAddress, ethers.constants.MaxUint256)

    const { events = [] } = await wait(1)

    debug('Approve DP -- receive events: %o', events)

    return events.some(({ event }) => event === 'Approval')
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [fullState.network.defaultProvider])

  const refreshGameInfo = useCallback(() => {
    const gameAddress = fullState.configs.contract.SlotMachine
    const dpAddress = fullState.configs.token.P.address

    const multiCallOfDP = wallet.status === 'connected' && wallet.account && tokenP && theMultiCall
      ? multicallv2(
        theMultiCall,
        ERC20,
        [
          {
            address: dpAddress,
            name: 'balanceOf',
            params: [wallet.account],
          },
          {
            address: dpAddress,
            name: 'allowance',
            params: [wallet.account, gameAddress],
          },
        ],
      ).then(([[balanceOf], [allowance]]) => ({ balanceOf, allowance }))
      : Promise.resolve(null)

    const multiCallofGame = theMultiCall
      ? multicallv2(
        theMultiCall,
        SlotMachine,
        [
          {
            address: gameAddress,
            name: 'unboxingFee',
            params: [],
          }
        ]
      ).then(([[unboxFee]]) => ({ unboxFee }))
      : Promise.resolve(null)

    Promise
      .all([
        fullState.network.providers.readonly.getBalance(gameAddress),
        multiCallOfDP,
        multiCallofGame,
      ])
      .then(([acculatedPrize, dpInfo, gameInfo]) => dpInfo
        ? changeState({
          balances: {
            ...fullState.balances,
            P: {
              amount: dpInfo.balanceOf,
              decimals: 18,
              display: formatP(dpInfo.balanceOf),
            },
          },
          game: {
            ...fullState.game,
            dpAllowance: dpInfo.allowance,
            acculatedPrize,
            unboxFee: gameInfo?.unboxFee,
          },
        })
        : changeState({
          game: {
            ...fullState.game,
            acculatedPrize,
            unboxFee: gameInfo?.unboxFee,
          },
        })
      )
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [fullState.network.defaultProvider])

  // on wallet initialized
  useEffect(() => {
    refreshGameInfo()
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [fullState.network.defaultProvider])

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

  // TODO auto refresh game info

  return {
    ...fullState,
    wallet,
    actions: {
      switchNetwork,
      setConnection,
      refreshGameInfo,
      play,
      approveDP,
      unbox,
    },
  }
}
