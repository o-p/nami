import { useCallback, useState, useEffect } from 'react'
import styled from 'styled-components'
import Box, { BoxProps } from '@mui/material/Box'
import { ethers } from 'ethers'

import { ImageObject } from 'slot-machine'
import { Layers } from './images'
import useDApp from 'contexts/Web3'
import Bets from './Bets'
import Reel from './Reel'
import StartButton from './StartButton'

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
  max-width: 428px;
  padding: 0 12%;
  margin: 0;
  font-size: 24px;
  line-height: 38px;
`
const SYMBOL_COUNTS = 5
function RNG() {
  return [
    Math.floor(Math.random() * SYMBOL_COUNTS),
    Math.floor(Math.random() * SYMBOL_COUNTS),
    Math.floor(Math.random() * SYMBOL_COUNTS),
  ]
}

export default function SlotMachine(props: BoxProps) {
  const { actions, wallet: { balance } } = useDApp()
  const [slots, setSlots] = useState({
    spinning: false,
    stops: RNG(),
  })

  const tt = Number(ethers.utils.formatEther(balance ?? 0))

  const [betAmount, chooseBetAmount] = useState(0)

  const play = useCallback(async () => {
    setSlots({ ...slots, spinning: true })

    actions
      .play(betAmount)
      .then(({ symbols, payment, tokenReward }: {
        symbols: number[]
        payment: string
        tokenReward: string
      }) => {
        debug('result: [%d, %d, %d] <TT: %s, P: %s>', ...symbols, payment, tokenReward)
        setSlots({ stops: symbols, spinning: false })
      })
      .catch((e: Error) => {
        console.error(e)
        setSlots({ stops: [0, 2, 4], spinning: false })
      })
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
          <Score>SCORE</Score>
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
              disabled={betAmount === 0 /* TODO 檢查 balance */ || slots.spinning }
              onClick={play}
            />
          </Box>{/* /Start */}
        </Box>
      </Box>
    </Box>
  )
}
