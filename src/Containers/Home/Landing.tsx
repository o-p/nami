import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    '& h1': {
      marginBottom: '4rem',
    },
  },
}))

export default function Landing() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <h1>Acorn Exchange</h1>
    </div>
  )
}
