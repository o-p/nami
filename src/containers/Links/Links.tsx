import React from 'react'
import Box from '@mui/material/Box'

import {
  ComingSoon,
  DicePlanet,
  LaserSwap,
  Telegram,
} from 'components/ExternalLinks'

const iconProps = { size: 72 }

function Links() {
  return (
    <Box>
      <Box
          height={120}
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
          alignItems="end"
        >
          <LaserSwap iconProps={iconProps}>Buy PMT</LaserSwap>
      </Box>
      <Box
          height={120}
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
          alignItems="end"
        >
          <Telegram iconProps={iconProps}>Telegram</Telegram>
          <DicePlanet iconProps={iconProps}>Dice Planet</DicePlanet>
      </Box>
      <Box
          height={120}
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
          alignItems="end"
        >
          <ComingSoon iconProps={iconProps}>Coming Soon</ComingSoon>
      </Box>
    </Box>
  )
}

export default Links
