import BUSD from 'assets/tokens/busd.png'
import ETH from 'assets/tokens/eth.png'
import RAM from 'assets/ram.png'
import TT from 'assets/tokens/tt.png'
import USDC from 'assets/tokens/usdc.png'
import USDT from 'assets/tokens/usdt.png'
import WBTC from 'assets/tokens/wbtc.png'
import HT from 'assets/tokens/ht.png'
import BNB from 'assets/tokens/bnb.svg'
import ACORN from 'assets/tokens/acorn.svg'
import { makeStyles } from '@material-ui/core'

interface ITokenIcon {
  value: string
  width?: string
  height?: string
  className?: string
}

const useStyles = makeStyles({
  img: {
    margin: '0 10px',
  },
})

export default function TokenIcon({
  value,
  width = '20px',
  height = '20px',
  className,
}: ITokenIcon) {
  const classes = useStyles()
  const getTokenIcon = (value: any) => (
    <img
      src={value}
      alt="token"
      width={width}
      height={height}
      className={className || classes.img}
    />
  )

  switch (value.toUpperCase()) {
    case 'TT':
      return getTokenIcon(TT)
    case 'TT-BUSD':
    case 'BUSD':
      return getTokenIcon(BUSD)
    case 'TT-ETH':
    case 'ETH':
      return getTokenIcon(ETH)
    case 'TT-BNB':
    case 'BNB':
      return getTokenIcon(BNB)
    case 'TT-USDC':
    case 'USDC':
      return getTokenIcon(USDC)
    case 'TT-USDT':
    case 'USDT':
      return getTokenIcon(USDT)
    case 'WBTC':
    case 'TT-WBTC':
      return getTokenIcon(WBTC)
    case 'HT':
      return getTokenIcon(HT)
    case 'RAM':
      return getTokenIcon(RAM)
    case 'ACORN':
      return getTokenIcon(ACORN)
    default:
      return null
  }
}
