import { useCallback, useState, useEffect, useRef, useMemo } from 'react'
import styled from 'styled-components'
import Box, { BoxProps } from '@mui/material/Box'
import Slide from '@mui/material/Slide'
import { ethers } from 'ethers'

import { ImageObject } from 'slot-machine'
import { Layers } from './images'
import Bets from './Bets'
import Lightening from 'components/Ligntening'
import Reel from './Reel'
import StartButton from './StartButton'
import ScoreInfo from './ScoreInfo'
import useDApp from 'contexts/Web3'

const debug = require('debug')('planet-master:slot-machine')

const Layer = styled(function ImageLayer({ className, images, title = '' }: {
    className?: string
    images: ImageObject
    title?: string
    zIndex?: number
  }) {
    const { x1, x2, x3 } = images
    return (
      <img
        className={className}
        src={x1}
        srcSet={`
          ${x2} 2x,
          ${x3} 3x
        `}
        height="100%"
        alt={title}
      />
    )
  })`
    position: absolute;
    top: 0;
    left: calc((100% - 428px) / 2);
    z-index: ${props => props.zIndex ?? 0}
  `

const Score = styled.h3`
  text-align: center;
  z-index: 100;
  color: #FFF;
  max-width: 330px;
  padding: 0 8px;
  margin: 0;
  font-size: 24px;
  line-height: 38px;
  cursor: help;
`
const SYMBOL_COUNTS = 5
function RNG() {
  return [
    Math.floor(Math.random() * SYMBOL_COUNTS),
    Math.floor(Math.random() * SYMBOL_COUNTS),
    Math.floor(Math.random() * SYMBOL_COUNTS),
  ]
}

const EarnedReward = styled.h3`
  text-align: center;
  z-index: 100;
  color: #FF0;
  max-width: 330px;
  padding: 0 8px;
  margin: 0;
  font-size: 24px;
  line-height: 38px;
`

const ErrorMessage = styled.h3`
  text-align: center;
  z-index: 100;
  color: #A33;
  max-width: 330px;
  padding: 0 8px;
  margin: 0;
  font-size: 12px;
  line-height: 38px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

interface LastResult {
  tt: string
  dp: string
  error?: Error
  show: boolean
}

export default function SlotMachine(props: BoxProps) {
  const [showLightening, setLighteningEffect] = useState<boolean>(false)

  const [lastResult, setLastResult] = useState<LastResult>({ tt: '', dp: '', show: false })
  const { actions, wallet: { balance } } = useDApp()
  const [slots, setSlots] = useState({
    spinning: false,
    stops: RNG(),
  })
  const message = useRef(null)

  const tt = Number(ethers.utils.formatEther(balance ?? 0))

  const [betAmount, chooseBetAmount] = useState(0)

  const play = useCallback(async () => {
    setSlots({ ...slots, spinning: true })
    setLastResult({ tt: '', dp: '', show: false })

    actions
      .play(betAmount)
      .then(({ symbols, payment, tokenReward }: {
        symbols: number[]
        payment: string
        tokenReward: string
      }) => {
        debug('result: [%d, %d, %d] <TT: %s, P: %s>', ...symbols, payment, tokenReward)
        setLighteningEffect(true)
        setSlots({ stops: symbols, spinning: false })
        setLastResult({ tt: payment, dp: tokenReward, show: true })
      })
      .catch((e: Error) => {
        console.error(e)
        setSlots({ stops: [0, 2, 4], spinning: false })
        setLastResult({ tt: '', dp: '', show: true, error: e })
      })
      .then(actions.refreshGameInfo)
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [slots, betAmount, actions.play])

  useEffect(() => {
    // Auto choose max bet
    if (betAmount === 0) {
      const defaultAmount = [1000, 500, 100, 50, 10, 5].find(amount => tt > amount)
      if ((defaultAmount as number) > 0) chooseBetAmount(defaultAmount as number)
      return
    // Auto reset bets if TT is too low
    } else if (betAmount > tt) {
      chooseBetAmount(0)
      return
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [tt])

  const hideLightening = useCallback(() => setLighteningEffect(false), [])
  const Message = useMemo(() => {
    if (lastResult.error) {
      return <ErrorMessage>{
        lastResult.error.message ?? lastResult.error.toString()
      }</ErrorMessage>
    } else if (lastResult.tt) {
      return <EarnedReward>+ { lastResult.tt } TT</EarnedReward>
    } else if (lastResult.dp) {
      return <EarnedReward>+ { lastResult.dp } P</EarnedReward>
    }
    return <Score>PLAY!</Score>
  }, [lastResult])

  return (
    <Box
      width="100%"
      minHeight={926}
      position="relative"
      overflow="hidden"
      zIndex={0}
    >
      <Box
        width="100%"
        height={926}
        position="relative"
        top={0}
      >
        <Layer images={Layers.background} zIndex={10} />
        <Layer images={Layers.foreground} zIndex={20} />
      </Box>
      <Box
        width="100%"
        position="absolute"
        top={220}
        zIndex={30}
      >
        <Box
          width="100%"
          position="relative"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Box
            ref={message}
            width={330}
            height={38}
            overflow="hidden"
            position="relative"
          >
            <Slide
              in={lastResult.show}
              container={message.current}
              direction="up"
              mountOnEnter
              unmountOnExit
            >
              { Message }
            </Slide>
            <ScoreInfo />
          </Box>
          {/* Reels */}
          <Box
            width={340}
            height={196}
            zIndex={30}
            overflow="hidden"
            display="flex"
          >
            <Reel
              spinning={slots.spinning}
              shift={slots.stops[0]}
              flex="30%"
            />
            <Reel
              spinning={slots.spinning}
              shift={slots.stops[1]}
              flex="30%"
            />
            <Reel
              spinning={slots.spinning}
              shift={slots.stops[2]}
              flex="30%"
            />
          </Box>{/* /Reels */}

          {/* Bets */}
          <Box
            height={116}
            width={330}
          >
            <Box
              height={58}
              width={330}
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-evenly"
            >
              <Bets
                amount="5"
                disabled={tt < 5}
                selected={betAmount === 5}
                onClick={() => chooseBetAmount(5) }
              />
              <Bets
                amount="10"
                disabled={tt < 10}
                selected={betAmount === 10}
                onClick={() => chooseBetAmount(10) }
              />
              <Bets
                amount="50"
                disabled={tt < 50}
                selected={betAmount === 50}
                onClick={() => chooseBetAmount(50) }
              />
            </Box>
            <Box
              height={58}
              width={330}
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-evenly"
            >
              <Bets
                amount="100"
                disabled={tt < 100}
                selected={betAmount === 100}
                onClick={() => chooseBetAmount(100) }
              />
              <Bets
                amount="500"
                disabled={tt < 500}
                selected={betAmount === 500}
                onClick={() => chooseBetAmount(500) }
              />
              <Bets
                amount="1000"
                disabled={tt < 1000}
                selected={betAmount === 1000}
                onClick={() => chooseBetAmount(1000) }
              />
            </Box>
          </Box>{/* /Bets */}

          {/* Start */}
          <Box
            width={200}
            height={130}
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
          >
            <StartButton
              disabled={betAmount === 0 || tt < betAmount || slots.spinning}
              onClick={play}
            />
          </Box>{/* /Start */}
          <Lightening
            show={showLightening}
            onHide={hideLightening}
            position="absolute"
            zIndex={100}
            bottom={0}
          />
        </Box>
      </Box>
    </Box>
  )
}
