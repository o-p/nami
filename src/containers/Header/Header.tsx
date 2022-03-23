import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import styled from 'styled-components'
import Typography from '@mui/material/Typography'
import CountUp from 'react-countup'

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
  const display = useRef<{ [token: string]: { start: number, end: number }}>({
    TT: { start: 0, end: 0 },
    PDT: { start: 0, end: 0 },
  })

  const { balance } = wallet as { balance: string }

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
          image: token.image,
        },
      },
    })
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [wallet.ethereum])

  useEffect(() => {
    const { TT, PDT } = display.current
    const tt = Number((balances?.TT?.display ?? formatCurrency(balance))) || 0
    const pdt = Number((balances?.P?.display ?? '0')) || 0

    if (TT.end !== tt) {
      display.current.TT = {
        start: TT.end,
        end: tt,
      }
    }

    if (PDT.end !== pdt) {
      display.current.PDT = {
        start: PDT.end,
        end: pdt,
      }
    }
  }, [balance, balances?.TT, balances?.P])

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
        <Box paddingX={1} paddingY={2}>
          <Typography variant="balance" component="p">
            <IconTT />
            &nbsp;
            <CountUp
              start={display.current.TT.start}
              end={display.current.TT.end}
              suffix=" TT"
              decimals={3}
              duration={1}
            />
          </Typography>
          <Typography
            variant="balance"
            component="p"
          >
            <IconP onClick={addToWallet} />
            &nbsp;
            <CountUp
              start={display.current.PDT.start}
              end={display.current.PDT.end}
              suffix=" PMT"
              decimals={3}
              duration={1}
            />
          </Typography>
        </Box>{/* /Balances */}
      </Box>
    </Box>
  )
}
