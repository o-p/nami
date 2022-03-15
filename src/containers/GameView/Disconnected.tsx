import Fade from '@mui/material/Fade'
import styled from 'styled-components'

import { grayscaled } from './images'

const DisconnectedOverlay = styled.img.attrs({
  src: grayscaled.x1,
  srcSet: `
    ${grayscaled.x2} 2x,
    ${grayscaled.x3} 3x
  `,
  alt: 'disconnected',
})`
  max-width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
  z-index: 100;
`

export default function Overlay({ disconnected }: { disconnected?: boolean }) {
  return (
    <Fade in={disconnected}>
      <DisconnectedOverlay />
    </Fade>
  )
}
