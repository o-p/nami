import React from 'react'
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';

import { Bets as BetImages } from './images'

const BetIcons = Object.fromEntries(
  Object
    .entries(BetImages)
    .map(([key, { x1, x2, x3 }]) => [key, (
      <Avatar
        src={x1}
        srcSet={`
          ${x2} 2x,
          ${x3} 3x
        `}
        alt={key}
        sx={{
          width: 58,
          height: 58,
        }}
      />
    )])
)

interface BetProps extends IconButtonProps {
  amount: '5' | '10' | '50' | '100' | '500' | '1000'
}
export default function Bets({ amount = '5', ...props }: BetProps) {
  return (
    <div>
      <IconButton {...props}>
        { BetIcons[amount] }
      </IconButton>
    </div>
  )
}
