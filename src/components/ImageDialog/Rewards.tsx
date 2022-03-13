import ImageDialog from './ImageDialog'

/* eslint-disable-next-line import/no-webpack-loader-syntax */
import image from '!!file-loader!./reward-sheet.gif'

// TODO 獎勵 & 機率表

export default function Rewards(props: WrappedImageDialogProps) {
  return <ImageDialog {...props} image={image} />
}
