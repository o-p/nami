import { useState } from 'react'
import { Container } from '@material-ui/core'
import Anchor from 'components/Anchor'
import Button from 'components/Button'
import Snackbar, { Status } from 'components/Snackbar'
import { contractAddresses, ttSwapHost, vaultPid } from 'constants/index'
import { useERC20Contract } from 'hooks/useContract'
import { networkID } from 'utils/helpers'
import Stake from './Stake'
import useStyles from './Stake.styles'
import { sendGAEvent } from 'utils/ga'

export default function AcornStaking() {
  const classes = useStyles()
  const [snackbarStatus, setsnackbarStatus] = useState(Status.close)
  const acornTTLP = useERC20Contract(
    contractAddresses[networkID]['acorn-TT'].address
  )

  return (
    <Container maxWidth="lg">
      <h2>ACORN STAKING</h2>
      <div className={classes.accordionContent}>
        <div className={`${classes.accordionContentSection} ${classes.getLP}`}>
          <img
            alt="ttswap"
            className={classes.ttswapLogo}
            src={
              'https://ttswap.space/static/media/tt-swap-logo-mobile.215995a2.png'
            }
          />
          <p className={classes.addLPDesc}>
            Add <span className={classes.primeColor}>ACORN</span> and
            <span className={classes.primeColor}>TT</span> on TTSwap to get
            ACORN-TT LP tokens. Then stake those LP tokens here to get more
            <span className={classes.primeColor}>{` ACORNS`}</span>!
          </p>
          <Anchor
            href={
              ttSwapHost[networkID] +
              `#/add-liquidity/${contractAddresses[networkID].acorn.address}`
            }
            className={classes.anchor}
          >
            <Button
              className={classes.lpBtn}
              onClick={() => sendGAEvent('acornStaking', 'getLP')}
            >
              Get ACORN-TT LP token
            </Button>
          </Anchor>
        </div>
        <Stake
          lpContract={acornTTLP}
          poolName={''}
          pid={vaultPid[networkID]['Acorn-TT']}
          setsnackbarStatus={setsnackbarStatus}
        />
        <Snackbar
          open={snackbarStatus !== Status.close}
          handleClose={() => {
            setsnackbarStatus(Status.close)
          }}
          time={3000}
          status={snackbarStatus}
        />
      </div>
    </Container>
  )
}
