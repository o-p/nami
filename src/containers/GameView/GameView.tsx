import React, { useState, forwardRef } from 'react'
import styled from 'styled-components'
import Fade from '@mui/material/Fade'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import Slide, { SlideProps } from '@mui/material/Slide'

// import NetworkChecker from 'components/NetworkChecker'
// import { TokenProvider } from 'context/Tokens'
// import { GlobalsProvider } from 'context/Globals/Context'
// import { UserProvider } from 'context/User'

import { grayscaled } from './images'
import MenuButton from 'components/MenuButton'
import SlotMachine from 'components/SlotMachine'
import TreasureChests from 'containers/TreasureChests'

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

function GameView() {
  const [showChests, setChestsModal] = useState(false)
  const hasTreasure = Math.random() > 0.5

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
          onClick={() => setChestsModal(true)}
        />
      </Box>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={showChests}
        onClose={() => setChestsModal(false)}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        <TreasureChests />
      </Dialog>

      <SlotMachine />

      <Fade in={false}>
        <DisconnectedOverlay />
      </Fade>
    </Container>
  )
}

export default GameView
