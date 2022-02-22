import { useState } from 'react'
import Container from '@material-ui/core/Container'
import { usePoolsContext } from 'context/Pools'
import Snackbar, { Status } from 'components/Snackbar'
import Pool from './Pool'

export default function Pools() {
  const { pools } = usePoolsContext()
  const [snackbarStatus, setsnackbarStatus] = useState(Status.close)

  return (
    <Container maxWidth="lg">
      <h2>Pools</h2>
      {Object.keys(pools).map((name: string, index: number) => (
        <Pool
          setsnackbarStatus={setsnackbarStatus}
          item={pools[name]}
          poolIndex={index}
          key={name}
        />
      ))}
      <Snackbar
        open={snackbarStatus !== Status.close}
        handleClose={() => {
          setsnackbarStatus(Status.close)
        }}
        time={3000}
        status={snackbarStatus}
      />
    </Container>
  )
}
