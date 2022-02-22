import { makeStyles } from '@material-ui/core/styles'
import { themeConfig } from 'theme'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: themeConfig.dark.main,
  },
  title: {
    backgroundColor: themeConfig.dark.main,
  },
}))

export default useStyles
