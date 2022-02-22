import TokenIcon from './TokenIcon'

export default function TokenIcons(key: any, value: any) {
  if (key !== 'name') return null

  return <TokenIcon value={value} />
}
