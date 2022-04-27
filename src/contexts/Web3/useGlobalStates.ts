import { useState, useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import { useWallet, Connectors, Wallet } from 'use-wallet'
import { BigNumber, BigNumberish, ethers, constants } from 'ethers'
import { ExternalProvider } from '@ethersproject/providers'
import { ContractTransaction, Event as ContractEvent } from '@ethersproject/contracts'

import {
  Multicall,
  ContractCallContext,
} from 'ethereum-multicall';

import configs, { config } from 'configs'
import useThunderHub from './useThunderHub'
import {
  PlayEvent,
  UnboxEvent,
  usePMT,
  useSlotMachine,
  ERC20 as AbiERC20,
  Multicall2 as AbiMulticall2,
  SlotMachine as AbiGame,
} from './contracts'
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
  error?: Error | string | null
  events: {
    unbox: { from: string, blockNumber: number, earned: BigNumber | null }[]
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
  events: {
    unbox: [],
  },
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
    blockNumber: 0,
  },
  wallet: {},
  actions: {},
}

function GlobalReducer(state: AppGlobalState, action: any) {
  switch (action.type) {
    case 'UNBOX_EVENTS':
      return {
        ...state,
        events: {
          ...state.events,
          unbox: action.payload,
        },
      }
    case 'SET_PROVIDER':
      return {
        ...state,
        network: {
          ...state.network,
          isReadOnly: action.payload.isReadOnly,
          defaultProvider: action.payload.defaultProvider,
          providers: {
            ...state.network.providers,
            ...action.payload.providers,
          },
        },
      }
    case 'NETWORK_ERROR':
      return {
        ...state,
        network: {
          ...state.network,
          error: action.payload,
        },
      }
    case 'GAME_STATE':
      return {
        ...state,
        game: {
          ...state.game,
          ...action.payload.game,
        },
        network: {
          ...state.network,
          ...action.payload.network,
        },
        balances: {
          ...state.balances,
          ...action.payload.balances,
        },
      }
    case 'ERROR':
      return {
        ...state,
        error: action.payload,
      }
    default:
      throw new Error('Invalid action')
  }
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

const formatToken = formatWei(18, 3)
const REFRESH_TIMEOUT = 10000
export default function useGlobalStates() {
  const refreshStatus = useRef({
    pauseAutoRefresh: false,
    fetching: false,
    lastUpdate: 0,
    lastAutoUpdate: 0,
    lastUpdateSuccess: false,
    lastAccount: '',
  })
  const [lastAutoRefresh, triggerAutoRefresh] = useState(0)

  const wallet = useClientWallet()
  const [fullState, dispatch] = useReducer(GlobalReducer, initState)

  const tokenPMT = usePMT(fullState.network.defaultProvider) as null | {
    balanceOf: (account: string) => Promise<BigNumber>
    approve: (spender: string, amount: BigNumberish) => Promise<ContractTransaction>
    filters: {
      Transfer: (from: string | null, to: string | null) => any
    }
    queryFilter: (
      event: string,
      fromBlockOrBlockHash?: string | number,
      toBlock?: number
    ) => Promise<ContractEvent[]>
  }

  const game = useSlotMachine(fullState.network.defaultProvider) as null | {
    play: (settings?: { value: BigNumberish, gasLimit: BigNumberish }) => Promise<ContractTransaction>
    unbox: (prize: BigNumberish, settings?: { gasLimit: BigNumberish }) => Promise<ContractTransaction>
    queryFilter: (
      event: string,
      fromBlockOrBlockHash?: string | number,
      toBlock?: number
    ) => Promise<ContractEvent[]>
  }

  const readonlyPMT = usePMT(fullState.network.providers.readonly)
  const readonlySlotMachine = useSlotMachine(fullState.network.providers.readonly)

  const play = useCallback(async (bet: number) => {
    if (wallet.status !== 'connected') throw new Error('Unable to play game before connecting')
    if (!game) throw new Error('Contract disconnected')
    refreshStatus.current.pauseAutoRefresh = true

    debug('Play -- bet amount: %d', bet)

    const { wait } = await game?.play({
      value: ethers.utils.parseEther(bet.toString()),
      gasLimit: 1000000
    })

    const { events = [] } = await wait(1)

    debug('Play -- receive events: %o', events)

    const event = events.find(({ event }) => event === 'Play')
    refreshStatus.current.pauseAutoRefresh = false

    // Contract didn't emit Play event correctly.
    // Possible reasons:
    //   - could be the Vault liquidity too low.
    //   - out of gas
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

    debug(
      'Play -- %s | %s | %s',
      fullState.configs.game.symbolNames[left.toString()],
      fullState.configs.game.symbolNames[mid.toString()],
      fullState.configs.game.symbolNames[right.toString()],
    )

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
    refreshStatus.current.pauseAutoRefresh = true
    debug('Unbox -- current prize: %s', prize.toString())

    const { wait } = await game?.unbox(prize, {
      gasLimit: 1000000,
    })
    refreshStatus.current.pauseAutoRefresh = false

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

  const queryUnboxHistory = useCallback(async () => {
    if (!readonlySlotMachine || !readonlyPMT) throw new Error('Contract disconnected')

    const { blockNumber } = fullState.network

    const burnedEvents = readonlyPMT.queryFilter(
      readonlyPMT.filters.Transfer(null, constants.AddressZero),
      blockNumber - 86400 * 2,
      blockNumber
    )

    const successUnboxEvents = readonlySlotMachine.queryFilter(
      readonlySlotMachine.filters.Unbox(),
      blockNumber - 86400 * 2,
      blockNumber
    )

    return Promise.all([
      burnedEvents,
      successUnboxEvents,
    ]).then(([burned, unbox]) => {
      // { [blockNumber]: { from, earned } }
      const history = Object.fromEntries(
        burned
          .filter(ev => ev.args!.value.eq(fullState.game.unboxFee))
          .map(ev => [ev.blockNumber, { from: ev.args!.from, earned: null }])
      )

      return unbox.reduce((all, ev) => Object.assign(all, {
        [ev.blockNumber]: {
          ...(all[ev.blockNumber] ?? null),
          from: ev.args!.player,
          earned: ev.args!.payment,
        },
      }), history)
    }).then((history) => {
      dispatch({
        type: 'UNBOX_EVENTS',
        payload: Object
          .entries(history)
          .map(([blockNumber, { from, earned }]) => ({
            blockNumber: parseInt(blockNumber, 10),
            from,
            earned,
          }))
          .reverse()
      })
    }).catch((e) => { console.error('Query unbox records failure', e) })
  }, [
    readonlyPMT,
    readonlySlotMachine,
    fullState.game.unboxFee,
    fullState.network,
  ])

  const setConnection = useCallback(async (method: keyof Connectors | '') => {
    debug('switch connection to: %s', method)
    if (method !== '') {
      try {
        await wallet.connect(method)
        dispatch({
          type: 'NETWORK_ERROR',
          payload: null,
        })
      } catch (error) {
        debug('Set connection error: %o', error)
        dispatch({
          type: 'NETWORK_ERROR',
          payload: error,
        })
      }
    } else {
      dispatch({
        type: 'SET_PROVIDER',
        payload: {
          isReadOnly: true,
          defaultProvider: fullState.network.providers.readonly,
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
          dispatch({
            type: 'NETWORK_ERROR',
            payload: error,
          })
        })
    }
  }, [])

  const approvePMT = useCallback(async () => {
    if (wallet.status !== 'connected') throw new Error('Unable to approve before connecting')
    if (!tokenPMT) throw new Error('Contract disconnected')

    debug('Approve DP')
    const gameAddress = fullState.configs.contract.SlotMachine
    const { wait } = await tokenPMT?.approve(gameAddress, ethers.constants.MaxUint256)

    const { events = [] } = await wait(1)

    debug('Approve DP -- receive events: %o', events)

    return events.some(({ event }) => event === 'Approval')
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [fullState.network.defaultProvider])

  const refreshGameInfo = useCallback(() => {
    const { current } = refreshStatus

    const gameAddress = fullState.configs.contract.SlotMachine
    const tokenAddress = fullState.configs.token.P.address
    const userAddress = wallet.account ?? ''
    const multicallAddress = fullState.configs.contract.Multicall2

    if (
      Date.now() - current.lastUpdate < 1000
      && current.lastUpdateSuccess
      && current.lastAccount === userAddress
    ) return Promise.reject('too soon')

    const multicall = new Multicall({
      ethersProvider: fullState.network.providers.readonly,
      tryAggregate: true,
      multicallCustomContractAddress: multicallAddress,
    })

    const requests: ContractCallContext[] = [
      {
        reference: 'gameUnboxFee',
        contractAddress: gameAddress,
        abi: AbiGame,
        calls: [{ reference: 'unboxingFee', methodName: 'unboxingFee', methodParameters: [] }],
      },
      {
        reference: 'gameAcculatedPrize',
        abi: AbiMulticall2,
        contractAddress: multicallAddress,
        calls: [
          { reference: 'game', methodName: 'getEthBalance', methodParameters: [gameAddress] },
        ],
      },
      {
        reference: 'chain',
        abi: AbiMulticall2,
        contractAddress: multicallAddress,
        calls: [
          { reference: 'blockNumber', methodName: 'getBlockNumber', methodParameters: [] },
        ],
      },
    ]

    if (userAddress) {
      requests.push({
        reference: 'PMT',
        contractAddress: tokenAddress,
        abi: AbiERC20,
        calls: [
          { reference: 'allowance', methodName: 'allowance', methodParameters: [userAddress, gameAddress] },
          { reference: 'balance', methodName: 'balanceOf', methodParameters: [userAddress] },
        ],
      }, {
        reference: 'TT',
        abi: AbiMulticall2,
        contractAddress: multicallAddress,
        calls: [
          { reference: 'user', methodName: 'getEthBalance', methodParameters: [userAddress] },
        ],
      })
    }

    Object.assign(current, {
      fetching: true,
      lastAccount: userAddress,
      lastSuccess: false,
      lastUpdate: Date.now(),
    })

    return multicall
      .call(requests)
      .then(({ results: { gameUnboxFee, gameAcculatedPrize, PMT, TT, chain } }) => {
        const game: any = {}
        const balances: any = {}

        if (gameUnboxFee.callsReturnContext[0].success) game.unboxFee = ethers.BigNumber.from(gameUnboxFee.callsReturnContext[0].returnValues[0])
        if (gameAcculatedPrize.callsReturnContext[0].success) game.acculatedPrize = ethers.BigNumber.from(gameAcculatedPrize.callsReturnContext[0].returnValues[0])

        const [allowance, balancePMT] = PMT?.callsReturnContext ?? []
        if (allowance?.success) game.dpAllowance = ethers.BigNumber.from(allowance.returnValues[0])
        if (balancePMT?.success) balances.P = { amount: ethers.BigNumber.from(balancePMT.returnValues[0]), display: formatToken(balancePMT.returnValues[0]) }

        const [balanceTT] = TT?.callsReturnContext ?? []
        if (balanceTT?.success) balances.TT = { amount: ethers.BigNumber.from(balanceTT.returnValues[0]), display: formatToken(balanceTT.returnValues[0]) }

        dispatch({
          type: 'GAME_STATE',
          payload: {
            game,
            balances,
            network: chain.callsReturnContext[0].success
              ? { blockNumber: ethers.BigNumber.from(chain.callsReturnContext[0].returnValues[0]).toNumber() }
              : null,
          },
        })
      })
      .then(() => {
        Object.assign(current, {
          fetching: false,
          lastAccount: userAddress,
          lastSuccess: true,
          lastUpdate: Date.now(),
        })
      })
      .catch(() => {
        Object.assign(current, {
          fetching: false,
          lastAccount: userAddress,
          lastSuccess: false,
          lastUpdate: Date.now(),
        })
      })
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [fullState.network.defaultProvider])

  const showError = useCallback((error: Error | string) => dispatch({ type: 'ERROR', payload: error }), [])
  const clearError = useCallback(() => dispatch({ type: 'ERROR', payload: null }), [])

  // on wallet initialized
  useEffect(() => {
    refreshGameInfo()
      .catch((e) => debug('Refresh game info on initialing failure, error: %s', e))
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [fullState.network.defaultProvider])

  // update default provider
  useEffect(() => {
    if (wallet.status === 'connected') {
      const { ethereum } = wallet
      const provider = new ethers.providers.Web3Provider(ethereum as ExternalProvider)
      const signer = provider.getSigner().connectUnchecked()
      dispatch({
        type: 'SET_PROVIDER',
        payload: {
          providers: {
            web3: provider,
          },
          isReadOnly: false,
          defaultProvider: signer,
        },
      })
    } else if (fullState.network.defaultProvider !== fullState.network.providers.readonly) {
      dispatch({
        type: 'SET_PROVIDER',
        payload: {
          defaultProvider: fullState.network.providers.readonly,
          isReadOnly: true,
        },
      })
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [wallet.status])

  // auto refresh
  useEffect(() => {
    if (!document.hidden
      && !refreshStatus.current.pauseAutoRefresh
      && refreshStatus.current.lastUpdate + REFRESH_TIMEOUT < Date.now()
    ) {
      refreshGameInfo()
        .then(() => {
          refreshStatus.current.lastAutoUpdate = Date.now()
        })
        .catch((e) => debug('Auto refresh failure, error: %s', e))
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [lastAutoRefresh])

  useEffect(() => {
    const timer = window.setInterval(() => {
      triggerAutoRefresh(Date.now())
    }, REFRESH_TIMEOUT)
    return () => window.clearInterval(timer)
  }, [])

  return {
    ...fullState,
    wallet,
    actions: {
      switchNetwork,
      setConnection,
      refreshGameInfo,
      play,
      approvePMT,
      unbox,
      showError,
      clearError,
      queryUnboxHistory,
    },
  }
}
