import React from 'react'
import MuiButton from '@material-ui/core/Button'
import { PropTypes } from '@material-ui/core'
import Spinner from 'components/Spinner/Spinner'
import useStyles from './Button.styles'

interface IButton {
  onClick: any
  children: any
  color?: PropTypes.Color
  disabled?: boolean
  className?: string
  isLoading?: boolean
}

export default function Button({
  children,
  disabled,
  className,
  onClick,
  color,
  isLoading,
}: IButton) {
  const classes = useStyles()
  return (
    <MuiButton
      className={className || classes.button}
      disabled={disabled}
      variant="contained"
      color={color}
      onClick={onClick}
    >
      {isLoading ? <Spinner /> : children}
    </MuiButton>
  )
}
