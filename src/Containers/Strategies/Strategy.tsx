import React, { useMemo, useState } from 'react'
import Accordion from 'components/Accordion'
import Tabs from 'components/Tabs'
import Input from 'components/Input'
import Button from 'components/Button'
import {
  bigOne,
  bigZero,
  ether,
  fromUnits,
  toBN,
  toEther,
  toUnits,
  toWei,
} from 'utils/ethers'
import TokenIcon from 'components/TokenIcons/TokenIcon'
import { useTokenContext } from 'context/Tokens'
import Approval from 'components/Button/Approval'
import { Status } from 'components/Snackbar'
import { formatDollarString, networkID, strToFixed } from 'utils/helpers'
import useStyles from 'Containers/Pools/Pools.styles'
import { contractAddresses, IAddress, vaultPid } from 'constants/index'
import { useStrategyContract } from 'hooks/useContract'
import { useGetUserBalance } from 'hooks/useGetUserBalance'
import { useGetAllowance } from 'hooks/useGetAllowance'
import Stake from 'Containers/Stake/Stake'
import { useGetStakingAPY } from 'hooks/useGetStakingAPY'
import { BigNumber } from 'ethers'
import { useGlobalsContext } from 'context/Globals'
import { useVaultsContext } from 'context/Vaults'
import { useStrategiesContext } from 'context/Strategies'
import { useUserContext } from 'context/User'
interface IPoolParams {
  item: IAddress
  setsnackbarStatus: React.Dispatch<React.SetStateAction<Status>>
  isExpanded: boolean
  setactiveAccordion: React.Dispatch<React.SetStateAction<number>>
  index: number
  assetName: string
}

type IPoolTabs = 'deposit' | 'withdraw'

const tabs = {
  deposit: 'deposit',
  withdraw: 'withdraw',
}

const gasLimit = 90000000
const lpDecimals = 18

