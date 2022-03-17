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
          ${x1} 1x,
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
  selected?: boolean
}
export default function Bets({ amount = '5', selected, ...props }: BetProps) {
  if (props.disabled) {
    return (
      <div>
        <IconButton {...props} sx={{
          filter: `grayscale(.8) opacity(.6)`,
          transition: `all 0.12s ease-in`,
        }}>
          { BetIcons[amount] }
        </IconButton>
      </div>
    )
  }

  if (selected) {
    return (
      <div>
        <IconButton {...props} sx={{
          filter: `hue-rotate(-180deg) saturate(2.2) brightness(1.8)`,
          transition: `all 0.12s ease-in`,
        }}>
          { BetIcons[amount] }
        </IconButton>
      </div>
    )
  }

  return (
    <div>
      <IconButton {...props}>
        { BetIcons[amount] }
      </IconButton>
    </div>
  )
}
