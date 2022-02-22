import { useCallback, useEffect, useMemo, useState } from 'react'
import Container from '@material-ui/core/Container'
import { useERC20Contract, useNPoolContract } from 'hooks/useContract'
import { useGetUserTT20Balance } from 'hooks/useGetUserTT20Balance'
import Button from 'components/Button'
import { networkID } from 'utils/helpers'
import { bigZero, ether, fromUnits, toUnits, toWei } from 'utils/ethers'
import { BigNumber } from 'ethers'
import { ReactComponent as Arrows } from 'assets/arrows.svg'
import Approval from 'components/Button/Approval'
import { useTokenContext } from 'context/Tokens'
import { useGetAllowance } from 'hooks/useGetAllowance'
import { usePoolsContext } from 'context/Pools'
import Snackbar, { Status } from 'components/Snackbar'
import useStyles from './Swap.styles'
import TokenTrade from './TokenTrade'
import { calcWithSlippage, slippageConfig } from 'utils/calculations'
import { contractAddresses } from 'constants/index'
import { sendGAEvent } from 'utils/ga'
interface ISwapOption {
  amount: string
  token: string
  userBalance: BigNumber
  id: string
}

enum Order {
  Normal = 0,
  Reversed = 1,
}

const tokenAddrs = contractAddresses[networkID]

const defaultPool = '3 Acorn'

