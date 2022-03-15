import styled from 'styled-components'
import Alert from '@mui/material/Alert'
import Snackbar, { SnackbarProps, SnackbarOrigin } from '@mui/material/Snackbar'

/* eslint-disable-next-line import/no-webpack-loader-syntax */
import ImageDragon from '!!file-loader!./dragon.png'

const Dragon = styled.img.attrs({
  src: ImageDragon,
})`
  width: 80px;
  height: 80px;
  position: absolute;
  right: -50px;
  bottom: -26px;
`

const anchor: SnackbarOrigin = { vertical: 'bottom', horizontal: 'right' }
const alertStyle = {
  padding: '0 24px',
  fontFamily: 'VT323, monospace',
  outline: '1px solid black',
}
export default function ErrorMessage({ children, onClose, ...props }: SnackbarProps) {
  return (
    <Snackbar
      anchorOrigin={anchor}
      onClose={onClose}
      autoHideDuration={5000}
      {...props}
    >
      <Alert
        variant="filled"
        severity="error"
        icon={false}
        sx={alertStyle}
        onClose={onClose as () => void}
      >
        { children }
        <Dragon />
      </Alert>
    </Snackbar>
  )
}
