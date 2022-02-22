// source: https://github.com/Web3Modal/web3modal
// Requirements: Logo image files
// Logo files: https://github.com/Web3Modal/web3modal/tree/master/src/providers/logos

import { CSSProperties, useEffect, useRef, useState } from 'react'
// Injected Provider
import Web3DefaultLogo from '../../assets/wallets/logos/web3-default.svg'
import MetaMaskLogo from '../../assets/wallets/logos/metamask.svg'
import SafeLogo from '../../assets/wallets/logos/safe.svg'
import NiftyWalletLogo from '../../assets/wallets/logos/niftyWallet.png'
import TrustLogo from '../../assets/wallets/logos/trust.svg'
import DapperLogo from '../../assets/wallets/logos/dapper.png'
import CoinbaseLogo from '../../assets/wallets/logos/coinbase.svg'
import CipherLogo from '../../assets/wallets/logos/cipher.svg'
import imTokenLogo from '../../assets/wallets/logos/imtoken.svg'
import StatusLogo from '../../assets/wallets/logos/status.svg'
import TokenaryLogo from '../../assets/wallets/logos/tokenary.png'
import OperaLogo from '../../assets/wallets/logos/opera.svg'
import FrameLogo from '../../assets/wallets/logos/frame.svg'
import LiqualityLogo from '../../assets/wallets/logos/liquality.png'

// Other Wallet Providers
import WalletConnectLogo from '../../assets/wallets/logos/walletconnect-circle.svg'
// import PortisLogo from "../../assets/wallets/logos/portis.svg";
// import FortmaticLogo from "../../assets/wallets/logos/fortmatic.svg";
// import ArkaneLogo from "../../assets/wallets/logos/arkane.svg";
// import TorusLogo from "../../assets/wallets/logos/torus.svg";
// import AuthereumLogo from "../../assets/wallets/logos/authereum.svg";
// import BurnerWalletLogo from "../../assets/wallets/logos/burnerwallet.png";
// import MEWwallet from "../../assets/wallets/logos/mewwallet.png";
// import DcentWalletLogo from "../../assets/wallets/logos/dcentwallet.png";
// import BitskiLogo from "../../assets/wallets/logos/bitski.svg";
// import FrameLogo from "../../assets/wallets/logos/frame.svg";

export interface IProviderDisplay {
  name: string
  logo: string
  description?: string
}

export interface IProviderInfo extends IProviderDisplay {
  id: string
  type: string
  check: string
  package?: IProviderPackageOptions
}

export type RequiredOption = string | string[]

export interface IProviderPackageOptions {
  required?: RequiredOption[]
}

export const WALLETCONNECT: IProviderInfo = {
  id: 'walletconnect',
  name: 'WalletConnect',
  logo: WalletConnectLogo,
  type: 'qrcode',
  check: 'isWalletConnect',
  package: {
    required: [['infuraId', 'rpc']],
  },
}

export const FALLBACK: IProviderInfo = {
  id: 'injected',
  name: 'Web3',
  logo: Web3DefaultLogo,
  type: 'injected',
  check: 'isWeb3',
}

export const METAMASK: IProviderInfo = {
  id: 'injected',
  name: 'MetaMask',
  logo: MetaMaskLogo,
  type: 'injected',
  check: 'isMetaMask',
}

export const SAFE: IProviderInfo = {
  id: 'injected',
  name: 'Safe',
  logo: SafeLogo,
  type: 'injected',
  check: 'isSafe',
}

export const NIFTY: IProviderInfo = {
  id: 'injected',
  name: 'Nifty',
  logo: NiftyWalletLogo,
  type: 'injected',
  check: 'isNiftyWallet',
}

export const DAPPER: IProviderInfo = {
  id: 'injected',
  name: 'Dapper',
  logo: DapperLogo,
  type: 'injected',
  check: 'isDapper',
}

export const OPERA: IProviderInfo = {
  id: 'injected',
  name: 'Opera',
  logo: OperaLogo,
  type: 'injected',
  check: 'isOpera',
}

export const TRUST: IProviderInfo = {
  id: 'injected',
  name: 'Trust',
  logo: TrustLogo,
  type: 'injected',
  check: 'isTrust',
}

export const COINBASE: IProviderInfo = {
  id: 'injected',
  name: 'Coinbase',
  logo: CoinbaseLogo,
  type: 'injected',
  check: 'isToshi',
}

export const CIPHER: IProviderInfo = {
  id: 'injected',
  name: 'Cipher',
  logo: CipherLogo,
  type: 'injected',
  check: 'isCipher',
}

export const IMTOKEN: IProviderInfo = {
  id: 'injected',
  name: 'imToken',
  logo: imTokenLogo,
  type: 'injected',
  check: 'isImToken',
}

export const STATUS: IProviderInfo = {
  id: 'injected',
  name: 'Status',
  logo: StatusLogo,
  type: 'injected',
  check: 'isStatus',
}

