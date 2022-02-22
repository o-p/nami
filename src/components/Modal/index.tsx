import { makeStyles } from '@material-ui/core/styles'
import Close from 'assets/close.png'
import Modal from '@material-ui/core/Modal'
import { IModal } from './Modal'
import { themeConfig } from 'theme'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paper: {
    position: 'absolute',
    borderRadius: themeConfig.borderRadius.main,
    background: theme.palette.secondary.main,
    color: 'white',
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    display: 'flex',
    justifyContent: 'center',
    maxHeight: '80%',
    overflowY: 'scroll',
    outline: 'none',
  },
  close: {
    position: 'absolute',
    right: '25px',
    width: '30px',
    height: '30px',
    top: '25px',
    cursor: 'pointer',
  },
}))

export default function SimpleModal({ open, closeModal, children }: IModal) {
  const classes = useStyles()

  return (
    <Modal
      open={open}
      className={classes.container}
      onClose={closeModal}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className={classes.paper}>
        <img
          onClick={closeModal}
          src={Close}
          alt="close"
          className={classes.close}
        />
        {children}
      </div>
    </Modal>
  )
}
