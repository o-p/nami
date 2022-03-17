import styled, { keyframes } from 'styled-components'

import Image from './images'

const shaking = keyframes`
  35% { transform: rotateZ(0); }
  40% { transform: rotateZ(10deg); }
  50% { transform: rotateZ(-10deg); }
  60% { transform: rotateZ(10deg); }
  70% { transform: rotateZ(-10deg); }
  75% { transform: rotateZ(0); }
`

interface TreasureChestProps {
  variant?: 'disabled' | 'empty' | 'full' | 'locked'
  size?: number
  opening?: boolean
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
      ${img.x1} x1,
      ${img.x2} x2,
      ${img.x3} x3
    `,
  }
})<TreasureChestProps>`
  width: ${props => props.size ?? 64}px;
  height: ${props => props.size ?? 64}px;
  animation: ${shaking} 1s infinite;
  ${ props => props.opening ? '' : 'animation: none;' }
`

export default TreasureChest
