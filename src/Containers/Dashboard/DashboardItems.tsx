import { useEffect, useMemo, useState } from 'react'
import { useStyles } from './Dashboard.styles'
import Button from 'components/Button'
import Anchor from 'components/Anchor'
import {
  contractAddresses,
  gotchiHost,
  ramHost,
  swapAssets,
  ttSwapHost,
} from 'constants/index'
import {
  formatDollarString,
  networkID,
  strToFixed,
  watchAsset,
} from 'utils/helpers'
import { useGlobalsContext } from 'context/Globals'
import {
  bigZero,
  ether,
  fromUnits,
  toBN,
  toEther,
  toUnits,
  toWei,
} from 'utils/ethers'
import { useWalletWrapper } from 'context/Wallet'
import { acornToken } from 'constants/index'
import TokenIcon from 'components/TokenIcons/TokenIcon'
import { useUserContext } from 'context/User'
import { useVaultsContext } from 'context/Vaults'
import { IVault } from 'context/Vaults/Types'
import { ICoins } from 'context/Pools/Types'
import { BigNumber, utils } from 'ethers'
import { IPoolData } from 'context/Pools/Types'
import { usePoolsContext } from 'context/Pools'
import { useTokenContext } from 'context/Tokens'
import RamPromo from 'assets/ramPromoButton.png'
import GotchiPromo from 'assets/gotchiPromo.png'
import Spinner from 'components/Spinner/Spinner'
import { useStrategiesContext } from 'context/Strategies'
import { useAcornContract } from 'hooks/useContract'
import { sendGAEvent } from 'utils/ga'

type IReserve = {
  [key: string]: BigNumber
}

