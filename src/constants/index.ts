import { networkID } from 'utils/helpers'

// testnet network ID: 18, mainnet network ID: 108
export type Networks = 18 | 108

export interface IAddress {
  address: string
  name: string
}

export interface ITokenAsset {
  type?: string
  address: string
  symbol: string
  decimals: number
  image: string
}

export const acornToken = {
  symbol: 'ACORN',
  decimals: 18,
  image: '',
}

export const startingBlock: { [key in Networks]: number } = {
  18: 52665195,
  108: 71006651,
}

export const pools: { [key in Networks]: string[] } = {
  18: ['0xD10A28407FBbe4FB0686CA7d1230600eAc4dF30d'],
  108: ['0x51dAe6236FBd0C93D203C57193587261f76B58aA'],
}

export const vaultPid: { [key in Networks]: { [key: string]: number } } = {
  18: {
    '3 Acorn': 0,
    'Acorn-TT': 1,
    'tt-strategy': 7,
    'eth-strategy': 8,
    'bnb-strategy': 9,
    'ht-strategy': 10,
    'wbtc-strategy': 13,
  },
  108: {
    '3 Acorn': 0,
    'Acorn-TT': 1,
    'tt-strategy': 2,
    'eth-strategy': 3,
    'bnb-strategy': 4,
    'ht-strategy': 5,
    'wbtc-strategy': 7,
  },
}

