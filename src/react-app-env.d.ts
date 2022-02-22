/// <reference types="react-scripts" />

interface Window {
  ethereum?: {
    isMetaMask?: boolean
    isTrust?: boolean
    isImToken?: boolean
    on: (...args: any[]) => void
    request: (...args: any[]) => Promise
  }
  ESportsIdToken?: string
  Error: {
    message: string
    code: string
  }
  hubId?: string
}
