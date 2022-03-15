import ImageDialog from './ImageDialog'

import { WrappedImageDialogProps } from './image-dialog'
/* eslint-disable-next-line import/no-webpack-loader-syntax */
import image from '!!file-loader!./tokenomic.png'

// TODO Token Distribution 圖

export default function Rewards(props: WrappedImageDialogProps) {
  return <ImageDialog {...props} image={image} />
}
