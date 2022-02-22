import { makeStyles } from '@material-ui/core'
import { reStyles, themeConfig } from 'theme'

const borderRadius = themeConfig.borderRadius.main

export const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
    '& section': {
      flex: 1,
      '&:first-child': {
        marginRight: '10px',
        [theme.breakpoints.down('xs')]: {
          marginRight: '0',
        },
      },
    },
  },
  protocol: {
    ...reStyles.flexCenter,
    flexDirection: 'column',
    background: themeConfig.dark.main,
  },
  buybackSection: {
    background: themeConfig.gray.main,
    borderRadius: `${borderRadius}`,
    '& h3': {
      textAlign: 'center',
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: '1rem',
    },
  },
  acorn: {
    ...reStyles.flexCenter,
    padding: '1rem 0 1rem 0',
    flexDirection: 'column',
    background: themeConfig.gray.main,
    borderRadius: `${borderRadius} ${borderRadius} 0 0`,
  },
  reserves: {
    ...reStyles.flexCenter,
    padding: '0 0 1rem 0',
    flexDirection: 'column',
    background: themeConfig.gray.main,
  },
  portfolio: {
    ...reStyles.flexCenter,
    padding: '0 0 1rem 0',
    flexDirection: 'column',
    background: themeConfig.gray.main,
    borderRadius: `0 0 ${borderRadius} ${borderRadius}`,
  },
  buyAcornAnchor: {
    textDecoration: 'none',
    '& button': {
      margin: '0 0 8px 0',
      width: '180px',
    },
  },
  msgGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: themeConfig.dark.main,
    width: '60%',
    padding: '0 2rem',
    marginBottom: '10px',
    borderRadius: themeConfig.borderRadius.main,
  },
  primeColor: {
    color: theme.palette.primary.main,
  },
  rmBtn: {
    background: 'linear-gradient(90deg, #E6C339 0%, #BDA237 100%)',
    width: '180px',
  },
  buttonsWrap: {
    ...reStyles.flexCenter,
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    '& div': {
      flex: 1,
    },
    '& div:first-child': {
      backgroundColor: themeConfig.dark.main,
      borderRadius: `${borderRadius}`,
      textAlign: 'center',
      padding: '1rem',
      marginRight: '10px',
      marginBottom: '1rem',
      '& h3': {
        color: themeConfig.green.dark,
        margin: '0 0 8px 0',
      },
      '& h2': {
        margin: '0 0 1rem 0',
        textDecoration: 'none',
      },
    },
  },
  acornToken: {
    marginRight: '10px',
  },
  inline: {
    display: 'flex',
    alignItems: 'center',
  },
  buyback: {
    padding: '2rem',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexColumnCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  ramAnchor: {
    flex: 1,
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'center',
    '& img': {
      maxWidth: '320px',
      width: '100%',
      minWidth: '256px',
      maxHeight: '200px',
    },
  },
  tableRoot: {
    backgroundColor: themeConfig.dark.main,
    '& td': {
      borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
    },
  },
  tableContainer: {
    maxHeight: '800px',
    overflow: 'scroll',
    overflowX: 'hidden',
    [theme.breakpoints.down('xs')]: {
      maxHeight: '200px',
      overflowX: 'scroll',
    },
  },
  flexAlignCenter: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  burnAmt: {},
  burnToken: {
    margin: '5px',
  },
  promos: {},
}))
