import { BigNumberish, ethers } from 'ethers'

const createWeiFormatter = (decimals = 18, floatPoints = 2, commify = false) =>
  commify
    ? (bn: BigNumberish) => {
      const [
        intPart,
        floatPart,
      ] = Math.max(Number(ethers.utils.formatUnits(bn, decimals)), 0)
            .toFixed(floatPoints)
            .split('.')
      return floatPart ? `${ethers.utils.commify(intPart)}.${floatPart}` : ethers.utils.commify(intPart)
    }
    : (bn: BigNumberish) => Number(ethers.utils.formatUnits(bn, decimals)).toFixed(floatPoints)

export default createWeiFormatter
