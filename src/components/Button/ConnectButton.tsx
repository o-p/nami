import { makeStyles } from '@material-ui/core'
import { useWalletWrapper } from 'context/Wallet'
import { useEffect, useState } from 'react'
import {
  autoSwitchNetwork,
  displayEllipsedAddress,
  isMobileOrHub,
  networkID,
} from 'utils/helpers'
import Button from '.'

const useStyles = makeStyles((theme) => ({
  connect: {
    color: 'white',
  },
  connected: {
    backgroundColor: 'transparent',
    color: 'white',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    boxShadow: 'inherit',
  },
}))

type ConnectStatus = 'connect' | 'switchNetwork' | 'wrongNetwork' | 'connected'

export default function ConnectButton({ className }: { className?: string }) {
  // const [walletButtonText, setwalletButtonText] = useState('Connect')
  const [connectStatus, setconnectStatus] = useState<ConnectStatus>('connect')
  const classes = useStyles()
  const {
    error: walletError,
    status,
    account,
    setisConnectWalletsModal,
    reset,
    connectByNetwork,
    currentConnectionType,
  } = useWalletWrapper()
  const isSwitchNetworkSupported =
    (!isMobileOrHub || window.ethereum?.isImToken) &&
    currentConnectionType === 'injected'
  // || window.ethereum?.isMetaMask
  const network =
    networkID === '18' ? 'Thundercore testnet' : 'Thundercore mainnet'

  const isSwitchNetwork =
    isSwitchNetworkSupported &&
    walletError &&
    walletError.message.includes('Unsupported chain')

  const getConnectButtonText = () => {
    switch (connectStatus) {
      case 'connected':
        return displayEllipsedAddress(account)
      case 'switchNetwork':
        return `Switch to ${network}`
      case 'wrongNetwork':
        return 'Wrong network'
      default:
        return 'connect'
    }
  }

  const handleConnectModal = () => {
    if (status !== 'connected') {
      if (isSwitchNetwork) {
        autoSwitchNetwork()
      } else {
        setisConnectWalletsModal(true)
      }
    } else if (reset && typeof reset === 'function') {
      reset()
      connectByNetwork()
    }
  }

  useEffect(() => {
    if (account) {
      setconnectStatus('connected')
    } else if (
      // wrong network
      walletError &&
      walletError.message.includes('Unsupported chain')
    ) {
      isSwitchNetworkSupported
        ? setconnectStatus('switchNetwork')
        : setconnectStatus('wrongNetwork')
    } else {
      setconnectStatus('connect')
    }
  }, [account, walletError, isSwitchNetworkSupported])

  return (
    <Button
      className={
        status === 'connected' && !isSwitchNetwork
          ? `${className} ${classes.connected}`
          : className || classes.connect
      }
      onClick={handleConnectModal}
    >
      {getConnectButtonText()}
    </Button>
  )
}
