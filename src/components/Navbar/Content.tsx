import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import { ReactComponent as Telegram } from 'assets/telegram.svg'
import Twitter from 'assets/twitter.png'
import { useStyles } from './Navbar.styles'
import ConnectButton from 'components/Button/ConnectButton'
import Anchor from 'components/Anchor'
import { ReactComponent as Logo } from 'assets/coloredLogo.svg'
import { sendGAEvent } from 'utils/ga'

export default function Content({
  setisDrawerOpen,
  className,
}: {
  setisDrawerOpen?: React.Dispatch<React.SetStateAction<boolean>>
  className?: string | undefined
}) {
  const classes = useStyles()

  const onLinkClick = (id: string) => {
    sendGAEvent('header', id)
    if (setisDrawerOpen) setisDrawerOpen(false)
  }

  const onScrollTo = (id: string, className: string, index?: number) => {
    sendGAEvent('header', id)
    if (setisDrawerOpen) setisDrawerOpen(false)
    // use setTimeout for mobile to work, since setisDrawerOpen is an async func, and materialUI drawer creates a div outside of React
    setTimeout(() => {
      document
        .getElementsByClassName(className)
        [index || 0].scrollIntoView({ behavior: 'smooth' })
    }, 0)
  }

  return (
    <AppBar position="static" color="transparent" className={className}>
      <Toolbar className={classes.toolbar}>
        <Logo className={classes.logo} />
        <Anchor
          className={`${classes.link}`}
          onClick={() =>
            onScrollTo('swap', 'MuiContainer-root MuiContainer-maxWidthLg', 2)
          }
        >
          Swap
        </Anchor>
        <Anchor
          className={`${classes.link}`}
          onClick={() =>
            onScrollTo('stake', 'MuiContainer-root MuiContainer-maxWidthLg', 3)
          }
        >
          Stake
        </Anchor>
        <Anchor
          className={`${classes.link}`}
          onClick={() =>
            onScrollTo('pools', 'MuiContainer-root MuiContainer-maxWidthLg', 4)
          }
        >
          Pools
        </Anchor>
        <Anchor
          className={`${classes.link}`}
          onClick={() =>
            onScrollTo(
              'strategy',
              'MuiContainer-root MuiContainer-maxWidthLg',
              5
            )
          }
        >
          Strategies
        </Anchor>
        <Anchor
          className={`${classes.link}`}
          onClick={() => onLinkClick('docs')}
          href="https://docs.acornstable.fi/"
        >
          Docs
        </Anchor>
        {!navigator.userAgent.includes('Hub') && (
          <Anchor
            className={`${classes.link}`}
            onClick={() => onLinkClick('bridge')}
            href="https://bridge.thundercore.com/"
          >
            Bridge
          </Anchor>
        )}

        <Anchor href="https://t.me/acornstable">
          <Button
            className={classes.noBgImage}
            onClick={() => onLinkClick('tg')}
          >
            <Telegram width="30px" height="30px" />
          </Button>
        </Anchor>
        <Anchor href="https://twitter.com/FlashBoys_fi">
          <Button
            className={classes.noBgImage}
            onClick={() => onLinkClick('twt')}
          >
            <img alt="Twitter" src={Twitter} width="40px" height="40px" />
          </Button>
        </Anchor>
        <ConnectButton
          className={`${classes.connectDesktop} ${classes.goRight}`}
        />
      </Toolbar>
    </AppBar>
  )
}
