import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles'

export const themeConfig = {
  beige: {
    light: '#DADDC7',
    main: '#e6e8db',
  },
  green: {
    main: '#37E192',
    dark: '#7d9300',
  },
  red: {
    main: '#8A3A0F',
  },
  gray: {
    dark: '#343227',
    lighter: '#595055',
    light: '#424242',
    main: '#3f3c2d',
  },
  disabled: '#595959',
  gradient: {
    green: 'linear-gradient(101deg, #bed44c, #94b549)',
  },
  dark: {
    main: '#2e2c21',
  },
  text: {
    black: '#000',
    white: '#fff',
  },
  borderRadius: {
    main: '5px',
  },
}

export const muiTheme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 720,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  palette: {
    primary: {
      main: '#c0e619',
    },
    secondary: {
      main: themeConfig.gray.main,
    },
    text: {
      primary: '#fff',
      secondary: '#000',
    },
  },
  overrides: {
    MuiContainer: {
      root: {
        padding: '1rem',
        background: 'transparent',
        borderRadius: themeConfig.borderRadius.main,
        marginBottom: '4rem',
      },
    },
    MuiButton: {
      root: {
        '&$disabled': {
          backgroundColor: `${themeConfig.disabled} !important`,
        },
        backgroundImage: themeConfig.gradient.green,
      },
      contained: {
        color: themeConfig.text.white,
      },
    },
    MuiAppBar: {
      root: {
        boxShadow: 'none',
      },
    },
    MuiList: {
      root: {
        background: themeConfig.beige.light,
      },
    },
    MuiAccordion: {
      root: {
        '&.MuiAccordion-root.Mui-expanded': {
          margin: '0 !important',
        },
      },
    },
    MuiInputBase: {
      root: {
        margin: '20px 10px',
        background: themeConfig.beige.light,
        height: '38px',
        color: themeConfig.text.black,
        borderRadius: themeConfig.borderRadius.main,
        padding: '0',
        // paddingLeft: '20px',
        // '&:before': {
        //   borderBottom: '1px solid red',
        // },
      },
      input: {
        paddingLeft: '10px',
        '-webkit-appearance': 'none',
        '&::-webkit-inner-spin-button': {
          '-webkit-appearance': 'none',
          margin: 0,
        },
      },
    },
  },
})

export const reStyles = {
  flexCenter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}
