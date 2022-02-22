import Landing from './Landing'
import Pools from '../Pools'
import Swap from '../Swap'
import AcornStaking from 'Containers/Stake/AcornStaking'
import Dashboard from 'Containers/Dashboard'
import ScreenSpinner from 'components/Spinner/ScreenSpinner'
import { useGlobalsContext } from 'context/Globals'
import { EContexts } from 'context/Globals/Context'
import Strategies from 'Containers/Strategies'

export default function Home() {
  const { isLoadingContext } = useGlobalsContext()
  return (
    <>
      {isLoadingContext !== EContexts.None ? (
        <ScreenSpinner />
      ) : (
        <>
          <Landing />
          <Dashboard />
          <Swap />
          <AcornStaking />
          <Pools />
          <Strategies />
        </>
      )}
    </>
  )
}
