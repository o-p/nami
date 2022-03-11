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
  filter: grayscale(${ props => props.disabled ? .5 : 0 });
`

const Bottle = styled(ImageSrc)<{ disabled?: boolean }>`
  background-image: url(${images.bottle.x1});
  background-position: 48% 48.5%;
  background-size: 174px;
  filter: brightness(${props => props.disabled ? 1.5 : 1 }) grayscale(${ props => props.disabled ? .9 : 0 });

  &:hover {
    filter: contrast(1.05) brightness(1.04) drop-shadow(0 2px 3px #0006);
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
      <ButtonBack disabled={props.disabled} / >
      <Bottle disabled={props.disabled} />
    </ImageButton>
  )
}
