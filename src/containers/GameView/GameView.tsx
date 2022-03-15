import React, { useState, forwardRef, useCallback } from 'react'
import { ethers } from 'ethers'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Dialog from '@mui/material/Dialog'
import Fade from '@mui/material/Fade'
import Slide, { SlideProps } from '@mui/material/Slide'
import styled from 'styled-components'

import { grayscaled } from './images'
import CloseButton from 'components/CloseButton'
import MenuButton from 'components/MenuButton'
import SlotMachine from 'components/SlotMachine'
import Header from 'containers/Header'
import TreasureChests from 'containers/TreasureChests'
import useDApp from 'contexts/Web3'
import formatWei from 'utils/formatWei'

import './GameView.scss'

const DisconnectedOverlay = styled.img.attrs({
  src: grayscaled.x1,
  srcSet: `
    ${grayscaled.x2} 2x,
    ${grayscaled.x3} 3x
  `,
  alt: 'disconnected',
})`
  max-width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
  z-index: 100;
`

const Transition = forwardRef<unknown, SlideProps>(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})


const formatPrize = formatWei(18, 0)
const dialogPaperProps = {
  sx: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
}

function GameView() {
  const { balances, game } = useDApp()
  const [showTreasures, setTreasureView] = useState(false)
  const hasTreasure = (game?.unboxFee?.gt(0) ?? false)
    && (balances.P?.amount?.gte(game.unboxFee) ?? false)

  const openTreasureView = useCallback(() => setTreasureView(true), [])
  const closeTreasureView = useCallback(() => setTreasureView(false), [])

  const prize = game.acculatedPrize.gt(ethers.constants.WeiPerEther)
    ? `Over ${formatPrize(game.acculatedPrize)} TT`
    : ''

  return (
    <Container
      className="game-view"
      maxWidth="sm"
      disableGutters
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        zIndex={100}
      >
        <MenuButton
          disabled={!hasTreasure}
          prize={prize}
          onClick={openTreasureView}
        />
      </Box>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={showTreasures}
        onClose={closeTreasureView}
        TransitionComponent={Transition}
        PaperProps={dialogPaperProps}
      >
        <Box display="flex" justifyContent="end">
          <CloseButton onClick={closeTreasureView} />
        </Box>
        <TreasureChests />
      </Dialog>

      <Header
        position="absolute"
        left={60}
        right={60}
        top={10}
      />

      <SlotMachine />

      <Fade in={false}>
        <DisconnectedOverlay />
      </Fade>
    </Container>
  )
}

export default GameView
