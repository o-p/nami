import { makeStyles } from '@material-ui/core/styles'
import BG from 'assets/bg.png'

const useStyles = makeStyles((theme) => ({
  main: {
    minHeight: '100vh',
    padding: '2rem 5px',
    backgroundImage: `url(${BG})`,
    backgroundSize: 'contain',
    color: theme.palette.text.primary,
  },
}))

export default useStyles
