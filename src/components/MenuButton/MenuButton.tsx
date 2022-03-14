import React from 'react'

import ButtonBase, { ButtonBaseProps } from '@mui/material/ButtonBase'

import Chest from 'components/TreasureChest'

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
      <p>{ prize }</p>
    </ButtonBase>
  )
}