export const contractAddresses: {
  [key in Networks]: { [key: string]: IAddress }
} = {
  18: {
    usdt: {
      address: '0xB1Fb0b14Ffea209ABa1e62ff3F2F3DFD2eaa9FE0',
      name: 'usdt',
    },
    usdc: {
      address: '0x1d8e61c62ceC1aabd2c36cd22E54Ba831c805f8B',
      name: 'usdc',
    },
    busd: {
      address: '0x0538575FD08d69166AB528aA62C1ba46E3cA3Ae8',
      name: 'busd',
    },
    oak: {
      address: '0x3d7Ecc080c5E682bb28Fe621888cE2c724436327',
      name: 'oak',
    },
    acorn: {
      address: '0x4F42644B6B8f018Db543179C5ba2dDD55Fb32ac4',
      name: 'acorn',
    },
    'acorn-TT': {
      address: '0xc885611875435AD952796FC6770CA05894A669AD',
      name: 'acorn-TT LP',
    },
    acornHelpers: {
      address: '0xAC974C5A0696D8C692dC3129FA92BBD8433b7792',
      name: 'acornHelpers',
    },
    squirrel: {
      address: '0xcAD988efCCbDF79f5FEbe5dEE891e416f610f2A6',
      name: 'squirrel',
    },
    bnb: {
      address: '0xCFefA2AeA9f067A366Ab5c403DABe0139b5a5f15',
      name: 'bnb',
    },
    ht: {
      address: '0xe2EbeA99b39FbB8A3eA599F39b015B73674Ca041',
      name: 'ht',
    },
    wbtc: {
      address: '0xAb2b4a86a9d21AB43B3e2B4B29FF6b8616ED33B6',
      name: 'wbtc',
    },
    eth: {
      address: '0x6757D10620c46219aF1E2f0E23144682d1aDBCC2',
      name: 'eth',
    },
    ram: {
      address: '0xe52A51A1501C129109b7998Ba3396f0fe5aB2059',
      name: 'ram',
    },
    'eth-strategy': {
      address: '0xC28a918F765Fda001101FfAd65f00edC0e3b9143',
      name: 'eth',
    },
    'tt-strategy': {
      address: '0x6Ac0881D94a7288d6C3D0aEF0bA5666507687eFe',
      name: 'tt',
    },
    'bnb-strategy': {
      address: '0x4C2CE1a77043E85725Cc0Adb209a715010163536',
      name: 'bnb',
    },
    'ht-strategy': {
      address: '0x9F715697996Cb2AF4c4Ee6e45aA65234c578559c',
      name: 'ht',
    },
    'wbtc-strategy': {
      address: '0x7D7bd43F15Ed01C89460B36555E815e19FE51152',
      name: 'wbtc',
    },
    oakView: {
      address: '0x78F2Da115d10551b285f061c883699B203A63cdf',
      name: 'oakView',
    },
    flashyGotchi: {
      address: '0xcc4d6879F0CAC49AD5caD8887D13f40A744d1C13',
      name: 'flashyGotchi',
    },
  },
  108: {
    usdt: {
      address: '0x4f3C8E20942461e2c3Bdd8311AC57B0c222f2b82',
      name: 'usdt',
    },
    usdc: {
      address: '0x22e89898A04eaf43379BeB70bf4E38b1faf8A31e',
      name: 'usdc',
    },
    busd: {
      address: '0xbeb0131d95ac3f03fd15894d0ade5dbf7451d171',
      name: 'busd',
    },
    oak: {
      address: '0xfc9733C2e5ee38b3dd2459DFa119FcdB33Bc7793',
      name: 'oak',
    },
    acorn: {
      address: '0x6E690DaC861fE7441770f84146F263d1CFBE909C',
      name: 'acorn',
    },
    'acorn-TT': {
      address: '0x1356D3BBF34451b624d5Ae10A498bB01DEbBc8B8',
      name: 'acorn-TT LP',
    },
    acornHelpers: {
      address: '0x7aBa58907c2A208672E5a163Ad40f9f290B3aa65',
      name: 'acornHelpers',
    },
    squirrel: {
      address: '0x521Db0e86B42926646d8932F34D0eD0A5e42c2c2',
      name: 'squirrel',
    },
    bnb: {
      address: '0x8EF1A1E0671Aa44852f4d87105eF482470bB3e69',
      name: 'bnb',
    },
    ht: {
      address: '0x0212b1F75503413b01A98158434c4570FB6e808c',
      name: 'ht',
    },
    wbtc: {
      address: '0x18fB0A62f207A2a082cA60aA78F47a1af4985190',
      name: 'wbtc',
    },
    eth: {
      address: '0x6576Bb918709906DcbFDCeae4bB1e6df7C8a1077',
      name: 'eth',
    },
    ram: {
      address: '0xfE146D5710015d4075355fb7bE8d133346EC63c2',
      name: 'ram',
    },
    'eth-strategy': {
      address: '0x04054417093Fad38347BfbbA048fbEfd95466723',
      name: 'eth',
    },
    'tt-strategy': {
      address: '0x33d0b60166526C4D70851E0dE74477FFf3E9bD65',
      name: 'tt',
    },
    'bnb-strategy': {
      address: '0x049558c2f7F11094F72Ff04B02b0AdE4a3fe1706',
      name: 'bnb',
    },
    'ht-strategy': {
      address: '0x6b84a01Cd5934f7183799a5057257a42420C5365',
      name: 'ht',
    },
    'wbtc-strategy': {
      address: '0x8f4FdFE357DE7d0478286052F400FB5Fb94294aF',
      name: 'wbtc',
    },
    oakView: {
      address: '0xb5d8ccF6d41E6702B119D1ac874B785c734e9B0F',
      name: 'oakView',
    },
    flashyGotchi: {
      address: '0x13304f8376DfFa5d82e0f15c2284fb33fDDCC96e',
      name: 'flashyGotchi',
    },
  },
}

export const ttSwapHost: { [key in Networks]: string } = {
  18: 'https://testnet-ttswap.platform.dev.tt-eng.com/',
  108: 'https://ttswap.space',
}

export const ramHost: { [key in Networks]: string } = {
  18: 'https://rammer.dapp.dev.tt-eng.com',
  108: 'https://rammer.finance',
}

export const gotchiHost: any = {
  18: 'https://gotchi.dapp.dev.tt-eng.com',
  108: 'https://gotchi.rammer.finance/',
}

export const strategiesAssets = [
  'tt-strategy',
  'eth-strategy',
  'bnb-strategy',
  'ht-strategy',
  'wbtc-strategy',
]
export const swapAssets = ['usdt', 'usdc', 'busd']

export const swapTokenAddrs = swapAssets.map((token: string) =>
  contractAddresses[networkID][
    contractAddresses[networkID][token].name
  ].address.toLowerCase()
)
