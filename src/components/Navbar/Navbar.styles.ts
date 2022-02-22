import { makeStyles } from '@material-ui/core/styles'
import { themeConfig } from 'theme'

export const useStyles = makeStyles((theme) => ({
  root: {
    padding: '0',
    background: 'transparent',
    marginBottom: '2rem',
    display: 'flex',
  },
  logo: {
    marginRight: '20px',
    [theme.breakpoints.down('xs')]: {
      marginRight: '0',
      marginBottom: '10px',
    },
  },
  hideOnMobile: {
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  link: {
    marginRight: '10px',
    margin: 'inherit',
    fontSize: 'inherit',
    color: theme.palette.text.primary,
    border: 'none',
    background: 'transparent',
    textDecoration: 'none',
    cursor: 'pointer',
    height: '20px',
    [theme.breakpoints.down('xs')]: {
      marginRight: 'inherit',
      margin: '10px 0',
      fontSize: '22px',
    },
  },
  mobileNav: {
    marginLeft: 'auto',
    display: 'none',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
    },
  },
  hamburger: {
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  goRight: {
    marginLeft: 'auto',
    [theme.breakpoints.down('xs')]: {
      marginLeft: 'inherit',
    },
    color: 'white',
  },
  connectDesktop: {
    color: 'white',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  toolbar: {
    background: 'inherit',
    height: 'inherit',
    flexDirection: 'row',
    justifyContent: 'inherit',
    display: 'flex',
    flexWrap: 'wrap',
    [theme.breakpoints.down('xs')]: {
      background: theme.palette.secondary.main,
      height: '80vh',
      flexDirection: 'column',
      justifyContent: 'center',
    },
  },
  noBgImage: {
    backgroundImage: 'none',
  },
}))
