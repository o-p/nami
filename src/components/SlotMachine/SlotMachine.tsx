import { useCallback, useState, useEffect, useRef, useMemo } from 'react'
import styled from 'styled-components'
import Box from '@mui/material/Box'
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
          ${x1} 1x,
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
const initReels = [
  Math.floor(Math.random() * SYMBOL_COUNTS),
  Math.floor(Math.random() * SYMBOL_COUNTS),
  Math.floor(Math.random() * SYMBOL_COUNTS),
]

const EarnedReward = styled.p`
  text-align: center;
  z-index: 100;
  color: #FF0;
  max-width: 330px;
  padding: 0 8px;
  margin: 0;
  font-size: 24px;
  line-height: 38px;
  cursor: point;
`

const EarnedRewardSpan = styled.span`
  text-align: center;
  z-index: 100;
  color: #FF0;
  max-width: 330px;
  padding: 0 8px;
  margin: 0;
  font-size: 24px;
  line-height: 38px;
  cursor: point;
`


const TokenReward = styled.p`
  text-align: center;
  z-index: 100;
  color: #FF9D00;
  max-width: 330px;
  padding: 0 8px;
  margin: 0;
  font-size: 24px;
  line-height: 38px;
  cursor: point;
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
  emoji: string
}

const LuckyEmojis: string[] = [
  `😩 😩 😩`,
  `🙄`,
  `💔`,
  `😱  😱  😱`,
  `😒`,
]

const goodLuck = () => LuckyEmojis[Math.floor(Math.random() * LuckyEmojis.length)]

const LEFT_SPINNING = 1 << 2
const MID_SPINNING = 1 << 1
const RIGHT_SPINNING = 1
const useLighteningEffect = () => {
  const states = useRef(0)

  const [showLightening, setLighteningEffect] = useState<boolean>(false)
  const [
    onLeftReelStopped,
    onMidReelStopped,
    onRightReelStopped,
  ] = useMemo(() => {
    const onReelStop = (reel: number) => () => {
      states.current &= ~reel
      if (states.current === 0) setLighteningEffect(true)
    }
    return [
      onReelStop(LEFT_SPINNING),
      onReelStop(MID_SPINNING),
      onReelStop(RIGHT_SPINNING),
    ]
  }, [])
  const onReelsStart = useCallback(() => {
    states.current = LEFT_SPINNING | MID_SPINNING | RIGHT_SPINNING
  }, [])

  const hideLightening = useCallback(() => setLighteningEffect(false), [])

  return {
    allReelsStopped: states.current === 0,
    showLightening,
    hideLightening,
    onLeftReelStopped,
    onMidReelStopped,
    onRightReelStopped,
    onReelsStart,
  }
}

export default function SlotMachine() {
  const {
    allReelsStopped,
    showLightening,
    hideLightening,
    onLeftReelStopped,
    onMidReelStopped,
    onRightReelStopped,
    onReelsStart,
  } = useLighteningEffect()

  const [lastResult, setLastResult] = useState<LastResult>({ tt: '', dp: '', show: false, emoji: '' })
  const { actions, wallet: { balance }, balances: { TT } } = useDApp()
  const [slots, setSlots] = useState({
    spinning: false,
    stops: initReels,
  })
  const message = useRef(null)

  const tt = Number(ethers.utils.formatEther(TT?.amount ?? balance ?? 0))

  const [betAmount, chooseBetAmount] = useState(0)

  const clear = useCallback(() => setLastResult({ tt: '', dp: '', show: false, emoji: '' }), [])
  const hideLastResult = useCallback(() => setLastResult({ ...lastResult, show: false }), [lastResult])

  const play = useCallback(async () => {
    setSlots({ ...slots, spinning: true })
    onReelsStart()
    clear()

    actions
      .play(betAmount)
      .then(({ symbols, payment, tokenReward }: {
        symbols: number[]
        payment: string
        tokenReward: string
      }) => {
        debug('result: [%d, %d, %d] <TT: %s, P: %s>', ...symbols, payment, tokenReward)
        setSlots({ stops: symbols, spinning: false })
        setLastResult({ tt: payment, dp: tokenReward, show: true, emoji: goodLuck() })
      })
      .catch((e: Error) => {
        console.error(e)
        actions.showError(e.message ?? e.toString())
        setSlots({ stops: initReels, spinning: false })
        setLastResult({ tt: '', dp: '', show: true, error: e, emoji: '' })
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

  const Message = useMemo(() => {
    if (lastResult.error) {
      return <ErrorMessage>{
        lastResult.error.message ?? lastResult.error.toString()
      }</ErrorMessage>
    } else if (Number(lastResult.dp) > 0 && Number(lastResult.tt) > 0) { // Has last result of TT and earned P
      return <TokenReward><EarnedRewardSpan>+{ lastResult.tt } TT</EarnedRewardSpan> { lastResult.dp } PMT</TokenReward>
    } else if (Number(lastResult.dp) > 0) { // Has last result of TT and earned P
      return <TokenReward>+{ lastResult.dp } PMT</TokenReward>
    } else if (Number(lastResult.tt) > 0) { // Has last result of TT and earned TT
      return <EarnedReward>+{ lastResult.tt } TT</EarnedReward>
    } else if (lastResult.tt) { // Has last result but earned nothing
      return <Score>{ lastResult.emoji }</Score>
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
            onClick={hideLastResult}
          >
            <Slide
              in={lastResult.show && allReelsStopped}
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
            width={330}
            height={196}
            zIndex={30}
            overflow="hidden"
            display="flex"
            justifyContent="space-between"
          >
            <Reel
              spinning={slots.spinning}
              shift={slots.stops[0]}
              flex="32% 0 0"
              onStop={onLeftReelStopped}
            />
            <Reel
              spinning={slots.spinning}
              shift={slots.stops[1]}
              flex="32% 0 0"
              onStop={onMidReelStopped}
            />
            <Reel
              spinning={slots.spinning}
              shift={slots.stops[2]}
              flex="32% 0 0"
              onStop={onRightReelStopped}
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
              <Bets
                amount="100"
                disabled={tt < 100}
                selected={betAmount === 100}
                onClick={() => chooseBetAmount(100) }
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
              <Bets
                amount="3000"
                disabled={tt < 3000}
                selected={betAmount === 3000}
                onClick={() => chooseBetAmount(3000) }
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
              disabled={betAmount === 0 || tt < betAmount || slots.spinning || showLightening}
              onClick={play}
            />
          </Box>{/* /Start */}
          <Lightening
            show={showLightening}
            onHide={hideLightening}
            position="absolute"
            zIndex={100}
            bottom={48}
          />
        </Box>
      </Box>
    </Box>
  )
}
