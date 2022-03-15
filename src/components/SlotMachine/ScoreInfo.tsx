import { useCallback, useState } from 'react'
import styled from 'styled-components'
import Box from '@mui/material/Box'
import InfoIcon from '@mui/icons-material/InfoOutlined'

import { Rewards } from 'components/ImageDialog'

const Score = styled.h3`
  text-align: center;
  z-index: 100;
  color: #FFF;
  max-width: 330px;
  padding: 0 8px;
  margin: 0;
  font-size: 24px;
  line-height: 38px;
  cursor: pointer;
  user-select: none;
`

const iconSx = { marginLeft: '8px' }
export default function ScoreInfo() {
  const [showRewards, setRewardDialog] = useState<boolean>(false)

  const showRewardDialog = useCallback(() => setRewardDialog(true), [])
  const hideRewardDialog = useCallback(() => setRewardDialog(false), [])

  return (
    <Box>
      <Score onClick={showRewardDialog}>
        SCORE
        <InfoIcon fontSize="small" sx={iconSx} />
      </Score>
      <Rewards open={showRewards} onClose={hideRewardDialog} />
    </Box>
  )
}
