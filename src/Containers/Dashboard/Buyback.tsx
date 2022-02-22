import Table, { ITableHeader } from 'components/Table'
import TokenIcon from 'components/TokenIcons/TokenIcon'
import {
  acornToken,
  contractAddresses,
  pools,
  startingBlock,
  strategiesAssets,
  swapAssets,
} from 'constants/index'
import { useTokenContext } from 'context/Tokens'
import { useWalletWrapper } from 'context/Wallet'
import { BigNumber } from 'ethers'
import { hexZeroPad, id } from 'ethers/lib/utils'
import { useSquirrelContract } from 'hooks/useContract'
import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { fromUnits, getProvider } from 'utils/ethers'
import {
  blocksPerDay,
  checkAccounts,
  networkID,
  strToFixed,
} from 'utils/helpers'
import { useStyles } from './Dashboard.styles'

interface IBuyback {
  acornBurned: BigNumber
  amount: BigNumber
  index: number
  swap: string
  token: string
  timestamp: number
}

const cells = {
  amount: { align: 'left' },
  time: { align: 'left' },
}

const burnContracts = [
  ...strategiesAssets.map(
    (asset: string) => contractAddresses[networkID][asset].address
  ),
  ...pools[networkID],
  contractAddresses[networkID].flashyGotchi.address,
]

const burnAssets = [...swapAssets, 'ram']

export default function Buyback() {
  const classes = useStyles()
  const tokenCtx = useTokenContext()
  const { ethereum } = useWalletWrapper()
  const tokenDecimals = useMemo(
    (): { [key: string]: number } =>
      Object.values(tokenCtx).reduce(
        (accu, cur) => ({
          ...accu,
          [cur.underlyingAddress]: cur.decimals,
        }),
        {}
      ),
    [tokenCtx]
  )

  const [burnEvents, setburnEvents] = useState<IBuyback[]>([])
  const squirrel = useSquirrelContract()

  const getHexZeroPads = () => {
    return burnContracts.map((addr) => hexZeroPad(addr, 32))
  }
  useEffect(() => {
    const getBuybacks = async () => {
      try {
        const provider = getProvider(ethereum)
        const blockNumber = (await provider.getBlockNumber()) as number
        const eventFilter = {
          fromBlock: blockNumber - blocksPerDay * 2 + 10,
          toBlock: blockNumber,
          topics: [
            id('BuyBack(address,address,uint256,uint256,uint256)'),
            getHexZeroPads(),
          ],
        }
        const rawLogs = await provider.getLogs(eventFilter)
        const logs = rawLogs.map((log) => squirrel!.interface.parseLog(log))
        const buybacks = logs.map((event: any, index: number) => ({
          acornBurned: event.args.acornBurned,
          amount: event.args.amount,
          swap: event.args.swap,
          token: event.args.token,
          timestamp: event.args.timestamp.mul(1000).toNumber(),
          index,
        }))
        // console.log('buybacks:', buybacks)
        setburnEvents(buybacks)
      } catch (error) {
        console.log('buyback events error:', error)
      }
    }
    getBuybacks()
  }, [squirrel, ethereum])

  const tableHeaders = [
    { value: 'Amount', align: 'left' },
    { value: 'Time', align: 'left' },
  ] as ITableHeader[]

  const tableRows = useMemo(() => {
    return burnEvents
      .map((ev: IBuyback) => {
        const time = new Date(ev.timestamp)
        const formattedDate = format(time, 'MM/dd HH:mm')
        const token = burnAssets.find((tokenName: string) => {
          const addr = contractAddresses[networkID][tokenName].address
          return checkAccounts(addr, ev.token)
        }) as string
        return {
          amount: (
            <div className={classes.flexAlignCenter}>
              <span className={classes.burnAmt}>{`🔥 ${strToFixed(
                fromUnits(ev.acornBurned, acornToken.decimals),
                4
              )}`}</span>
              <TokenIcon className={classes.burnToken} value="acorn" />
              <span>{`from $${strToFixed(
                fromUnits(ev.amount, tokenDecimals[ev.token]),
                4
              )}`}</span>
              {token && (
                <TokenIcon className={classes.burnToken} value={token} />
              )}
            </div>
          ),
          index: ev.index,
          time: formattedDate,
        }
      })
      .reverse()
  }, [
    burnEvents,
    tokenDecimals,
    classes.flexAlignCenter,
    classes.burnAmt,
    classes.burnToken,
  ])

  return (
    <section className={classes.buybackSection}>
      <div className={classes.buyback}>
        <h3>Buyback and Burn</h3>
        <Table
          rootClass={classes.tableRoot}
          cells={cells}
          tableRowKey="index"
          rows={tableRows}
          onCellClick={() => {}}
          tableHeaders={tableHeaders}
          containerClass={classes.tableContainer}
        />
      </div>
    </section>
  )
}
