import { useMemo, useState } from 'react'
import useStyles from './Stake.styles'
import Button from 'components/Button'
import Approval from 'components/Button/Approval'
import { useOakContract } from 'hooks/useContract'
import { bigZero, ether, fromUnits, toEther } from 'utils/ethers'
import { Status } from 'components/Snackbar'
import { useGetAllowance } from 'hooks/useGetAllowance'
import { formatDollarString } from 'utils/helpers'
import { BigNumber } from 'ethers'
import { useGetStakingAPY } from 'hooks/useGetStakingAPY'
import { useUserContext } from 'context/User'
import { useVaultsContext } from 'context/Vaults'
import { usePoolsContext } from 'context/Pools'
import { IVault } from 'context/Vaults/Types'
import { sendGAEvent } from 'utils/ga'

interface IStake {
  poolName: string
  pid: number
  setsnackbarStatus: React.Dispatch<React.SetStateAction<Status>>
  lpContract: any
  price?: BigNumber
}

type StakingMethod = 'stake' | 'unstake' | 'harvest'

enum LoadingButton {
  None = 0,
  Stake = 1,
  UnStake = 2,
  Harvest = 3,
}

export default function Stake({
  poolName,
  pid,
  setsnackbarStatus,
  lpContract,
  price,
}: IStake) {
  const classes = useStyles()
  const [loadingButton, setloadingButton] = useState(LoadingButton.None)
  const oak = useOakContract()
  const { vaults, getAllVaults } = useVaultsContext()
  const { getAllPools } = usePoolsContext()
  const tokenPrice = price || ether
  const { getAPY, stakingAPY } = useGetStakingAPY(pid)
  const {
    portfolio: { getPoolDeposits, getAcornsEarned, userVaults, getUserStaking },
  } = useUserContext()
  const { allowance, getAllowance } = useGetAllowance({
    tokenAddress: lpContract.address,
    allowAddress: oak!.address,
  })
  const userVaultAssets = userVaults.assets[pid]
    ? userVaults.assets[pid]
    : {
        acornClaimable: bigZero,
        staked: bigZero,
        balance: bigZero,
      }

  const vault = useMemo(
    () => vaults.find((v) => v.pid === pid) as IVault,
    [vaults, pid]
  )
  // id: stake/ unstake/ harvest
  const onLinkClick = (buttonID: string) => {
    sendGAEvent(buttonID, poolName) // [stake, WBTC strategy]
    // sendGAEvent(poolName, buttonID) // [ WBTC strategy, stake]
  }

  const onStake = async (
    method: StakingMethod,
    amount: BigNumber,
    stakeButton: LoadingButton
  ) => {
    try {
      const stakeMethod = method === 'stake' ? 'deposit' : 'withdraw'
      setloadingButton(stakeButton)
      const tx = await oak![stakeMethod](pid, amount)
      await tx.wait()
      getPoolDeposits()
      getUserStaking()
      getAllVaults()
      getAllPools()
      getAcornsEarned()
      getAPY()
      setsnackbarStatus(Status.success)
    } catch (error) {
      console.log('error:', error)
      setsnackbarStatus(Status.fail)
    } finally {
      setloadingButton(LoadingButton.None)
    }
  }

  return (
    <div className={classes.stakeContainer}>
      {/* stake */}
      <div className={classes.accordionContentSection}>
        <h3>{poolName} LP Balance</h3>
        <h5 className={classes.primeColor}>
          Staking APR: {formatDollarString(stakingAPY)}%
        </h5>
        <div className={classes.inline}>
          <div className={classes.inline}>
            <h4>{formatDollarString(toEther(userVaultAssets.balance))}</h4>
            <h5>{`$(${formatDollarString(
              fromUnits(
                userVaultAssets.balance.mul(vault.virtualPrice).mul(tokenPrice),
                54
              )
            )})`}</h5>
          </div>
          <div>
            <Approval
              disabled={allowance.gte(userVaultAssets.balance)}
              className={classes.stakeAppove}
              contract={lpContract}
              allowAddress={oak!.address}
              callback={getAllowance}
              setsnackbarStatus={() => setsnackbarStatus(Status.unlock)}
            />
            <Button
              className={classes.stakeButton}
              disabled={
                userVaultAssets.balance.isZero() ||
                allowance.lt(userVaultAssets.balance)
              }
              onClick={() => {
                onLinkClick('stake')
                onStake('stake', userVaultAssets.balance, LoadingButton.Stake)
              }}
              isLoading={loadingButton === LoadingButton.Stake}
            >
              STAKE
            </Button>
          </div>
        </div>
      </div>
      {/* unstake */}
      <div className={classes.accordionContentSection}>
        <h3>{poolName} LP Staked</h3>
        <div className={classes.inline}>
          <div className={classes.inline}>
            <h4>{formatDollarString(toEther(userVaultAssets.staked))}</h4>
            <h5>{`$(${formatDollarString(
              fromUnits(
                userVaultAssets.staked.mul(vault.virtualPrice).mul(tokenPrice),
                54
              )
            )})`}</h5>
          </div>
          <Button
            className={classes.stakeButton}
            disabled={userVaultAssets.staked.isZero()}
            onClick={() => {
              onLinkClick('unstake')
              onStake('unstake', userVaultAssets.staked, LoadingButton.UnStake)
            }}
            isLoading={loadingButton === LoadingButton.UnStake}
          >
            UNSTAKE
          </Button>
        </div>
      </div>
      {/* harvest */}
      <div className={classes.accordionContentSection}>
        <h3>ACORN Earned</h3>
        <div className={classes.inline}>
          <h4>{formatDollarString(toEther(userVaultAssets.acornClaimable))}</h4>
          <Button
            className={classes.stakeButton}
            disabled={userVaultAssets.acornClaimable.isZero()}
            onClick={() => {
              onLinkClick('harvest')
              onStake('harvest', bigZero, LoadingButton.Harvest)
            }}
            isLoading={loadingButton === LoadingButton.Harvest}
          >
            HARVEST
          </Button>
        </div>
      </div>
    </div>
  )
}
