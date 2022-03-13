import React, { useCallback, useMemo, useState } from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import styled from 'styled-components'
import Typography from '@mui/material/Typography'

import { useDApp } from 'contexts/Web3'
import ConnectButton from './ConnectButton'
import formatWei from 'utils/formatWei'
import Tokenomic from 'components/ImageDialog/Tokenomic'

import ImageTT from './images/TT.png'
import ImageP from './images/P.png'

const IconTT = styled.img.attrs({
  src: ImageTT,
})`
  width: 22px;
  height: 22px;
  vertical-align: sub;
`
const IconP = styled.img.attrs({
  src: ImageP,
})`
  width: 22px;
  height: 22px;
  vertical-align: sub;
`

const formatCurrency = formatWei()

const dpBalanceStyle = { cursor: 'help' }

export default function Header(props: BoxProps) {
  const [showTokenomics, setTokenomicDialog] = useState(false)
  const { configs, wallet, balances } = useDApp()

  const { balance } = wallet as { balance: string }
  const balanceTT = useMemo(() => formatCurrency(balance), [balance])

  const openTokenomicDialog = useCallback(() => setTokenomicDialog(true), [])
  const closeTokenomicDialog = useCallback(() => setTokenomicDialog(false), [])

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
          <Typography
            variant="balance"
            component="p"
            onClick={openTokenomicDialog}
            sx={dpBalanceStyle}
          >
            { balances?.P?.display ?? '0.00' }
            <IconP />
          </Typography>
        </Box>{/* /Balances */}
      </Box>
      <Tokenomic open={showTokenomics} onClose={closeTokenomicDialog} />
    </Box>
  )
}
