import React from 'react'

import styledComp, { keyframes } from 'styled-components'
import ButtonBase, { ButtonBaseProps } from '@mui/material/ButtonBase'
import { styled } from '@mui/material/styles'

/* eslint-disable-next-line import/no-webpack-loader-syntax */
import ImageDragon from '!!file-loader!./dragon.png'
/* eslint-disable-next-line import/no-webpack-loader-syntax */
import ImageToken from '!!file-loader!./token.png'

const Dragon = styledComp.img.attrs({
  src: ImageDragon,
})`
  position: absolute;
  bottom: 0;
  left: 180px;
  z-index: 55;
`

const glowing = keyframes`
  0% {
    box-shadow: 0 0 0 #FBB616;
    filter: drop-shadow(2px 4px 6px #F00);
  }

  25% { filter: drop-shadow(4px 0 6px #880); }

  50% {
    box-shadow: 0 0 10px #FBB616;
    filter: drop-shadow(0 -2px 6px #0F0);
  }

  75% { filter: drop-shadow(-2px 0 6px #880); }

  100% {
    box-shadow: 0 0 0 #FBB616;
    filter: drop-shadow(2px 4px 6px #F00);
  }
`

const Token = styledComp.img.attrs({
  src: ImageToken,
})`
  position: absolute;
  top: 30px;
  left: 80px;
  width: 100px;
  z-index: 50;
  border-radius: 50%;
  animation: ${glowing} 3s infinite;
  animation: none;
`

const Button = styled(ButtonBase)({
  position: 'relative',
  maxWidth: '100%',
  width: '100%',
  height: '200px',
  overflow: 'hidden',

  '&:hover, &:active, &:focus': {
    '.dragon': {
      transform: `translateX(360px) rotateZ(635deg)`,
      transition: `transform .15s ease-in .08s`,
    },
    '.token': {
      transform: `translateX(85px) translateY(20px) scale3d(1.3, 1.3, 1)`,
      transition: `transform .15s ease-in`,
    },
  },

  '&.approving': {
    '.dragon': {
      opacity: 0,
    },
    '.token': {
      animation: `${glowing.getName()} 5s infinite`,
    },
  },
})

export default function ApproveButton({ approving, ...props }: { approving: boolean } & ButtonBaseProps) {
  return (
    <Button className={ approving ? 'approving': '' } {...props}>
      <Dragon className="dragon" />
      <Token className="token" />
    </Button>
  )
}
