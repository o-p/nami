import SimpleModal from 'components/Modal'
import { makeStyles } from '@material-ui/core/styles'
import Anchor from 'components/Anchor'

export default function NoWalletModal({
  isModalOpen,
  setisModalOpen,
}: {
  isModalOpen: boolean
  setisModalOpen: Function
}) {
  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: '320px',
      '& h3': {
        color: theme.palette.primary.main,
      },
    },
    a: {
      color: 'pink',
    },
  }))
  const classes = useStyles()

  return (
    <SimpleModal closeModal={() => setisModalOpen(false)} open={isModalOpen}>
      <div className={classes.root}>
        <h3>No ThunderCore wallet found</h3>
        <p>
          {`Please visit `}
          <Anchor
            className={classes.a}
            href="https://developers.thundercore.com/docs/get-wallet/"
          >
            Wallet Instructions
          </Anchor>
        </p>
      </div>
    </SimpleModal>
  )
}
