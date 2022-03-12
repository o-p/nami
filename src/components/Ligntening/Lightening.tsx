import styled, { keyframes } from 'styled-components'
import Box, { BoxProps } from '@mui/material/Box'
import Slide from '@mui/material/Slide'

/* eslint-disable-next-line import/no-webpack-loader-syntax */
import image from '!!file-loader!./lightening.png'

const flash = keyframes`
    0% { background-position-y:   0%; }
  100% { background-position-y: 500%; }
`

const LIGHTENING_COUNTS = 5

const Animated = styled.div`
  background-image: url(${image});
  width: 100%;
  height: ${200 * (LIGHTENING_COUNTS + 1)}px;
  background-size: auto ${ 100 * LIGHTENING_COUNTS / (LIGHTENING_COUNTS + 1) }%;
  background-repeat: repeat-y;
  background-position-x: center;
  animation: ${flash} .6s steps(5,end) infinite;
  transform: translateZ(0);
  filter: opacity(.6);
`

interface LighteningProps {
  show: boolean
  onHide: () => void
}

const slideEffects = {
  easing: { enter: 'steps(6,end)' },
  timeout: { enter: 400, exit: 0 },
}

export default function LighteningWrapper({ show, onHide, ...props }: LighteningProps & BoxProps) {
  return (
    <Slide
      direction="down"
      in={show}
      mountOnEnter
      easing={slideEffects.easing}
      timeout={slideEffects.timeout}
      onTransitionEnd={onHide}
    >
      <Box
        {...props}
        width={200}
        height={200}
        overflow="hidden"
      >
        <Animated />
      </Box>
    </Slide>
  )
}
