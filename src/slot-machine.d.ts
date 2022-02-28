import React from 'react'

import '@mui/material/styles'
import '@mui/material/Typography'
import 'styled-components'

declare module 'slot-machine' {
  export interface ImageObject {
    x1: string
    x2: string
    x3: string
  }
}

declare module "@mui/material/styles" {
  interface TypographyVariants {
    score: React.CSSProperties
    treasureHints: React.CSSProperties
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    score?: React.CSSProperties
    treasureHints?: React.CSSProperties & { '& small': React.CSSProperties }
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    score: true
    treasureHints: true
  }
}

declare module 'styled-components' {
  export interface DefaultTheme {
    borderRadius: string

    colors: {
      main: string
      secondary: string
    }

    breakpoints: {
      values: {
        xs: number
        sm: number
        md: number
        lg: number
        xl: number
      }
    }
  }
}
