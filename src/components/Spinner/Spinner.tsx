import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

interface ISpinner {
  className?: any
}

export default function Spinner({ className }: ISpinner) {
  return <CircularProgress color="inherit" size="20px" className={className} />
}