export default function Strategy({
  item,
  assetName,
  index,
  setsnackbarStatus,
  isExpanded,
  setactiveAccordion,
}: IPoolParams) {
  const classes = useStyles()
  const [inputVals, setinputVals] = useState('0')
  const { tt } = useGlobalsContext()
  const userCtx = useUserContext()
  const { strategies, getStrategies } = useStrategiesContext()
  const strategy = strategies[item.name]
  const [activeTab, setactiveTab] = useState<IPoolTabs>('deposit')
  const tokenContext = useTokenContext()
  const [isLoading, setisLoading] = useState(false)
  const [isMax, setisMax] = useState(false)
  const underlyingToken = item.name.toLowerCase()
  const isNativeToken = underlyingToken === 'tt'
  const underlyingTokenAddress = !isNativeToken
    ? contractAddresses[networkID][underlyingToken].address
    : ''
  const pid = vaultPid[networkID][assetName]
  const { vaults } = useVaultsContext()
  const vault = vaults.find((v) => v.vaultName === assetName)
  const { stakingAPY, getAPY } = useGetStakingAPY(pid)
  const vPrice = vault!.virtualPrice
  const strategyContract = useStrategyContract(item.address)
  const { balance, getUserBalance } = useGetUserBalance(
    isNativeToken,
    underlyingTokenAddress
  )
  const { allowance, getAllowance } = useGetAllowance({
    isNativeToken,
    tokenAddress: underlyingTokenAddress,
    allowAddress: item.address,
  })
  const price = isNativeToken ? tt.price : tokenContext[item.name].price
  const underlyingDecimals = isNativeToken
    ? 18
    : tokenContext[item.name].decimals

  const handleTabChange = (event: React.ChangeEvent<{}>, value: any) => {
    setactiveTab(value)
    setinputVals('0')
  }
  const strategyTokenBalance = userCtx.portfolio.userVaults.assets[pid]
    ? userCtx.portfolio.userVaults.assets[pid].balance
    : bigZero

  const handleButtonClick = async () => {
    const method = activeTab === 'withdraw' && isMax ? 'burn' : activeTab
    const decimals = method === 'burn' ? lpDecimals : underlyingDecimals
    const amount = toUnits(inputVals || '0', decimals)
    const isDepositNativeToken = isNativeToken && method === 'deposit'
    try {
      setisLoading(true)
      const tx = isDepositNativeToken
        ? await strategyContract![method](amount, {
            value: amount,
          })
        : await strategyContract![method](amount, { gasLimit })
      await tx.wait()
      setsnackbarStatus(Status.success)
      userCtx.portfolio.getUserStaking()
      setinputVals('0')
      getAPY()
      getUserBalance()
      getStrategies()
    } catch (error) {
      console.log('error:', error)
      setsnackbarStatus(Status.fail)
    } finally {
      setisLoading(false)
    }
  }

  const onInputChange = (e: React.ChangeEvent<any>) => {
    if (isMax) setisMax(false)
    setinputVals(e.target.value)
  }

  const submitButtonStatus = useMemo((): string => {
    const allowanceInWei = isNativeToken
      ? bigZero
      : allowance
          .mul(ether)
          .div(toBN('10').pow(tokenContext[item.name].decimals))
    if (inputVals === '0') return 'Amount cannot be 0'
    if (
      !isNativeToken &&
      activeTab === 'deposit' &&
      toWei(inputVals).gt(allowanceInWei)
    )
      return `Approve ${item.name}`
    return activeTab
  }, [activeTab, allowance, tokenContext, item.name, inputVals, isNativeToken])

  const feeInToken = useMemo((): string => {
    if (strategy.denominator.isZero()) return '0'
    const feePercent = bigOne
      .mul(strategy.denominator)
      .sub(strategy.entranceFeeFactor)
    return fromUnits(
      toWei(inputVals).mul(feePercent).div(strategy.denominator),
      18
    )
  }, [strategy.denominator, inputVals, strategy.entranceFeeFactor])

  const apr = useMemo((): BigNumber => {
    // 1e18
    if (strategy.vPriceYesterday.isZero()) return bigZero
    return vPrice
      .sub(strategy.vPriceYesterday)
      .mul(ether)
      .mul(365)
      .mul(100)
      .div(strategy.vPriceYesterday)
  }, [vPrice, strategy.vPriceYesterday])

  const addMaxLiq = () => {
    setisMax(true)
    activeTab === 'deposit'
      ? setinputVals(fromUnits(balance, tokenContext[item.name].decimals))
      : setinputVals(toEther(strategyTokenBalance))
  }

  const isSubmitDisabled = useMemo((): boolean => {
    // if (submitButtonStatus.includes('Insufficient') || priceImpactRestraint)
    if (submitButtonStatus === activeTab) return false
    return true
  }, [submitButtonStatus, activeTab])

  return (
    <div className={classes.accordion}>
      <Accordion
        expanded={isExpanded}
        title={
          <div
            className={classes.accordionTitle}
            onClick={() =>
              setactiveAccordion((prev) => (prev === index ? -1 : index))
            }
          >
            <div className={classes.verticalCenter}>
              <TokenIcon value={item.name} />
              <h3>{item.name.toUpperCase()}</h3>
            </div>
            <div>
              <p>Total Value Locked: ${formatDollarString(strategy.tvl)}</p>
              <p>{`APR: ${strToFixed(toEther(apr))}%`}</p>
              <p>{`APR with Staking: ${strToFixed(
                toEther(toWei(stakingAPY).add(apr))
              )}%`}</p>
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
                <div key={item.address} className={classes.verticalCenter}>
                  <div className={classes.verticalCenter}>
                    <TokenIcon
                      className={classes.rwdTokenIcon}
                      value={item.name}
                    />
                    <span>{item.name.toUpperCase()}</span>
                  </div>
                  <div className={classes.amountInput}>
                    <Input
                      id={`poolToken_${item.name}`}
                      value={inputVals}
                      onChange={onInputChange}
                    />
                    <Button onClick={addMaxLiq} className={classes.balanceBtn}>
                      {activeTab === 'deposit' ? (
                        <div className={classes.balanceContent}>
                          <span>balance</span>
                          <span>
                            {strToFixed(fromUnits(balance, underlyingDecimals))}
                          </span>
                        </div>
                      ) : (
                        'MAX'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <div className={classes.fees}>
                {activeTab === 'withdraw' && (
                  <h5>
                    Available:
                    <span className={classes.primeColor}>
                      {` ${formatDollarString(
                        toEther(strategyTokenBalance)
                      )} LP`}
                    </span>
                  </h5>
                )}
                {activeTab === 'deposit' && <h5>Fee: {feeInToken}</h5>}
              </div>
              {submitButtonStatus.includes('Approve') ? (
                <Approval
                  contract={tokenContext[item.name].contract}
                  allowAddress={strategyContract!.address}
                  setsnackbarStatus={() => setsnackbarStatus(Status.unlock)}
                  approveText={submitButtonStatus}
                  callback={getAllowance}
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
            poolName={item.name.toUpperCase() + ' strategy'}
            pid={pid}
            setsnackbarStatus={setsnackbarStatus}
            lpContract={strategyContract}
            price={price}
          />
        </div>
      </Accordion>
      <div
        className={classes.accordionTail}
        onClick={() =>
          setactiveAccordion((prev) => (prev === index ? -1 : index))
        }
      >
        <span className={`${classes.arrow} ${isExpanded ? 'up' : 'down'}`} />
      </div>
    </div>
  )
}
