// slippage default: 3/1000

import { IToken } from 'context/Tokens/Context'
import { BigNumber } from 'ethers'
import { bigZero, fromUnits, toBN } from './ethers'
import { strToFixed } from './helpers'

export const slippageConfig = {
  nominator: 997,
  denominator: 1000,
}
// inverted - inverted slippage
export function calcWithSlippage(
  val: BigNumber,
  inverted?: boolean,
  customSlippage?: number
) {
  const slippage = customSlippage || slippageConfig.nominator
  if (inverted) return val.mul(1000).div(slippageConfig.denominator)
  return val.mul(toBN(slippage)).div(1000)
}

export function calcPriceImpact({
  amounts,
  liquidityChange,
  poolTokens,
  method,
}: {
  amounts: BigNumber[]
  liquidityChange: BigNumber
  poolTokens: IToken[]
  method: 'withdraw' | 'deposit'
}): string {
  const totalAmount = amounts.reduce((accu, cur, index) => {
    const decimalsDiff = 18 - poolTokens[index].decimals
    const paddingCur = cur.mul(toBN('10').pow(decimalsDiff))
    return accu.add(paddingCur)
  }, bigZero)
  let payment = liquidityChange,
    gains = totalAmount
  const changeSign = -1 // positive = bonus, negative = price impact

  if (method === 'deposit') {
    payment = totalAmount
    gains = liquidityChange
  }

  if (!payment.isZero()) {
    const maxPercent = toBN('10').pow(4)
    const priceImpact = gains.mul(maxPercent).div(payment)
    return fromUnits(maxPercent.sub(priceImpact).mul(changeSign), 2)
  }
  return '0'
}

export function calcFee(
  tokenGet: BigNumber,
  idealTokenGet: BigNumber,
  virtualPrice: BigNumber,
  method: 'withdraw' | 'deposit'
): string {
  if (idealTokenGet.isZero()) return '0'
  const newFee = idealTokenGet.sub(tokenGet).mul(virtualPrice)
  const fee =
    method === 'withdraw'
      ? fromUnits(newFee.mul('-1'), 36)
      : fromUnits(newFee, 36)
  return strToFixed(fee)
}
