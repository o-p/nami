import { useWalletWrapper } from 'context/Wallet'
import React from 'react'
import { Container } from '@material-ui/core'
import { networkID } from 'utils/helpers'

interface IProps {
  children: React.ReactNode
}

const NetworkChecker = ({ children }: IProps) => {
  const { error: walletError } = useWalletWrapper()
  const isWrongNetwork =
    walletError && walletError.message.includes('Unsupported chain')
  // status === 'disconnected'
  const network =
    networkID === '18' ? 'Thundercore testnet' : 'Thundercore mainnet'

  return (
    <>
      {isWrongNetwork ? (
        <Container maxWidth="lg" style={{ background: 'none' }}>
          <div>Wrong network detected, please switch to {network}</div>
        </Container>
      ) : (
        children
      )}
    </>
  )
}

NetworkChecker.propTypes = {}

export default NetworkChecker
