import React, { useState } from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import Chest from 'components/TreasureChest'

function TreasureChests() {
  const [canOpen] = useState(Math.random() > 0.5)

  return (
    <>
      {
        canOpen
          ? (
            <Typography variant="treasureHints">
              Choose a box to win the jackpot!
              <br />
              <small>This will cost you 100 $DPT.</small>
            </Typography>)
          : (
            <Typography variant="treasureHints" mb={2}>
              Opening Jackbox needs 100 $DPT.
              <br />
              Keep playing to win more token!
            </Typography>)
      }
      <Box width="100%" height={300} mt={3} paddingX={3}>
        <Box
          height={150}
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="end"
        >
          <Chest size={120} variant="full" />
        </Box>
        <Box
          height={150}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="end"
        >
          <Chest size={120} variant="empty" />
          <Chest size={120} variant="locked" />
        </Box>
      </Box>
    </>
  )
}

export default TreasureChests
