/* eslint-disable import/no-webpack-loader-syntax */
import { ImageObject } from 'slot-machine'

////// MACHINE BACKGROUND //////

import backgroundx1 from '!!file-loader!./background.png'
import backgroundx2 from '!!file-loader!./background@2x.png'
import backgroundx3 from '!!file-loader!./background@3x.png'

import foregroundx1 from '!!file-loader!./foreground.png'
import foregroundx2 from '!!file-loader!./foreground@2x.png'
import foregroundx3 from '!!file-loader!./foreground@3x.png'

////// BETS //////
import bet0010x1 from '!!file-loader!./bet-0010.png'
import bet0010x2 from '!!file-loader!./bet-0010@2x.png'
import bet0010x3 from '!!file-loader!./bet-0010@3x.png'

import bet0050x1 from '!!file-loader!./bet-0050.png'
import bet0050x2 from '!!file-loader!./bet-0050@2x.png'
import bet0050x3 from '!!file-loader!./bet-0050@3x.png'

import bet0100x1 from '!!file-loader!./bet-0100.png'
import bet0100x2 from '!!file-loader!./bet-0100@2x.png'
import bet0100x3 from '!!file-loader!./bet-0100@3x.png'

import bet0500x1 from '!!file-loader!./bet-0500.png'
import bet0500x2 from '!!file-loader!./bet-0500@2x.png'
import bet0500x3 from '!!file-loader!./bet-0500@3x.png'

import bet1000x1 from '!!file-loader!./bet-1000.png'
import bet1000x2 from '!!file-loader!./bet-1000@2x.png'
import bet1000x3 from '!!file-loader!./bet-1000@3x.png'

import bet3000x1 from '!!file-loader!./bet-3000.png'
import bet3000x2 from '!!file-loader!./bet-3000@2x.png'
import bet3000x3 from '!!file-loader!./bet-3000@3x.png'

////// START BUTTON //////

import basex1 from '!!file-loader!./button-base.png'
import basex2 from '!!file-loader!./button-base@2x.png'
import basex3 from '!!file-loader!./button-base@3x.png'

import chargedx1 from '!!file-loader!./button-charged.png'
import chargedx2 from '!!file-loader!./button-charged@2x.png'
import chargedx3 from '!!file-loader!./button-charged@3x.png'

import bottlex1 from '!!file-loader!./bottle.png'
import bottlex2 from '!!file-loader!./bottle@2x.png'
import bottlex3 from '!!file-loader!./bottle@3x.png'

////// RELL SLOTS //////

export { default as Slots } from '!!file-loader!./slots.png'

export const StartButton = {
  base: { x1: basex1, x2: basex2, x3: basex3 },
  charged: { x1: chargedx1, x2: chargedx2, x3: chargedx3 },
  bottle: { x1: bottlex1, x2: bottlex2, x3: bottlex3 },
} as {
  [key: string]: ImageObject
}

export const Bets = {
  '10': { x1: bet0010x1, x2: bet0010x2, x3: bet0010x3 },
  '50': { x1: bet0050x1, x2: bet0050x2, x3: bet0050x3 },
  '100': { x1: bet0100x1, x2: bet0100x2, x3: bet0100x3 },
  '500': { x1: bet0500x1, x2: bet0500x2, x3: bet0500x3 },
  '1000': { x1: bet1000x1, x2: bet1000x2, x3: bet1000x3 },
  '3000': { x1: bet3000x1, x2: bet3000x2, x3: bet3000x3 },
} as {
  [key: string]: ImageObject
}

export const Layers = {
  background: { x1: backgroundx1, x2: backgroundx2, x3: backgroundx3 },
  foreground: { x1: foregroundx1, x2: foregroundx2, x3: foregroundx3 },
} as {
  [key: string]: ImageObject
}
