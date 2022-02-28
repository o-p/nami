import React from 'react'
import { render } from 'react-dom'

import {
  UseWalletWrapperProvider,
  WalletProvider,
} from 'contexts/Wallet'
import GameView from 'containers/GameView'
import MuiTheme from './theme'
import reportWebVitals from './reportWebVitals'

import './index.scss'

render(
  <React.StrictMode>
    <MuiTheme>
      <UseWalletWrapperProvider>
        <WalletProvider>
          <GameView />
        </WalletProvider>
      </UseWalletWrapperProvider>
    </MuiTheme>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
