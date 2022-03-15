import { forwardRef } from 'react'

import styled from 'styled-components'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import Grow, { GrowProps } from '@mui/material/Grow'

import CloseButton from 'components/CloseButton'
import { ImageContentProps, ImageDialogProps } from './image-dialog'

const Transition = forwardRef<unknown, GrowProps>(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />
})

const ImageContent = styled.div<ImageContentProps>`
  background-image: url(${props => props.image});
  width: 100%;
  height: 600px;
  max-height: 90vh;
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

export default function ImageDialog({ open, onClose, image, CloseButtonProps }: ImageDialogProps) {
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      PaperProps={DialogPaperProps}
    >
      <Box
        position="absolute"
        right={0}
        top={0}
        {...CloseButtonProps}
      >
        <CloseButton
          onClick={onClose as () => void}
        />
      </Box>
      <ImageContent image={image} />
    </Dialog>
  )
}
