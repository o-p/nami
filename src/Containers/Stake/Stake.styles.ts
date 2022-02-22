import { makeStyles } from '@material-ui/core'
import { themeConfig } from 'theme'

const useStyles = makeStyles((theme) => ({
  stakeContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  stakeAppove: {
    marginRight: '20px',
  },
  stakeButton: {
    margin: 0,
  },
  fees: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
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
    backgroundColor: themeConfig.dark.main,
    borderRadius: themeConfig.borderRadius.main,
    padding: '2rem',
    '& > div': {
      flexGrow: 1,
      margin: '10px',
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      padding: '2rem 0',
    },
  },
  accordionContentSection: {
    backgroundColor: themeConfig.gray.main,
    borderRadius: '10px',
    padding: '1rem',
    marginBottom: '20px',
    // maxWidth: '500px',
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
    [theme.breakpoints.down('sm')]: {
      '& .MuiAccordionDetails-root': {
        padding: 0,
      },
    },
  },
  ttswapLogo: {
    width: '220px',
    background: 'white',
    padding: '1rem',
    borderRadius: themeConfig.borderRadius.main,
    marginBottom: '2rem',
  },
  getLP: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  lpBtn: {
    margin: '1rem 0 0 0',
    width: '220px',
  },
  rmBtn: {
    background: 'linear-gradient(90deg, #E6C339 0%, #BDA237 100%)',
  },
  anchor: {
    textDecoration: 'none',
  },
  addLPDesc: {
    textAlign: 'center',
    width: '260px',
    lineHeight: 1.4,
    fontSize: '15px',
  },
}))

export default useStyles
