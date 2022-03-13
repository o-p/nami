import ImageDialog from './ImageDialog'

/* eslint-disable-next-line import/no-webpack-loader-syntax */
import image from '!!file-loader!./tokenomic.png'

// TODO Token Distribution 圖

export default function Rewards(props: WrappedImageDialogProps) {
  return <ImageDialog {...props} image={image} />
}
