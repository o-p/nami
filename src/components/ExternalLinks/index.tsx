import { diceplanet, dragon, laserswap, portal, reward } from './images'
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

const DicePlanetPath = `https://www.diceplanet.xyz`
export function DicePlanet({ image, href, title, ...props }: Partial<ImageLinkProps>) {
  return (
    <ImageLink
      image={diceplanet}
      href={DicePlanetPath}
      textColor="#ecb633"
      {...props}
    />
  )
}

export function Portal({ image, href, title, ...props }: Partial<ImageLinkProps>) {
  return (
    <ImageLink
      image={portal}
      href=""
      textColor="#1d1400"
      {...props}
    />
  )
}

export function Reward({ image, href, title, ...props }: Partial<ImageLinkProps>) {
  return (
    <ImageLink
      image={reward}
      href=""
      textColor="#fde262"
      {...props}
    />
  )
}

export function ComingSoon({ image, href, title, ...props }: Partial<ImageLinkProps>) {
  return (
    <ImageLink
      image={dragon}
      href=""
      textColor="#907500"
      {...props}
    />
  )
}
