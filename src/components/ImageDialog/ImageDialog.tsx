import { forwardRef } from 'react'

import styled from 'styled-components'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Grow, { GrowProps } from '@mui/material/Grow'

import CloseButton from 'components/CloseButton'

const Transition = forwardRef<unknown, GrowProps>(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />
})

const ImageContent = styled.div<ImageContentProps>`
  background-image: url(${props => props.image});
  width: 100%;
  height: 60vh;
  background-size: contain;
  background-position: center top;
  background-repeat: no-repeat;
`

const DialogPaperProps = {
  sx: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
}

const DialogTitleStyles = {
  textAlign: 'right',
  padding: 0,
}

export default function ImageDialog({ open, onClose, image }: ImageDialogProps) {
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      PaperProps={DialogPaperProps}
    >
      <DialogTitle sx={DialogTitleStyles}>
        <CloseButton
          onClick={onClose as () => void}
        />
      </DialogTitle>
      <DialogContent>
        <ImageContent image={image} />
      </DialogContent>
    </Dialog>
  )
}
