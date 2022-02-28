/* eslint-disable import/no-webpack-loader-syntax */
import grayscaledx1 from '!!file-loader!./bg-grayscaled.png'
import grayscaledx2 from '!!file-loader!./bg-grayscaled@2x.png'
import grayscaledx3 from '!!file-loader!./bg-grayscaled@3x.png'

export const grayscaled = {
  x1: grayscaledx1,
  x2: grayscaledx2,
  x3: grayscaledx3,
}
