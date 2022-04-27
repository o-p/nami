import React, { useState, forwardRef, useCallback } from 'react'
import { ethers } from 'ethers'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Container from '@mui/material/Container'
import Dialog from '@mui/material/Dialog'
import Slide, { SlideProps } from '@mui/material/Slide'

import { Portal, Reward } from 'components/ExternalLinks'
import CloseButton from 'components/CloseButton'
import ErrorMessage from 'components/ErrorMessage'
import MenuButton from 'components/MenuButton'
import SlotMachine from 'components/SlotMachine'
import Header from 'containers/Header'
import TreasureChests from 'containers/TreasureChests'
import Links from 'containers/Links'
import UnboxHistory from 'containers/UnboxHistory'
import useDApp from 'contexts/Web3'
import formatWei from 'utils/formatWei'

import './GameView.scss'

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
  const { balances, game, error, actions } = useDApp()
  const [showTreasures, setTreasureView] = useState(false)
  const [showLinks, setLinksView] = useState(false)
  const [showUnboxHistory, setUnboxHistoryView] = useState(false)
  const hasTreasure = (game?.unboxFee?.gt(0) ?? false)
    && (balances.P?.amount?.gte(game.unboxFee) ?? false)

  const openTreasureView = useCallback(() => setTreasureView(true), [])
  const closeTreasureView = useCallback(() => setTreasureView(false), [])

  const openLinks = useCallback(() => setLinksView(true), [])
  const closeLinks = useCallback(() => setLinksView(false), [])

  const openUnboxHistory = useCallback(() => setUnboxHistoryView(true), [])
  const closeUnboxHistory = useCallback(() => setUnboxHistoryView(false), [])

  const prize = game.acculatedPrize.gt(ethers.constants.WeiPerEther)
    ? `Pool ${formatPrize(game.acculatedPrize)} TT`
    : ''

  return (
    <Container
      className="game-view"
      maxWidth="sm"
      disableGutters
    >
      <Stack
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
        <Reward onClick={openUnboxHistory}>Winners</Reward>
      </Stack>
      <Stack
        position="absolute"
        top={0}
        right={0}
        zIndex={100}
      >
        <Portal onClick={openLinks}>Portal</Portal>
      </Stack>
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
      <Dialog
        fullWidth
        maxWidth="sm"
        open={showLinks}
        onClose={closeLinks}
        TransitionComponent={Transition}
        PaperProps={dialogPaperProps}
      >
        <Box display="flex" justifyContent="end">
          <CloseButton onClick={closeLinks} />
        </Box>
        <Links />
      </Dialog>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={showUnboxHistory}
        onClose={closeUnboxHistory}
        TransitionComponent={Transition}
        PaperProps={dialogPaperProps}
      >
        <Box display="flex" justifyContent="end">
          <CloseButton onClick={closeUnboxHistory} />
        </Box>
        <UnboxHistory />
      </Dialog>

      <Header
        position="absolute"
        left={60}
        right={60}
        top={10}
      />

      <SlotMachine />

      <ErrorMessage
        open={Boolean(error)}
        onClose={actions.clearError}
      >
        <>{ error ?? '' }</>
      </ErrorMessage>
    </Container>
  )
}

export default GameView
