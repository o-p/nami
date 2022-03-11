import { BigNumberish, ethers } from 'ethers'

const createWeiFormatter = (decimals = 18, floatPoints = 2, commify = true) =>
  commify
    ? (bn: BigNumberish) => {
      const [
        intPart,
        floatPart,
      ] = Number(ethers.utils.formatUnits(bn, decimals))
            .toFixed(floatPoints)
            .split('.')
      return `${ethers.utils.commify(intPart)}.${floatPart}`
    }
    : (bn: BigNumberish) => Number(ethers.utils.formatUnits(bn, decimals)).toFixed(floatPoints)

export default createWeiFormatter
