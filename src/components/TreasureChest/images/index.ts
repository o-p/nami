/* eslint-disable import/no-webpack-loader-syntax */
import { ImageObject } from 'slot-machine'

import disabledx1 from '!!file-loader!./box-disabled.png'
import disabledx2 from '!!file-loader!./box-disabled@2x.png'
import disabledx3 from '!!file-loader!./box-disabled@3x.png'

import emptyx1 from '!!file-loader!./box-empty.png'
import emptyx2 from '!!file-loader!./box-empty@2x.png'
import emptyx3 from '!!file-loader!./box-empty@3x.png'

import fullx1 from '!!file-loader!./box-full.png'
import fullx2 from '!!file-loader!./box-full@2x.png'
import fullx3 from '!!file-loader!./box-full@3x.png'

import lockedx1 from '!!file-loader!./box-locked.png'
import lockedx2 from '!!file-loader!./box-locked@2x.png'
import lockedx3 from '!!file-loader!./box-locked@3x.png'

export default {
  disabled: {
    x1: disabledx1,
    x2: disabledx2,
    x3: disabledx3,
  },
  empty: {
    x1: emptyx1,
    x2: emptyx2,
    x3: emptyx3,
  },
  full: {
    x1: fullx1,
    x2: fullx2,
    x3: fullx3,
  },
  locked: {
    x1: lockedx1,
    x2: lockedx2,
    x3: lockedx3,
  },
} as {
  [key: string]: ImageObject
}
