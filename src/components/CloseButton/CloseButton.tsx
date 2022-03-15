import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import styled from 'styled-components'

import btn from './close.png'

const CloseIcon = styled.img.attrs({
  src: btn,
})`
  width: 44px;
  height: 44px;
`

export default function CloseButton(props: IconButtonProps) {
  return (
    <IconButton {...props}>
      <CloseIcon />
    </IconButton>
  )
}
