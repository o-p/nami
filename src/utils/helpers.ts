import { ITokenAsset } from 'constants/index'
import { isMobile } from 'react-device-detect'
import { isAddress } from './ethers'

export const noByte = '0x'
export const emptyAddress = '0x0000000000000000000000000000000000000000'
export const userDeniedError = 4001
export const rpcNetworkUrl =
  process.env.REACT_APP_NETWORK_URL || 'https://mainnet-rpc.thundercore.com'
export const networkID = parseEnv('REACT_APP_NETWORK_ID', '108') as '18' | '108'
export const blockPerYear = '31536000'
export const blocksPerDay = 60 * 60 * 24
export const isMobileOrHub = isMobile || window.hubId

export const displayEllipsedAddress = (
  address: string | null | undefined
): string => {
  const account: string = address || ''
  if (!isAddress(account)) return ''
  return (
    account.slice(0, 6) +
    '...' +
    account.slice(account.length - 4, account.length)
  )
}

export function parseEnv(name: string, defaultValue: string): string {
  const env = process.env[name]
  if (!env) {
    return defaultValue
  }

  return env
}

export function parseEnvInt(name: string, defaultValue: number): number {
  const env = process.env[name]
  if (!env) {
    return defaultValue
  }

  return parseInt(env, 10)
}

export function formatDollarString(str: string) {
  if (str === '0') return '0'
  const dotIndex = str.indexOf('.')
  const whole = str
    .slice(0, dotIndex === -1 ? str.length : dotIndex)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const decimals = str.slice(dotIndex, dotIndex + 3)
  return whole + decimals
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function autoSwitchNetwork() {
  const networkInfo: any = {
    108: {
      chainId: '0x6c',
      chainName: 'Thundercore Mainnet',
      rpcUrls: ['https://mainnet-rpc.thundercore.com'],
      iconUrls: ['https://thundercore.github.io/dist/thundercore.png'],
      blockExplorerUrls: ['https://viewblock.io/thundercore'],
      nativeCurrency: {
        name: 'Thundercore Token',
        symbol: 'TT',
        decimals: 18,
      },
    },
    18: {
      chainId: '0x12',
      chainName: 'Thundercore Testnet',
      rpcUrls: ['https://testnet-rpc.thundercore.com'],
      iconUrls: ['https://thundercore.github.io/dist/thundercore.png'],
      blockExplorerUrls: ['https://viewblock.io/thundercore'],
      nativeCurrency: {
        name: 'Thundercore Token',
        symbol: 'TT',
        decimals: 18,
      },
    },
  }
  if (window.ethereum) {
    window.ethereum
      .request({
        method: 'wallet_addEthereumChain',
        params: [networkInfo[networkID]], // you must have access to the specified account
      })
      .catch((error: any) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log('Switch network failed')
        } else {
          console.error(error)
        }
      })
  }
}

export function watchAsset(asset: ITokenAsset) {
  if (window.ethereum) {
    const { address, symbol, decimals, type, image } = asset
    try {
      window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: type || 'ERC20',
          options: {
            address,
            symbol,
            decimals,
            image,
          },
        },
      })
    } catch (error) {
      console.log('error:', error)
    }
  }
}

export function strToFixed(value: string, decimalsStep: number = 4) {
  return value.slice(0, value.indexOf('.') + decimalsStep + 1)
}

export function checkAccounts(addr1: string, addr2: string): boolean {
  return addr1.toLowerCase() === addr2.toLowerCase()
}
