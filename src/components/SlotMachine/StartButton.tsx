import React from 'react'

import { styled as muiStyled } from '@mui/material/styles'
import ButtonBase, { ButtonBaseProps } from '@mui/material/ButtonBase'

import styled from 'styled-components'

import { StartButton as images } from './images'

const ImageButton = muiStyled(ButtonBase)({
  position: 'relative',
  width: 130,
  height: 60,
  borderRadius: 30,
})

const ImageSrc = styled.span`
  position: absolute;
  left: -50px;
  right: -40px;
  top: -70px;
  bottom: -75px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  transition: all .15s ease-in;
`

const ButtonBack = styled(ImageSrc)<{ disabled?: boolean }>`
  background-image: url(${images.charged.x1});
  background-size: 200px;
  transition: all .08s ease-in .7s;

  &.disabled {
    filter: grayscale(.5);
    transition: all .08s ease-in;
  }
`

const Bottle = styled(ImageSrc)<{ disabled?: boolean }>`
  background-image: url(${images.bottle.x1});
  background-position: 48% 48.5%;
  background-size: 174px;
  transition: all .35s ease-in .4s;

  &.disabled {
    filter: grayscale(.8);
    filter: brightness(1.5) grayscale(.9);
    transition: all .1s ease-in;
  }

  &:hover {
    filter: drop-shadow(0 2px 3px #0006);
    filter: contrast(1.05) brightness(1.08) drop-shadow(0 2px 3px #0009);
    transition: all .1s ease-in;
  }
`

export default function StartButton(props: ButtonBaseProps) {
  return (
    <ImageButton
      TouchRippleProps={{
        // @ts-ignore
        sx: { color: '#0003' },
      }}
      {...props}
    >
      <ButtonBack className={ props.disabled ? 'disabled' : '' } / >
      <Bottle className={ props.disabled ? 'disabled' : '' } />
    </ImageButton>
  )
}
