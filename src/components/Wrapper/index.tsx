import useStyles from './Wrapper.styles'
import React from 'react'

interface IWrapper {
  children: React.ReactNode
  className?: string
}

export default function Wrapper({ children, className }: IWrapper) {
  const classes = useStyles()
  return (
    <main className={`${classes.main} ${className || ''}`}>{children}</main>
  )
}
