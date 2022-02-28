import React from 'react'

import ButtonBase, { ButtonBaseProps } from '@mui/material/ButtonBase'

import Chest from 'components/TreasureChest'

interface MenuButtonProps extends ButtonBaseProps {
  disabled?: boolean
}

export default function MenuButton({ disabled, ...props }: MenuButtonProps) {
  return (
    <ButtonBase
      sx={{
        borderRadius: '30%',
        padding: 0,
      }}
      {...props}
    >
      <Chest
        size={64}
        variant={ disabled ? 'disabled' : 'locked' }
      />
    </ButtonBase>
  )
}
