import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Accordion from 'components/Accordion'
import Tabs from 'components/Tabs'
import Input from 'components/Input'
import Button from 'components/Button'
import {
  bigZero,
  ether,
  fromUnits,
  toBN,
  toEther,
  toUnits,
  toWei,
} from 'utils/ethers'
import TokenIcon from 'components/TokenIcons/TokenIcon'
import { useUserPoolInfo } from 'hooks/useUserPoolInfo'
import { useTokenContext } from 'context/Tokens'
import Approval from 'components/Button/Approval'
import { IToken } from 'context/Tokens/Context'
import { IPoolData } from 'context/Pools/Types'
import { Status } from 'components/Snackbar'
import { formatDollarString, networkID, strToFixed } from 'utils/helpers'
import useDebounce from 'hooks/useDebounce'
import { BigNumber } from '@ethersproject/bignumber'
import useStyles from './Pools.styles'
import Stake from '../Stake/Stake'
import {
  calcFee,
  calcPriceImpact,
  calcWithSlippage,
  slippageConfig,
} from 'utils/calculations'
import { vaultPid } from 'constants/index'
import { usePoolsContext } from 'context/Pools'
import { useUserContext } from 'context/User'
import { useVaultsContext } from 'context/Vaults'
import { useGetStakingAPY } from 'hooks/useGetStakingAPY'
import { sendGAEvent } from 'utils/ga'

interface IPoolParams {
  item: IPoolData
  poolIndex: number
  setsnackbarStatus: React.Dispatch<React.SetStateAction<Status>>
}

type IPoolTabs = 'deposit' | 'withdraw'

const tabs = {
  deposit: 'deposit',
  withdraw: 'withdraw',
}