export default function DashboardItems() {
  const classes = useStyles()
  const { dexTokens } = useGlobalsContext()
  const { strategies } = useStrategiesContext()
  const { pools } = usePoolsContext()
  const [acornsBurned, setacornsBurned] = useState(bigZero)
  const {
    portfolio: { deposits, acornEarned, isLoading },
  } = useUserContext()
  const { currentConnectionType } = useWalletWrapper()
  const { vaults } = useVaultsContext()
  const tokenCtx = useTokenContext()
  const acornContract = useAcornContract()

  const onLinkClick = (id: string) => {
    sendGAEvent('dashboard', id)
  }

  useEffect(() => {
    const getAcornsBurned = async () => {
      const totalBurned = await acornContract!.totalBurnt()
      setacornsBurned(totalBurned)
    }
    getAcornsBurned()
  }, [acornContract])

  const reserves = useMemo(() => {
    let res = {} as IReserve
    // map all pools' reserves to [{busd: 100, usdt: 100}, {busd: 200, usdt: 200}]
    Object.values(pools).forEach((item: IPoolData) => {
      item.coins.forEach((coin: ICoins) => {
        const balance = item.poolBalances[coin.index]
        if (res[coin.token]) {
          res[coin.token] = res[coin.token].add(balance)
        } else {
          res[coin.token] = balance
        }
      })
    })
    return res
  }, [pools])

  const tvl = useMemo(() => {
    const vaultsTvl = vaults.reduce((accu: BigNumber, cur: IVault) => {
      const truncatedStakedBal = toBN(toWei(strToFixed(cur.stakedBalance)))
      return accu.add(truncatedStakedBal.mul(cur.virtualPrice))
    }, bigZero)
    const poolsTvl = Object.values(pools)
      .reduce((accu: BigNumber, cur: IPoolData) => accu.add(cur.tvl), bigZero)
      .mul(ether)

    const strategiesTvl = Object.keys(strategies).reduce((accu, cur) => {
      return accu.add(toUnits(strategies[cur].tvl, 36))
    }, bigZero)

    const tvl = vaultsTvl.add(poolsTvl).add(strategiesTvl)
    return tvl
  }, [pools, vaults, strategies])

  const tokenInfo = useMemo((): {
    [key: string]: {
      val: any
      txt: string
    }
  } => {
    return {
      price: {
        val: `$${dexTokens.acorn.price.toFixed(4)}`,
        txt: 'ACORN price',
      },
      marketCap: {
        val:
          '$' +
          formatDollarString(
            (
              dexTokens.acorn.price * dexTokens.acorn.circulatingSupply
            ).toString()
          ),
        txt: 'market cap',
      },
      circulatingSupply: {
        val: formatDollarString(dexTokens.acorn.circulatingSupply.toString()),
        txt: 'circulating supply',
      },
      burned: {
        val: formatDollarString(toEther(acornsBurned)),
        txt: 'acorns burned',
      },
    }
  }, [dexTokens.acorn, acornsBurned])

  const portfolioInfo = useMemo((): {
    [key: string]: {
      val: any
      txt: string
    }
  } => {
    return {
      deposits: {
        val: '$' + formatDollarString(fromUnits(deposits, 36)),
        txt: 'My total deposit',
      },
      acorns: {
        val: isLoading ? <Spinner /> : formatDollarString(toEther(acornEarned)),
        txt: 'ACORNS earned',
      },
    }
  }, [deposits, acornEarned, isLoading])

  return (
    <section>
      <div className={classes.buttonsWrap}>
        <div>
          <h3>TOTAL VALUE LOCKED</h3>
          <h2>{`$${formatDollarString(fromUnits(tvl, 36))}`}</h2>
          <div className={classes.flexColumnCenter}>
            <Anchor
              className={classes.buyAcornAnchor}
              href={`${ttSwapHost[networkID]}#/swap/${contractAddresses[networkID].acorn.address}`}
            >
              <Button onClick={() => onLinkClick('buyAcorn')}>Buy ACORN</Button>
            </Anchor>
            {currentConnectionType === 'injected' && (
              <Button
                className={classes.rmBtn}
                onClick={() =>
                  watchAsset({
                    ...acornToken,
                    address: contractAddresses[networkID].acorn.address,
                  })
                }
              >
                <TokenIcon className={classes.acornToken} value={'acorn'} />
                <span>Add to wallet</span>
              </Button>
            )}
          </div>
        </div>
        <div className={classes.promos}>
          <Anchor
            className={classes.ramAnchor}
            href={ramHost[networkID]}
            onClick={() => onLinkClick('ramPromo')}
          >
            <img alt="Ram protocol" src={RamPromo} />
          </Anchor>
          <Anchor
            className={classes.ramAnchor}
            href={gotchiHost[networkID]}
            onClick={() => onLinkClick('gotchiPromo')}
          >
            <img alt="FlashyGotchi" src={GotchiPromo} />
          </Anchor>
        </div>
      </div>
      <div className={classes.acorn}>
        <h3>ACORN Information</h3>
        {Object.keys(tokenInfo).map((item: string) => (
          <div key={item} className={classes.msgGroup}>
            <h5 className={classes.primeColor}>
              {tokenInfo[item].txt.toUpperCase()}
            </h5>
            <p>{tokenInfo[item].val}</p>
          </div>
        ))}
      </div>
      <div className={classes.reserves}>
        <h3>Currency Reserves</h3>
        {swapAssets.map((tokenName: string) => (
          <div key={tokenName} className={classes.msgGroup}>
            <div className={classes.inline}>
              <TokenIcon value={tokenName} />
              <h5>{tokenName.toUpperCase()}</h5>
            </div>
            <p>
              {formatDollarString(
                fromUnits(reserves[tokenName], tokenCtx[tokenName].decimals)
              )}
            </p>
          </div>
        ))}
      </div>
      <div className={classes.portfolio}>
        <h3>Portfolio</h3>
        {Object.keys(portfolioInfo).map((item: string) => (
          <div key={item} className={classes.msgGroup}>
            <h5 className={classes.primeColor}>
              {portfolioInfo[item].txt.toUpperCase()}
            </h5>
            <div>{portfolioInfo[item].val}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
