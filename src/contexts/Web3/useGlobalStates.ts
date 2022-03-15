import { useState, useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import { useWallet, Connectors, Wallet } from 'use-wallet'
import { BigNumber, BigNumberish, ethers } from 'ethers'
import { ExternalProvider } from '@ethersproject/providers'
import { ContractTransaction } from '@ethersproject/contracts'

import {
  Multicall,
  ContractCallContext,
} from 'ethereum-multicall';

import configs, { config } from 'configs'
import useThunderHub from './useThunderHub'
import {
  PlayEvent,
  UnboxEvent,
  useP,
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

const formatToken = formatWei()
const REFRESH_TIMEOUT = 10000
export default function useGlobalStates() {
  const refreshStatus = useRef({
    fetching: false,
    lastUpdate: 0,
    lastAutoUpdate: 0,
    lastUpdateSuccess: false,
    lastAccount: '',
  })
  const [lastAutoRefresh, triggerAutoRefresh] = useState(0)

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
    play: (settings?: { value: BigNumberish, gasLimit: BigNumberish }) => Promise<ContractTransaction>
    unbox: (prize: BigNumberish, settings?: { gasLimit: BigNumberish }) => Promise<ContractTransaction>
  }

  const play = useCallback(async (bet: number) => {
    if (wallet.status !== 'connected') throw new Error('Unable to play game before connecting')
    if (!game) throw new Error('Contract disconnected')

    debug('Play -- bet amount: %d', bet)

    const { wait } = await game?.play({
      value: ethers.utils.parseEther(bet.toString()),
      gasLimit: 500000,
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

    const { wait } = await game?.unbox(prize, {
      gasLimit: 500000,
    })

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
    const { current } = refreshStatus

    const gameAddress = fullState.configs.contract.SlotMachine
    const tokenAddress = fullState.configs.token.P.address
    const userAddress = wallet.account ?? ''
    const multicallAddress = fullState.configs.contract.Multicall2

    // if (current.fetching) return Promise.reject('fetching')
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
      }
    ]

    if (userAddress) {
      requests.push({
        reference: 'P',
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
      .then(({ results: { gameUnboxFee, gameAcculatedPrize, P, TT } }) => {
        const game = { ...fullState.game }
        const balanceP = { ...fullState.balances.P }
        const balanceTT = { ...fullState.balances.TT }

        if (gameUnboxFee.callsReturnContext[0].success) game.unboxFee = ethers.BigNumber.from(gameUnboxFee.callsReturnContext[0].returnValues[0])
        if (gameAcculatedPrize.callsReturnContext[0].success) game.acculatedPrize = ethers.BigNumber.from(gameAcculatedPrize.callsReturnContext[0].returnValues[0])

        const [allowance, balanceOfP] = P?.callsReturnContext ?? []
        if (allowance?.success) game.dpAllowance = allowance.returnValues[0]
        if (balanceOfP?.success) Object.assign(balanceP, { amount: ethers.BigNumber.from(balanceOfP.returnValues[0]), display: formatToken(balanceOfP.returnValues[0]) })

        const [balanceOfTT] = TT?.callsReturnContext ?? []
        if (balanceOfTT?.success) Object.assign(balanceTT, { amount: ethers.BigNumber.from(balanceOfTT.returnValues[0]), display: formatToken(balanceOfTT.returnValues[0]) })

        changeState({
          game,
          balances: {
            ...fullState.balances,
            P: balanceP,
            TT: balanceTT,
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

  // auto refresh
  useEffect(() => {
    if (!document.hidden
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
      approveDP,
      unbox,
    },
  }
}
