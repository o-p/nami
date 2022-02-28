import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Connectors, useWallet, UseWalletProvider } from 'use-wallet'
import JwtDecode from 'jwt-decode'
import { ethers } from 'ethers'

import { getProvider } from 'utils/ethers'
import { networkID, rpcNetworkUrl } from 'utils/helpers'

export const walletContext = createContext(null)

export function getHub() {
  try {
    return JwtDecode<any>(window.ESportsIdToken || '')
  } catch (error) {
    console.log('error:', error)
  }
}

export const UseWalletWrapperProvider: React.FC = ({ children }) => {
  const chainId = Number(networkID || 108)
  return (
    <UseWalletProvider
      chainId={chainId}
      connectors={{
        walletconnect: {
          rpcUrl: rpcNetworkUrl,
        },
      }}
    >
      {children}
    </UseWalletProvider>
  )
}

export function useWalletWrapper(): any {
  const wallet = useContext<any>(walletContext)
  return wallet
}

export const WalletProvider: React.FC = ({ children }) => {
  const walletVal = useWallet()
  const [isNoWalletModal, setisNoWalletModal] = useState(false)
  const [isConnectWalletsModal, setisConnectWalletsModal] = useState(false)
  const [currentConnectionType, setcurrentConnectionType] = useState('')
  const [customProvider, setcustomProvider] = useState<any>(null)
  const isHub = !!window.ESportsIdToken

  const connectByNetwork = () => {
    setcustomProvider(new ethers.providers.JsonRpcProvider(rpcNetworkUrl))
  }

  const wallet = useMemo(() => {
    let newWallet = walletVal
    if (isHub) {
      const hubData = isHub ? getHub() : null
      newWallet = {
        ...walletVal,
        account: hubData?.walletAddress || '',
        chainId: Number(networkID),
        ethereum: window.ethereum,
        status: 'connected',
        // unused: connect, error, networkName, type
      }
    }

    if (customProvider && !walletVal.ethereum) {
      newWallet.ethereum = customProvider
    }

    return newWallet
  }, [isHub, walletVal, customProvider])

  const setConnection = async (type: keyof Connectors) => {
    try {
      await wallet.connect(type)
      setcurrentConnectionType(type)
    } catch (error) {
      console.log('connection error:', error)
    }
  }

  // initialize
  useEffect(() => {
    async function checkNetworkAccountChange() {
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', () => document.location.reload())
        window.ethereum.on('chainChanged', () => document.location.reload())
      }
    }
    const connectOnInitialize = async () => {
      if (wallet.status !== 'connected') {
        if (window.ethereum) {
          const library = getProvider(window.ethereum)
          const accounts = await library.listAccounts()
          if (accounts.length >= 1) {
            setConnection('injected')
          } else {
            connectByNetwork()
          }
        } else {
          connectByNetwork()
        }
      }
    }
    connectOnInitialize()
    checkNetworkAccountChange()
  }, [])

  const values = {
    ...wallet,
    isNoWalletModal,
    connectByNetwork,
    setConnection,
    currentConnectionType,
    setisNoWalletModal,
    isConnectWalletsModal,
    setisConnectWalletsModal,
  }

  return (
    <walletContext.Provider value={values as any}>
      {children}
    </walletContext.Provider>
  )
}
