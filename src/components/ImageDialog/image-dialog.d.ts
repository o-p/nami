interface ImageDialogProps {
  image: string
  onClose: () => void
  open: boolean
}

interface ImageContentProps {
  image: string
}

interface WrappedImageDialogProps {
  onClose: () => void
  open: boolean
}