export default function Swap() {
  const classes = useStyles()
  const nPool = useNPoolContract()
  const tokenContext = useTokenContext()
  const [isLoading, setisLoading] = useState(false)
  const [snackbarStatus, setsnackbarStatus] = useState(Status.close)
  const { pools: poolContext } = usePoolsContext()
  const [order, setorder] = useState<Order>(Order.Normal)
  const poolTokenIndexMap = useMemo(
    (): { [token: string]: number } =>
      poolContext[defaultPool].coins.reduce(
        (accu, cur) => ({
          ...accu,
          [cur.token]: cur.index,
        }),
        {}
      ),
    [poolContext]
  )
  const [swapOption, setswapOption] = useState<{ [key: string]: ISwapOption }>({
    index0: {
      amount: '0',
      token: 'usdt',
      userBalance: bigZero,
      id: 'index0',
    },
    index1: {
      amount: '0',
      token: 'usdc',
      userBalance: bigZero,
      id: 'index1',
    },
  })
  const index0Contract = useERC20Contract(
    tokenAddrs[swapOption.index0.token].address
  )
  const index1Contract = useERC20Contract(
    tokenAddrs[swapOption.index1.token].address
  )
  const index0 = {
    ...swapOption.index0,
    contract: index0Contract,
    address: tokenAddrs[swapOption.index0.token].address,
    poolIndex: poolTokenIndexMap[swapOption.index0.token],
  }
  const index1 = {
    ...swapOption.index1,
    contract: index1Contract,
    address: tokenAddrs[swapOption.index1.token].address,
    poolIndex: poolTokenIndexMap[swapOption.index1.token],
  }
  const orderedOptions =
    order === Order.Normal
      ? {
          input: index0,
          output: index1,
        }
      : { input: index1, output: index0 }

  const exFee = useMemo(() => {
    if (!orderedOptions.input.amount || orderedOptions.input.amount === '0')
      return '1: 1'
    const div = (
      Number(orderedOptions.output.amount) / Number(orderedOptions.input.amount)
    ).toFixed(4)
    return `1: ${div}`
  }, [orderedOptions.input.amount, orderedOptions.output.amount])

  const { allowance, getAllowance } = useGetAllowance({
    tokenAddress: orderedOptions.input.address,
    allowAddress: nPool!.address,
  })

  const updateBalance = (val: BigNumber, field: string) =>
    setswapOption((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        userBalance: val,
      },
    }))

  const getUserInputBalance = useGetUserTT20Balance(
    useCallback(
      (val: BigNumber) => updateBalance(val, orderedOptions.input.id),
      [orderedOptions.input.id]
    ),
    orderedOptions.input.contract
  )
  const getUserOutputBalance = useGetUserTT20Balance(
    useCallback(
      (val: BigNumber) => updateBalance(val, orderedOptions.output.id),
      [orderedOptions.output.id]
    ),
    orderedOptions.output.contract
  )
  // console.log('swapOption:', swapOption)

  const onLinkClick = (id: string) => {
    sendGAEvent('swap', id)
  }

  useEffect(() => {
    if (orderedOptions.input.token === orderedOptions.output.token) {
      // change output token
      const { id: optionToChangeID, token } = orderedOptions.output
      const differentToken = Object.keys(tokenContext).find(
        (item) => item !== token
      ) as string
      setswapOption((prev) => ({
        ...prev,
        [optionToChangeID]: {
          ...prev[optionToChangeID],
          token: differentToken,
        },
      }))
    }
  }, [orderedOptions.input.token, orderedOptions.output, tokenContext])

  useEffect(() => {
    const getOutputAmount = async () => {
      if (
        orderedOptions.input.amount &&
        orderedOptions.input.amount !== '0' &&
        orderedOptions.input.token !== orderedOptions.output.token
      ) {
        const amount = toUnits(
          orderedOptions.input.amount,
          tokenContext[orderedOptions.input.token].decimals
        )
        if (nPool && amount.gt(bigZero)) {
          try {
            const outputAmount = await nPool.get_dy(
              orderedOptions.input.poolIndex,
              orderedOptions.output.poolIndex,
              amount
            )
            setswapOption((prev) => ({
              ...prev,
              [orderedOptions.output.id]: {
                ...prev[orderedOptions.output.id],
                amount: fromUnits(
                  outputAmount,
                  tokenContext[orderedOptions.output.token].decimals
                ),
              },
            }))
          } catch (error) {
            console.log('error:', error)
          }
        }
      } else {
        setswapOption((prev) => ({
          ...prev,
          [orderedOptions.output.id]: {
            ...prev[orderedOptions.output.id],
            amount: '0',
          },
        }))
      }
    }
    getOutputAmount()
  }, [
    nPool,
    orderedOptions.input.amount,
    orderedOptions.input.token,
    orderedOptions.output.token,
    orderedOptions.input.poolIndex,
    orderedOptions.output.poolIndex,
    orderedOptions.output.id,
    tokenContext,
  ])

  const submitButtonStatus = useMemo((): string => {
    if (orderedOptions.input.amount) {
      const { decimals } = tokenContext[orderedOptions.input.token]
      const value = toWei(orderedOptions.input.amount)
      // check balance
      const balanceInWei = orderedOptions.input.userBalance
        .mul(ether)
        .div(decimals)
      if (value.gt(balanceInWei))
        return `Insufficient Balance: ${orderedOptions.input.token.toUpperCase()}`
      // check allowance
      const allowanceInWei = allowance.mul(ether).div(decimals)
      if (value.gt(allowanceInWei))
        return `Approve ${orderedOptions.input.token.toUpperCase()}`
    }
    return 'Swap'
  }, [
    orderedOptions.input.amount,
    allowance,
    orderedOptions.input.token,
    orderedOptions.input.userBalance,
    tokenContext,
  ])

  const swap = async () => {
    try {
      setisLoading(true)
      const minDy = calcWithSlippage(
        toUnits(
          orderedOptions.output.amount,
          tokenContext[orderedOptions.output.token].decimals
        )
      )
      const tx = await nPool!.exchange(
        orderedOptions.input.poolIndex,
        orderedOptions.output.poolIndex,
        toUnits(
          orderedOptions.input.amount,
          tokenContext[orderedOptions.input.token].decimals
        ),
        minDy
      )
      await tx.wait()
      getUserInputBalance()
      getUserOutputBalance()
      setsnackbarStatus(Status.success)
      setswapOption((prev) => ({
        index0: {
          ...prev.index0,
          amount: '0',
        },
        index1: {
          ...prev.index1,
          amount: '0',
        },
      }))
    } catch (error) {
      console.log('error:', error)
      setsnackbarStatus(Status.fail)
    } finally {
      setisLoading(false)
    }
  }
  const handleOrder = () =>
    setorder((prev) => (prev === Order.Normal ? Order.Reversed : Order.Normal))

  return (
    <Container maxWidth="lg">
      <Snackbar
        open={snackbarStatus !== Status.close}
        handleClose={() => {
          setsnackbarStatus(Status.close)
        }}
        time={3000}
        status={snackbarStatus}
      />
      <h2>SWAP</h2>
      <div className={classes.root}>
        <div className={classes.exchange}>
          <TokenTrade
            type={'input'}
            option={orderedOptions.input}
            setOption={setswapOption}
          />
          <div className={classes.arrowButtonWrapper} onClick={handleOrder}>
            <button className={classes.arrowButton}>
              <Arrows />
            </button>
          </div>
          <TokenTrade
            type={'output'}
            option={orderedOptions.output}
            setOption={setswapOption}
          />
        </div>
        <div className={classes.swapInfo}>
          <p>
            <span>{`Exchange Rate ${orderedOptions.input.token.toUpperCase()}/${orderedOptions.output.token.toUpperCase()} (including fees):`}</span>
            <span className={classes.primeColor}>{` ${exFee}`}</span>
          </p>
          <p>
            {`Max slippage:${
              ((slippageConfig.denominator - slippageConfig.nominator) /
                slippageConfig.denominator) *
              100
            }%`}
          </p>
        </div>
        {submitButtonStatus.includes('Approve') ? (
          <Approval
            className={classes.submit}
            contract={
              tokenContext[submitButtonStatus.split(' ')[1].toLowerCase()]
                .contract
            }
            allowAddress={nPool!.address}
            setsnackbarStatus={() => setsnackbarStatus(Status.unlock)}
            approveText={submitButtonStatus}
            callback={getAllowance}
          />
        ) : (
          <Button
            className={classes.submit}
            onClick={() => {
              onLinkClick('swap')
              swap()
            }}
            isLoading={isLoading}
          >
            {submitButtonStatus}
          </Button>
        )}
      </div>
    </Container>
  )
}
