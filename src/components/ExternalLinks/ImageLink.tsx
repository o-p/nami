import React from 'react'

import styled from 'styled-components'
import Button, { ButtonProps } from '@mui/material/Button'

const Title = styled.p`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0;
  padding: 0;
  text-align: center;
  font-family: 'VT323', monospace;
  font-size: 12px;
  font-weight: 800;
  text-transform: none;
  color: ${props => props.color ?? '#000'}
`

interface IconProps {
  src: string
}

export interface ImageLinkProps extends ButtonProps {
  image: string
  href: string
  iconProps?: Partial<IconProps>
  textColor?: string
}

const Icon = styled.img`
  width: 48px;
  height: 48px;
  margin: 0 6px 12px 6px;
`

export default function ImageLink({
  children,
  href = '',
  iconProps,
  image,
  textColor = '#000',
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
      <Title color={textColor}>
        { children }
      </Title>
    </Button>
  )
}
