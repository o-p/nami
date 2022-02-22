import React from 'react'
import Select from 'components/Select'
import Input from 'components/Input'
import { strToFixed } from 'utils/helpers'
import { fromUnits } from 'utils/ethers'
import { BigNumber } from 'ethers'
import TokenSelect from 'components/Select/TokenSelect'
import { useTokenContext } from 'context/Tokens'
import { usePoolsContext } from 'context/Pools'
import useStyles from './Swap.styles'

interface ISwapOption {
  amount: string
  token: string
  userBalance: BigNumber
  id: string
}

type TradeType = 'input' | 'output'

const defaultPool = '3 Acorn'

export default function TokenTrade({
  type,
  option,
  setOption,
}: {
  type: TradeType
  option: ISwapOption
  setOption: React.Dispatch<
    React.SetStateAction<{
      [key: string]: ISwapOption
    }>
  >
}) {
  const classes = useStyles()
  const tokenContext = useTokenContext()
  const { pools: pool } = usePoolsContext()
  const tokenInfo = tokenContext[option.token]
  const { id } = option
  const maxAmt = fromUnits(
    option.userBalance,
    tokenInfo ? tokenInfo.decimals : 18
  )
  const handleInputChange = (
    e: React.ChangeEvent<any>,
    field: 'amount' | 'token'
  ) => {
    setOption((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: e.target.value,
      },
    }))
  }

  const onInputMax = () => {
    setOption((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        amount: maxAmt,
      },
    }))
  }

  return (
    <div className={classes.tokenTrade}>
      <h5 className={classes.balanceHeader}>
        <span>BALANCE</span>
        <span className={classes.primeColor}>{` ${strToFixed(maxAmt)} `}</span>
        <span>${option.token.toUpperCase()}</span>
      </h5>
      <div className={classes.inputs}>
        <Select
          id={id}
          value={option.token}
          onChange={(e) => handleInputChange(e, 'token')}
          options={pool[defaultPool].coins.map((item) => ({
            value: item.token,
            content: <TokenSelect token={item.token.toUpperCase()} />,
          }))}
        />
        <div className={classes.amountInputContainer}>
          <Input
            className={classes.amountInput}
            id={id}
            value={option.amount}
            disabled={type === 'output'}
            onChange={(e: React.ChangeEvent) => handleInputChange(e, 'amount')}
          />
          {type === 'input' && (
            <button className={classes.maxButton} onClick={onInputMax}>
              MAX
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
