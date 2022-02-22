import ReactGA from 'react-ga'

const trackingID = 'UA-194771077-3'

export const initializeTracker = () => {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.initialize(trackingID)
    ReactGA.pageview(window.location.pathname)
  } else {
    ReactGA.initialize('test', { testMode: true })
  }
}
