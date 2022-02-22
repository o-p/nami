interface iErrorMap {
  [key: string]: string
}
export const ControllerErrors: iErrorMap = {
  '0x01': 'UNAUTHORIZED',
  '0x02': 'COMPTROLLER_MISMATCH',
  '0x03': 'INSUFFICIENT_SHORTFALL',
  '0x04': 'INSUFFICIENT_LIQUIDITY',
  '0x05': 'INVALID_CLOSE_FACTOR',
  '0x06': 'INVALID_COLLATERAL_FACTOR',
  '0x07': 'INVALID_LIQUIDATION_INCENTIVE',
  '0x08': 'MARKET_NOT_ENTERED',
  '0x09': 'MARKET_NOT_LISTED',
  '0x0a': 'MARKET_ALREADY_LISTED',
  '0x0b': 'MATH_ERROR',
  '0x0c': 'NONZERO_BORROW_BALANCE',
  '0x0d': 'PRICE_ERROR',
  '0x0e': 'REJECTION',
  '0x0f': 'SNAPSHOT_ERROR',
  '0x10': 'TOO_MANY_ASSETS',
  '0x11': 'TOO_MUCH_REPAY',
}

export const TokenErrors: iErrorMap = {
  '0x01': 'UNAUTHORIZED',
  '0x02': 'BAD_INPUT',
  '0x03': 'COMPTROLLER_REJECTION',
  '0x04': 'COMPTROLLER_CALCULATION_ERROR',
  '0x05': 'INTEREST_RATE_MODEL_ERROR',
  '0x06': 'INVALID_ACCOUNT_PAIR',
  '0x07': 'INVALID_CLOSE_AMOUNT_REQUESTED',
  '0x08': 'INVALID_COLLATERAL_FACTOR',
  '0x09': 'MATH_ERROR',
  '0x0a': 'MARKET_NOT_FRESH',
  '0x0b': 'MARKET_NOT_LISTED',
  '0x0c': 'TOKEN_INSUFFICIENT_ALLOWANCE',
  '0x0d': 'TOKEN_INSUFFICIENT_BALANCE',
  '0x0e': 'TOKEN_INSUFFICIENT_CASH',
  '0x0f': 'TOKEN_TRANSFER_IN_FAILED',
  '0x10': 'TOKEN_TRANSFER_OUT_FAILED',
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}
