import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Spinner from 'components/Spinner/Spinner'
import Wrapper from 'components/Wrapper'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'none',
    padding: 0,
  },
  spinner: {
    color: '#cc9966',
  },
}))

export default function ScreenSpinner() {
  const classes = useStyles()
  return (
    <Wrapper className={classes.root}>
      <Spinner className={classes.spinner} />
    </Wrapper>
  )
}
