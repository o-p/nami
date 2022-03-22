import { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Slots } from './images'

import Box, { BoxProps } from '@mui/material/Box'

const SYMBOL_COUNTS = 5

const reset = keyframes`
  to {
    background-position-y: ${SYMBOL_COUNTS * 2}00%;
  }
`

const keepSpinning = keyframes`
  from {
    background-position-y: 0%;
  }

  to {
    background-position-y: ${SYMBOL_COUNTS}00%;
  }
`

interface BaseReelProps {
  shift: number
}

const BaseReel = styled.div<BaseReelProps>`
  background-image: url(${Slots});
  width: 100%;
  height: ${100 * (SYMBOL_COUNTS + 1)}px;
  background-size: auto ${ 100 * SYMBOL_COUNTS / (SYMBOL_COUNTS + 1) }%;
  background-repeat: repeat-y;
  background-position-x: center;
  background-position-y: ${props => props.shift * 100 + 50}%;
`

interface SpinningReelProps extends BaseReelProps {
  distance: number
}
const SpinningReel = styled(BaseReel)<SpinningReelProps>`
  animation: ${reset} ${props => props.distance}s cubic-bezier(0.6, 0, 0.9, 1) backwards,
             ${keepSpinning} .4s linear ${props => props.distance}s infinite;
`

interface StoppedReelProps extends BaseReelProps {
  distance: number
}

const StoppedReel = styled(BaseReel)<StoppedReelProps>`
  animation-timing-function: cubic-bezier(0.7, 0, 1, 1);
  animation-name: ${reset};
  animation-direction: reverse;
  animation-fill-mode: backwards;

  background-position-y: ${
    // Minimium required stopping-animation-rounds is 2, cause reset animation is run to 2
    props => SYMBOL_COUNTS * 100 * 2 + props.shift * 100 + 50
  }%;

  &.timer-1 {
    background-position-y: ${
      props => SYMBOL_COUNTS * 100 * 2 + props.shift * 100 + 50
    }%;
    animation-duration: ${props => 2.0 + props.distance / 2}s
  }
  &.timer-2 {
    background-position-y: ${
      props => SYMBOL_COUNTS * 100 * 3 + props.shift * 100 + 50
    }%;
    animation-duration: ${props => 2.2 + props.distance / 2}s
  }
  &.timer-3 {
    background-position-y: ${
      props => SYMBOL_COUNTS * 100 * 4 + props.shift * 100 + 50
    }%;
    animation-duration: ${props => 2.6 + props.distance / 2}s
  }

  &.static {
    animation: none;
  }
`

function rand(range: number, digits: number) {
  return Math.round(Math.random() * range * 10 ** digits) / 10 ** digits
}

const StoppingAnimations = [
  'timer-1',
  'timer-2',
  'timer-3',
]

interface ReelProps extends BoxProps {
  shift: number
  spinning: boolean
  onStop?: () => void
}
export default function Reel({ shift, spinning, onStop, ...boxProps }: ReelProps & BoxProps) {
  const [counts, setCounts] = useState(0)
  const [distance, setDistance] = useState(0)
  const [stopAnima, setStopAnima] = useState(StoppingAnimations[0])

  useEffect(() => {
    if (spinning) {
      setCounts(counts + 1)
    } else {
      setDistance(rand(2, 2))
      setStopAnima(StoppingAnimations[rand(2, 0)])
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [spinning])

  return (
    <Box {...boxProps}>
      {
        spinning
          ? (<SpinningReel
              shift={shift}
              distance={distance}
            />)
          : (<StoppedReel
              className={!counts ? `${stopAnima} static` : stopAnima}
              shift={shift}
              distance={distance}
              onAnimationEnd={onStop}
            />)
      }
    </Box>
  )
}
