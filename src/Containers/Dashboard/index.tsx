import { Container } from '@material-ui/core'
import Buyback from './Buyback'
import { useStyles } from './Dashboard.styles'
import DashboardItems from './DashboardItems'

export default function Dashboard() {
  const classes = useStyles()
  return (
    <Container maxWidth="lg">
      <div className={classes.container}>
        <DashboardItems />
        <Buyback />
      </div>
    </Container>
  )
}
