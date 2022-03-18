import React, { useCallback, useState } from 'react'

import { ethers } from 'ethers'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Typography from '@mui/material/Typography'

import ApproveButton from 'components/ApproveButton'
import Chest from 'components/TreasureChest'
import useDApp from 'contexts/Web3'
import PrizeText from './PrizeText'

const Button = styled(ButtonBase)({
  width: 140,
  height: 140,
  position: 'relative',
  borderRadius: 30,
})

interface OpenStatus {
  isOpening: boolean
  openIndex: number
  won: string
}
interface ChestButtonProps {
  disabled?: boolean
  status: OpenStatus
  onClick: () => void
}
function OpeningChestButton({ status }: ChestButtonProps) {
  const variant = status.isOpening
    ? 'locked'
    : (status.won ? 'full' : 'empty')

  return (
    <Button disabled>
      {
        status.won ? <PrizeText text={status.won} size={130} /> : null
      }
      <Chest
        size={120}
        variant={variant}
        opening={status.isOpening}
      />
    </Button>
  )
}

function RestChestButton({ status, onClick, disabled }: ChestButtonProps) {
  const isDisabled = disabled || status.openIndex !== -1
  return (
    <Button
      disabled={isDisabled}
      onClick={onClick}
    >
      <Chest size={120} variant={ isDisabled ? 'disabled' : 'locked' } />
    </Button>
  )
}

function TreasureChests() {
  const [approving, setApproving] = useState<boolean>(false)
  const [openStatus, setOpenStatus] = useState<OpenStatus>({
    isOpening: false,
    openIndex: -1,
    won: '',
  })
  const {
    configs: { token: { P: { decimals } } },
    balances,
    game: {
      acculatedPrize,
      dpAllowance,
      unboxFee,
    },
    actions: {
      approveDP,
      refreshGameInfo,
      unbox,
      showError,
    },
  } = useDApp()

  const approve = useCallback(
    () => {
      setApproving(true)

      approveDP()
        .catch((e: any) => {
          showError(e.message ?? e.toString())
        })
        .then(() => setApproving(false))
        .then(refreshGameInfo)

    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [approveDP, refreshGameInfo]
  )

  const choose = useCallback((index: number) => () => {
    setOpenStatus({ openIndex: index, isOpening: true, won: '' })
    unbox(acculatedPrize)
      .then(({ win: won }: { win: string }) => setOpenStatus({ openIndex: index, isOpening: false, won }))
      .catch((e: any) => {
        console.error(e)
        showError(e.message ?? e.toString())
        setOpenStatus({ openIndex: -1, isOpening: false, won: '' })
      })
      .then(refreshGameInfo)
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [unbox, acculatedPrize, refreshGameInfo])

  if (dpAllowance.lt(unboxFee)) {
    return (
      <>
        <Typography variant="treasureHints">
          Approve spending $PMT for opening treasure boxes.
        </Typography>)
        <ApproveButton onClick={approve} approving={approving} />
      </>
    )
  }

  const canOpen = (balances?.P?.amount ?? ethers.constants.Zero).gte(unboxFee)
  const cost = ethers.utils.formatUnits(unboxFee, decimals)

  return (
    <>
      {
        canOpen
          ? (
            <Typography variant="treasureHints">
              Choose a box to win the jackpot!
              <br />
              <small>This will cost you {cost} $P.</small>
            </Typography>)
          : (
            <Typography variant="treasureHints" mb={2}>
              Opening Jackbox needs {cost} $PMT.
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
          {
            openStatus.openIndex === 0
              ? <OpeningChestButton status={openStatus} onClick={choose(0)} disabled={!canOpen} />
              : <RestChestButton status={openStatus} onClick={choose(0)} disabled={!canOpen} />
          }
        </Box>
        <Box
          height={150}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="end"
        >
          {
            openStatus.openIndex === 1
              ? <OpeningChestButton status={openStatus} onClick={choose(1)} disabled={!canOpen} />
              : <RestChestButton status={openStatus} onClick={choose(1)} disabled={!canOpen} />
          }
          {
            openStatus.openIndex === 2
              ? <OpeningChestButton status={openStatus} onClick={choose(2)} disabled={!canOpen} />
              : <RestChestButton status={openStatus} onClick={choose(2)} disabled={!canOpen} />
          }
        </Box>
      </Box>
    </>
  )
}

export default TreasureChests
