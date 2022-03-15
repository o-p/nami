import { BoxProps } from '@mui/material/Box'

interface ImageDialogProps {
  image: string
  onClose: () => void
  open: boolean
  CloseButtonProps?: BoxProps
}

interface ImageContentProps {
  image: string
}

interface WrappedImageDialogProps {
  onClose: () => void
  open: boolean
}
