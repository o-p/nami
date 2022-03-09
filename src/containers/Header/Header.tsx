import Box, { BoxProps } from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { useDApp } from 'contexts/Web3'
import ConnectButton from './ConnectButton'

export default function Header(props: BoxProps) {
  const dapp = useDApp()

  console.log(dapp)

  return (
    <Box
      component="header"
      display="flex"
      flexDirection="column"
      {...props}
    >
      <Typography variant="h1" align="center">
        { dapp.configs.name }
      </Typography>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
      >
        {/* Connection Button */}
        <Box p={1} borderRight="2px groove rgb(113 95 164 / .3)">
          <ConnectButton />
        </Box>{/* /Connection Button */}
        {/* Balances */}
        <Box p={1}>
          <Typography>
            Balance 1 TT
          </Typography>
          <Typography>
            Balance 2 $PDT (i)
          </Typography>
        </Box>{/* /Balances */}
      </Box>
    </Box>
  )
}
