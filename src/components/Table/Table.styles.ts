import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {},
  cell: {},
  rootSecondaryBg: {
    backgroundColor: theme.palette.secondary.main,
    '& th, & td': {
      color: 'white',
      borderBottom: 'none',
    },
  },
}))

export default useStyles
