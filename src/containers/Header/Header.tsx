import React, { useMemo } from 'react'
import { ethers } from 'ethers'
import Box, { BoxProps } from '@mui/material/Box'
import styled from 'styled-components'
import Typography from '@mui/material/Typography'

import { useDApp } from 'contexts/Web3'
import ConnectButton from './ConnectButton'

import ImageTT from './images/TT.png'
import ImagePDT from './images/PDT.png'

const IconTT = styled.img.attrs({
  src: ImageTT,
})`
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: bottom;
`
const IconPDT = styled.img.attrs({
  src: ImagePDT,
})`
  width: 20px;
  height: 20px;
  display: inline-block;
  vertical-align: bottom;
`

export default function Header(props: BoxProps) {
  const { configs, wallet, balances } = useDApp()

  const { balance } = wallet as { balance: string }
  const balanceTT = useMemo(() => (
    ethers.utils.commify(
      ethers.utils.formatEther(balance)
                  .replace(/(\.\d{3})\d+$/, '$1')
    )
  ), [balance])

  return (
    <Box
      component="header"
      display="flex"
      flexDirection="column"
      zIndex={30}
      {...props}
    >
      <Typography variant="h1" align="center">
        { configs.name }
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
        <Box paddingX={1}>
          <Typography variant="balance" component="p">
            { balanceTT }
            <IconTT />
          </Typography>
          <Typography variant="balance" component="p">
            { balances.PDT ?? 0 }
            <IconPDT />
          </Typography>
        </Box>{/* /Balances */}
      </Box>
    </Box>
  )
}
