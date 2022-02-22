import ReactGA from 'react-ga'

export const sendGAEvent = (category: string, label: string, action?: string) =>
  ReactGA.event({
    category,
    action: action || 'button',
    label,
  })
