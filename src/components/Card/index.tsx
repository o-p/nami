import React from 'react'
import MuiCard from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import useStyles from './Card.styles'

interface ICard {
  children: React.ReactNode
}

export default function Card({ children }: ICard) {
  const classes = useStyles()
  return (
    <MuiCard className={classes.root}>
      <CardContent className={classes.content}>{children}</CardContent>
    </MuiCard>
  )
}
