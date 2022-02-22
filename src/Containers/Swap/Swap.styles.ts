import { makeStyles } from '@material-ui/core'
import { themeConfig } from 'theme'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    background: themeConfig.dark.main,
    padding: '2rem',
    borderRadius: themeConfig.borderRadius.main,
  },
  tokenTrade: { display: 'flex', flexDirection: 'column' },
  exchange: {
    display: 'flex',
    alignItems: 'flex-end',
    [theme.breakpoints.down('xs')]: {
      alignItems: 'center',
      flexDirection: 'column',
    },
  },
  arrowButtonWrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: '5px',
    margin: '20px 0',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
      padding: '0',
      margin: '0',
    },
  },
  arrowButton: {
    height: '40px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    [theme.breakpoints.down('xs')]: {
      transform: 'rotate(90deg)',
      justifyContent: 'center',
    },
  },
  swapInfo: {
    alignSelf: 'flex-end',
    fontSize: '13px',
    '& p': {
      textAlign: 'right',
    },
  },
  balanceHeader: {
    marginBottom: '5px',
    textAlign: 'end',
  },
  submit: {
    width: '200px',
  },
  inputs: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      '& div': {
        width: '100%',
      },
    },
  },
  primeColor: {
    color: theme.palette.primary.main,
    fontWeight: 600,
    background: 'transparent',
  },
  maxButton: {
    background: 'transparent',
    color: themeConfig.red.main,
    border: 'none',
    cursor: 'pointer',
    display: 'block',
    position: 'absolute',
    top: '29px',
    right: '15px',
    fontWeight: 600,
  },
  amountInputContainer: {
    position: 'relative',
  },
  amountInput: {
    [theme.breakpoints.down('xs')]: {
      margin: '20px 0',
    },
  },
}))

export default useStyles
