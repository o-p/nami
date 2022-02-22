import React from 'react'
import TokenIcon from 'components/TokenIcons/TokenIcon'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  select: {
    display: 'flex',
    alignItems: 'center',
  },
}))

export default function TokenSelect({ token }: { token: string }) {
  const classes = useStyles()
  const symbol = token.toUpperCase()
  return (
    <div className={classes.select}>
      <TokenIcon value={symbol} />
      <span>{symbol}</span>
    </div>
  )
}
