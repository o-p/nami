import React, { useCallback, useMemo } from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import styled from 'styled-components'
import Typography from '@mui/material/Typography'

import { useDApp } from 'contexts/Web3'
import ConnectButton from './ConnectButton'
import formatWei from 'utils/formatWei'

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
  cursor: copy;
`

const formatCurrency = formatWei()

export default function Header(props: BoxProps) {
  const { configs, wallet, balances } = useDApp()

  const { balance } = wallet as { balance: string }
  const balanceTT = useMemo(() => formatCurrency(balance), [balance])

  const addToWallet = useCallback(() => {
    const token = configs.token.P
    if (!token || !wallet.ethereum || !wallet.ethereum.request) return

    wallet?.ethereum?.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: token.address,
          symbol: token.symbol,
          decimals: token.decimals,
          image: `${process.env.PUBLIC_URL}/logo512.png`,
        },
      },
    })
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [wallet.ethereum])

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
            { balances?.TT?.display ?? balanceTT }
            <IconTT />
          </Typography>
          <Typography
            variant="balance"
            component="p"
          >
            { balances?.P?.display ?? '0.00' }
            <IconP onClick={addToWallet} />
          </Typography>
        </Box>{/* /Balances */}
      </Box>
    </Box>
  )
}
