import { diceplanet, dragon, laserswap, portal, reward, telegram } from './images'
import ImageLink, { ImageLinkProps } from './ImageLink'

import { config } from 'configs'

const LaserSwapPath = `https://laserswap.finance/swap?outputCurrency=${config('token.P.address')}`
export function LaserSwap({ image, href, title, ...props }: Partial<ImageLinkProps>) {
  return (
    <ImageLink
      image={laserswap}
      href={LaserSwapPath}
      textColor="#c7f7a1"
      textSize={24}
      textPosition={-14}
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
      textSize={24}
      textPosition={-14}
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

export function Telegram({ image, href, title, ...props }: Partial<ImageLinkProps>) {
  return (
    <ImageLink
      image={telegram}
      href="https://t.me/diceplanet"
      textColor="#48bed8"
      textSize={24}
      textPosition={-14}
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
      textSize={24}
      textPosition={-14}
      {...props}
    />
  )
}
