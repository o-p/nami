import React from 'react'

import styled from 'styled-components'
import Button, { ButtonProps } from '@mui/material/Button'

interface TitleProps {
  fontSize?: number
  color?: string
  bottom?: number
}
const Title = styled.p<TitleProps>`
  position: absolute;
  bottom: ${props => props.bottom ?? 0}px;
  min-width: 100%;
  margin: 0;
  padding: 0;
  text-align: center;
  font-family: 'VT323', monospace;
  font-size: ${props => props.fontSize ?? 14}px;
  font-weight: 800;
  text-transform: none;
  color: ${props => props.color ?? '#000'};
  white-space: nowrap;
`

interface IconProps {
  src: string
  size?: number
}

export interface ImageLinkProps extends ButtonProps {
  image: string
  href: string
  iconProps?: Partial<IconProps>
  textColor?: string
  textSize?: number
  textPosition?: number
}

const Icon = styled.img<IconProps>`
  width: ${props => props.size ?? 48}px;
  height: ${props => props.size ?? 48}px;
  margin: 0 6px 12px 6px;
`

export default function ImageLink({
  children,
  href = '',
  iconProps,
  image,
  textColor = '#000',
  textSize,
  textPosition,
  ...props
}: ImageLinkProps) {
  return (
    <Button
      href={href}
      sx={{
        borderRadius: '30%',
        padding: 0,
        position: 'relative',
      }}

      {...props}
    >
      <Icon src={image} {...iconProps} />
      <Title color={textColor} fontSize={textSize} bottom={textPosition}>
        { children }
      </Title>
    </Button>
  )
}
