import { useState } from 'react'
import Container from '@material-ui/core/Container'
import { ReactComponent as Hamburger } from 'assets/hamburger.svg'
import Drawer from 'components/Drawer'
import Content from './Content'
import { useStyles } from './Navbar.styles'
import ConnectButton from 'components/Button/ConnectButton'
import NoWalletModal from './NoWalletModal'
import { useWalletWrapper } from 'context/Wallet'
import ConnectWalletsModal from 'components/ConnectWallets'

export default function Navbar() {
  const classes = useStyles()
  const [isDrawerOpen, setisDrawerOpen] = useState(false)
  const {
    isNoWalletModal,
    setisNoWalletModal,
    isConnectWalletsModal,
    setisConnectWalletsModal,
    setConnection,
  } = useWalletWrapper()

  const toggleDrawer = () => {
    setisDrawerOpen(false)
  }

  return (
    <Container maxWidth="lg" className={classes.root}>
      <NoWalletModal
        isModalOpen={isNoWalletModal}
        setisModalOpen={setisNoWalletModal}
      />
      <ConnectWalletsModal
        open={isConnectWalletsModal}
        closeModal={() => setisConnectWalletsModal(false)}
        connect={setConnection}
      />
      <Drawer anchor="top" open={isDrawerOpen} toggleDrawer={toggleDrawer}>
        <Content setisDrawerOpen={setisDrawerOpen} />
      </Drawer>
      <div className={classes.mobileNav}>
        <ConnectButton />
        <button
          type="button"
          className={classes.hamburger}
          onClick={() => setisDrawerOpen(true)}
        >
          <Hamburger />
        </button>
      </div>
      <Content className={classes.hideOnMobile} />
    </Container>
  )
}
