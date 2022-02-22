import { HashRouter } from 'react-router-dom'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'

import Wrapper from './components/Wrapper'
import { muiTheme } from './theme'
import RenderRoutes from './utils/routes'
import Navbar from 'components/Navbar'
import NetworkChecker from 'components/NetworkChecker'
import {
  UseWalletWrapperProvider,
  WalletProvider,
} from 'context/Wallet/Context'
// import { initializeTracker } from 'utils/tracking'
import { TokenProvider } from 'context/Tokens'
import { GlobalsProvider } from 'context/Globals/Context'
import { UserProvider } from 'context/User'

function App() {
  // initializeTracker()

  return (
    <UseWalletWrapperProvider>
      <MuiThemeProvider theme={muiTheme}>
        <WalletProvider>
          <GlobalsProvider>
            <TokenProvider>
              <UserProvider>
                <Wrapper>
                  <HashRouter>
                    <Navbar />
                    <NetworkChecker>
                      <RenderRoutes />
                    </NetworkChecker>
                  </HashRouter>
                </Wrapper>
              </UserProvider>
            </TokenProvider>
          </GlobalsProvider>
        </WalletProvider>
      </MuiThemeProvider>
    </UseWalletWrapperProvider>
  )
}

export default App