export const TOKENARY: IProviderInfo = {
  id: 'injected',
  name: 'Tokenary',
  logo: TokenaryLogo,
  type: 'injected',
  check: 'isTokenary',
}

export const FRAMEINJECTED: IProviderInfo = {
  id: 'injected',
  name: 'Frame',
  logo: FrameLogo,
  type: 'injected',
  check: 'isFrame',
}

export const LIQUALITY: IProviderInfo = {
  id: 'injected',
  name: 'Liquality',
  logo: LiqualityLogo,
  type: 'injected',
  check: 'isLiquality',
}

// export const PORTIS: IProviderInfo = {
//   id: 'portis',
//   name: 'Portis',
//   logo: PortisLogo,
//   type: 'web',
//   check: 'isPortis',
//   package: {
//     required: ['id'],
//   },
// }

// export const FORTMATIC: IProviderInfo = {
//   id: 'fortmatic',
//   name: 'Fortmatic',
//   logo: FortmaticLogo,
//   type: 'web',
//   check: 'isFortmatic',
//   package: {
//     required: ['key'],
//   },
// }

// export const TORUS: IProviderInfo = {
//   id: 'torus',
//   name: 'Torus',
//   logo: TorusLogo,
//   type: 'web',
//   check: 'isTorus',
// }

// export const ARKANE: IProviderInfo = {
//   id: 'arkane',
//   name: 'Arkane',
//   logo: ArkaneLogo,
//   type: 'web',
//   check: 'isArkane',
//   package: {
//     required: ['clientId'],
//   },
// }

// export const AUTHEREUM: IProviderInfo = {
//   id: 'authereum',
//   name: 'Authereum',
//   logo: AuthereumLogo,
//   type: 'web',
//   check: 'isAuthereum',
// }

// export const BURNERCONNECT: IProviderInfo = {
//   id: 'burnerconnect',
//   name: 'Burner Connect',
//   logo: BurnerWalletLogo,
//   type: 'web',
//   check: 'isBurnerProvider',
// }

// export const MEWCONNECT: IProviderInfo = {
//   id: 'mewconnect',
//   name: 'MEW wallet',
//   logo: MEWwallet,
//   type: 'qrcode',
//   check: 'isMEWconnect',
//   package: {
//     required: [['infuraId', 'rpc']],
//   },
// }

// export const DCENT: IProviderInfo = {
//   id: 'dcentwallet',
//   name: "D'CENT",
//   logo: DcentWalletLogo,
//   type: 'hardware',
//   check: 'isDcentWallet',
//   package: {
//     required: ['rpcUrl'],
//   },
// }

// export const BITSKI: IProviderInfo = {
//   id: 'bitski',
//   name: 'Bitski',
//   logo: BitskiLogo,
//   type: 'web',
//   check: 'isBitski',
//   package: {
//     required: ['clientId', 'callbackUrl'],
//   },
// }

// export const FRAME: IProviderInfo = {
//   id: 'frame',
//   name: 'Frame',
//   logo: FrameLogo,
//   type: 'web',
//   check: 'isFrameNative',
// }

interface IWeb3Modal {
  opacity: number
  show: number
  offset: number
  maxWidth?: number
  themeConfig: {
    background?: string
    color?: string
    borderColor?: string
    descColor?: string
    hover?: string
  }
  zIndex?: number
  isMobile: boolean
}

const generateStyles = ({
  offset,
  zIndex,
  opacity,
  show,
  isMobile,
  maxWidth,
  themeConfig,
}: IWeb3Modal) => ({
  sLightbox: {
    transition: 'opacity 0.1s ease-in-out',
    textAlign: 'center',
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    marginLeft: '-50vw',
    top: offset ? `-${offset}px` : 0,
    left: '50%',
    zIndex: zIndex || 1,
    willChange: 'opacity',
    backgroundColor: `rgba(0, 0, 0, ${
      typeof opacity === 'number' ? opacity : 0.4
    })`,
    opacity: show ? 1 : 0,
    visibility: show ? 'visible' : 'hidden',
    pointerEvents: show ? 'auto' : 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // & * {
    //   boxSizing: border-box !important;
    // }
  },
  sModalContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    padding: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: show ? 1 : 0,
    visibility: show ? 'visible' : 'hidden',
    pointerEvents: show ? 'auto' : 'none',
  },
  SModalCard: {
    position: 'relative',
    width: '100%',
    backgroundColor: themeConfig.background || 'white',
    borderRadius: '12px',
    margin: '10px',
    padding: '0',
    opacity: show ? 1 : 0,
    visibility: show ? 'visible' : 'hidden',
    pointerEvents: show ? 'auto' : 'none',
    display: 'grid',
    gridTemplateColumns: isMobile
      ? '1fr'
      : 'repeat(auto-fit, minmax(320px, 1fr))',
    maxWidth: `${maxWidth || isMobile ? '500' : '800'}px`,
    minWidth: 'fit-content',
    maxHeight: '100%',
    overflow: 'auto',
  },
  sIcon: {
    width: isMobile ? '8.5vw' : '45px',
    height: isMobile ? '8.5vw' : '45px',
    display: 'flex',
    borderRadius: '50%',
    overflow: 'visible',
    boxShadow: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    '&img': {
      width: '100%',
      height: '100%',
    },
  },
  sName: {
    width: '100%',
    fontSize: isMobile ? '5vw' : '24px',
    fontWeight: 700,
    marginTop: '0.5em',
    marginBottom: '0',
    color: themeConfig.color || 'black',
  },
  sProviderContainer: {
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeConfig.background || 'white',
    borderRadius: '12px',
    border: 'none',
    padding: isMobile ? '1vw' : '24px 16px',
  },
  sDescription: {
    width: '100%',
    fontSize: isMobile ? '4vw' : '18px',
    margin: '0.333em 0',
    color: themeConfig.descColor || 'black',
  },
  sProviderWrapper: {
    padding: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    cursor: 'pointer',
    borderRadius: '0',
    backgroundColor: themeConfig.background || 'white',
    border: `1px solid ${themeConfig.borderColor}`,
    // '&:hover': {
    //   backgroundColor: themeConfig.hover || 'gray',
    // },
  },
})

