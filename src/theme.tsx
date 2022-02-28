import { ReactChild } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

export const theme = createTheme({
  // mixins: {},
  breakpoints: {
    values: {
      xs: 0,
      sm: 428, // default 600
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundImage: `linear-gradient(180deg, transparent, rgba(0,0,0,.3))`
        }
      },
    },
    //
  },
  palette: {
    // primary?: PaletteColorOptions;
    // secondary?: PaletteColorOptions;
    // error?: PaletteColorOptions;
    // warning?: PaletteColorOptions;
    // info?: PaletteColorOptions;
    // success?: PaletteColorOptions;
    // mode?: PaletteMode;
    // tonalOffset?: PaletteTonalOffset;
    // contrastThreshold?: number;
    // common?: Partial<CommonColors>;
    // grey?: ColorPartial;
    // text?: Partial<TypeText>;
    // divider?: string;
    // action?: Partial<TypeAction>;
    background: {
      default: '#715ca4',
      // paper: '',
    },
    // getContrastText?: (background: string) => string;
  },
  // shadows: ,
  transitions: {},
  typography: {
    fontFamily: 'Revalia, cursive',
    treasureHints: {
      color: 'yellow',
      fontSize: 32,
      lineHeight: 1.4,
      textAlign: 'center',
      '& small': {
        fontSize: 10,
      },
    },
  },
  zIndex: {},
})

export default function MuiThemeProvider({ children }: { children: ReactChild }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      { children }
    </ThemeProvider>
  )
}
