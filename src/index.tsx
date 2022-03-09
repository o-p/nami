import React from 'react'
import { render } from 'react-dom'

import { Provider as DApp } from 'contexts/Web3'
import GameView from 'containers/GameView'
import MuiTheme from './theme'
import reportWebVitals from './reportWebVitals'

import './index.scss'

render(
  <React.StrictMode>
    <MuiTheme>
      <DApp>
        <GameView />
      </DApp>
    </MuiTheme>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
