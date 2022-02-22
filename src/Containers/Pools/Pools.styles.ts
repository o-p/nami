import { makeStyles } from '@material-ui/core'
import { themeConfig } from 'theme'

const borderRadius = themeConfig.borderRadius.main

const useStyles = makeStyles((theme) => ({
  poolTokenBlock: {},
  accordionTitle: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  verticalCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  balanceContent: {
    display: 'flex',
    flexDirection: 'column',
    background: 'transparent',
    border: 'none',
    fontSize: '10px',
  },
  balanceBtn: {
    lineHeight: 1.3,
    height: '38px',
    minWidth: '82px',
  },
  combineMax: {
    background: 'transparent',
    color: theme.palette.primary.main,
    textDecoration: 'underline',
    border: 'none',
    cursor: 'pointer',
    display: 'block',
  },
  amountInput: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& .MuiInputBase-root': {
      flexGrow: 1,
    },
  },
  fees: {
    textAlign: 'end',
    '& h5': {
      margin: '0 0 5px 0',
    },
  },
  primeColor: {
    color: theme.palette.primary.main,
  },
  accordionContent: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    '& > div': {
      flexGrow: 1,
      margin: '10px',
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  accordionContentSection: {
    backgroundColor: themeConfig.gray.main,
    borderRadius: '10px',
    padding: '1rem',
    marginBottom: '20px',
    [theme.breakpoints.down('sm')]: {
      padding: '1rem 10px',
    },
  },
  fullWidthBtn: {
    marginTop: '10px',
    width: '100%',
  },
  inline: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    '& h4': {
      margin: '10px',
    },
  },
  accordion: {
    '& .MuiAccordion-root ': {
      borderRadius: `${borderRadius} ${borderRadius} 0 0`,
    },
    '& .MuiAccordionSummary-root': {
      borderRadius: `${borderRadius} ${borderRadius} 0 0`,
    },
    [theme.breakpoints.down('sm')]: {
      '& .MuiAccordionDetails-root': {
        padding: 0,
      },
    },
  },
  rwdTokenIcon: {
    margin: '0 10px 0 0',
    [theme.breakpoints.down('sm')]: {
      margin: '0 3px 0 0',
    },
  },
  accordionTail: {
    background: 'black',
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: themeConfig.gray.main,
    padding: '8px 0',
    cursor: 'pointer',
    borderRadius: `0 0 ${borderRadius} ${borderRadius}`,
    marginBottom: '2rem',
  },
  arrow: {
    border: 'solid white',
    borderWidth: '0 3px 3px 0',
    display: 'inline-block',
    padding: '3px',
    '&.down': {
      transform: 'rotate(45deg)',
      '-webkit-transform': 'rotate(45deg)',
      marginBottom: '5px',
    },
    '&.up': {
      transform: 'rotate(-135deg)',
      '-webkit-transform': 'rotate(-135deg)',
      marginTop: '5px',
    },
  },
}))

export default useStyles
