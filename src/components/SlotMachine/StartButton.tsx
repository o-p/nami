import React from 'react'

import { styled } from '@mui/material/styles'
import ButtonBase, { ButtonBaseProps } from '@mui/material/ButtonBase'

import { StartButton as images } from './images'

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  width: 130,
  height: 60,
  borderRadius: 30,
}))

const ImageSrc = styled('span')({
  position: 'absolute',
  left: -50,
  right: -40,
  top: -70,
  bottom: -75,
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
})

export default function StartButton(props: ButtonBaseProps) {
  return (
    <ImageButton
      TouchRippleProps={{
        // @ts-ignore
        sx: { color: '#00000030' },
      }}
      {...props}
    >
      <ImageSrc
        style={{
          backgroundImage: `url(${images.charged.x1})`
        }}
      />
    </ImageButton>
  )
}
