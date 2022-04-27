import ButtonBase, { ButtonBaseProps } from '@mui/material/ButtonBase'
import { ChainUnsupportedError } from 'use-wallet'
import { styled } from '@mui/material/styles'

import { useDApp } from 'contexts/Web3'
import shortenAccount from 'utils/shortenAccount'

const Button = styled(ButtonBase)({
  fontFamily: `'Nova Mono', monospace`,
  backgroundColor: '#FFF9',
  borderRadius: 9,
  border: '1px solid #FFFA',
  padding: '1px 6px',
})

export default function ConnectButton(props: ButtonBaseProps) {
  const {
    wallet,
    actions,
  } = useDApp()

  // @ts-ignore
  const isWrongNetwork = wallet.error instanceof ChainUnsupportedError

  if (isWrongNetwork) {
    return (
      <Button {...props} onClick={actions.switchNetwork}>
        Switch Network
      </Button>
    )
  }

  // @ts-ignore
  if (wallet.status === 'connected') {
    return (
      <Button {...props}>
        { shortenAccount(wallet.account ?? '') }
      </Button>
    )
  }

  return (
    <Button {...props} onClick={() => actions.setConnection('injected')}>
      Connect
    </Button>
  )
}
