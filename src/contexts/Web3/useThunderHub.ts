import { useRef, useMemo } from 'react'
import JwtDecode from 'jwt-decode'

interface HubData {
  walletAddress: string
}

function decodeHubData(jwt: string = '') {
  try {
    return JwtDecode<HubData>(jwt)
  } catch (error) {
    console.log('Decode ThunderHub JWT Failure: ', error)
    return null
  }
}

export default function useThunderHub() {
  const { current: hubToken } = useRef(window.ESportsIdToken)
  const isHub = !!hubToken

  const hubData = useMemo(() => {
    if (!isHub) return null
    return decodeHubData(hubToken)
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [])

  return {
    isHub,
    hubData,
  }
}
