import React from 'react'
import { isAndroid } from 'react-device-detect'

interface IAnchor {
  children: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  className?: string
  href?: string
}

export default function Anchor({
  onClick,
  className,
  href,
  children,
}: IAnchor) {
  const onButtonClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault()
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <>
      {href ? (
        isAndroid ? (
          <a className={className} onClick={onClick} href={href}>
            {children}
          </a>
        ) : (
          <a
            className={className}
            onClick={onClick}
            rel="noreferrer"
            href={href || ''}
            target="_blank"
          >
            {children}
          </a>
        )
      ) : (
        // eslint-disable-next-line
        <a href="" className={className} onClick={onButtonClick}>
          {children}
        </a>
      )}
    </>
  )
}
