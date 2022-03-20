import ImageDialog from './ImageDialog'

import { WrappedImageDialogProps } from './image-dialog'
/* eslint-disable-next-line import/no-webpack-loader-syntax */
import image from '!!file-loader!./reward-sheet.png'

const closeButtonProps = {
  top: 50,
  right: 20,
}
export default function Rewards(props: WrappedImageDialogProps) {
  return (
    <ImageDialog
      CloseButtonProps={closeButtonProps}
      {...props}
      image={image}
    />
  )
}
