import React, { useEffect } from 'react'
import Stack from '@mui/material/Stack'
import { formatDistance } from 'date-fns'
import Typography from '@mui/material/Typography'
import { BigNumber } from 'ethers'

import useDApp from 'contexts/Web3'
import formatWei from 'utils/formatWei'
import shortenAccount from 'utils/shortenAccount'

const formatPrize = formatWei(18, 2)
function UnboxRecord({ from, earned, blockNumber, current }: {
  from: string
  earned: BigNumber | null
  blockNumber: number
  current: number
}) {
  if (earned) {
    return (
      <Typography variant="records" component="p">
        Player {shortenAccount(from)} has won {formatPrize(earned)} TT {
          formatDistance(
            current * 1000,
            blockNumber * 1000,
          )
        } ago
      </Typography>
    )
  }

  return (
    <Typography variant="records" component="p" sx={{ opacity: .6 }}>
      Player {shortenAccount(from)} was trying to open treaure box {
        formatDistance(
          current * 1000,
          blockNumber * 1000,
        )
      } ago
    </Typography>
  )
}


function UnboxHistory() {
  const {
    events: {
      unbox: events,
    },
    network: {
      blockNumber: current,
    },
    actions: {
      queryUnboxHistory
    },
  } = useDApp()

  useEffect(() => {
    queryUnboxHistory()
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [])

  if (events.length === 0) {
    return (
      <Stack>
        <Typography variant="treasureHints">
          Looking for those lucky guys...
        </Typography>
      </Stack>
    )
  }

  return (
    <Stack>
      {
        events.map(ev => (
          <UnboxRecord
            key={ev.blockNumber}
            from={ev.from}
            blockNumber={ev.blockNumber}
            earned={ev.earned}
            current={current}
          />
        ))
      }
    </Stack>
  )
}

export default UnboxHistory