export default function Pool({
  item,
  poolIndex,
  setsnackbarStatus,
}: IPoolParams) {
  const classes = useStyles()
  const [activeTab, setactiveTab] = useState<IPoolTabs>('deposit')
  const [activeAccordion, setactiveAccordion] = useState(-1)
  const tokenContext = useTokenContext()
  const [isLoading, setisLoading] = useState(false)
  const [estimatedTokenGet, setestimatedTokenGet] = useState('0')
  const [disabledMaxButton, setdisabledMaxButton] = useState(-1)
  const [priceImpact, setpriceImpact] = useState('0')
  const [isWithdrawOneCoinIndex, setisWithdrawOneCoinIndex] = useState(-1)
  const priceImpactRestraint = Number(priceImpact) < -15
  const [fee, setfee] = useState('0')
  const { getAllPools } = usePoolsContext()
  const { accountPoolInfo, getAccountPoolInfo } = useUserPoolInfo(item)
  const {
    portfolio: { getPoolDeposits, getAcornsEarned, getUserStaking },
  } = useUserContext()
  const { getAllVaults } = useVaultsContext()
  const pid = vaultPid[networkID][item.poolTokenName]
  const { stakingAPY } = useGetStakingAPY(pid)
  const poolTokens = item.coins.map((coin) => tokenContext[coin.token])
  const tvl = toEther(item.tvl)
  const initInputVals = poolTokens.reduce((accu, cur: IToken) => {
    return {
      ...accu,
      [cur.name]: '0',
    }
  }, {})
  const [inputVals, setinputVals] =
    useState<{ [key: string]: string }>(initInputVals)
  const accountLPBalance = accountPoolInfo[item.poolTokenName]
    ? accountPoolInfo[item.poolTokenName].balance
    : bigZero

  const handleTabChange = (event: React.ChangeEvent<{}>, value: any) => {
    setactiveTab(value)
    setinputVals(initInputVals)
  }

  const handleButtonClick = async () => {
    sendGAEvent('submit btn', activeTab)

    const amounts = poolTokens.map((token) =>
      toUnits(inputVals[token.name] || '0', token.decimals)
    )
    const method =
      activeTab === 'deposit'
        ? 'add_liquidity'
        : isWithdrawOneCoinIndex >= 0
        ? 'remove_liquidity_one_coin'
        : 'remove_liquidity_imbalance'

    try {
      let tx
      setisLoading(true)
      // estimatedAmount = minMint or maxBurn
      const estimatedAmount = calcWithSlippage(
        toBN(estimatedTokenGet),
        activeTab === 'withdraw'
      )

      if (method === 'remove_liquidity_one_coin') {
        const token = item.coins[isWithdrawOneCoinIndex].token
        const { decimals } = tokenContext[token]
        const tokenAmount = toUnits(inputVals[token], decimals)
        const minAmount = calcWithSlippage(tokenAmount)
        tx = await item.contract[method](
          accountLPBalance,
          isWithdrawOneCoinIndex,
          minAmount
        )
      } else {
        tx = await item.contract[method](amounts, estimatedAmount)
      }
      await tx.wait()
      getAccountPoolInfo()
      getPoolDeposits()
      getUserStaking()
      getAcornsEarned()
      getAllPools()
      getAllVaults()
      setisWithdrawOneCoinIndex(-1)
      setsnackbarStatus(Status.success)
      setinputVals(initInputVals)
    } catch (error) {
      console.log('error:', error)
      setsnackbarStatus(Status.fail)
    } finally {
      setisLoading(false)
    }
  }

  const onInputChange = (e: React.ChangeEvent<any>, token: string) => {
    setisWithdrawOneCoinIndex(-1)
    setpriceImpact('0')
    setinputVals((prev) => ({
      ...prev,
      [token]: e.target.value,
    }))
  }

  const debouncedInputVals = useDebounce(inputVals, 500)
  useEffect(() => {
    const getEstimations = async () => {
      try {
        const amounts = poolTokens.map((token) =>
          toUnits(debouncedInputVals[token.name] || '0', token.decimals)
        )
        const calculated = await item.contract.calc_token_amount(
          amounts,
          activeTab === 'deposit'
        )
        const { idealTokenGet, liquidityChange, tokenGet } = calculated
        setestimatedTokenGet(tokenGet.toString())
        const estimatedPriceImpact = calcPriceImpact({
          amounts,
          liquidityChange,
          poolTokens,
          method: activeTab,
        })
        setpriceImpact(estimatedPriceImpact)
        const estimatedFee = calcFee(
          tokenGet,
          idealTokenGet,
          item.virtualPrice,
          activeTab
        )
        setfee(estimatedFee)
      } catch (error) {
        console.log('error:', error)
      }
    }
    getEstimations()
  }, [debouncedInputVals, item.contract, activeTab, item.virtualPrice])

  const submitButtonStatus = useMemo((): string => {
    const handleAddLiquidity = (): string => {
      for (const { name: token } of poolTokens) {
        // calc in 1e18 to avoid invalid Bignumber
        const { decimals } = tokenContext[token]
        const value = toWei(debouncedInputVals[token])
        // check balance
        const balanceInWei = accountPoolInfo[token].balance
          .mul(ether)
          .div(toBN('10').pow(decimals))
        if (value.gt(balanceInWei))
          return `Insufficient Balance: ${token.toUpperCase()}`
        // check allowance
        const allowanceInWei = accountPoolInfo[token].allowance
          .mul(ether)
          .div(toBN('10').pow(decimals))
        if (value.gt(allowanceInWei)) return `Approve ${token.toUpperCase()}`
      }
      return activeTab
    }
    const handleWithdraw = (): string => {
      for (const [index, poolToken] of Object.entries(poolTokens)) {
        const token = poolToken.name
        // // calc in 1e18 to avoid invalid Bignumber
        const { decimals } = tokenContext[token]
        const value = toWei(debouncedInputVals[token])
        // // pool insufficient liquidity
        const poolBalanceInWei = item.poolBalances[Number(index)]
          .mul(ether)
          .div(toBN('10').pow(decimals))
        if (value.gt(poolBalanceInWei)) return `Pool Insufficient Balance`
        // // user insufficient liquidity - tokenGet not over LP balance
        // // estimatedTokenGet - token to burn from user
        else if (
          toBN(estimatedTokenGet).gt(
            accountPoolInfo[item.poolTokenName].balance
          )
        ) {
          return `Insufficient Balance`
        }
      }
      return activeTab
    }

    if (priceImpactRestraint) return 'Slippage too much!'
    else if (Object.keys(accountPoolInfo).length > 0) {
      return activeTab === 'deposit' ? handleAddLiquidity() : handleWithdraw()
    }
    return activeTab
  }, [
    accountPoolInfo,
    debouncedInputVals,
    tokenContext,
    activeTab,
    priceImpactRestraint,
    item.poolBalances,
    estimatedTokenGet,
    item.poolTokenName,
    poolTokens,
  ])
  // console.log('submitButtonStatus:', submitButtonStatus)

  const addMaxLiq = useCallback(
    async (token: IToken, idx: number) => {
      const LP_BALANCE_IS_ZERO =
        accountPoolInfo[item.poolTokenName].balance.isZero()
      if (activeTab === 'deposit') {
        setinputVals((prev) => ({
          ...prev,
          [token.name]: fromUnits(
            accountPoolInfo[token.name].balance,
            tokenContext[token.name].decimals
          ),
        }))
      } else if (!LP_BALANCE_IS_ZERO) {
        setisWithdrawOneCoinIndex(idx)
        setdisabledMaxButton(idx)
        const estimatedTokenWithdraws =
          await item.contract.calc_withdraw_one_coin(accountLPBalance, idx)
        const dy = estimatedTokenWithdraws[0] as BigNumber
        const poolBalance = item.poolBalances[idx]
        const cent = toBN('10').pow(token.decimals - 2)
        const maxAmount = dy.gte(poolBalance.sub(cent))
          ? poolBalance.sub(cent)
          : dy
        if (!maxAmount.isZero()) {
          setinputVals((prev) =>
            Object.keys(prev).reduce((accu: any, cur: string) => {
              if (cur === token.name) {
                accu[cur] = fromUnits(maxAmount, token.decimals)
              } else {
                accu[cur] = '0'
              }
              return accu
            }, {})
          )
        }
        setdisabledMaxButton(-1)
      }
    },
    [accountPoolInfo, activeTab, item, tokenContext]
  )

  const isSubmitDisabled = useMemo((): boolean => {
    if (submitButtonStatus.includes('Insufficient') || priceImpactRestraint)
      return true
    return false
  }, [submitButtonStatus, priceImpactRestraint])

  // const onCombineMax = () => {}

  return (
    <div className={classes.accordion}>
      <Accordion
        expanded={poolIndex === activeAccordion}
        title={
          <div
            className={classes.accordionTitle}
            onClick={() =>
              setactiveAccordion(activeAccordion === poolIndex ? -1 : poolIndex)
            }
          >
            <div>
              <h3>{item.poolTokenName.toUpperCase()}</h3>
              <div>
                {poolTokens.map((poolToken: IToken) => (
                  <TokenIcon
                    key={poolToken.name}
                    value={poolToken.name.toUpperCase()}
                  />
                ))}
              </div>
            </div>
            <div>
              <p>Total Value Locked: ${formatDollarString(tvl)}</p>
              <p>
                {`APR: ${strToFixed(
                  toEther(item.poolAPR.mul('100').mul('365'))
                )}%`}
              </p>
              <p>
                {`APR with Staking: ${strToFixed(
                  toEther(
                    toWei(stakingAPY).add(item.poolAPR.mul('100').mul('365'))
                  )
                )}%`}
              </p>
            </div>
          </div>
        }
      >
        <div className={classes.accordionContent}>
          <div className={classes.accordionContentSection}>
            <Tabs
              handleChange={handleTabChange}
              value={activeTab}
              tabs={tabs}
            />
            <div>
              <div className={classes.poolTokenBlock}>
                {poolTokens.map((token: IToken, idx: number) => (
                  <div
                    key={token.underlyingAddress}
                    className={classes.verticalCenter}
                  >
                    <div className={classes.verticalCenter}>
                      <TokenIcon
                        className={classes.rwdTokenIcon}
                        value={token.name.toUpperCase()}
                      />
                      <span>{token.name.toUpperCase()}</span>
                    </div>
                    <div className={classes.amountInput}>
                      <Input
                        id={`poolToken_${token.name}`}
                        value={inputVals[token.name]}
                        onChange={(e: React.ChangeEvent<any>) =>
                          onInputChange(e, token.name)
                        }
                      />
                      <Button
                        onClick={() => addMaxLiq(token, idx)}
                        disabled={disabledMaxButton === idx}
                        className={classes.balanceBtn}
                      >
                        {activeTab === 'deposit' ? (
                          <div className={classes.balanceContent}>
                            <span>balance</span>
                            <span>
                              {accountPoolInfo[token.name] &&
                                strToFixed(
                                  fromUnits(
                                    accountPoolInfo[token.name].balance,
                                    tokenContext[token.name].decimals
                                  )
                                )}
                            </span>
                          </div>
                        ) : (
                          'MAX'
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {/* {activeTab === 'withdraw' && (
		  <button className={classes.combineMax} onClick={onCombineMax}>
		    Combination Max
		  </button>
		)} */}
              <div className={classes.fees}>
                {activeTab === 'withdraw' && (
                  <h5>
                    Available:
                    <span className={classes.primeColor}>
                      {` ${formatDollarString(toEther(accountLPBalance))} LP`}
                    </span>
                  </h5>
                )}
                <h5>
                  <span>{`${
                    activeTab === 'deposit' ? 'Receive' : 'Transfer'
                  }: `}</span>
                  <span className={classes.primeColor}>
                    {`${formatDollarString(toEther(estimatedTokenGet))} LP`}
                  </span>
                </h5>
                <h5>
                  <span>{`${
                    priceImpact.startsWith('-') ? 'Price impact' : 'Bonus'
                  }: `}</span>
                  <span className={classes.primeColor}>
                    {priceImpact.startsWith('-')
                      ? priceImpact.slice(1)
                      : priceImpact}
                    %
                  </span>
                </h5>
                <h5>Fee: ${fee}</h5>
                <h5>{`Max slippage:${
                  ((slippageConfig.denominator - slippageConfig.nominator) /
                    slippageConfig.denominator) *
                  100
                }%`}</h5>
              </div>
              {submitButtonStatus.includes('Approve') ? (
                <Approval
                  contract={
                    tokenContext[submitButtonStatus.split(' ')[1].toLowerCase()]
                      .contract
                  }
                  allowAddress={item.contract.address}
                  setsnackbarStatus={() => setsnackbarStatus(Status.unlock)}
                  approveText={submitButtonStatus}
                  callback={getAccountPoolInfo}
                  className={classes.fullWidthBtn}
                />
              ) : (
                <Button
                  className={classes.fullWidthBtn}
                  onClick={handleButtonClick}
                  disabled={isSubmitDisabled}
                  isLoading={isLoading}
                >
                  {submitButtonStatus}
                </Button>
              )}
            </div>
          </div>
          <Stake
            poolName={item.poolTokenName}
            pid={pid}
            setsnackbarStatus={setsnackbarStatus}
            lpContract={item.contract}
          />
        </div>
      </Accordion>
      <div
        className={classes.accordionTail}
        onClick={() =>
          setactiveAccordion(activeAccordion === poolIndex ? -1 : poolIndex)
        }
      >
        <span
          className={`${classes.arrow} ${
            activeAccordion === poolIndex ? 'up' : 'down'
          }`}
        />
      </div>
    </div>
  )
}
