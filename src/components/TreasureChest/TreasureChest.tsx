import React from 'react'

import styled from 'styled-components'

import Image from './images'

interface TreasureChestProps {
  variant?: 'disabled' | 'empty' | 'full' | 'locked'
  size?: number
}

const variants = {
  disabled: 'disabled',
  empty: 'empty',
  full: 'full',
  locked: 'locked',
}

const TreasureChest = styled.img.attrs<TreasureChestProps>((props) => {
  const variant = variants[props.variant ?? 'locked']
  const img = Image[variant] ?? Image.locked

  return {
    src: img.x1,
    srcSet: `
      ${img.x2} x2,
      ${img.x3} x3
    `,
  }
})<TreasureChestProps>`
  width: ${props => props.size ?? 64}px;
  height: ${props => props.size ?? 64}px;
`

export default TreasureChest
