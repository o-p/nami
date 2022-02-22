import { Switch, Route } from 'react-router-dom'
import Home from 'Containers/Home'

const routes = [{ key: 'home', path: '/', component: Home }]

export default function RenderRoutes() {
  return (
    <Switch>
      {routes.map((route) => (
        <Route
          path={route.path}
          exact={route.exact}
          key={route.key}
          render={(props) => <route.component {...props} />}
        />
      ))}
    </Switch>
  )
}
