import React from 'react'
import MuiTooltip from '@material-ui/core/Tooltip'

interface IToolTip {
  children: any
  title: NonNullable<React.ReactNode>
  enterTouchDelay: number
  placement?:
    | 'bottom-end'
    | 'bottom-start'
    | 'bottom'
    | 'left-end'
    | 'left-start'
    | 'left'
    | 'right-end'
    | 'right-start'
    | 'right'
    | 'top-end'
    | 'top-start'
    | 'top'
}

export default function Tooltip({
  children,
  placement,
  title,
  enterTouchDelay,
}: IToolTip) {
  return (
    <MuiTooltip
      title={title}
      placement={placement}
      enterTouchDelay={enterTouchDelay}
    >
      {children}
    </MuiTooltip>
  )
}
