import React from 'react'

import styled from 'styled-components'
import ButtonBase, { ButtonBaseProps } from '@mui/material/ButtonBase'

import Chest from 'components/TreasureChest'

const TreasurePrize = styled.p`
  position: absolute;
  top: -10px;
  left: 6px;
  white-space: nowrap;
  font-weight: 800;
  font-family: 'VT323', monospace;
  color: #fff387;
  text-shadow: 1px 1px 1px #7c441e, 0 0 3px #fff9aa;
`

interface MenuButtonProps extends ButtonBaseProps {
  disabled?: boolean
  prize: string
}

export default function MenuButton({ disabled, prize, ...props }: MenuButtonProps) {
  return (
    <ButtonBase
      sx={{
        borderRadius: '30%',
        padding: 0,
        position: 'relative',
      }}
      {...props}
    >
      <Chest
        size={64}
        variant={ disabled ? 'disabled' : 'locked' }
      />
      <TreasurePrize>{ prize }</TreasurePrize>
    </ButtonBase>
  )
}