const getProviderDescription = (
  providerInfo: Partial<IProviderInfo>
): string => {
  if (providerInfo.description) {
    return providerInfo.description
  }
  let description = ''
  switch (providerInfo.type) {
    case 'injected':
      description = `Connect to your ${providerInfo.name} Wallet`
      break
    case 'web':
      description = `Connect with your ${providerInfo.name} account`
      break
    case 'qrcode':
      description = `Scan with ${providerInfo.name} to connect`
      break
    case 'hardware':
      description = `Connect to your ${providerInfo.name} Hardware Wallet`
      break
    default:
      break
  }
  return description
}

const verifyInjectedProvider = (check: string): boolean => {
  return window.ethereum
    ? //@ts-ignore
      window.ethereum[check]
    : false
}

const injectedWallets = [
  FALLBACK,
  METAMASK,
  SAFE,
  NIFTY,
  DAPPER,
  OPERA,
  TRUST,
  COINBASE,
  CIPHER,
  IMTOKEN,
  STATUS,
  TOKENARY,
  FRAMEINJECTED,
  LIQUALITY,
]
const otherSupportedWallets = [WALLETCONNECT]

interface IStylesConfig {
  opacity: number
  show: number
  offset: number
  themeConfig: {
    borderColor: string
    hover: string
    descColor: string
  }
  zIndex: number
}
interface IConnectWalletsModal {
  stylesConfig?: IStylesConfig
  connect: (type: string) => void
  open: boolean
  closeModal: () => void
  children?: any
}

interface IStyleComponents {
  [key: string]: CSSProperties
}

export default function ConnectWalletsModal({
  open,
  closeModal,
  connect,
  stylesConfig,
}: IConnectWalletsModal) {
  const [supportedWallets, setsupportedWallets] = useState<IProviderInfo[]>([])
  const cardRef = useRef<HTMLDivElement>(null)
  const isMobile = !window.matchMedia('(min-width: 768px)').matches
  const baseStyles = stylesConfig || {
    opacity: 0.7,
    show: 1,
    offset: 0,
    themeConfig: {
      borderColor: 'rgba(195, 195, 195, 0.14)',
      hover: 'rgba(195, 195, 195, 0.14)',
      descColor: 'rgb(169, 169, 188)',
    },
    zIndex: 1101,
    isMobile,
  }
  const styles = generateStyles({ ...baseStyles, isMobile }) as IStyleComponents

  const handleConnect = (providerInfo: IProviderInfo) => {
    // console.log('providerInfo:', providerInfo)
    connect(providerInfo.id)
    closeModal()
  }

  // useOnClickOutside
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const isInsider =
        !cardRef.current || cardRef.current.contains(event.target as Node)
      if (!isInsider) {
        closeModal()
      }
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [cardRef, closeModal])

  useEffect(() => {
    const injectedList = injectedWallets.filter((wallet) =>
      verifyInjectedProvider(wallet.check)
    )
    setsupportedWallets(
      injectedList.length === 1
        ? [...injectedList, ...otherSupportedWallets]
        : otherSupportedWallets
    )
  }, [])

  return (
    <>
      {open && (
        <div style={styles.sLightbox}>
          <div style={styles.sModalContainer}>
            <div ref={cardRef} style={styles.SModalCard}>
              {supportedWallets.map((wallet) => (
                <div key={wallet.name} style={styles.sProviderWrapper}>
                  <button
                    style={styles.sProviderContainer}
                    onClick={() => handleConnect(wallet)}
                  >
                    <img style={styles.sIcon} src={wallet.logo} alt={'name'} />
                    <h5 style={styles.sName}>{wallet.name}</h5>
                    <p style={styles.sDescription}>
                      {getProviderDescription(wallet)}
                    </p>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
