import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close'

export default function CloseButton(props: IconButtonProps) {
  return (
    <IconButton
      sx={{ padding: 0 }}
      {...props}
    >
      <CloseIcon
        color="info"
        fontSize="large"
      />
    </IconButton>
  )
}
