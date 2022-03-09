import ButtonBase, { ButtonBaseProps } from '@mui/material/ButtonBase'
// import Typography from '@mui/material/Typography'

import { useDApp } from 'contexts/Web3'

export default function ConnectButton(props: ButtonBaseProps) {
  // const {
  //   actions: {
  //   },
  // } = useDApp()

  return (
    <ButtonBase {...props}>
      Connect
    </ButtonBase>
  )
}
