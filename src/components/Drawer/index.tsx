import React from 'react'
import MuiDrawer from '@material-ui/core/Drawer'
import { ModalProps } from '@material-ui/core'

interface IDrawer {
  anchor: 'left' | 'top' | 'right' | 'bottom'
  open: boolean
  children: React.ReactNode
  toggleDrawer: ModalProps['onClose']
}

export default function Drawer({
  anchor,
  open,
  children,
  toggleDrawer,
}: IDrawer) {
  return (
    <MuiDrawer anchor={anchor} open={open} onClose={toggleDrawer}>
      {children}
    </MuiDrawer>
  )
}
