import { useMemo } from 'react'
import MuiSnackbar from '@material-ui/core/Snackbar'
import useStyles from './Snackbar.styles'

export enum Status {
  close = 'close',
  success = 'success',
  fail = 'fail',
  unlock = 'unlock',
}

interface ISnackbar {
  open: boolean
  handleClose: () => void
  time: number
  message?: string
  status: Status
}

export default function Snackbar({
  handleClose,
  time,
  open,
  message,
  status,
}: ISnackbar) {
  const classes = useStyles()

  const [defaultMessage, className] = useMemo(() => {
    switch (status) {
      case Status.success:
        return ['success', classes.success]
      case Status.fail:
        return ['failed', classes.fail]
      case Status.unlock:
        return ['unlocked', classes.unlock]
      default:
        return ['', classes.close]
    }
  }, [status, classes.success, classes.fail, classes.unlock, classes.close])

  return (
    <MuiSnackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      className={className}
      open={open}
      autoHideDuration={time}
      onClose={handleClose}
      message={message || defaultMessage}
      // action={<React.Fragment>hi</React.Fragment>}
    />
  )
}
