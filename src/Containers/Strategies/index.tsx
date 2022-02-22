import { useState } from 'react'
import Container from '@material-ui/core/Container'
import Snackbar, { Status } from 'components/Snackbar'
import { contractAddresses, strategiesAssets } from 'constants/index'
import Strategy from './Strategy'
import { networkID } from 'utils/helpers'

export default function Pools() {
  const [snackbarStatus, setsnackbarStatus] = useState(Status.close)
  const [activeAccordion, setactiveAccordion] = useState(-1)

  return (
    <Container maxWidth="lg">
      <h2>STRATEGIES</h2>
      {strategiesAssets.map((name: string, index: number) => (
        <Strategy
          index={index}
          isExpanded={index === activeAccordion}
          setactiveAccordion={setactiveAccordion}
          setsnackbarStatus={setsnackbarStatus}
          item={contractAddresses[networkID][name]}
          assetName={name}
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
