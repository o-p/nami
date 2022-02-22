import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  close: {
    '& > *': {
      backgroundColor: 'transparent',
      color: 'transparent',
    },
  },
  success: {
    '& > *': {
      backgroundColor: 'green',
    },
  },
  fail: {
    '& > *': {
      backgroundColor: 'red',
    },
  },
  unlock: {
    '& > *': {
      backgroundColor: '#ED6D24',
    },
  },
})

export default useStyles
