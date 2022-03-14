import React from 'react'

import styledComp from 'styled-components'
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

const Token = styledComp.img.attrs({
  src: ImageToken,
})`
  position: absolute;
  top: 0;
  left: 100px;
  width: 100px;
  z-index: 50;
`

const Button = styled(ButtonBase)({
  position: 'relative',
  width: '100%',
  height: '200px',

  '&:hover': {
    '.dragon': {
      transform: `translateX(360px) rotateZ(635deg)`,
      transition: `transform .15s ease-in .08s`,
    },
    '.token': {
      transform: `translateX(85px) scale3d(1.3, 1.3, 1)`,
      transition: `transform .15s ease-in`,
    },
  },
})

export default function ApproveButton(props: ButtonBaseProps) {
  return (
    <Button {...props}>
      <Dragon className="dragon" />
      <Token className="token" />
    </Button>
  )
}
