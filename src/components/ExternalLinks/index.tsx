import { laserswap } from './images'
import ImageLink, { ImageLinkProps } from './ImageLink'

import { config } from 'configs'

const LaserSwapPath = `https://laserswap.finance/swap?outputCurrency=${config('token.P.address')}`
export function LaserSwap({ image, href, title, ...props }: Partial<ImageLinkProps>) {
  return (
    <ImageLink
      image={laserswap}
      href={LaserSwapPath}
      textColor="#dd2013"
      {...props}
    />
  )
}
